"use client";

import { useState, useCallback } from "react";
import { APP_NAME } from "~/lib/constants";
import sdk from "@farcaster/miniapp-sdk";
import { useMiniApp } from "@neynar/react";
import Image from "next/image";
import AppIcon from "../../../public/icon.png";
import { truncateAddress } from "~/lib/truncateAddress";
import { Button } from "./Button";
import { config } from "../providers/WagmiProvider";
import { useAccount, useConnect, useSignMessage } from "wagmi";
import { base } from "wagmi/chains";

type HeaderProps = {
  neynarUser?: {
    fid: number;
    score: number;
  } | null;
};

export function Header({ neynarUser }: HeaderProps) {
  const { context } = useMiniApp();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  /* ---------- Wallet hooks ---------- */
  const { address, isConnected } = useAccount();
  const { connectAsync, isPending: isConnecting } = useConnect();
  const { signMessageAsync } = useSignMessage();

  /* ---------- Handlers ---------- */
  const handleWalletSignin = useCallback(async () => {
    if (!isConnected) {
      await connectAsync({
        chainId: base.id,
        connector: config.connectors[0], // Farcaster / Frame connector
      });
    }

    await signMessageAsync({
      message: `Sign in to ${APP_NAME}`,
    });

    // এখানে চাইলে backend-এ signature পাঠাতে পারো
  }, [isConnected, connectAsync, signMessageAsync]);

  return (
    <div className="relative px-4">
      <div className="relative overflow-hidden rounded-2xl">
        <div className="relative flex items-center justify-between py-3">
          {/* ---------- Left: App Info ---------- */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full p-[2px]">
              <div className="w-full h-full rounded-full bg-[#020617] flex items-center justify-center">
                <Image src={AppIcon} alt="App" width={30} height={30} />
              </div>
            </div>

            <div>
              <p className="text-md font-extrabold">
                <span className="animated-gradient-text">{APP_NAME}</span>
              </p>
              <p className="text-[10px] uppercase text-[#94A3B8]">
                Premium Rewards
              </p>
            </div>
          </div>

          {/* ---------- Right: Wallet / User ---------- */}
          {context?.user && (
            <div className="flex items-center gap-3">
              {!isConnected ? (
                <Button
                  size="sm"
                  onClick={handleWalletSignin}
                  isLoading={isConnecting}
                >
                  Sign in Wallet
                </Button>
              ) : (
                <div
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#020617] border border-[#1E293B] hover:border-[#38BDF8]"
                >
                  <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                  <span className="text-xs font-mono text-[#E5E7EB]">
                    {truncateAddress(address!)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ---------- Dropdown ---------- */}
      {context?.user && isUserDropdownOpen && (
        <div className="absolute right-4 top-full mt-3 z-50 w-56 rounded-2xl bg-[#020617] border border-[#1E293B]">
          <div className="p-4 space-y-3">
            <div>
              <p
                onClick={() =>
                  sdk.actions.viewProfile({ fid: context.user.fid })
                }
                className="text-sm font-semibold text-white cursor-pointer"
              >
                {context.user.displayName || context.user.username}
              </p>
              <p className="text-xs text-[#94A3B8]">@{context.user.username}</p>
            </div>

            <div className="border-t border-[#1E293B] pt-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">FID</span>
                <span>{context.user.fid}</span>
              </div>

              {address && (
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Wallet</span>
                  <span className="font-mono">{truncateAddress(address)}</span>
                </div>
              )}

              {neynarUser && (
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Score</span>
                  <span className="text-[#22C55E]">
                    +{neynarUser.score.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

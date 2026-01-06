"use client";

import { APP_NAME } from "~/lib/constants";
import { useMiniApp } from "@neynar/react";
import Image from "next/image";
import AppIcon from "../../../public/user.png";
import { truncateAddress } from "~/lib/truncateAddress";
import { useAccount } from "wagmi";

// type HeaderProps = {
//   neynarUser?: {
//     fid: number;
//     score: number;
//   } | null;
// };

export function Header() {
  const { context } = useMiniApp();

  const { address } = useAccount();

  return (
    <div className="relative px-4">
      <div className="relative overflow-hidden rounded-2xl">
        <div className="relative flex items-center justify-between py-3">
          {/* Left */}
          <div className="flex items-center gap-2">
            <div className="w-14 h-14 rounded-full p-[2px]">
              <div
                className="w-full h-full rounded-full  flex items-center justify-center overflow-hidden
    border-2 
    shadow-[0_0_10px_2px_rgba(59,130,246,0.7)]
    transition-shadow duration-500 ease-in-out
    hover:shadow-[0_0_15px_3px_rgba(59,130,246,1)] "
              >
                <Image
                  src={context?.user?.pfpUrl || AppIcon}
                  alt="User Profile"
                  width={70}
                  height={70}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <p className="text-md font-extrabold">
                <span className="animated-gradient-text">
                  {context?.user?.displayName || APP_NAME}
                </span>
              </p>
              <p className="text-[10px] uppercase text-[#94A3B8]">
                {context?.user && (
                  <div
                    className="cursor-pointer flex items-center gap-2 px-3 py-1 rounded-full bg-[#020617] border border-[#1E293B] hover:border-[#38BDF8]"
                    title="Click to Disconnect Wallet"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                    <span className="text-xs font-mono text-[#E5E7EB]">
                      {truncateAddress(address!)}
                    </span>
                  </div>
                )}
              </p>
            </div>
          </div>

          {/* Right */}

          <div className="text-white font-mono px-3 py-1.5 rounded-full bg-[#020617] border border-[#1E293B] hover:border-[#38BDF8]">
            <button className="text-white font-bold">0 $FR</button>
          </div>
        </div>
      </div>

      {/* Dropdown */}
    </div>
  );
}

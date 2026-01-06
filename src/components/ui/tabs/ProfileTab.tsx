"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  RefreshCw,
  Settings,
  ShieldCheck,
  Award,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { useMiniApp } from "@neynar/react";
import { useAccount } from "wagmi";

export const ProfileTab = () => {
  const { context } = useMiniApp();
  const { address } = useAccount();

  const name = context?.user?.displayName ?? "Unknown User";
  const username = context?.user?.username;
  const fid = context?.user?.fid;
  const profilePic = context?.user?.pfpUrl;

  return (
    <div className="relative text-white px-3 md:p-10 overflow-hidden font-sans">
      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: PROFILE CARD */}
        <div className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden bg-[#05080f]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_40px_-12px_rgba(59,130,246,0.35)]"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5" />

            <div className="relative flex flex-col items-center">
              {/* Avatar */}
              <div className="relative mb-5">
                <div className="absolute inset-0 bg-blue-500 blur-[40px] opacity-25" />
                <div className="relative w-28 h-28 rounded-full border-2 border-white/10 p-2 bg-[#05080f]">
                  <div className="w-full h-full rounded-full overflow-hidden border border-blue-500/30">
                    {profilePic ? (
                      <img
                        src={profilePic}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800" />
                    )}
                  </div>
                  <div className="absolute bottom-1 right-1 bg-emerald-500 p-1.5 rounded-full border-[3px] border-[#05080f]">
                    <ShieldCheck size={14} className="text-black" />
                  </div>
                </div>
              </div>

              {/* Name */}
              <h2 className="text-2xl font-black bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                {name}
              </h2>

              {/* Username */}
              {username && (
                <p className="text-sm text-blue-400 font-mono mt-1">
                  @{username}
                </p>
              )}

              {/* Profile Meta */}
              <div className="w-full mt-5 space-y-3 text-xs">
                {/* FID */}
                {fid && (
                  <div className="flex justify-between bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2">
                    <span className="text-gray-500">FID</span>
                    <span className="font-mono text-white">{fid}</span>
                  </div>
                )}

                {/* Address */}
                {address && (
                  <div className="flex justify-between bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2">
                    <span className="text-gray-500">Address</span>
                    <span className="font-mono text-gray-300 truncate max-w-[140px]">
                      {address}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-8 space-y-6">
          {/* Rewards */}
          <motion.div
            whileHover={{ y: -4 }}
            className="relative overflow-hidden bg-[#05080f]/80 backdrop-blur-xl border border-emerald-500/20 rounded-[2.5rem] p-8 shadow-[0_0_40px_-12px_rgba(16,185,129,0.3)]"
          >
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/10 blur-[100px]" />

            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-500 p-3 rounded-xl">
                  <Award size={22} className="text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Available Rewards</h3>
                  <p className="text-xs text-emerald-400">Live on-chain</p>
                </div>
              </div>
              <button className="p-2 bg-white/5 rounded-xl">
                <RefreshCw size={18} className="text-emerald-400" />
              </button>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl py-10 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-widest">
                Balance
              </p>
              <h4 className="text-4xl font-black mt-2">
                0.00 <span className="text-gray-500 text-xl">ETH</span>
              </h4>
              <button className="mt-6 px-6 py-2 bg-emerald-500 text-black rounded-full font-bold">
                Explore Quests
              </button>
            </div>
          </motion.div>

          {/* HISTORY */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold">Transaction History</h3>
              <Settings size={16} className="text-gray-500" />
            </div>

            {[1, 2].map((i) => (
              <motion.div
                key={i}
                whileHover={{ x: 6 }}
                className="flex justify-between items-center p-4 rounded-xl hover:bg-white/[0.04] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <TrendingUp size={18} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Staking Reward</p>
                    <p className="text-xs text-gray-500">Validated • 2h ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-mono">+0.002 ETH</p>
                  <ChevronRight size={12} className="text-gray-600 ml-auto" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

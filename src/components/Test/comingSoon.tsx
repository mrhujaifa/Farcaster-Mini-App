"use client";
import React from "react";
import { motion } from "framer-motion";
import { Rocket, Sparkles } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="relative flex items-center justify-center  overflow-hidden text-white">
      {/* Background glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 " />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 " />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-md w-full mx-4 bg-[#05080f]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center shadow-[0_0_60px_-15px_rgba(59,130,246,0.35)]"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-30" />
            <div className="relative p-4 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-500">
              <Rocket className="text-black" size={28} />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-black bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
          Coming Soon
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-gray-400 mt-3 leading-relaxed">
          We are building something powerful and exciting.
          <br />
          Stay tuned for the launch.
        </p>

        {/* Divider */}
        <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Status */}
        <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 font-bold tracking-wider uppercase">
          <Sparkles size={14} />
          Under Active Development
        </div>
      </motion.div>
    </div>
  );
}

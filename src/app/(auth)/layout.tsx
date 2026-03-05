"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-[#0A0A0F]">
      {/* ━━━ Left Panel — Branding (Visible on LG+) ━━━ */}
      <div className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-[#07070A] border-r border-zinc-800/50 lg:flex xl:w-[50%]">
        {/* Ambient Gradients */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-[10%] -top-[10%] h-[600px] w-[600px] rounded-full bg-indigo-600/12 blur-[120px]" />
          <div className="absolute -bottom-[20%] -right-[10%] h-[500px] w-[500px] rounded-full bg-cyan-500/8 blur-[100px]" />
        </div>

        {/* Logo */}
        <div className="relative z-10 p-10">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-transform group-hover:scale-105">
              <Sparkles className="h-6 w-6 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Studio<span className="text-zinc-500">.ai</span>
            </span>
          </Link>
        </div>

        {/* Branding Content */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-12 text-center xl:px-20">
          <div className="max-w-md space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-1.5 text-xs font-semibold text-zinc-400 backdrop-blur-md">
                <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                Next-Gen Presentation Engine
              </div>
              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white xl:text-6xl">
                Design <br />
                <span className="bg-linear-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Brilliance
                </span>{" "}
                with AI
              </h1>
              <p className="text-lg leading-relaxed text-zinc-400">
                Transform complex ideas into cinematic slide decks. Join 10k+
                creators crafting stories that matter.
              </p>
            </motion.div>

            {/* Decorative Slide Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative mt-8"
            >
              <div className="relative aspect-4/3 w-full max-w-sm mx-auto overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 shadow-2xl backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500/50" />
                    <div className="h-3 w-3 rounded-full bg-amber-500/50" />
                    <div className="h-3 w-3 rounded-full bg-emerald-500/50" />
                  </div>
                  <div className="h-6 w-2/3 rounded-lg bg-indigo-500/20" />
                  <div className="space-y-2 pt-2">
                    <div className="h-2 w-full rounded-full bg-zinc-800" />
                    <div className="h-2 w-5/6 rounded-full bg-zinc-800" />
                    <div className="h-2 w-4/6 rounded-full bg-zinc-800" />
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="aspect-video rounded-lg bg-cyan-500/10 border border-cyan-500/20" />
                    <div className="aspect-video rounded-lg bg-purple-500/10 border border-purple-500/20" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="relative z-10 p-10 text-center lg:text-left">
          <p className="text-xs font-medium text-zinc-600">
            Trusted by creators at Google, Notion, and Framer.
          </p>
        </div>
      </div>

      {/* ━━━ Right Panel — Auth Container ━━━ */}
      <div className="relative flex flex-1 flex-col items-center justify-center p-6 sm:p-12 lg:p-20">
        {/* Mobile Header */}
        <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-8 lg:hidden">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
              <Sparkles className="h-5 w-5 text-black" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Studio<span className="text-zinc-500">.ai</span>
            </span>
          </Link>
        </div>

        {/* Form Content Wrapper */}
        <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Code2,
  Brain,
  Trophy,
  ChevronRight,
} from "lucide-react";

const floatingBadges = [
  { icon: Code2, label: "Coding Round", color: "from-indigo-500/20 to-indigo-600/10 border-indigo-500/20", delay: 0 },
  { icon: Brain, label: "AI Feedback", color: "from-violet-500/20 to-violet-600/10 border-violet-500/20", delay: 0.2 },
  { icon: Trophy, label: "Global Rank #1", color: "from-amber-500/20 to-amber-600/10 border-amber-500/20", delay: 0.4 },
];

const stats = [
  { value: "50K+", label: "Questions" },
  { value: "20+", label: "Tech Tracks" },
  { value: "10K+", label: "Users" },
  { value: "95%", label: "Success Rate" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb w-[600px] h-[600px] bg-indigo-600/15 -top-48 -left-32" />
        <div className="orb w-[500px] h-[500px] bg-violet-600/10 top-1/4 right-0" />
        <div className="orb w-[400px] h-[400px] bg-cyan-600/10 bottom-0 left-1/3" />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Announcement badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-indigo-500/20 text-sm text-indigo-300 mb-8 hover:border-indigo-500/40 transition-colors cursor-default"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Powered Interview Prep Platform</span>
          <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          Ace Every{" "}
          <span className="gradient-text">Interview</span>
          <br />
          with <span className="gradient-text-purple">Confidence</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          One platform to prep for every tech role — SDE, Data Science, Cloud,
          QA, BA, PM and more. Practice with JD-based questions, get AI feedback,
          and rank globally.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/auth/sign-up"
            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-[1.02]"
          >
            Start Practicing Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#features"
            className="flex items-center gap-2 px-8 py-4 glass border border-white/10 text-slate-300 font-medium rounded-xl hover:border-indigo-500/30 hover:text-white transition-all duration-300"
          >
            See How It Works
          </Link>
        </motion.div>

        {/* Floating badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-16"
        >
          {floatingBadges.map((badge) => (
            <div
              key={badge.label}
              className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${badge.color} border text-sm text-slate-300`}
            >
              <badge.icon className="w-3.5 h-3.5" />
              {badge.label}
            </div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden max-w-2xl mx-auto"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#07070f] p-6 flex flex-col items-center gap-1"
            >
              <span className="text-3xl font-bold gradient-text">{stat.value}</span>
              <span className="text-sm text-slate-500">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Hero mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 relative max-w-4xl mx-auto"
        >
          {/* Glow behind mockup */}
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/20 via-violet-600/10 to-transparent blur-3xl rounded-3xl" />

          {/* Browser frame */}
          <div className="relative glass border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              </div>
              <div className="flex-1 mx-4 px-4 py-1 bg-white/5 rounded-md text-xs text-slate-500 text-center">
                prepit.dev/dashboard
              </div>
            </div>

            {/* Dashboard preview content */}
            <div className="p-6 bg-gradient-to-br from-[#0d0d1a] to-[#07070f] min-h-[320px]">
              <div className="flex gap-6">
                {/* Sidebar */}
                <div className="hidden sm:flex flex-col gap-2 w-48">
                  {["Dashboard", "Practice", "Interview", "IDE", "Leaderboard"].map((item, i) => (
                    <div
                      key={item}
                      className={`px-3 py-2 rounded-lg text-xs ${
                        i === 1
                          ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/20"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>

                {/* Main content preview */}
                <div className="flex-1 space-y-4">
                  <div className="h-6 w-48 bg-gradient-to-r from-indigo-500/20 to-transparent rounded-lg" />
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Questions Solved", val: "142", color: "indigo" },
                      { label: "Streak", val: "7 days", color: "amber" },
                      { label: "Global Rank", val: "#2,341", color: "emerald" },
                    ].map((c) => (
                      <div key={c.label} className="glass border border-white/5 rounded-xl p-3">
                        <div className="text-lg font-bold text-white">{c.val}</div>
                        <div className="text-xs text-slate-500">{c.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="glass border border-white/5 rounded-xl p-4 space-y-2">
                    <div className="h-3 w-3/4 bg-white/5 rounded" />
                    <div className="h-3 w-1/2 bg-white/5 rounded" />
                    <div className="h-3 w-2/3 bg-indigo-500/20 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

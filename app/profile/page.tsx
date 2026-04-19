"use client";

import { motion } from "framer-motion";
import {
  User, Mail, Briefcase, Edit3, Trophy, Flame, Code2,
  CheckCircle2, BarChart3, Calendar, Star, Lock, Bell, Palette,
} from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  Tooltip,
} from "recharts";

const skillData = [
  { subject: "DSA", score: 72 },
  { subject: "System Design", score: 58 },
  { subject: "SQL", score: 85 },
  { subject: "Cloud", score: 45 },
  { subject: "Behavioral", score: 90 },
  { subject: "ML/AI", score: 38 },
];

const achievements = [
  { icon: "🔥", label: "7 Day Streak", unlocked: true },
  { icon: "💯", label: "100 Questions", unlocked: true },
  { icon: "🧠", label: "System Design Pro", unlocked: true },
  { icon: "⚡", label: "Speed Coder", unlocked: false },
  { icon: "🏆", label: "Top 1000", unlocked: false },
  { icon: "🎯", label: "Perfect Score", unlocked: false },
];

const settingsTabs = ["Profile", "Security", "Notifications", "Appearance"];

export default function ProfilePage() {
  return (
    <div className="max-w-4xl space-y-6">
      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border border-white/7 rounded-2xl p-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-indigo-500/20">
              JD
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#07070f] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-white">John Doe</h1>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/20 text-xs text-indigo-300">
                Pro Plan
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-3">
              Software Engineer · 3-5 years · Targeting Google, Meta
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                { icon: Trophy, label: "Rank #2,341", color: "text-amber-400" },
                { icon: Flame, label: "7 day streak", color: "text-orange-400" },
                { icon: Code2, label: "142 solved", color: "text-indigo-400" },
                { icon: CheckCircle2, label: "Member since Jan 2025", color: "text-emerald-400" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                  {s.label}
                </div>
              ))}
            </div>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 glass border border-white/10 rounded-xl text-sm text-slate-300 hover:border-white/20 hover:text-white transition-all">
            <Edit3 className="w-3.5 h-3.5" />
            Edit Profile
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skill radar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass border border-white/7 rounded-2xl p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              Skill Map
            </h2>
            <span className="text-xs text-slate-500">Last 30 days</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={skillData}>
              <PolarGrid stroke="rgba(255,255,255,0.05)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 11 }} />
              <Radar
                name="Skills"
                dataKey="score"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{ background: "#0d0d1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#f1f5f9", fontSize: 12 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass border border-white/7 rounded-2xl p-6"
        >
          <h2 className="font-semibold text-white flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-amber-400" />
            Achievements
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {achievements.map((a) => (
              <div
                key={a.label}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                  a.unlocked
                    ? "bg-amber-500/10 border-amber-500/20"
                    : "bg-white/3 border-white/5 opacity-40 grayscale"
                }`}
              >
                <span className="text-xl">{a.icon}</span>
                <span className="text-xs text-slate-400 text-center leading-tight">{a.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Settings section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass border border-white/7 rounded-2xl overflow-hidden"
      >
        {/* Tabs */}
        <div className="flex border-b border-white/5">
          {settingsTabs.map((tab, i) => {
            const icons = [User, Lock, Bell, Palette];
            const Icon = icons[i];
            return (
              <button
                key={tab}
                className={`flex items-center gap-1.5 px-5 py-4 text-sm transition-colors ${
                  i === 0
                    ? "text-indigo-400 border-b-2 border-indigo-500 font-medium"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:block">{tab}</span>
              </button>
            );
          })}
        </div>

        {/* Profile form */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: User, label: "Full Name", value: "John Doe", type: "text" },
            { icon: Mail, label: "Email", value: "john@example.com", type: "email" },
            { icon: Briefcase, label: "Current Role", value: "Software Engineer", type: "text" },
            { icon: Calendar, label: "Experience", value: "3-5 years", type: "text" },
          ].map((field) => (
            <div key={field.label}>
              <label className="block text-xs text-slate-500 mb-1.5">{field.label}</label>
              <div className="relative">
                <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type={field.type}
                  defaultValue={field.value}
                  className="w-full pl-9 pr-4 py-2.5 bg-white/4 border border-white/8 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500/30 transition-all"
                />
              </div>
            </div>
          ))}

          <div className="sm:col-span-2 flex justify-end">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all">
              Save Changes
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen, Code2, Video, Trophy,
  Flame, TrendingUp, Target, Clock,
  ChevronRight, ArrowUpRight, Star,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

const activityData = [
  { day: "Mon", questions: 8 },
  { day: "Tue", questions: 12 },
  { day: "Wed", questions: 5 },
  { day: "Thu", questions: 18 },
  { day: "Fri", questions: 14 },
  { day: "Sat", questions: 22 },
  { day: "Sun", questions: 9 },
];

const recentQuestions = [
  { title: "Implement LRU Cache", topic: "DSA", difficulty: "Medium", status: "solved" },
  { title: "Design Twitter Feed", topic: "System Design", difficulty: "Hard", status: "in-progress" },
  { title: "Kubernetes Pod Lifecycle", topic: "Cloud", difficulty: "Easy", status: "solved" },
  { title: "SQL Window Functions", topic: "Database", difficulty: "Medium", status: "unsolved" },
];

const difficultyColor: Record<string, string> = {
  Easy: "text-emerald-400",
  Medium: "text-amber-400",
  Hard: "text-rose-400",
};

const statusColor: Record<string, string> = {
  solved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "in-progress": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  unsolved: "bg-white/5 text-slate-500 border-white/10",
};

const quickActions = [
  { icon: BookOpen, label: "Practice Questions", href: "/practice", color: "from-indigo-500 to-violet-500" },
  { icon: Video, label: "Mock Interview", href: "/interview", color: "from-violet-500 to-fuchsia-500" },
  { icon: Code2, label: "Open IDE", href: "/ide", color: "from-cyan-500 to-indigo-500" },
  { icon: Trophy, label: "Leaderboard", href: "/leaderboard", color: "from-amber-500 to-orange-500" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Good morning, John 👋</h1>
          <p className="text-slate-400 text-sm mt-1">You have 3 pending topics to review today.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 glass border border-amber-500/20 rounded-xl text-sm text-amber-300">
          <Flame className="w-4 h-4" />
          <span>7 day streak</span>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: "Questions Solved", value: "142", icon: Target, change: "+12 this week", color: "text-indigo-400", bg: "bg-indigo-500/10" },
          { label: "Current Streak", value: "7 days", icon: Flame, change: "Personal best!", color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Global Rank", value: "#2,341", icon: Trophy, change: "↑ 230 this week", color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Avg. Session", value: "42 min", icon: Clock, change: "Above average", color: "text-violet-400", bg: "bg-violet-500/10" },
        ].map((stat) => (
          <div key={stat.label} className="glass border border-white/7 rounded-2xl p-4">
            <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-xs text-slate-500 mb-1">{stat.label}</div>
            <div className={`text-xs ${stat.color} opacity-70`}>{stat.change}</div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass border border-white/7 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-white">Weekly Activity</h2>
              <p className="text-xs text-slate-500 mt-0.5">Questions solved this week</p>
            </div>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "#0d0d1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#f1f5f9", fontSize: 12 }}
                cursor={{ stroke: "rgba(99,102,241,0.3)" }}
              />
              <Area type="monotone" dataKey="questions" stroke="#6366f1" strokeWidth={2} fill="url(#areaGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass border border-white/7 rounded-2xl p-6"
        >
          <h2 className="font-semibold text-white mb-4">Quick Start</h2>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/8 transition-all group"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                  <action.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors flex-1">{action.label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Questions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass border border-white/7 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Recent Questions</h2>
          <Link href="/practice" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
            View all <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-3">
          {recentQuestions.map((q) => (
            <div key={q.title} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/4 transition-all group cursor-pointer">
              <div className="flex items-center gap-3">
                <Star className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
                <div>
                  <div className="text-sm text-slate-200 group-hover:text-white transition-colors">{q.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{q.topic}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium ${difficultyColor[q.difficulty]}`}>{q.difficulty}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColor[q.status]}`}>
                  {q.status === "in-progress" ? "In Progress" : q.status === "solved" ? "Solved" : "Unsolved"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

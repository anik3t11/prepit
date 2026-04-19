"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, BookOpen, Code2, Database, Cloud,
  TestTube, BarChart3, Bot, ChevronRight, CheckCircle2,
  Circle, Clock, Star, Flame, SlidersHorizontal,
} from "lucide-react";

const topics = [
  { id: "all", label: "All Topics", icon: BookOpen, color: "text-slate-400" },
  { id: "dsa", label: "DSA", icon: Code2, color: "text-indigo-400" },
  { id: "system-design", label: "System Design", icon: Database, color: "text-violet-400" },
  { id: "cloud", label: "Cloud / DevOps", icon: Cloud, color: "text-sky-400" },
  { id: "ml", label: "ML / AI", icon: Bot, color: "text-fuchsia-400" },
  { id: "sql", label: "SQL / DBMS", icon: Database, color: "text-emerald-400" },
  { id: "testing", label: "Testing", icon: TestTube, color: "text-amber-400" },
  { id: "analytics", label: "Analytics", icon: BarChart3, color: "text-cyan-400" },
];

const difficulties = ["All", "Easy", "Medium", "Hard"];

const questions = [
  { id: 1, title: "Two Sum", topic: "DSA", difficulty: "Easy", status: "solved", time: "15 min", starred: true },
  { id: 2, title: "LRU Cache Implementation", topic: "DSA", difficulty: "Medium", status: "solved", time: "25 min", starred: false },
  { id: 3, title: "Design a URL Shortener", topic: "System Design", difficulty: "Medium", status: "in-progress", time: "45 min", starred: true },
  { id: 4, title: "Kubernetes Pod Scheduling", topic: "Cloud / DevOps", difficulty: "Hard", status: "unsolved", time: "30 min", starred: false },
  { id: 5, title: "Explain BERT Architecture", topic: "ML / AI", difficulty: "Hard", status: "unsolved", time: "20 min", starred: false },
  { id: 6, title: "SQL Window Functions", topic: "SQL / DBMS", difficulty: "Medium", status: "solved", time: "15 min", starred: true },
  { id: 7, title: "Binary Search Tree Operations", topic: "DSA", difficulty: "Easy", status: "solved", time: "20 min", starred: false },
  { id: 8, title: "Design Netflix Architecture", topic: "System Design", difficulty: "Hard", status: "unsolved", time: "60 min", starred: false },
  { id: 9, title: "Selenium Page Object Model", topic: "Testing", difficulty: "Medium", status: "in-progress", time: "25 min", starred: false },
  { id: 10, title: "Merge K Sorted Lists", topic: "DSA", difficulty: "Hard", status: "unsolved", time: "30 min", starred: false },
];

const diffColor: Record<string, string> = {
  Easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Hard: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

const statusIcon = (status: string) => {
  if (status === "solved") return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
  if (status === "in-progress") return <Clock className="w-4 h-4 text-amber-400" />;
  return <Circle className="w-4 h-4 text-slate-600" />;
};

export default function PracticePage() {
  const [activeTopic, setActiveTopic] = useState("all");
  const [activeDiff, setActiveDiff] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<(typeof questions)[0] | null>(null);

  const filtered = questions.filter((q) => {
    const topicMatch = activeTopic === "all" || q.topic.toLowerCase().includes(activeTopic);
    const diffMatch = activeDiff === "All" || q.difficulty === activeDiff;
    const searchMatch = !search || q.title.toLowerCase().includes(search.toLowerCase());
    return topicMatch && diffMatch && searchMatch;
  });

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Practice Questions</h1>
          <p className="text-slate-400 text-sm mt-1">
            {filtered.length} questions · {questions.filter((q) => q.status === "solved").length} solved
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all">
          <Flame className="w-4 h-4" />
          Daily Challenge
        </button>
      </motion.div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block w-52 shrink-0 space-y-4"
        >
          <div className="glass border border-white/7 rounded-2xl p-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Topics</h3>
            <div className="space-y-1">
              {topics.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTopic(t.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                    activeTopic === t.id
                      ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
                      : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <t.icon className={`w-3.5 h-3.5 ${t.color}`} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="glass border border-white/7 rounded-2xl p-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Difficulty</h3>
            <div className="space-y-1">
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => setActiveDiff(d)}
                  className={`w-full px-3 py-2 rounded-lg text-sm text-left transition-all ${
                    activeDiff === d
                      ? "bg-white/8 text-white"
                      : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main list */}
        <div className="flex-1 space-y-4">
          {/* Search + filter bar */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-9 pr-4 py-2.5 bg-white/4 border border-white/8 rounded-xl text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/30 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 glass border border-white/8 rounded-xl text-sm text-slate-400 hover:text-white transition-colors lg:hidden">
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </button>
          </div>

          {/* Questions list */}
          <div className="glass border border-white/7 rounded-2xl overflow-hidden">
            <div className="divide-y divide-white/5">
              {filtered.map((q, i) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedQuestion(q)}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-white/3 cursor-pointer group transition-all"
                >
                  <div className="shrink-0">{statusIcon(q.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-200 group-hover:text-white transition-colors truncate">
                        {q.title}
                      </span>
                      {q.starred && <Star className="w-3.5 h-3.5 text-amber-400 shrink-0" fill="currentColor" />}
                    </div>
                    <span className="text-xs text-slate-500">{q.topic}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-slate-600 hidden sm:block">
                      <Clock className="w-3 h-3 inline mr-1" />{q.time}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${diffColor[q.difficulty]}`}>
                      {q.difficulty}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                  </div>
                </motion.div>
              ))}

              {filtered.length === 0 && (
                <div className="py-16 text-center text-slate-500 text-sm">
                  No questions match your filters.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Question detail panel */}
        <AnimatePresence>
          {selectedQuestion && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="hidden xl:block w-80 shrink-0"
            >
              <div className="glass border border-white/7 rounded-2xl p-6 sticky top-0 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-white text-sm">{selectedQuestion.title}</h2>
                  <button
                    onClick={() => setSelectedQuestion(null)}
                    className="text-slate-500 hover:text-slate-300 text-xs shrink-0"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${diffColor[selectedQuestion.difficulty]}`}>
                    {selectedQuestion.difficulty}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                    {selectedQuestion.topic}
                  </span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Practice this question to strengthen your {selectedQuestion.topic} skills.
                  Estimated time: {selectedQuestion.time}.
                </p>
                <div className="space-y-2 pt-2">
                  <a
                    href={`/practice/${selectedQuestion.id}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
                  >
                    Start Question
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="/ide"
                    className="w-full flex items-center justify-center gap-2 py-2.5 glass border border-white/10 text-slate-300 text-sm rounded-xl hover:border-indigo-500/30 transition-all"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    Open in IDE
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

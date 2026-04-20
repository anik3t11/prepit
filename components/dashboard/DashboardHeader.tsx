"use client";

import { Bell, Search, ChevronDown } from "lucide-react";
import { useUser } from "@/lib/useUser";

export default function DashboardHeader() {
  const { displayName, initial } = useUser();

  return (
    <header className="h-16 border-b border-white/5 bg-[#07070f]/50 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
      {/* Search */}
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
        <input
          type="text"
          placeholder="Search questions, topics..."
          className="w-full pl-9 pr-4 py-2 bg-white/4 border border-white/8 rounded-xl text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/30 transition-all"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 glass border border-white/8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
        </button>

        <button className="flex items-center gap-2.5 px-3 py-2 glass border border-white/8 rounded-xl hover:border-white/15 transition-all">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white">
            {initial}
          </div>
          <span className="text-sm text-slate-300">{displayName}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
        </button>
      </div>
    </header>
  );
}

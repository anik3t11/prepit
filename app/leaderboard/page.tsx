"use client";

import { motion } from "framer-motion";
import { Trophy, Flame, TrendingUp, Medal, Crown, Star } from "lucide-react";

const tracks = ["Global", "SDE", "Data Science", "Cloud", "ML / AI", "QA"];

const leaderboardData = [
  { rank: 1, name: "Priya Sharma", avatar: "PS", score: 9840, streak: 42, solved: 412, badge: "🏆", country: "IN" },
  { rank: 2, name: "Alex Chen", avatar: "AC", score: 9120, streak: 38, solved: 389, badge: "🥈", country: "US" },
  { rank: 3, name: "Lucas Müller", avatar: "LM", score: 8930, streak: 31, solved: 371, badge: "🥉", country: "DE" },
  { rank: 4, name: "Fatima Al-Hassan", avatar: "FA", score: 8450, streak: 28, solved: 352, badge: null, country: "AE" },
  { rank: 5, name: "Yuki Tanaka", avatar: "YT", score: 8200, streak: 25, solved: 340, badge: null, country: "JP" },
  { rank: 6, name: "Carlos Rivera", avatar: "CR", score: 7980, streak: 22, solved: 328, badge: null, country: "BR" },
  { rank: 7, name: "Amara Diallo", avatar: "AD", score: 7760, streak: 20, solved: 315, badge: null, country: "NG" },
  { rank: 8, name: "John Doe", avatar: "JD", score: 7540, streak: 7, solved: 142, badge: null, country: "US", isUser: true },
  { rank: 9, name: "Mei Wang", avatar: "MW", score: 7320, streak: 15, solved: 299, badge: null, country: "CN" },
  { rank: 10, name: "Omar Abdullah", avatar: "OA", score: 7100, streak: 13, solved: 287, badge: null, country: "SA" },
];

const rankColors = ["text-amber-400", "text-slate-300", "text-amber-700"];
const rankBgs = ["bg-amber-500/10 border-amber-500/20", "bg-slate-500/10 border-slate-500/20", "bg-amber-700/10 border-amber-700/20"];

const topThree = leaderboardData.slice(0, 3);

export default function LeaderboardPage() {
  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
          <p className="text-slate-400 text-sm mt-1">Compete globally. Climb the ranks.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 glass border border-amber-500/20 rounded-xl text-sm text-amber-300">
          <Crown className="w-4 h-4" />
          <span>Your rank: #2,341</span>
        </div>
      </motion.div>

      {/* Track tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tracks.map((t, i) => (
          <button
            key={t}
            className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all border ${
              i === 0
                ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-300"
                : "glass border-white/8 text-slate-500 hover:text-slate-300 hover:border-white/15"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Podium top 3 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        {[topThree[1], topThree[0], topThree[2]].map((user, i) => {
          const actualRank = i === 0 ? 2 : i === 1 ? 1 : 3;
          const height = i === 1 ? "h-36" : "h-28";
          return (
            <div key={user.rank} className="flex flex-col items-center gap-2">
              <div className="flex flex-col items-center gap-2">
                <div className="text-2xl">{user.badge}</div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-sm font-bold text-white">
                  {user.avatar}
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-white truncate max-w-[100px]">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.score.toLocaleString()} pts</div>
                </div>
              </div>
              <div
                className={`w-full ${height} rounded-t-xl flex items-end justify-center pb-3 ${rankBgs[actualRank - 1]} border border-b-0`}
              >
                <span className={`text-2xl font-black ${rankColors[actualRank - 1]}`}>{actualRank}</span>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Full table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass border border-white/7 rounded-2xl overflow-hidden"
      >
        <div className="divide-y divide-white/5">
          {leaderboardData.map((user, i) => (
            <motion.div
              key={user.rank}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className={`flex items-center gap-4 px-5 py-4 transition-all ${
                user.isUser
                  ? "bg-indigo-500/8 border-l-2 border-l-indigo-500"
                  : "hover:bg-white/3"
              }`}
            >
              {/* Rank */}
              <div className="w-8 text-center shrink-0">
                {user.rank <= 3 ? (
                  <Medal className={`w-5 h-5 mx-auto ${rankColors[user.rank - 1]}`} />
                ) : (
                  <span className="text-sm font-bold text-slate-500">#{user.rank}</span>
                )}
              </div>

              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500/60 to-violet-500/60 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {user.avatar}
              </div>

              {/* Name + country */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${user.isUser ? "text-indigo-300" : "text-slate-200"}`}>
                    {user.name}
                  </span>
                  {user.isUser && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/20">
                      You
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-600">{user.country}</div>
              </div>

              {/* Stats */}
              <div className="hidden sm:flex items-center gap-6">
                <div className="text-center">
                  <div className="text-sm font-semibold text-white">{user.solved}</div>
                  <div className="text-xs text-slate-600">Solved</div>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  <Flame className="w-3.5 h-3.5" />
                  <span className="text-sm font-semibold">{user.streak}d</span>
                </div>
              </div>

              {/* Score */}
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400" fill="currentColor" />
                  <span className="text-sm font-bold text-white">{user.score.toLocaleString()}</span>
                </div>
                <div className="text-xs text-slate-600">points</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

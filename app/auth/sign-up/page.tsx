"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap, Mail, Lock, Eye, EyeOff, ArrowRight, GitFork, User,
} from "lucide-react";

const tracks = [
  "Software Engineer", "Data Science", "ML / AI", "Data Engineering",
  "Cloud / DevOps", "QA / Testing", "Full Stack", "Backend", "Business Analyst",
  "Product Manager", "SAP / ERP", "Cybersecurity",
];

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedTrack, setSelectedTrack] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.location.href = "/dashboard";
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12">
      <div className="absolute inset-0 animated-gradient" />
      <div className="orb w-[500px] h-[500px] bg-violet-600/15 -top-32 -right-32 absolute" />
      <div className="orb w-[400px] h-[400px] bg-cyan-600/10 -bottom-32 -left-32 absolute" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Zap className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="font-bold text-xl">
              Prep<span className="text-indigo-400">It</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">
            {step === 1 ? "Create your account" : "Choose your track"}
          </h1>
          <p className="text-slate-400 text-sm">
            {step === 1
              ? "Start your interview prep journey today — free forever"
              : "We'll personalize your experience based on your goal"}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all ${
                s <= step ? "bg-indigo-500" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        <div className="glass border border-white/10 rounded-2xl p-8">
          {step === 1 ? (
            <>
              <button className="w-full flex items-center justify-center gap-3 px-4 py-3 glass border border-white/10 rounded-xl text-sm text-slate-300 hover:border-white/20 hover:text-white transition-all mb-6">
                <GitFork className="w-4 h-4" />
                Continue with GitHub
              </button>

              <div className="relative flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-white/8" />
                <span className="text-xs text-slate-600">or sign up with email</span>
                <div className="flex-1 h-px bg-white/8" />
              </div>

              <form onSubmit={handleStep1} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Min. 8 characters"
                      required
                      minLength={8}
                      className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {tracks.map((track) => (
                  <button
                    key={track}
                    onClick={() => setSelectedTrack(track)}
                    className={`px-3 py-2.5 rounded-xl text-xs text-left transition-all border ${
                      selectedTrack === track
                        ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                        : "bg-white/3 border-white/8 text-slate-400 hover:border-white/15 hover:text-slate-300"
                    }`}
                  >
                    {track}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSubmit}
                disabled={!selectedTrack || loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Start Practicing
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <button
                onClick={() => setStep(1)}
                className="w-full text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                ← Back
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

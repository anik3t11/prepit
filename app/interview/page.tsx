"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload, Briefcase, ChevronRight, Sparkles,
  Clock, Target, Brain, PlayCircle, FileText,
  Building, GraduationCap,
} from "lucide-react";

const roles = [
  "Software Engineer", "Senior SDE", "Data Scientist", "ML Engineer",
  "Data Engineer", "Cloud Architect", "DevOps Engineer", "Full Stack Dev",
  "QA Engineer", "Business Analyst", "Product Manager", "Backend Engineer",
];

const experiences = ["0-1 year", "1-3 years", "3-5 years", "5-8 years", "8+ years"];

const interviewTypes = [
  { id: "technical", icon: Brain, label: "Technical Round", desc: "DSA, System Design, Coding", color: "indigo" },
  { id: "behavioral", icon: Target, label: "Behavioral Round", desc: "STAR method, Leadership", color: "violet" },
  { id: "mixed", icon: Sparkles, label: "Mixed Round", desc: "Blend of both types", color: "cyan" },
];

const durations = ["15 min", "30 min", "45 min", "60 min"];

type Step = "setup" | "jd" | "ready";

export default function InterviewPage() {
  const [step, setStep] = useState<Step>("setup");
  const [config, setConfig] = useState({
    role: "",
    experience: "",
    type: "mixed",
    duration: "30 min",
    company: "",
  });
  const [jdText, setJdText] = useState("");

  const canProceed = config.role && config.experience;

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white">Mock Interview</h1>
        <p className="text-slate-400 text-sm mt-1">Configure your mock interview session</p>
      </motion.div>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        {(["setup", "jd", "ready"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all ${
                step === s
                  ? "bg-indigo-500 text-white"
                  : i < ["setup", "jd", "ready"].indexOf(step)
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-white/5 text-slate-500 border border-white/10"
              }`}
            >
              {i + 1}
            </div>
            {i < 2 && <div className="flex-1 h-px w-16 bg-white/8" />}
          </div>
        ))}
      </div>

      {step === "setup" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Role */}
          <div className="glass border border-white/7 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-1 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              Target Role
            </h2>
            <p className="text-sm text-slate-500 mb-4">What role are you interviewing for?</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => setConfig({ ...config, role })}
                  className={`px-3 py-2 rounded-xl text-sm text-left transition-all border ${
                    config.role === role
                      ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                      : "bg-white/3 border-white/8 text-slate-400 hover:border-white/15 hover:text-slate-300"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="glass border border-white/7 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-1 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-violet-400" />
              Experience Level
            </h2>
            <p className="text-sm text-slate-500 mb-4">How many years of experience do you have?</p>
            <div className="flex flex-wrap gap-2">
              {experiences.map((exp) => (
                <button
                  key={exp}
                  onClick={() => setConfig({ ...config, experience: exp })}
                  className={`px-4 py-2 rounded-xl text-sm transition-all border ${
                    config.experience === exp
                      ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                      : "bg-white/3 border-white/8 text-slate-400 hover:border-white/15 hover:text-slate-300"
                  }`}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>

          {/* Interview type */}
          <div className="glass border border-white/7 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-1 flex items-center gap-2">
              <Brain className="w-4 h-4 text-cyan-400" />
              Interview Type
            </h2>
            <p className="text-sm text-slate-500 mb-4">What kind of questions do you want?</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {interviewTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setConfig({ ...config, type: type.id })}
                  className={`p-4 rounded-xl text-left transition-all border ${
                    config.type === type.id
                      ? `bg-${type.color}-500/15 border-${type.color}-500/30 text-${type.color}-300`
                      : "bg-white/3 border-white/8 text-slate-400 hover:border-white/15"
                  }`}
                >
                  <type.icon className="w-4 h-4 mb-2" />
                  <div className="font-medium text-sm text-white">{type.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{type.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Duration + company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass border border-white/7 rounded-2xl p-6">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Duration
              </h2>
              <div className="flex flex-wrap gap-2">
                {durations.map((d) => (
                  <button
                    key={d}
                    onClick={() => setConfig({ ...config, duration: d })}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all border ${
                      config.duration === d
                        ? "bg-amber-500/20 border-amber-500/30 text-amber-300"
                        : "bg-white/3 border-white/8 text-slate-400 hover:border-white/15"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass border border-white/7 rounded-2xl p-6">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-400" />
                Target Company
                <span className="text-xs text-slate-600">(optional)</span>
              </h2>
              <input
                type="text"
                placeholder="e.g. Google, Amazon..."
                value={config.company}
                onChange={(e) => setConfig({ ...config, company: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/30 transition-all"
              />
            </div>
          </div>

          <button
            onClick={() => setStep("jd")}
            disabled={!canProceed}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue to JD
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {step === "jd" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="glass border border-white/7 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-1 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              Job Description
              <span className="text-xs text-slate-600 font-normal">(optional but recommended)</span>
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Paste the JD to get hyper-targeted questions for this exact role.
            </p>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the job description here..."
              rows={10}
              className="w-full px-4 py-3 bg-white/4 border border-white/8 rounded-xl text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/30 transition-all resize-none font-mono"
            />
            <div className="flex items-center gap-3 mt-3">
              <button className="flex items-center gap-2 px-4 py-2 glass border border-white/10 rounded-xl text-sm text-slate-400 hover:text-white transition-colors">
                <Upload className="w-4 h-4" />
                Upload PDF
              </button>
              <span className="text-xs text-slate-600">or paste text above</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep("setup")}
              className="px-6 py-3 glass border border-white/10 text-slate-300 text-sm rounded-xl hover:border-white/20 transition-all"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep("ready")}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Generate Interview
            </button>
          </div>
        </motion.div>
      )}

      {step === "ready" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="glass border border-indigo-500/20 rounded-2xl p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-indigo-500/30">
                <PlayCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Interview Ready!</h2>
              <p className="text-slate-400 text-sm mb-6">
                Your {config.duration} {config.type} interview for <strong className="text-white">{config.role}</strong> is ready.
                {config.company && ` Tailored for ${config.company}.`}
              </p>

              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {[
                  { label: config.role, icon: Briefcase },
                  { label: config.experience, icon: GraduationCap },
                  { label: config.duration, icon: Clock },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5 px-3 py-1.5 glass border border-white/10 rounded-full text-sm text-slate-300">
                    <item.icon className="w-3.5 h-3.5 text-indigo-400" />
                    {item.label}
                  </div>
                ))}
              </div>

              <button
                onClick={() => window.location.href = "/interview/session"}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-indigo-500/30 transition-all text-lg"
              >
                <PlayCircle className="w-5 h-5" />
                Start Interview
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

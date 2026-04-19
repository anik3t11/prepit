"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Briefcase, ChevronRight, Sparkles,
  Clock, Target, Brain, PlayCircle, FileText,
  Building, GraduationCap, Layers, MessageSquare,
  CheckCircle2, X, AlertCircle, Lightbulb, Bug,
} from "lucide-react";

const roles = [
  "Software Engineer", "Senior SDE", "Data Scientist", "ML Engineer",
  "Data Engineer", "Cloud Architect", "DevOps Engineer", "Full Stack Dev",
  "QA Engineer", "Business Analyst", "Product Manager", "Backend Engineer",
  "Data Analyst", "Cybersecurity Engineer", "SAP Consultant",
];

const experiences = ["0-1 year", "1-3 years", "3-5 years", "5-8 years", "8+ years"];

const interviewTypes = [
  { id: "technical",  icon: Brain,   label: "Technical",  desc: "DSA, System Design, Coding",  color: "indigo" },
  { id: "behavioral", icon: Target,  label: "Behavioral", desc: "STAR method, Leadership",       color: "violet" },
  { id: "mixed",      icon: Sparkles,label: "Mixed",      desc: "Blend of both types",           color: "cyan"   },
];

const interviewRounds = [
  { id: "screening",      label: "HR Screening",     desc: "Culture fit, basic eligibility" },
  { id: "technical-1",    label: "Technical Round 1", desc: "DSA & fundamentals" },
  { id: "technical-2",    label: "Technical Round 2", desc: "Advanced DSA & system design" },
  { id: "system-design",  label: "System Design",     desc: "Architecture & scalability" },
  { id: "managerial",     label: "Managerial Round",  desc: "Leadership & decision making" },
  { id: "final",          label: "Final / HR",        desc: "Offer negotiation & culture" },
];

const popularCompanies = [
  "Google", "Amazon", "Microsoft", "Meta", "Apple",
  "Netflix", "Flipkart", "Infosys", "Wipro", "TCS",
];

const durations = ["15 min", "30 min", "45 min", "60 min"];

const feedbackCategories = [
  { id: "bug",        icon: Bug,          label: "Bug / Error",       color: "text-rose-400" },
  { id: "question",   icon: AlertCircle,  label: "Question Quality",  color: "text-amber-400" },
  { id: "ui",         icon: Layers,       label: "UI / UX Issue",     color: "text-indigo-400" },
  { id: "suggestion", icon: Lightbulb,    label: "Suggestion",        color: "text-emerald-400" },
];

type Step = "setup" | "jd" | "ready";

interface FeedbackForm {
  category: string;
  description: string;
  email: string;
}

export default function InterviewPage() {
  const [step, setStep] = useState<Step>("setup");
  const [config, setConfig] = useState({
    role: "", experience: "", type: "mixed",
    duration: "30 min", company: "", round: "technical-1",
  });
  const [jdText, setJdText] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackForm>({ category: "", description: "", email: "" });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const canProceed = config.role && config.experience;

  const handleFeedbackSubmit = () => {
    if (!feedback.category || !feedback.description.trim()) return;
    // Store in localStorage so it can be reviewed later
    const existing = JSON.parse(localStorage.getItem("prepit_feedback") || "[]");
    existing.push({ ...feedback, page: "interview", ts: new Date().toISOString() });
    localStorage.setItem("prepit_feedback", JSON.stringify(existing));
    setFeedbackSubmitted(true);
    setTimeout(() => { setShowFeedback(false); setFeedbackSubmitted(false); setFeedback({ category: "", description: "", email: "" }); }, 2000);
  };

  return (
    <div className="max-w-3xl relative">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mock Interview</h1>
          <p className="text-slate-400 text-sm mt-1">Configure your mock interview session</p>
        </div>
        <button
          onClick={() => setShowFeedback(true)}
          className="flex items-center gap-2 px-3 py-2 glass border border-white/10 rounded-xl text-xs text-slate-400 hover:text-white hover:border-white/20 transition-all"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Report / Feedback
        </button>
      </motion.div>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        {(["setup", "jd", "ready"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all ${
              step === s
                ? "bg-indigo-500 text-white"
                : i < ["setup", "jd", "ready"].indexOf(step)
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-white/5 text-slate-500 border border-white/10"
            }`}>
              {i < ["setup", "jd", "ready"].indexOf(step) ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
            </div>
            {i < 2 && <div className="flex-1 h-px w-16 bg-white/8" />}
          </div>
        ))}
        <span className="text-xs text-slate-500 ml-1">
          {step === "setup" ? "Configure" : step === "jd" ? "Job Description" : "Ready"}
        </span>
      </div>

      {/* ── STEP 1: Setup ─────────────────────────────────────────────────────── */}
      {step === "setup" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

          {/* Role */}
          <div className="glass border border-white/7 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-1 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" />Target Role
            </h2>
            <p className="text-sm text-slate-500 mb-4">What role are you interviewing for?</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {roles.map((role) => (
                <button key={role} onClick={() => setConfig({ ...config, role })}
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

          {/* Company */}
          <div className="glass border border-white/7 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-1 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-400" />Target Company
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              We&apos;ll tailor questions to that company&apos;s known interview style.
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {popularCompanies.map((c) => (
                <button key={c} onClick={() => setConfig({ ...config, company: c })}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all border ${
                    config.company === c
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                      : "bg-white/3 border-white/8 text-slate-400 hover:border-white/15 hover:text-slate-300"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Or type a company name..."
              value={config.company}
              onChange={(e) => setConfig({ ...config, company: e.target.value })}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/30 transition-all"
            />
          </div>

          {/* Interview Round */}
          <div className="glass border border-white/7 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-1 flex items-center gap-2">
              <Layers className="w-4 h-4 text-violet-400" />Interview Round
            </h2>
            <p className="text-sm text-slate-500 mb-4">Which round are you preparing for?</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {interviewRounds.map((r) => (
                <button key={r.id} onClick={() => setConfig({ ...config, round: r.id })}
                  className={`p-3 rounded-xl text-left transition-all border ${
                    config.round === r.id
                      ? "bg-violet-500/15 border-violet-500/30 text-violet-300"
                      : "bg-white/3 border-white/8 text-slate-400 hover:border-white/15 hover:text-slate-300"
                  }`}
                >
                  <div className="text-xs font-semibold mb-0.5">{r.label}</div>
                  <div className="text-xs text-slate-600 leading-tight">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="glass border border-white/7 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-1 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-amber-400" />Experience Level
            </h2>
            <p className="text-sm text-slate-500 mb-4">How many years of experience do you have?</p>
            <div className="flex flex-wrap gap-2">
              {experiences.map((exp) => (
                <button key={exp} onClick={() => setConfig({ ...config, experience: exp })}
                  className={`px-4 py-2 rounded-xl text-sm transition-all border ${
                    config.experience === exp
                      ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                      : "bg-white/3 border-white/8 text-slate-400 hover:border-white/15 hover:text-slate-300"
                  }`}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>

          {/* Interview Type + Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass border border-white/7 rounded-2xl p-6">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-4 h-4 text-cyan-400" />Interview Type
              </h2>
              <div className="space-y-2">
                {interviewTypes.map((type) => (
                  <button key={type.id} onClick={() => setConfig({ ...config, type: type.id })}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all border ${
                      config.type === type.id
                        ? "bg-white/8 border-white/15 text-white"
                        : "bg-white/3 border-white/8 text-slate-400 hover:border-white/15"
                    }`}
                  >
                    <type.icon className="w-4 h-4 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold">{type.label}</div>
                      <div className="text-xs text-slate-500">{type.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="glass border border-white/7 rounded-2xl p-6">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-400" />Duration
              </h2>
              <div className="flex flex-wrap gap-2">
                {durations.map((d) => (
                  <button key={d} onClick={() => setConfig({ ...config, duration: d })}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all border ${
                      config.duration === d
                        ? "bg-rose-500/15 border-rose-500/30 text-rose-300"
                        : "bg-white/3 border-white/8 text-slate-400 hover:border-white/15"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button onClick={() => setStep("jd")} disabled={!canProceed}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue to Job Description <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* ── STEP 2: JD ────────────────────────────────────────────────────────── */}
      {step === "jd" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="glass border border-white/7 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-1 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              Job Description
              <span className="text-xs text-slate-600 font-normal ml-1 px-2 py-0.5 bg-white/5 rounded-full border border-white/10">Optional</span>
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Paste the JD to get hyper-targeted questions. Skip this step if you don&apos;t have one.
            </p>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste job description here..."
              rows={10}
              className="w-full px-4 py-3 bg-white/4 border border-white/8 rounded-xl text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/30 transition-all resize-none font-mono"
            />
            <div className="flex items-center gap-3 mt-3">
              <button className="flex items-center gap-2 px-4 py-2 glass border border-white/10 rounded-xl text-sm text-slate-400 hover:text-white transition-colors">
                <Upload className="w-4 h-4" />Upload PDF
              </button>
              <span className="text-xs text-slate-600">or paste text above</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep("setup")}
              className="px-6 py-3 glass border border-white/10 text-slate-300 text-sm rounded-xl hover:border-white/20 transition-all">
              ← Back
            </button>
            <button onClick={() => setStep("ready")}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all">
              <Sparkles className="w-4 h-4" />
              {jdText.trim() ? "Generate from JD" : "Skip & Generate Interview"}
            </button>
          </div>
        </motion.div>
      )}

      {/* ── STEP 3: Ready ─────────────────────────────────────────────────────── */}
      {step === "ready" && (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className="glass border border-indigo-500/20 rounded-2xl p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-indigo-500/30">
                <PlayCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Interview Ready!</h2>
              <p className="text-slate-400 text-sm mb-6">
                Your <strong className="text-white">{config.duration}</strong> {config.type} interview for{" "}
                <strong className="text-white">{config.role}</strong>
                {config.company && <> at <strong className="text-white">{config.company}</strong></>} is configured.
              </p>

              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {[
                  { label: config.role,       icon: Briefcase },
                  { label: config.experience, icon: GraduationCap },
                  { label: config.duration,   icon: Clock },
                  { label: interviewRounds.find((r) => r.id === config.round)?.label ?? "", icon: Layers },
                  ...(config.company ? [{ label: config.company, icon: Building }] : []),
                  ...(jdText.trim() ? [{ label: "JD Provided", icon: FileText }] : []),
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5 px-3 py-1.5 glass border border-white/10 rounded-full text-xs text-slate-300">
                    <item.icon className="w-3 h-3 text-indigo-400" />
                    {item.label}
                  </div>
                ))}
              </div>

              <button onClick={() => window.location.href = "/interview/session"}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-indigo-500/30 transition-all text-lg">
                <PlayCircle className="w-5 h-5" />Start Interview
              </button>
              <button onClick={() => setStep("setup")} className="w-full text-sm text-slate-500 hover:text-slate-300 transition-colors mt-3">
                ← Reconfigure
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Feedback Modal ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showFeedback && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowFeedback(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto bg-[#0d0d1a] border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/50"
            >
              {feedbackSubmitted ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold text-lg mb-1">Thanks for the feedback!</h3>
                  <p className="text-slate-400 text-sm">We&apos;ll review it in our next sprint.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-white font-semibold">Report Issue / Give Feedback</h3>
                      <p className="text-slate-500 text-xs mt-0.5">We read every submission and act on it each sprint.</p>
                    </div>
                    <button onClick={() => setShowFeedback(false)} className="text-slate-500 hover:text-white transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Category */}
                    <div>
                      <label className="text-xs text-slate-400 mb-2 block font-medium">Category</label>
                      <div className="grid grid-cols-2 gap-2">
                        {feedbackCategories.map((cat) => (
                          <button key={cat.id} onClick={() => setFeedback({ ...feedback, category: cat.id })}
                            className={`flex items-center gap-2 p-3 rounded-xl text-sm border transition-all text-left ${
                              feedback.category === cat.id
                                ? "bg-white/10 border-white/20 text-white"
                                : "bg-white/3 border-white/8 text-slate-400 hover:border-white/15"
                            }`}
                          >
                            <cat.icon className={`w-4 h-4 shrink-0 ${cat.color}`} />
                            <span className="text-xs font-medium">{cat.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-xs text-slate-400 mb-2 block font-medium">Description <span className="text-rose-400">*</span></label>
                      <textarea
                        value={feedback.description}
                        onChange={(e) => setFeedback({ ...feedback, description: e.target.value })}
                        placeholder="Describe the issue or suggestion in detail..."
                        rows={4}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/30 transition-all resize-none"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-xs text-slate-400 mb-2 block font-medium">Email <span className="text-slate-600">(optional — if you want a reply)</span></label>
                      <input
                        type="email"
                        value={feedback.email}
                        onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/30 transition-all"
                      />
                    </div>

                    <button
                      onClick={handleFeedbackSubmit}
                      disabled={!feedback.category || !feedback.description.trim()}
                      className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Submit Feedback
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

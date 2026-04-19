"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Code2,
  Brain,
  BarChart3,
  Globe,
  Cpu,
  Lightbulb,
  Target,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "JD-Based Questions",
    description:
      "Paste your job description and get laser-targeted questions tailored to the exact role, company, and requirements.",
    color: "from-indigo-500/20 to-indigo-600/5",
    border: "border-indigo-500/20",
    iconColor: "text-indigo-400",
  },
  {
    icon: Code2,
    title: "In-Browser IDE",
    description:
      "Full-featured code editor with 40+ language compilers. Run, debug, and submit code without leaving PrepIt.",
    color: "from-cyan-500/20 to-cyan-600/5",
    border: "border-cyan-500/20",
    iconColor: "text-cyan-400",
  },
  {
    icon: Brain,
    title: "AI Mock Interviewer",
    description:
      "Simulate real interviews with our AI. Get voice-based questions, instant feedback, and detailed analysis of your answers.",
    color: "from-violet-500/20 to-violet-600/5",
    border: "border-violet-500/20",
    iconColor: "text-violet-400",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description:
      "Deep dive into your strengths and weaknesses. See exactly where you're losing marks and how to fix it.",
    color: "from-emerald-500/20 to-emerald-600/5",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-400",
  },
  {
    icon: Globe,
    title: "Global Leaderboard",
    description:
      "Compete with learners worldwide. Earn XP, climb ranks, and get recognized as a top performer in your track.",
    color: "from-amber-500/20 to-amber-600/5",
    border: "border-amber-500/20",
    iconColor: "text-amber-400",
  },
  {
    icon: Target,
    title: "Topic-Focused Practice",
    description:
      "Zero in on specific skills — DSA, System Design, SQL, Kubernetes, Behavioral, or anything else you choose.",
    color: "from-rose-500/20 to-rose-600/5",
    border: "border-rose-500/20",
    iconColor: "text-rose-400",
  },
  {
    icon: Lightbulb,
    title: "Smart Recommendations",
    description:
      "Our AI identifies your weak areas and recommends courses, resources, and targeted practice to fill the gaps.",
    color: "from-sky-500/20 to-sky-600/5",
    border: "border-sky-500/20",
    iconColor: "text-sky-400",
  },
  {
    icon: Cpu,
    title: "20+ Tech Tracks",
    description:
      "From SDE to SAP, Data Science to DevOps — every tech career path has a dedicated prep track built for it.",
    color: "from-fuchsia-500/20 to-fuchsia-600/5",
    border: "border-fuchsia-500/20",
    iconColor: "text-fuchsia-400",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb w-[500px] h-[500px] bg-indigo-600/10 top-0 right-0" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-sm text-slate-400 mb-4">
            Everything you need
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Built for <span className="gradient-text">serious prep</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Every feature is designed to get you interview-ready, fast. No fluff, no filler.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`glass glass-hover rounded-2xl p-6 border ${feature.border} group`}
            >
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
              </div>
              <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

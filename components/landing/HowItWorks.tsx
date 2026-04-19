"use client";

import { motion } from "framer-motion";
import { Upload, Cpu, PlayCircle, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Import Your JD",
    description:
      "Paste the job description or select your role and experience level. PrepIt instantly analyzes it to understand exactly what you need.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    line: "from-indigo-500/50 to-transparent",
  },
  {
    icon: Cpu,
    step: "02",
    title: "Get Smart Questions",
    description:
      "Our AI generates role-specific questions from a database of 50K+ real interview questions scraped from top sources and AI-augmented.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    line: "from-violet-500/50 to-transparent",
  },
  {
    icon: PlayCircle,
    step: "03",
    title: "Practice & Code",
    description:
      "Answer questions, write code in the IDE, run your solutions, and get instant AI feedback on your responses.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    line: "from-cyan-500/50 to-transparent",
  },
  {
    icon: TrendingUp,
    step: "04",
    title: "Analyze & Improve",
    description:
      "See detailed performance reports, identify weak areas, get course recommendations, and track your progress over time.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    line: "",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb w-[500px] h-[500px] bg-cyan-600/8 top-0 left-1/2 -translate-x-1/2" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-sm text-slate-400 mb-4">
            Simple 4-step process
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            How <span className="gradient-text">PrepIt</span> works
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            From zero to interview-ready in days, not months.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-white/10 to-transparent z-0" />
              )}

              <div className="relative z-10 glass rounded-2xl p-6 border border-white/7 glass-hover h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${step.bg} flex items-center justify-center`}>
                    <step.icon className={`w-5 h-5 ${step.color}`} />
                  </div>
                  <span className={`text-2xl font-black ${step.color} opacity-30`}>{step.step}</span>
                </div>
                <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

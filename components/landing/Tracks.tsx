"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Database,
  Cloud,
  TestTube,
  BarChart3,
  Bot,
  ShieldCheck,
  Server,
  Layers,
  Package,
  Users,
  Briefcase,
} from "lucide-react";

const tracks = [
  {
    icon: Code2,
    title: "Software Engineer",
    sub: "DSA · System Design · LLD",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    count: "4,200+ questions",
  },
  {
    icon: Bot,
    title: "AI / ML Engineer",
    sub: "ML · Deep Learning · LLMs",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    count: "2,100+ questions",
  },
  {
    icon: BarChart3,
    title: "Data Science",
    sub: "Statistics · Python · ML",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    count: "1,800+ questions",
  },
  {
    icon: Database,
    title: "Data Engineering",
    sub: "Spark · Kafka · Airflow",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    count: "1,500+ questions",
  },
  {
    icon: Cloud,
    title: "Cloud / DevOps",
    sub: "AWS · GCP · Kubernetes",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    count: "2,600+ questions",
  },
  {
    icon: TestTube,
    title: "QA / Testing",
    sub: "Manual · Selenium · Cypress",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    count: "1,200+ questions",
  },
  {
    icon: Server,
    title: "Backend Engineer",
    sub: "APIs · Databases · Microservices",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    count: "2,800+ questions",
  },
  {
    icon: Layers,
    title: "Full Stack",
    sub: "React · Node · Next.js",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    count: "3,000+ questions",
  },
  {
    icon: ShieldCheck,
    title: "Cybersecurity",
    sub: "Network · OWASP · Pen Testing",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    count: "900+ questions",
  },
  {
    icon: Package,
    title: "SAP / ERP",
    sub: "SAP Basis · ABAP · Fiori",
    color: "text-lime-400",
    bg: "bg-lime-500/10",
    border: "border-lime-500/20",
    count: "800+ questions",
  },
  {
    icon: Briefcase,
    title: "Business Analyst",
    sub: "Requirements · JIRA · SQL",
    color: "text-teal-400",
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
    count: "1,100+ questions",
  },
  {
    icon: Users,
    title: "Product Manager",
    sub: "Strategy · Roadmap · Metrics",
    color: "text-fuchsia-400",
    bg: "bg-fuchsia-500/10",
    border: "border-fuchsia-500/20",
    count: "1,000+ questions",
  },
];

export default function Tracks() {
  return (
    <section id="tracks" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb w-[600px] h-[600px] bg-violet-600/8 -bottom-32 -left-32" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-sm text-slate-400 mb-4">
            Every tech career covered
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Your track, <span className="gradient-text">your path</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Whether you&apos;re an SDE, data engineer, cloud architect, or product manager — we have a dedicated track built just for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tracks.map((track, i) => (
            <motion.div
              key={track.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              whileHover={{ y: -4 }}
              className={`glass glass-hover rounded-2xl p-5 border ${track.border} cursor-pointer group`}
            >
              <div className={`w-10 h-10 rounded-xl ${track.bg} flex items-center justify-center mb-3`}>
                <track.icon className={`w-5 h-5 ${track.color}`} />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">{track.title}</h3>
              <p className="text-xs text-slate-500 mb-3">{track.sub}</p>
              <div className={`text-xs font-medium ${track.color} opacity-70 group-hover:opacity-100 transition-opacity`}>
                {track.count}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-slate-400 text-sm">
            + Behavioral, DBMS, Salesforce, ServiceNow, IT Support &amp; more tracks
          </p>
        </motion.div>
      </div>
    </section>
  );
}

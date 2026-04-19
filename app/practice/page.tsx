"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search, Code2, Database, Cloud, Bot, BarChart3,
  TestTube, ChevronRight, CheckCircle2, Circle, Clock,
  Star, Flame, ChevronDown, Briefcase, Shield,
  BookOpen, Layers, GitBranch, LineChart,
} from "lucide-react";

// ─── Track definitions ────────────────────────────────────────────────────────
const tracks = [
  { id: "data-analyst",    label: "Data Analyst",      icon: BarChart3,  color: "text-cyan-400",    bg: "bg-cyan-500/10",    border: "border-cyan-500/20" },
  { id: "sde",             label: "Software Engineer", icon: Code2,      color: "text-indigo-400",  bg: "bg-indigo-500/10",  border: "border-indigo-500/20" },
  { id: "ml-ai",           label: "ML / AI",           icon: Bot,        color: "text-fuchsia-400", bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/20" },
  { id: "data-engineering",label: "Data Engineering",  icon: GitBranch,  color: "text-violet-400",  bg: "bg-violet-500/10",  border: "border-violet-500/20" },
  { id: "cloud-devops",    label: "Cloud / DevOps",    icon: Cloud,      color: "text-sky-400",     bg: "bg-sky-500/10",     border: "border-sky-500/20" },
  { id: "qa",              label: "QA / Testing",      icon: TestTube,   color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20" },
  { id: "fullstack",       label: "Full Stack",        icon: Layers,     color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { id: "backend",         label: "Backend",           icon: Database,   color: "text-rose-400",    bg: "bg-rose-500/10",    border: "border-rose-500/20" },
  { id: "product-manager", label: "Product Manager",   icon: Briefcase,  color: "text-orange-400",  bg: "bg-orange-500/10",  border: "border-orange-500/20" },
  { id: "cybersecurity",   label: "Cybersecurity",     icon: Shield,     color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/20" },
  { id: "business-analyst",label: "Business Analyst",  icon: LineChart,  color: "text-teal-400",    bg: "bg-teal-500/10",    border: "border-teal-500/20" },
  { id: "behavioral",      label: "Behavioral",        icon: BookOpen,   color: "text-slate-400",   bg: "bg-slate-500/10",   border: "border-slate-500/20" },
];

// ─── Question bank grouped by track → skill group ─────────────────────────────
type Question = {
  id: number; title: string; difficulty: "Easy" | "Medium" | "Hard";
  status: "solved" | "in-progress" | "unsolved"; time: string; starred?: boolean;
};
type SkillGroup = { id: string; label: string; icon: typeof Code2; questions: Question[] };
type TrackData = Record<string, SkillGroup[]>;

const trackData: TrackData = {
  "data-analyst": [
    {
      id: "sql", label: "SQL & Queries", icon: Database, questions: [
        { id: 101, title: "SQL Window Functions (RANK, DENSE_RANK, ROW_NUMBER)", difficulty: "Medium", status: "solved", time: "15 min", starred: true },
        { id: 102, title: "Write a query to find duplicate records", difficulty: "Easy", status: "solved", time: "10 min" },
        { id: 103, title: "Optimize a slow-running JOIN query", difficulty: "Hard", status: "unsolved", time: "30 min" },
        { id: 104, title: "CTEs vs Subqueries — when to use each?", difficulty: "Medium", status: "in-progress", time: "20 min" },
        { id: 105, title: "Pivot a table using CASE statements", difficulty: "Medium", status: "unsolved", time: "20 min" },
      ],
    },
    {
      id: "python-r", label: "Python / R for Analysis", icon: Code2, questions: [
        { id: 111, title: "Pandas: merge, groupby, pivot_table", difficulty: "Medium", status: "solved", time: "20 min", starred: true },
        { id: 112, title: "Handle missing data in a DataFrame", difficulty: "Easy", status: "solved", time: "10 min" },
        { id: 113, title: "Explain vectorized operations vs loops", difficulty: "Medium", status: "unsolved", time: "15 min" },
        { id: 114, title: "Build a cohort retention analysis in Python", difficulty: "Hard", status: "unsolved", time: "40 min" },
      ],
    },
    {
      id: "statistics", label: "Statistics & Probability", icon: BarChart3, questions: [
        { id: 121, title: "Explain p-value and statistical significance", difficulty: "Medium", status: "solved", time: "15 min" },
        { id: 122, title: "A/B Testing — how do you determine sample size?", difficulty: "Hard", status: "unsolved", time: "25 min", starred: true },
        { id: 123, title: "Central Limit Theorem — explain with example", difficulty: "Easy", status: "in-progress", time: "10 min" },
        { id: 124, title: "What is multicollinearity and how do you detect it?", difficulty: "Medium", status: "unsolved", time: "15 min" },
      ],
    },
    {
      id: "bi", label: "Business Intelligence", icon: LineChart, questions: [
        { id: 131, title: "Design a KPI dashboard for an e-commerce site", difficulty: "Medium", status: "unsolved", time: "30 min" },
        { id: 132, title: "Explain star schema vs snowflake schema", difficulty: "Easy", status: "solved", time: "15 min" },
        { id: 133, title: "What metrics would you track for user churn?", difficulty: "Medium", status: "unsolved", time: "20 min" },
      ],
    },
  ],

  "sde": [
    {
      id: "dsa", label: "Data Structures & Algorithms", icon: Code2, questions: [
        { id: 201, title: "Two Sum", difficulty: "Easy", status: "solved", time: "15 min", starred: true },
        { id: 202, title: "LRU Cache Implementation", difficulty: "Medium", status: "solved", time: "25 min" },
        { id: 203, title: "Merge K Sorted Lists", difficulty: "Hard", status: "unsolved", time: "30 min" },
        { id: 204, title: "Binary Search Tree Operations", difficulty: "Easy", status: "solved", time: "20 min" },
        { id: 205, title: "Graph — Detect cycle in directed graph", difficulty: "Medium", status: "in-progress", time: "25 min" },
        { id: 206, title: "Dynamic Programming — Coin Change", difficulty: "Medium", status: "unsolved", time: "30 min" },
      ],
    },
    {
      id: "system-design", label: "System Design", icon: Database, questions: [
        { id: 211, title: "Design a URL Shortener", difficulty: "Medium", status: "in-progress", time: "45 min", starred: true },
        { id: 212, title: "Design Netflix Architecture", difficulty: "Hard", status: "unsolved", time: "60 min" },
        { id: 213, title: "Design a Rate Limiter", difficulty: "Medium", status: "unsolved", time: "40 min" },
        { id: 214, title: "Design a Notification System", difficulty: "Hard", status: "unsolved", time: "50 min" },
      ],
    },
    {
      id: "oop", label: "OOP & Design Patterns", icon: Layers, questions: [
        { id: 221, title: "Explain SOLID principles with examples", difficulty: "Medium", status: "solved", time: "20 min" },
        { id: 222, title: "Implement Observer design pattern", difficulty: "Medium", status: "unsolved", time: "25 min" },
        { id: 223, title: "Singleton vs Static — what's the difference?", difficulty: "Easy", status: "solved", time: "10 min" },
      ],
    },
  ],

  "ml-ai": [
    {
      id: "ml-core", label: "Machine Learning", icon: Bot, questions: [
        { id: 301, title: "Explain bias-variance tradeoff", difficulty: "Medium", status: "solved", time: "15 min", starred: true },
        { id: 302, title: "Gradient Descent — types and when to use each", difficulty: "Medium", status: "solved", time: "20 min" },
        { id: 303, title: "How does Random Forest reduce overfitting?", difficulty: "Medium", status: "unsolved", time: "15 min" },
        { id: 304, title: "Implement k-means clustering from scratch", difficulty: "Hard", status: "unsolved", time: "45 min" },
      ],
    },
    {
      id: "deep-learning", label: "Deep Learning", icon: Layers, questions: [
        { id: 311, title: "Explain BERT Architecture", difficulty: "Hard", status: "unsolved", time: "20 min" },
        { id: 312, title: "What is attention mechanism in Transformers?", difficulty: "Hard", status: "in-progress", time: "25 min", starred: true },
        { id: 313, title: "Vanishing gradient problem and solutions", difficulty: "Medium", status: "unsolved", time: "15 min" },
      ],
    },
    {
      id: "mlops", label: "MLOps & Deployment", icon: Cloud, questions: [
        { id: 321, title: "How do you monitor model drift in production?", difficulty: "Hard", status: "unsolved", time: "20 min" },
        { id: 322, title: "Feature store — what is it and why use it?", difficulty: "Medium", status: "unsolved", time: "15 min" },
        { id: 323, title: "A/B testing a new ML model in production", difficulty: "Hard", status: "unsolved", time: "25 min" },
      ],
    },
  ],

  "data-engineering": [
    {
      id: "pipelines", label: "ETL & Data Pipelines", icon: GitBranch, questions: [
        { id: 401, title: "Design an idempotent data pipeline", difficulty: "Hard", status: "unsolved", time: "30 min", starred: true },
        { id: 402, title: "Batch vs Stream processing — when to use each?", difficulty: "Medium", status: "solved", time: "20 min" },
        { id: 403, title: "Handle late-arriving data in a streaming pipeline", difficulty: "Hard", status: "unsolved", time: "25 min" },
      ],
    },
    {
      id: "big-data", label: "Cloud & Big Data", icon: Cloud, questions: [
        { id: 411, title: "Explain Apache Spark vs Hadoop MapReduce", difficulty: "Medium", status: "in-progress", time: "20 min" },
        { id: 412, title: "Design a data lake on AWS S3", difficulty: "Hard", status: "unsolved", time: "40 min" },
        { id: 413, title: "Kafka partitioning strategy for high throughput", difficulty: "Hard", status: "unsolved", time: "30 min" },
      ],
    },
    {
      id: "sql-de", label: "SQL & Data Modeling", icon: Database, questions: [
        { id: 421, title: "Slowly Changing Dimensions (SCD Type 2)", difficulty: "Medium", status: "solved", time: "25 min" },
        { id: 422, title: "Optimize a query on a 1B-row partitioned table", difficulty: "Hard", status: "unsolved", time: "35 min" },
      ],
    },
  ],

  "cloud-devops": [
    {
      id: "kubernetes", label: "Kubernetes & Docker", icon: Layers, questions: [
        { id: 501, title: "Kubernetes Pod Scheduling", difficulty: "Hard", status: "unsolved", time: "30 min" },
        { id: 502, title: "Difference between Deployment and StatefulSet", difficulty: "Medium", status: "solved", time: "15 min" },
        { id: 503, title: "How does Kubernetes handle rolling updates?", difficulty: "Medium", status: "in-progress", time: "20 min", starred: true },
      ],
    },
    {
      id: "aws", label: "AWS / GCP / Azure", icon: Cloud, questions: [
        { id: 511, title: "Design a multi-region failover on AWS", difficulty: "Hard", status: "unsolved", time: "45 min", starred: true },
        { id: 512, title: "When to use SQS vs SNS vs EventBridge?", difficulty: "Medium", status: "unsolved", time: "20 min" },
        { id: 513, title: "Explain IAM roles vs IAM users and best practices", difficulty: "Easy", status: "solved", time: "15 min" },
      ],
    },
    {
      id: "cicd", label: "CI/CD & DevOps", icon: GitBranch, questions: [
        { id: 521, title: "Design a CI/CD pipeline with GitHub Actions", difficulty: "Medium", status: "unsolved", time: "25 min" },
        { id: 522, title: "Blue/Green vs Canary deployment strategies", difficulty: "Medium", status: "solved", time: "15 min" },
      ],
    },
  ],

  "qa": [
    {
      id: "fundamentals", label: "Testing Fundamentals", icon: TestTube, questions: [
        { id: 601, title: "What is the testing pyramid? Explain each layer.", difficulty: "Easy", status: "solved", time: "15 min" },
        { id: 602, title: "Difference between regression and smoke testing", difficulty: "Easy", status: "solved", time: "10 min" },
        { id: 603, title: "How do you prioritize test cases under time pressure?", difficulty: "Medium", status: "unsolved", time: "20 min", starred: true },
      ],
    },
    {
      id: "automation", label: "Test Automation", icon: Code2, questions: [
        { id: 611, title: "Selenium Page Object Model", difficulty: "Medium", status: "in-progress", time: "25 min" },
        { id: 612, title: "Cypress vs Playwright — tradeoffs?", difficulty: "Medium", status: "unsolved", time: "15 min" },
        { id: 613, title: "How do you handle flaky tests?", difficulty: "Medium", status: "unsolved", time: "20 min", starred: true },
      ],
    },
    {
      id: "api-testing", label: "API & Performance Testing", icon: Database, questions: [
        { id: 621, title: "Write Postman test scripts for an auth API", difficulty: "Medium", status: "unsolved", time: "25 min" },
        { id: 622, title: "Explain load testing vs stress testing vs spike testing", difficulty: "Easy", status: "solved", time: "15 min" },
      ],
    },
  ],

  "fullstack": [
    {
      id: "frontend", label: "Frontend", icon: Layers, questions: [
        { id: 701, title: "React reconciliation and virtual DOM", difficulty: "Medium", status: "solved", time: "15 min" },
        { id: 702, title: "Explain CSS specificity and the cascade", difficulty: "Easy", status: "solved", time: "10 min" },
        { id: 703, title: "Optimize a React app with 10k list items", difficulty: "Hard", status: "unsolved", time: "30 min", starred: true },
      ],
    },
    {
      id: "backend-fs", label: "Backend & APIs", icon: Database, questions: [
        { id: 711, title: "REST vs GraphQL — when to choose what?", difficulty: "Medium", status: "solved", time: "15 min", starred: true },
        { id: 712, title: "Design an authentication flow with JWT + refresh tokens", difficulty: "Hard", status: "unsolved", time: "35 min" },
        { id: 713, title: "SQL N+1 problem — how to detect and fix?", difficulty: "Medium", status: "in-progress", time: "20 min" },
      ],
    },
  ],

  "backend": [
    {
      id: "api-design", label: "API Design", icon: Database, questions: [
        { id: 801, title: "Design idempotent REST endpoints", difficulty: "Medium", status: "unsolved", time: "20 min" },
        { id: 802, title: "Versioning strategy for a public API", difficulty: "Medium", status: "solved", time: "15 min", starred: true },
      ],
    },
    {
      id: "databases", label: "Databases", icon: Layers, questions: [
        { id: 811, title: "When to use SQL vs NoSQL?", difficulty: "Easy", status: "solved", time: "15 min" },
        { id: 812, title: "Explain database indexing and its tradeoffs", difficulty: "Medium", status: "solved", time: "20 min" },
        { id: 813, title: "Implement optimistic vs pessimistic locking", difficulty: "Hard", status: "unsolved", time: "30 min" },
      ],
    },
  ],

  "product-manager": [
    {
      id: "product-sense", label: "Product Sense", icon: Briefcase, questions: [
        { id: 901, title: "How would you improve YouTube's homepage?", difficulty: "Medium", status: "unsolved", time: "20 min", starred: true },
        { id: 902, title: "Define success metrics for a new feature launch", difficulty: "Medium", status: "solved", time: "15 min" },
        { id: 903, title: "How do you prioritize a backlog with competing stakeholders?", difficulty: "Hard", status: "unsolved", time: "25 min" },
      ],
    },
    {
      id: "execution", label: "Execution & Metrics", icon: BarChart3, questions: [
        { id: 911, title: "Daily Active Users dropped 10% — root cause analysis", difficulty: "Hard", status: "unsolved", time: "25 min", starred: true },
        { id: 912, title: "How do you run an A/B test as a PM?", difficulty: "Medium", status: "in-progress", time: "20 min" },
      ],
    },
  ],

  "cybersecurity": [
    {
      id: "appsec", label: "Application Security", icon: Shield, questions: [
        { id: 1001, title: "Explain OWASP Top 10 with examples", difficulty: "Medium", status: "unsolved", time: "25 min", starred: true },
        { id: 1002, title: "How does SQL injection work? How to prevent it?", difficulty: "Easy", status: "solved", time: "15 min" },
        { id: 1003, title: "Describe a CSRF attack and mitigation", difficulty: "Medium", status: "unsolved", time: "20 min" },
      ],
    },
    {
      id: "network-sec", label: "Network Security", icon: Cloud, questions: [
        { id: 1011, title: "TLS handshake — step by step", difficulty: "Medium", status: "in-progress", time: "20 min" },
        { id: 1012, title: "Zero Trust Architecture — principles and implementation", difficulty: "Hard", status: "unsolved", time: "30 min", starred: true },
      ],
    },
  ],

  "business-analyst": [
    {
      id: "requirements", label: "Requirements & Analysis", icon: LineChart, questions: [
        { id: 1101, title: "How do you elicit requirements from stakeholders?", difficulty: "Medium", status: "unsolved", time: "20 min", starred: true },
        { id: 1102, title: "Write a use case for an ATM withdrawal", difficulty: "Easy", status: "solved", time: "15 min" },
        { id: 1103, title: "Functional vs Non-functional requirements — examples", difficulty: "Easy", status: "solved", time: "10 min" },
      ],
    },
    {
      id: "process", label: "Process Modeling", icon: GitBranch, questions: [
        { id: 1111, title: "Create a BPMN diagram for an order fulfillment process", difficulty: "Medium", status: "unsolved", time: "25 min" },
        { id: 1112, title: "AS-IS vs TO-BE process mapping", difficulty: "Medium", status: "in-progress", time: "20 min", starred: true },
      ],
    },
  ],

  "behavioral": [
    {
      id: "star-method", label: "STAR Method Questions", icon: BookOpen, questions: [
        { id: 1201, title: "Tell me about a time you dealt with a difficult teammate", difficulty: "Medium", status: "solved", time: "10 min", starred: true },
        { id: 1202, title: "Describe a project where you failed — what did you learn?", difficulty: "Medium", status: "unsolved", time: "10 min" },
        { id: 1203, title: "Tell me about a time you took initiative", difficulty: "Easy", status: "solved", time: "10 min" },
        { id: 1204, title: "How do you handle conflicting priorities?", difficulty: "Medium", status: "unsolved", time: "10 min" },
      ],
    },
    {
      id: "leadership", label: "Leadership & Culture Fit", icon: Briefcase, questions: [
        { id: 1211, title: "Describe your leadership style with an example", difficulty: "Medium", status: "unsolved", time: "10 min", starred: true },
        { id: 1212, title: "How do you give constructive feedback?", difficulty: "Easy", status: "solved", time: "10 min" },
        { id: 1213, title: "Where do you see yourself in 5 years?", difficulty: "Easy", status: "unsolved", time: "10 min" },
      ],
    },
  ],
};

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
  const [activeTrack, setActiveTrack] = useState("data-analyst");
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState("All");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const track = tracks.find((t) => t.id === activeTrack)!;
  const groups = trackData[activeTrack] ?? [];

  // Filter questions within each group
  const filteredGroups = groups.map((g) => ({
    ...g,
    questions: g.questions.filter((q) => {
      const diffMatch = diffFilter === "All" || q.difficulty === diffFilter;
      const searchMatch = !search || q.title.toLowerCase().includes(search.toLowerCase());
      return diffMatch && searchMatch;
    }),
  })).filter((g) => g.questions.length > 0);

  const totalQ = groups.reduce((a, g) => a + g.questions.length, 0);
  const solvedQ = groups.reduce((a, g) => a + g.questions.filter((q) => q.status === "solved").length, 0);

  const toggleGroup = (id: string) =>
    setExpandedGroups((p) => ({ ...p, [id]: p[id] === false ? true : p[id] === true ? false : false }));

  const isExpanded = (id: string) => expandedGroups[id] !== false; // default open

  return (
    <div className="max-w-6xl space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Practice Questions</h1>
          <p className="text-slate-400 text-sm mt-1">
            {totalQ} questions in this track · {solvedQ} solved
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all">
          <Flame className="w-4 h-4" />
          Daily Challenge
        </button>
      </motion.div>

      {/* Track selector */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Your Track</p>
        <div className="flex flex-wrap gap-2">
          {tracks.map((t) => (
            <button
              key={t.id}
              onClick={() => { setActiveTrack(t.id); setSelectedQuestion(null); setSearch(""); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                activeTrack === t.id
                  ? `${t.bg} ${t.border} ${t.color}`
                  : "bg-white/3 border-white/8 text-slate-500 hover:text-slate-300 hover:border-white/15"
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Progress bar */}
      <div className="glass border border-white/7 rounded-xl px-4 py-3 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400 font-medium">{track.label} Progress</span>
            <span className="text-xs text-slate-500">{solvedQ} / {totalQ}</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all`}
              style={{ width: `${totalQ ? (solvedQ / totalQ) * 100 : 0}%` }}
            />
          </div>
        </div>
        <div className="flex gap-3 text-xs shrink-0">
          {["All", "Easy", "Medium", "Hard"].map((d) => (
            <button key={d} onClick={() => setDiffFilter(d)}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                diffFilter === d ? "bg-white/10 border-white/20 text-white" : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >{d}</button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search in ${track.label} questions...`}
          className="w-full pl-9 pr-4 py-2.5 bg-white/4 border border-white/8 rounded-xl text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/30 transition-all"
        />
      </div>

      {/* Question groups */}
      <div className="flex gap-5">
        <div className="flex-1 space-y-3 min-w-0">
          {filteredGroups.length === 0 && (
            <div className="glass border border-white/7 rounded-2xl py-16 text-center text-slate-500 text-sm">
              No questions match your search.
            </div>
          )}

          {filteredGroups.map((group) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass border border-white/7 rounded-2xl overflow-hidden"
            >
              {/* Group header */}
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/3 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${track.bg}`}>
                    <group.icon className={`w-3.5 h-3.5 ${track.color}`} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white">{group.label}</p>
                    <p className="text-xs text-slate-500">
                      {group.questions.filter((q) => q.status === "solved").length} / {group.questions.length} solved
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex gap-1.5">
                    {["Easy", "Medium", "Hard"].map((d) => {
                      const count = group.questions.filter((q) => q.difficulty === d).length;
                      if (!count) return null;
                      return (
                        <span key={d} className={`text-xs px-2 py-0.5 rounded-full border ${diffColor[d]}`}>
                          {count} {d}
                        </span>
                      );
                    })}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded(group.id) ? "rotate-180" : ""}`} />
                </div>
              </button>

              {/* Questions list */}
              <AnimatePresence>
                {isExpanded(group.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="divide-y divide-white/5 border-t border-white/5">
                      {group.questions.map((q) => (
                        <div
                          key={q.id}
                          onClick={() => setSelectedQuestion(q)}
                          className={`flex items-center gap-4 px-5 py-3.5 hover:bg-white/3 cursor-pointer group transition-all ${
                            selectedQuestion?.id === q.id ? "bg-indigo-500/5 border-l-2 border-indigo-500/50" : ""
                          }`}
                        >
                          <div className="shrink-0">{statusIcon(q.status)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-300 group-hover:text-white transition-colors truncate">
                                {q.title}
                              </span>
                              {q.starred && <Star className="w-3 h-3 text-amber-400 shrink-0" fill="currentColor" />}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs text-slate-600 hidden sm:flex items-center gap-1">
                              <Clock className="w-3 h-3" />{q.time}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${diffColor[q.difficulty]}`}>
                              {q.difficulty}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Question detail panel */}
        <AnimatePresence>
          {selectedQuestion && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="hidden xl:block w-72 shrink-0"
            >
              <div className="glass border border-white/7 rounded-2xl p-5 sticky top-0 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-white text-sm leading-snug">{selectedQuestion.title}</h2>
                  <button onClick={() => setSelectedQuestion(null)} className="text-slate-500 hover:text-slate-300 text-xs shrink-0 mt-0.5">✕</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${diffColor[selectedQuestion.difficulty]}`}>
                    {selectedQuestion.difficulty}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />{selectedQuestion.time}
                  </span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Strengthen your <strong className="text-slate-300">{track.label}</strong> skills with this question.
                </p>
                <div className="space-y-2 pt-1">
                  <Link
                    href={`/practice/${selectedQuestion.id}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
                  >
                    Start Question <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/ide"
                    className="w-full flex items-center justify-center gap-2 py-2.5 glass border border-white/10 text-slate-300 text-sm rounded-xl hover:border-indigo-500/30 transition-all"
                  >
                    <Code2 className="w-3.5 h-3.5" />Open in IDE
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

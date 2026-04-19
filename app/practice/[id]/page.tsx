"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowLeft, ChevronRight, CheckCircle2, XCircle, Lightbulb,
  Code2, FileText, Clock, Bookmark, BookmarkCheck,
  Loader2, Zap, BarChart2, RefreshCw, ThumbsUp, ThumbsDown,
} from "lucide-react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const question = {
  id: 1,
  title: "Two Sum",
  difficulty: "Easy",
  track: "DSA",
  tags: ["Array", "Hash Map"],
  acceptance: "49.1%",
  description: `Given an array of integers \`nums\` and an integer \`target\`, return **indices** of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    },
    {
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]",
      explanation: "",
    },
  ],
  constraints: [
    "2 ≤ nums.length ≤ 10⁴",
    "-10⁹ ≤ nums[i] ≤ 10⁹",
    "-10⁹ ≤ target ≤ 10⁹",
    "Only one valid answer exists.",
  ],
  hints: [
    "A brute-force approach is O(n²). Can you do better?",
    "Think about what complement you need for each number.",
    "A hash map lets you look up complements in O(1).",
  ],
  starterCode: `function twoSum(nums, target) {
  // Your solution here
};`,
  solution: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
};`,
};

const difficultyStyle: Record<string, string> = {
  Easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Hard: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

type Tab = "description" | "solution" | "ai";
type Mode = "text" | "code";

interface AIFeedback {
  verdict: "pass" | "fail" | "partial";
  score: number;
  timeComplexity: string;
  spaceComplexity: string;
  comments: string[];
  suggestions: string[];
}

export default function PracticeQuestionPage() {
  const [activeTab, setActiveTab] = useState<Tab>("description");
  const [mode, setMode] = useState<Mode>("code");
  const [code, setCode] = useState(question.starterCode);
  const [textAnswer, setTextAnswer] = useState("");
  const [hintIndex, setHintIndex] = useState(-1);
  const [bookmarked, setBookmarked] = useState(false);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<null | "up" | "down">(null);

  const handleRun = async () => {
    setRunning(true);
    setOutput("");
    await new Promise((r) => setTimeout(r, 1500));
    setOutput("[0, 1]\n[1, 2]\n\nAll test cases passed ✓\nExecution time: 0.12ms | Memory: 2.1 MB");
    setRunning(false);
  };

  const handleSubmit = async () => {
    setEvaluating(true);
    setAiFeedback(null);
    setActiveTab("ai");
    await new Promise((r) => setTimeout(r, 2200));
    setAiFeedback({
      verdict: "pass",
      score: 92,
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      comments: [
        "Great use of a hash map to achieve O(n) time complexity.",
        "Clean, readable code with proper variable naming.",
        "Correctly handles the single-pass approach.",
      ],
      suggestions: [
        "Consider adding input validation for edge cases.",
        "You could use early return to make the logic cleaner.",
      ],
    });
    setEvaluating(false);
  };

  const showNextHint = () => {
    if (hintIndex < question.hints.length - 1) setHintIndex((p) => p + 1);
  };

  return (
    <div className="flex gap-4 h-full">
      {/* Left panel — problem */}
      <div className="w-[420px] shrink-0 flex flex-col glass border border-white/7 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/5 shrink-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <Link
              href="/practice"
              className="text-slate-500 hover:text-slate-300 transition-colors mt-0.5"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex-1">
              <h1 className="text-base font-semibold text-white leading-tight">{question.title}</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${difficultyStyle[question.difficulty]}`}>
                  {question.difficulty}
                </span>
                <span className="text-xs text-slate-600">Acceptance: {question.acceptance}</span>
              </div>
            </div>
            <button onClick={() => setBookmarked(!bookmarked)} className="text-slate-500 hover:text-amber-400 transition-colors mt-0.5">
              {bookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white/3 rounded-xl p-1">
            {(["description", "solution", "ai"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                  activeTab === t
                    ? "bg-white/8 text-white"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {t === "ai" ? "AI Feedback" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
          {activeTab === "description" && (
            <>
              <div className="prose-dark text-slate-300 leading-relaxed whitespace-pre-line text-sm">
                {question.description}
              </div>

              <div className="space-y-3">
                {question.examples.map((ex, i) => (
                  <div key={i} className="bg-white/3 rounded-xl p-3 space-y-1.5 font-mono text-xs">
                    <p><span className="text-slate-500">Input: </span><span className="text-slate-200">{ex.input}</span></p>
                    <p><span className="text-slate-500">Output: </span><span className="text-emerald-300">{ex.output}</span></p>
                    {ex.explanation && (
                      <p><span className="text-slate-500">Explanation: </span><span className="text-slate-400">{ex.explanation}</span></p>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400 mb-2">Constraints</p>
                <ul className="space-y-1">
                  {question.constraints.map((c) => (
                    <li key={c} className="text-xs text-slate-500 font-mono">• {c}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2">
                {question.tags.map((t) => (
                  <span key={t} className="text-xs px-2.5 py-1 glass border border-white/8 rounded-full text-slate-400">
                    {t}
                  </span>
                ))}
              </div>

              {/* Hints */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-slate-400">Hints</p>
                  {hintIndex < question.hints.length - 1 && (
                    <button
                      onClick={showNextHint}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                    >
                      <Lightbulb className="w-3 h-3" />
                      {hintIndex === -1 ? "Show hint" : "Next hint"}
                    </button>
                  )}
                </div>
                <AnimatePresence>
                  {question.hints.slice(0, hintIndex + 1).map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-2 bg-amber-500/8 border border-amber-500/15 rounded-xl p-3 text-xs text-amber-300/80"
                    >
                      <span className="text-amber-400 font-medium">Hint {i + 1}: </span>{h}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}

          {activeTab === "solution" && (
            <div className="space-y-4">
              <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-300/80">
                Try solving it yourself first — checking the solution too early will hinder your growth.
              </div>
              <div className="bg-white/3 rounded-xl overflow-hidden">
                <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-500">JavaScript — O(n) solution</span>
                  <span className="text-xs text-emerald-400">Optimal</span>
                </div>
                <pre className="p-4 text-xs text-slate-300 font-mono leading-relaxed overflow-x-auto">
                  {question.solution}
                </pre>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/3 rounded-xl p-3 text-center">
                  <div className="text-base font-bold text-indigo-400">O(n)</div>
                  <div className="text-xs text-slate-500 mt-0.5">Time</div>
                </div>
                <div className="bg-white/3 rounded-xl p-3 text-center">
                  <div className="text-base font-bold text-violet-400">O(n)</div>
                  <div className="text-xs text-slate-500 mt-0.5">Space</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "ai" && (
            <div className="space-y-4">
              {evaluating && (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-500">
                  <Loader2 className="w-7 h-7 animate-spin text-indigo-400" />
                  <p className="text-sm">Evaluating your solution…</p>
                </div>
              )}
              {!evaluating && !aiFeedback && (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-600 text-center">
                  <Zap className="w-8 h-8 opacity-30" />
                  <p className="text-sm">Submit your solution to get AI feedback</p>
                </div>
              )}
              {!evaluating && aiFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Verdict */}
                  <div className={`rounded-xl p-4 border ${
                    aiFeedback.verdict === "pass"
                      ? "bg-emerald-500/8 border-emerald-500/20"
                      : aiFeedback.verdict === "partial"
                      ? "bg-amber-500/8 border-amber-500/20"
                      : "bg-rose-500/8 border-rose-500/20"
                  } flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      {aiFeedback.verdict === "pass" ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      )}
                      <span className={`font-semibold capitalize ${
                        aiFeedback.verdict === "pass" ? "text-emerald-400" :
                        aiFeedback.verdict === "partial" ? "text-amber-400" : "text-rose-400"
                      }`}>
                        {aiFeedback.verdict === "pass" ? "Accepted" : aiFeedback.verdict === "partial" ? "Partial" : "Wrong Answer"}
                      </span>
                    </div>
                    <div className="text-2xl font-black text-white">{aiFeedback.score}<span className="text-sm font-normal text-slate-500">/100</span></div>
                  </div>

                  {/* Complexity */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/3 rounded-xl p-3 text-center">
                      <div className="text-base font-bold text-indigo-400">{aiFeedback.timeComplexity}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Time Complexity</div>
                    </div>
                    <div className="bg-white/3 rounded-xl p-3 text-center">
                      <div className="text-base font-bold text-violet-400">{aiFeedback.spaceComplexity}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Space Complexity</div>
                    </div>
                  </div>

                  {/* Comments */}
                  <div>
                    <p className="text-xs font-medium text-emerald-400 mb-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> What you did well
                    </p>
                    <ul className="space-y-1.5">
                      {aiFeedback.comments.map((c) => (
                        <li key={c} className="text-xs text-slate-400 flex gap-2">
                          <span className="text-emerald-500 shrink-0">•</span>{c}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-amber-400 mb-2 flex items-center gap-1">
                      <BarChart2 className="w-3 h-3" /> Suggestions
                    </p>
                    <ul className="space-y-1.5">
                      {aiFeedback.suggestions.map((s) => (
                        <li key={s} className="text-xs text-slate-400 flex gap-2">
                          <span className="text-amber-500 shrink-0">•</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Helpful? */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-xs text-slate-600">Was this feedback helpful?</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setFeedbackGiven("up")}
                        className={`p-1.5 rounded-lg transition-all ${feedbackGiven === "up" ? "text-emerald-400 bg-emerald-500/10" : "text-slate-600 hover:text-slate-400"}`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setFeedbackGiven("down")}
                        className={`p-1.5 rounded-lg transition-all ${feedbackGiven === "down" ? "text-rose-400 bg-rose-500/10" : "text-slate-600 hover:text-slate-400"}`}
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right panel — editor */}
      <div className="flex-1 flex flex-col glass border border-white/7 rounded-2xl overflow-hidden min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode("code")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                mode === "code"
                  ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Code
            </button>
            <button
              onClick={() => setMode("text")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                mode === "text"
                  ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Text
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setCode(question.starterCode); setOutput(""); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              onClick={handleRun}
              disabled={running}
              className="flex items-center gap-1.5 px-3 py-1.5 glass border border-white/10 text-slate-300 text-xs rounded-lg hover:border-white/20 transition-all disabled:opacity-60"
            >
              {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Clock className="w-3.5 h-3.5" />}
              {running ? "Running…" : "Run"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={evaluating}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs font-medium rounded-lg hover:shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-60"
            >
              {evaluating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ChevronRight className="w-3.5 h-3.5" />}
              {evaluating ? "Submitting…" : "Submit"}
            </button>
          </div>
        </div>

        {/* Editor area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {mode === "code" ? (
            <>
              <div className="flex-1 overflow-hidden">
                <MonacoEditor
                  height="100%"
                  language="javascript"
                  value={code}
                  onChange={(v) => setCode(v || "")}
                  theme="vs-dark"
                  options={{
                    fontSize: 13,
                    fontFamily: "var(--font-geist-mono), monospace",
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    padding: { top: 16, bottom: 16 },
                    lineNumbers: "on",
                    renderLineHighlight: "line",
                    smoothScrolling: true,
                    cursorBlinking: "smooth",
                    tabSize: 2,
                    wordWrap: "on",
                    lineHeight: 1.7,
                  }}
                />
              </div>

              {/* Output */}
              <div className="h-40 border-t border-white/5 shrink-0 bg-[#0a0a15] overflow-y-auto p-4">
                {output ? (
                  <pre className="text-xs text-emerald-300 font-mono leading-relaxed whitespace-pre-wrap">{output}</pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-600 text-xs">
                    Click &quot;Run&quot; to test your solution
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 p-4">
              <textarea
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Explain your approach here… Describe the algorithm, time/space complexity, and any edge cases you considered."
                className="w-full h-full bg-transparent text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none leading-relaxed"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowLeft, ChevronRight, CheckCircle2, XCircle, Lightbulb,
  Code2, FileText, Clock, Bookmark, BookmarkCheck,
  Loader2, Zap, BarChart2, RefreshCw, ThumbsUp, ThumbsDown,
  AlertTriangle, Terminal,
} from "lucide-react";
import { runCode, type ExecutionResult } from "@/lib/judge0";
import { getQuestion, type FullQuestion } from "@/lib/questions";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

// ─── Difficulty styling ───────────────────────────────────────────────────────

const difficultyStyle: Record<string, string> = {
  Easy:   "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Hard:   "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

// ─── Theory answer evaluator (same heuristic as interview session) ────────────

interface TheoryFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
}

function evaluateTheory(answer: string, question: FullQuestion): TheoryFeedback {
  const lower   = answer.toLowerCase().trim();
  const words   = lower.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const lengthScore =
    wordCount >= 120 ? 25 :
    wordCount >= 70  ? 18 :
    wordCount >= 35  ? 10 :
    wordCount >= 10  ? 4  : 0;

  const kws = question.keywords ?? [];
  const hit  = kws.filter((k) => lower.includes(k.toLowerCase()));
  const keywordScore = kws.length > 0
    ? Math.round((hit.length / kws.length) * 50)
    : 25;

  let structureScore = 0;
  if (/\b(for example|such as|for instance|e\.g\.|consider)\b/i.test(answer)) structureScore += 10;
  if (/\b(however|but|whereas|trade-?off|compared to|on the other hand|advantage|disadvantage)\b/i.test(answer)) structureScore += 10;

  const score = Math.min(100, Math.max(8, 5 + lengthScore + keywordScore + structureScore));

  const strengths:    string[] = [];
  const improvements: string[] = [];

  if (wordCount >= 70) {
    strengths.push("Well-developed answer with sufficient depth");
  } else if (wordCount >= 30) {
    improvements.push("Expand your response — aim for 70+ words with concrete examples");
  } else {
    improvements.push("Answer is too brief. Add specific details, examples, and reasoning (70+ words)");
  }

  if (hit.length > 0) strengths.push(`Covered key concepts: ${hit.slice(0, 3).join(", ")}`);

  const missed = kws.filter((k) => !lower.includes(k.toLowerCase()));
  if (missed.length > 0) improvements.push(`Key concepts to mention: ${missed.slice(0, 3).join(", ")}`);

  if (/\b(for example|such as|e\.g\.|for instance)\b/i.test(answer)) {
    strengths.push("Good use of concrete examples");
  } else {
    improvements.push("Add a concrete real-world example to strengthen your answer");
  }

  return { score, strengths: strengths.slice(0, 3), improvements: improvements.slice(0, 3) };
}

// ─── Coding test harness builder ─────────────────────────────────────────────

function buildCodingHarness(userCode: string, q: FullQuestion, caseIndex: number): string {
  const tc = q.testCases?.[caseIndex];
  if (!tc) return userCode;

  // Two Sum
  if (q.id === 201 && tc.nums !== undefined && tc.target !== undefined) {
    return `${userCode}\nconsole.log(JSON.stringify(twoSum(${JSON.stringify(tc.nums)}, ${tc.target})));`;
  }
  // Coin Change
  if (q.id === 206) {
    const cases: [number[], number][] = [
      [[1, 5, 11], 15],
      [[2], 3],
      [[1], 0],
    ];
    const [coins, amount] = cases[caseIndex] ?? cases[0];
    return `${userCode}\nconsole.log(coinChange(${JSON.stringify(coins)}, ${amount}));`;
  }
  // BST inorder (test case 0 only)
  if (q.id === 204) {
    return `${userCode}
let root = null;
root = insert(root, 5);
root = insert(root, 3);
root = insert(root, 7);
console.log(inorder(root).join(','));`;
  }
  return userCode;
}

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "description" | "solution" | "ai";

interface AIFeedback {
  verdict: "pass" | "fail" | "partial";
  score: number;
  timeComplexity: string;
  spaceComplexity: string;
  comments: string[];
  suggestions: string[];
}

interface TestResult {
  label: string;
  passed: boolean;
  stdout: string;
  expected: string;
  error?: string;
}

// ─── Not found fallback ───────────────────────────────────────────────────────

function NotFound({ id }: { id: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-500">
      <Zap className="w-12 h-12 opacity-20" />
      <p className="text-lg font-medium text-slate-400">Question #{id} not found</p>
      <Link href="/practice" className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Practice
      </Link>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PracticeQuestionPage() {
  const params    = useParams();
  const rawId     = Array.isArray(params.id) ? params.id[0] : params.id;
  const question  = useMemo(() => getQuestion(Number(rawId)), [rawId]);

  if (!question) return <NotFound id={rawId ?? "?"} />;

  return question.type === "coding"
    ? <CodingView question={question} />
    : <TheoryView question={question} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// CODING VIEW  (Monaco editor + real Judge0 execution)
// ─────────────────────────────────────────────────────────────────────────────

function CodingView({ question }: { question: FullQuestion }) {
  const [activeTab, setActiveTab]   = useState<Tab>("description");
  const [code, setCode]             = useState(question.starterCode ?? "");
  const [hintIndex, setHintIndex]   = useState(-1);
  const [bookmarked, setBookmarked] = useState(false);
  const [running, setRunning]       = useState(false);
  const [runResult, setRunResult]   = useState<ExecutionResult | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<null | "up" | "down">(null);

  const handleRun = async () => {
    setRunning(true);
    setRunResult(null);
    try {
      const fullCode = buildCodingHarness(code, question, 0);
      const result   = await runCode(fullCode, "javascript");
      setRunResult(result);
    } catch (err) {
      setRunResult({ stdout: "", stderr: "", compile_output: "", time: null, memory: null, status: 0, statusText: "Network Error", error: err instanceof Error ? err.message : "Failed to reach execution server" });
    }
    setRunning(false);
  };

  const handleSubmit = async () => {
    setEvaluating(true);
    setAiFeedback(null);
    setTestResults([]);
    setActiveTab("ai");
    const results: TestResult[] = [];
    const tcs = question.testCases ?? [];
    for (let i = 0; i < tcs.length; i++) {
      try {
        const fullCode = buildCodingHarness(code, question, i);
        const result   = await runCode(fullCode, "javascript");
        const stdout   = (result.stdout ?? "").trim();
        const passed   = result.status === 3 && !result.compile_output && !result.stderr && stdout === tcs[i].expected;
        results.push({ label: tcs[i].label, passed, stdout, expected: tcs[i].expected, error: result.compile_output || result.stderr || result.error || undefined });
      } catch (err) {
        results.push({ label: tcs[i].label, passed: false, stdout: "", expected: tcs[i].expected, error: err instanceof Error ? err.message : "Network error" });
      }
    }
    setTestResults(results);
    const passedCount = results.filter((r) => r.passed).length;
    const verdict: "pass" | "partial" | "fail" = passedCount === results.length ? "pass" : passedCount > 0 ? "partial" : "fail";
    setAiFeedback({
      verdict, score: Math.round((passedCount / Math.max(results.length, 1)) * 100),
      timeComplexity: "O(n)", spaceComplexity: "O(n)",
      comments: verdict === "pass" ? ["All test cases passed!", "Your solution handles all edge cases correctly."] : [`${passedCount} of ${results.length} test cases passed.`],
      suggestions: ["Consider edge cases: empty array, negative numbers.", "Aim for O(n) time using a hash map."],
    });
    setEvaluating(false);
  };

  const handleReset = () => { setCode(question.starterCode ?? ""); setRunResult(null); setTestResults([]); setAiFeedback(null); };

  return (
    <div className="flex gap-4 h-full">
      {/* Left panel */}
      <div className="w-[420px] shrink-0 flex flex-col glass border border-white/7 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 shrink-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <Link href="/practice" className="text-slate-500 hover:text-slate-300 transition-colors mt-0.5"><ArrowLeft className="w-4 h-4" /></Link>
            <div className="flex-1">
              <h1 className="text-base font-semibold text-white leading-tight">{question.title}</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${difficultyStyle[question.difficulty]}`}>{question.difficulty}</span>
                <span className="text-xs text-slate-600">{question.track}</span>
              </div>
            </div>
            <button onClick={() => setBookmarked(!bookmarked)} className="text-slate-500 hover:text-amber-400 transition-colors mt-0.5">
              {bookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex gap-1 bg-white/3 rounded-xl p-1">
            {(["description", "solution", "ai"] as Tab[]).map((t) => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${activeTab === t ? "bg-white/8 text-white" : "text-slate-500 hover:text-slate-300"}`}>
                {t === "ai" ? "AI Feedback" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
          {activeTab === "description" && (
            <>
              <div className="text-slate-300 leading-relaxed whitespace-pre-line text-sm">{question.description}</div>
              {question.examples && (
                <div className="space-y-3">
                  {question.examples.map((ex, i) => (
                    <div key={i} className="bg-white/3 rounded-xl p-3 space-y-1.5 font-mono text-xs">
                      <p><span className="text-slate-500">Input: </span><span className="text-slate-200">{ex.input}</span></p>
                      <p><span className="text-slate-500">Output: </span><span className="text-emerald-300">{ex.output}</span></p>
                      {ex.explanation && <p><span className="text-slate-500">Explanation: </span><span className="text-slate-400">{ex.explanation}</span></p>}
                    </div>
                  ))}
                </div>
              )}
              {question.constraints && (
                <div>
                  <p className="text-xs font-medium text-slate-400 mb-2">Constraints</p>
                  <ul className="space-y-1">{question.constraints.map((c) => <li key={c} className="text-xs text-slate-500 font-mono">• {c}</li>)}</ul>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {question.tags.map((t) => <span key={t} className="text-xs px-2.5 py-1 glass border border-white/8 rounded-full text-slate-400">{t}</span>)}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-slate-400">Hints</p>
                  {hintIndex < question.hints.length - 1 && (
                    <button onClick={() => setHintIndex((p) => p + 1)} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" />{hintIndex === -1 ? "Show hint" : "Next hint"}
                    </button>
                  )}
                </div>
                <AnimatePresence>
                  {question.hints.slice(0, hintIndex + 1).map((h, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                      className="mb-2 bg-amber-500/8 border border-amber-500/15 rounded-xl p-3 text-xs text-amber-300/80">
                      <span className="text-amber-400 font-medium">Hint {i + 1}: </span>{h}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}

          {activeTab === "solution" && (
            <div className="space-y-4">
              <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-300/80">Try solving it yourself first.</div>
              <div className="bg-white/3 rounded-xl overflow-hidden">
                <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-500">JavaScript — optimal solution</span>
                  <span className="text-xs text-emerald-400">Optimal</span>
                </div>
                <pre className="p-4 text-xs text-slate-300 font-mono leading-relaxed overflow-x-auto">{question.solution}</pre>
              </div>
            </div>
          )}

          {activeTab === "ai" && (
            <div className="space-y-4">
              {evaluating && <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-500"><Loader2 className="w-7 h-7 animate-spin text-indigo-400" /><p className="text-sm">Running test cases…</p></div>}
              {!evaluating && testResults.length === 0 && !aiFeedback && (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-600 text-center"><Zap className="w-8 h-8 opacity-30" /><p className="text-sm">Submit your solution to run all test cases</p></div>
              )}
              {!evaluating && aiFeedback && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className={`rounded-xl p-4 border flex items-center justify-between ${aiFeedback.verdict === "pass" ? "bg-emerald-500/8 border-emerald-500/20" : aiFeedback.verdict === "partial" ? "bg-amber-500/8 border-amber-500/20" : "bg-rose-500/8 border-rose-500/20"}`}>
                    <div className="flex items-center gap-2">
                      {aiFeedback.verdict === "pass" ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-rose-400" />}
                      <span className={`font-semibold ${aiFeedback.verdict === "pass" ? "text-emerald-400" : aiFeedback.verdict === "partial" ? "text-amber-400" : "text-rose-400"}`}>
                        {aiFeedback.verdict === "pass" ? "Accepted" : aiFeedback.verdict === "partial" ? "Partial" : "Wrong Answer"}
                      </span>
                    </div>
                    <div className="text-2xl font-black text-white">{aiFeedback.score}<span className="text-sm font-normal text-slate-500">/100</span></div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 mb-2">Test Cases</p>
                    <div className="space-y-2">
                      {testResults.map((tr, i) => (
                        <div key={i} className={`rounded-xl p-3 border text-xs ${tr.passed ? "bg-emerald-500/5 border-emerald-500/15" : "bg-rose-500/5 border-rose-500/15"}`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-slate-400">{tr.label}</span>
                            {tr.passed ? <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Pass</span> : <span className="text-rose-400 flex items-center gap-1"><XCircle className="w-3 h-3" /> Fail</span>}
                          </div>
                          {!tr.passed && (
                            <div className="mt-1.5 space-y-1 font-mono">
                              <div><span className="text-slate-500">Expected: </span><span className="text-emerald-300">{tr.expected}</span></div>
                              {tr.stdout && <div><span className="text-slate-500">Got: </span><span className="text-rose-300">{tr.stdout}</span></div>}
                              {tr.error && <div className="text-amber-400 truncate">{tr.error}</div>}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-emerald-400 mb-2 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Assessment</p>
                    <ul className="space-y-1.5">{aiFeedback.comments.map((c) => <li key={c} className="text-xs text-slate-400 flex gap-2"><span className="text-emerald-500 shrink-0">•</span>{c}</li>)}</ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-amber-400 mb-2 flex items-center gap-1"><BarChart2 className="w-3 h-3" /> Suggestions</p>
                    <ul className="space-y-1.5">{aiFeedback.suggestions.map((s) => <li key={s} className="text-xs text-slate-400 flex gap-2"><span className="text-amber-500 shrink-0">•</span>{s}</li>)}</ul>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-xs text-slate-600">Was this helpful?</span>
                    <div className="flex gap-2">
                      <button onClick={() => setFeedbackGiven("up")} className={`p-1.5 rounded-lg transition-all ${feedbackGiven === "up" ? "text-emerald-400 bg-emerald-500/10" : "text-slate-600 hover:text-slate-400"}`}><ThumbsUp className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setFeedbackGiven("down")} className={`p-1.5 rounded-lg transition-all ${feedbackGiven === "down" ? "text-rose-400 bg-rose-500/10" : "text-slate-600 hover:text-slate-400"}`}><ThumbsDown className="w-3.5 h-3.5" /></button>
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
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
              <Code2 className="w-3.5 h-3.5" />JavaScript
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleReset} className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />Reset
            </button>
            <button onClick={handleRun} disabled={running || evaluating} className="flex items-center gap-1.5 px-3 py-1.5 glass border border-white/10 text-slate-300 text-xs rounded-lg hover:border-white/20 transition-all disabled:opacity-60">
              {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Clock className="w-3.5 h-3.5" />}
              {running ? "Running…" : "Run"}
            </button>
            <button onClick={handleSubmit} disabled={evaluating || running} className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs font-medium rounded-lg hover:shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-60">
              {evaluating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ChevronRight className="w-3.5 h-3.5" />}
              {evaluating ? "Submitting…" : "Submit"}
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-hidden">
            <MonacoEditor height="100%" language="javascript" value={code} onChange={(v) => setCode(v || "")} theme="vs-dark"
              options={{ fontSize: 13, fontFamily: "var(--font-geist-mono), monospace", minimap: { enabled: false }, scrollBeyondLastLine: false, padding: { top: 16, bottom: 16 }, lineNumbers: "on", smoothScrolling: true, cursorBlinking: "smooth", tabSize: 2, wordWrap: "on", lineHeight: 1.7 }} />
          </div>
          <div className="h-44 border-t border-white/5 shrink-0 bg-[#0a0a15] overflow-y-auto">
            {!runResult && !running && (
              <div className="h-full flex items-center justify-center text-slate-600 text-xs gap-2"><Terminal className="w-4 h-4 opacity-50" />Click &quot;Run&quot; to test your solution</div>
            )}
            {running && <div className="h-full flex items-center justify-center text-slate-500 text-xs gap-2"><Loader2 className="w-4 h-4 animate-spin text-indigo-400" />Executing…</div>}
            {runResult && !running && (
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${runResult.status === 3 ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"}`}>{runResult.statusText || (runResult.error ? "Error" : "Unknown")}</span>
                  {(runResult.time || runResult.memory) && <span className="text-xs text-slate-600 font-mono">{runResult.time && `${runResult.time}s`}{runResult.time && runResult.memory && " · "}{runResult.memory && `${runResult.memory} KB`}</span>}
                </div>
                {runResult.stdout && <pre className="text-xs text-emerald-300 font-mono leading-relaxed whitespace-pre-wrap">{runResult.stdout}</pre>}
                {runResult.compile_output && <div><p className="text-xs text-rose-400 font-medium mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Compile Error</p><pre className="text-xs text-rose-300/80 font-mono whitespace-pre-wrap bg-rose-500/5 rounded-lg p-2">{runResult.compile_output}</pre></div>}
                {runResult.stderr && <div><p className="text-xs text-amber-400 font-medium mb-1">stderr</p><pre className="text-xs text-amber-300/80 font-mono whitespace-pre-wrap bg-amber-500/5 rounded-lg p-2">{runResult.stderr}</pre></div>}
                {runResult.error && <div className="text-xs text-rose-400 font-mono">{runResult.error}</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// THEORY VIEW  (text answer + AI evaluation)
// ─────────────────────────────────────────────────────────────────────────────

function TheoryView({ question }: { question: FullQuestion }) {
  const [answer, setAnswer]         = useState("");
  const [hintIndex, setHintIndex]   = useState(-1);
  const [bookmarked, setBookmarked] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback]     = useState<TheoryFeedback | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<null | "up" | "down">(null);

  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setEvaluating(true);
    setFeedback(null);
    await new Promise((r) => setTimeout(r, 800));
    setFeedback(evaluateTheory(answer, question));
    setEvaluating(false);
  };

  return (
    <div className="flex gap-4 h-full">
      {/* Left panel — question */}
      <div className="w-[420px] shrink-0 flex flex-col glass border border-white/7 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 shrink-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <Link href="/practice" className="text-slate-500 hover:text-slate-300 transition-colors mt-0.5"><ArrowLeft className="w-4 h-4" /></Link>
            <div className="flex-1">
              <h1 className="text-base font-semibold text-white leading-tight">{question.title}</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${difficultyStyle[question.difficulty]}`}>{question.difficulty}</span>
                <span className="text-xs text-slate-600">{question.track}</span>
                <span className="text-xs text-slate-600">{question.time}</span>
              </div>
            </div>
            <button onClick={() => setBookmarked(!bookmarked)} className="text-slate-500 hover:text-amber-400 transition-colors mt-0.5">
              {bookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {question.tags.map((t) => <span key={t} className="text-xs px-2.5 py-1 glass border border-white/8 rounded-full text-slate-400">{t}</span>)}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
          <div className="text-slate-300 leading-relaxed whitespace-pre-line">{question.description}</div>

          {/* Hints */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-400">Hints</p>
              {hintIndex < question.hints.length - 1 && (
                <button onClick={() => setHintIndex((p) => p + 1)} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />{hintIndex === -1 ? "Show hint" : "Next hint"}
                </button>
              )}
            </div>
            <AnimatePresence>
              {question.hints.slice(0, hintIndex + 1).map((h, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  className="mb-2 bg-amber-500/8 border border-amber-500/15 rounded-xl p-3 text-xs text-amber-300/80">
                  <span className="text-amber-400 font-medium">Hint {i + 1}: </span>{h}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Sample answer outline (if available) */}
          {question.sampleAnswer && (
            <div className="bg-white/3 rounded-xl p-3">
              <p className="text-xs font-medium text-slate-400 mb-2">Strong Answer Covers</p>
              <p className="text-xs text-slate-500 leading-relaxed">{question.sampleAnswer}</p>
            </div>
          )}
        </div>
      </div>

      {/* Right panel — answer + feedback */}
      <div className="flex-1 flex flex-col glass border border-white/7 rounded-2xl overflow-hidden min-w-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
            <FileText className="w-3.5 h-3.5" />Written Answer
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setAnswer(""); setFeedback(null); }} className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />Clear
            </button>
            <button onClick={handleSubmit} disabled={!answer.trim() || evaluating}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs font-medium rounded-lg hover:shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-60">
              {evaluating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ChevronRight className="w-3.5 h-3.5" />}
              {evaluating ? "Evaluating…" : "Submit Answer"}
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Textarea */}
          <div className="flex-1 p-4 flex flex-col">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={evaluating}
              placeholder="Type your answer here… The more detail and specific examples you provide, the higher your score."
              className="flex-1 w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none leading-relaxed disabled:opacity-60"
            />
            <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-2">
              <span className={`text-xs font-mono ${wordCount >= 70 ? "text-emerald-500" : wordCount >= 30 ? "text-amber-500" : "text-slate-600"}`}>
                {answer.trim() ? `${wordCount} words` : ""}
              </span>
              <span className="text-xs text-slate-600">Aim for 70+ words for full credit</span>
            </div>
          </div>

          {/* AI feedback panel */}
          <AnimatePresence>
            {(evaluating || feedback) && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="border-t border-white/5 bg-[#0a0a15] overflow-hidden">
                {evaluating && (
                  <div className="flex items-center justify-center gap-2 py-6 text-slate-500 text-xs">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />Evaluating your answer…
                  </div>
                )}
                {feedback && !evaluating && (
                  <div className="p-4 space-y-3">
                    {/* Score row */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${feedback.score >= 80 ? "bg-emerald-500/15 text-emerald-400" : feedback.score >= 55 ? "bg-amber-500/15 text-amber-400" : "bg-rose-500/15 text-rose-400"}`}>
                        {feedback.score >= 80 ? "Strong Answer" : feedback.score >= 55 ? "Good Start" : "Needs Work"}
                      </span>
                      <span className={`text-lg font-black ${feedback.score >= 80 ? "text-emerald-400" : feedback.score >= 55 ? "text-amber-400" : "text-rose-400"}`}>
                        {feedback.score}<span className="text-xs font-normal text-slate-500">/100</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-medium text-emerald-400 mb-1.5 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Strengths</p>
                        {feedback.strengths.length > 0
                          ? <ul className="space-y-1">{feedback.strengths.map((s) => <li key={s} className="text-xs text-slate-400 leading-relaxed">• {s}</li>)}</ul>
                          : <p className="text-xs text-slate-600">No standout strengths yet</p>}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-amber-400 mb-1.5 flex items-center gap-1"><BarChart2 className="w-3 h-3" />Improve</p>
                        <ul className="space-y-1">{feedback.improvements.map((s) => <li key={s} className="text-xs text-slate-400 leading-relaxed">• {s}</li>)}</ul>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-xs text-slate-600">Was this helpful?</span>
                      <div className="flex gap-2">
                        <button onClick={() => setFeedbackGiven("up")} className={`p-1.5 rounded-lg transition-all ${feedbackGiven === "up" ? "text-emerald-400 bg-emerald-500/10" : "text-slate-600 hover:text-slate-400"}`}><ThumbsUp className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setFeedbackGiven("down")} className={`p-1.5 rounded-lg transition-all ${feedbackGiven === "down" ? "text-rose-400 bg-rose-500/10" : "text-slate-600 hover:text-slate-400"}`}><ThumbsDown className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

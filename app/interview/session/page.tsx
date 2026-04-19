"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Mic, MicOff, Clock, ChevronRight, ChevronLeft,
  CheckCircle2, XCircle, Loader2, Zap, SkipForward,
  MessageSquare, Brain, Star, BarChart2, ArrowLeft,
} from "lucide-react";

const mockQuestions = [
  {
    id: 1,
    type: "behavioral",
    question: "Tell me about a time you had to deal with a difficult teammate. How did you handle it?",
    hint: "Use the STAR method: Situation, Task, Action, Result.",
    followUp: "What would you do differently now?",
  },
  {
    id: 2,
    type: "technical",
    question: "Explain the difference between TCP and UDP. When would you use each?",
    hint: "Think about reliability vs. speed trade-offs.",
    followUp: "Can you give a real-world example where UDP is preferred?",
  },
  {
    id: 3,
    type: "technical",
    question: "What is the time complexity of quicksort in the average and worst case? How can you mitigate worst-case behavior?",
    hint: "Consider pivot selection strategies.",
    followUp: "How does introsort improve on this?",
  },
  {
    id: 4,
    type: "system-design",
    question: "Design a URL shortener like bit.ly. Walk me through your architecture.",
    hint: "Consider read/write ratios, hashing strategy, and scalability.",
    followUp: "How would you handle 1 billion URLs?",
  },
  {
    id: 5,
    type: "behavioral",
    question: "Describe a project where you had to learn a new technology quickly under pressure.",
    hint: "Focus on your learning process and the outcome.",
    followUp: "How do you stay current with new technologies?",
  },
];

const typeColors: Record<string, string> = {
  behavioral: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  technical: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  "system-design": "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

const typeLabels: Record<string, string> = {
  behavioral: "Behavioral",
  technical: "Technical",
  "system-design": "System Design",
};

type Phase = "intro" | "interview" | "feedback" | "complete";

interface AIFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  followUpAnswer?: string;
}

export default function InterviewSessionPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 min
  const [qTimer, setQTimer] = useState(120); // 2 min per question
  const [isRecording, setIsRecording] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [allFeedback, setAllFeedback] = useState<AIFeedback[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Global timer
  useEffect(() => {
    if (phase !== "interview") return;
    const t = setInterval(() => setTimeLeft((p) => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, [phase]);

  // Per-question timer
  useEffect(() => {
    if (phase !== "interview" || evaluating) return;
    setQTimer(120);
  }, [currentQ, phase]);

  useEffect(() => {
    if (phase !== "interview" || evaluating) return;
    const t = setInterval(() => setQTimer((p) => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, [phase, currentQ, evaluating]);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;
    setEvaluating(true);
    setShowFollowUp(false);
    await new Promise((r) => setTimeout(r, 2000));

    const mockFeedback: AIFeedback = {
      score: Math.floor(Math.random() * 30) + 65,
      strengths: [
        "Clear and structured response",
        "Good use of specific examples",
        "Demonstrated self-awareness",
      ].slice(0, Math.floor(Math.random() * 2) + 1),
      improvements: [
        "Could elaborate more on the outcome/impact",
        "Quantify results where possible",
        "Add more technical depth",
      ].slice(0, Math.floor(Math.random() * 2) + 1),
    };

    setFeedback(mockFeedback);
    setEvaluating(false);
    setShowFollowUp(true);
  };

  const handleNext = () => {
    const saved = [...answers, answer];
    setAnswers(saved);
    setAllFeedback((p) => [...p, feedback!]);
    setAnswer("");
    setFeedback(null);
    setShowHint(false);
    setShowFollowUp(false);
    if (currentQ + 1 >= mockQuestions.length) {
      setPhase("complete");
    } else {
      setCurrentQ((p) => p + 1);
    }
  };

  const handleSkip = () => {
    setAnswers((p) => [...p, ""]);
    setAllFeedback((p) => [...p, { score: 0, strengths: [], improvements: ["Skipped"] }]);
    setAnswer("");
    setFeedback(null);
    setShowHint(false);
    setShowFollowUp(false);
    if (currentQ + 1 >= mockQuestions.length) {
      setPhase("complete");
    } else {
      setCurrentQ((p) => p + 1);
    }
  };

  const avgScore =
    allFeedback.length > 0
      ? Math.round(allFeedback.reduce((a, b) => a + b.score, 0) / allFeedback.length)
      : 0;

  const q = mockQuestions[currentQ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AnimatePresence mode="wait">
        {/* INTRO */}
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center text-center gap-6 py-12"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-3">Your Interview is Ready</h1>
              <p className="text-slate-400 max-w-md">
                You&apos;ll answer {mockQuestions.length} questions in 45 minutes. AI will evaluate
                each response and give instant feedback.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
              {[
                { label: "Questions", value: mockQuestions.length },
                { label: "Duration", value: "45 min" },
                { label: "AI Feedback", value: "Live" },
              ].map((s) => (
                <div key={s.label} className="glass border border-white/7 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-white">{s.value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="glass border border-white/7 rounded-xl p-4 w-full max-w-sm text-left space-y-2 text-sm text-slate-400">
              <p className="font-medium text-slate-200 text-xs uppercase tracking-wider mb-1">Tips</p>
              <p>• Speak or type naturally — there are no trick questions</p>
              <p>• Use STAR method for behavioral questions</p>
              <p>• Request hints if you&apos;re stuck — they won&apos;t penalize you</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/interview"
                className="px-5 py-2.5 glass border border-white/10 text-slate-300 text-sm rounded-xl hover:border-white/20 transition-all"
              >
                <ArrowLeft className="w-4 h-4 inline mr-1.5" />
                Back
              </Link>
              <button
                onClick={() => setPhase("interview")}
                className="px-7 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
              >
                Start Interview
                <ChevronRight className="w-4 h-4 inline ml-1.5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* INTERVIEW */}
        {phase === "interview" && (
          <motion.div
            key="interview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between glass border border-white/7 rounded-2xl px-5 py-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm text-slate-300">
                  <Zap className="w-4 h-4 text-indigo-400" />
                  <span className="font-medium">Question {currentQ + 1}</span>
                  <span className="text-slate-600">/ {mockQuestions.length}</span>
                </div>
                {/* Progress dots */}
                <div className="flex gap-1.5">
                  {mockQuestions.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        i < currentQ
                          ? "w-4 bg-emerald-500"
                          : i === currentQ
                          ? "w-4 bg-indigo-500"
                          : "w-1.5 bg-white/10"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className={`flex items-center gap-1.5 font-mono font-medium ${qTimer < 30 ? "text-rose-400" : "text-slate-300"}`}>
                  <Clock className="w-3.5 h-3.5" />
                  {fmt(qTimer)}
                  <span className="text-slate-600 text-xs font-normal">q</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-1.5 text-slate-400 font-mono text-xs">
                  <Clock className="w-3 h-3" />
                  {fmt(timeLeft)} left
                </div>
              </div>
            </div>

            {/* Question card */}
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass border border-white/7 rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${typeColors[q.type]}`}>
                  {typeLabels[q.type]}
                </span>
              </div>

              <p className="text-white text-lg font-medium leading-relaxed">{q.question}</p>

              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-3 text-sm text-amber-300/80"
                >
                  <span className="font-semibold text-amber-400">Hint: </span>
                  {q.hint}
                </motion.div>
              )}

              <textarea
                ref={textareaRef}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here… or use the microphone to speak"
                disabled={evaluating || showFollowUp}
                rows={6}
                className="w-full px-4 py-3 bg-white/3 border border-white/8 rounded-xl text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/30 transition-all resize-none disabled:opacity-60"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    disabled={evaluating || showFollowUp}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                      isRecording
                        ? "bg-rose-500/15 border border-rose-500/30 text-rose-400"
                        : "glass border border-white/10 text-slate-400 hover:text-slate-300"
                    }`}
                  >
                    {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    {isRecording ? "Stop" : "Record"}
                  </button>
                  {!showHint && !showFollowUp && (
                    <button
                      onClick={() => setShowHint(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 glass border border-white/10 rounded-lg text-xs text-slate-400 hover:text-slate-300 transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Hint
                    </button>
                  )}
                  <button
                    onClick={handleSkip}
                    disabled={evaluating}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                    Skip
                  </button>
                </div>

                {!showFollowUp && (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!answer.trim() || evaluating}
                    className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {evaluating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Evaluating…
                      </>
                    ) : (
                      <>
                        Submit Answer
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>

            {/* AI Feedback */}
            <AnimatePresence>
              {feedback && !evaluating && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="glass border border-white/7 rounded-2xl p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white text-sm">AI Feedback</h3>
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`text-lg font-black ${
                          feedback.score >= 80
                            ? "text-emerald-400"
                            : feedback.score >= 60
                            ? "text-amber-400"
                            : "text-rose-400"
                        }`}
                      >
                        {feedback.score}
                      </div>
                      <span className="text-slate-600 text-xs">/100</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-medium text-emerald-400 mb-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Strengths
                      </p>
                      <ul className="space-y-1">
                        {feedback.strengths.map((s) => (
                          <li key={s} className="text-xs text-slate-400">{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-amber-400 mb-1.5 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Improve
                      </p>
                      <ul className="space-y-1">
                        {feedback.improvements.map((s) => (
                          <li key={s} className="text-xs text-slate-400">{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {showFollowUp && (
                    <div className="bg-indigo-500/8 border border-indigo-500/20 rounded-xl p-3">
                      <p className="text-xs font-medium text-indigo-400 mb-1">Follow-up:</p>
                      <p className="text-sm text-slate-300">{q.followUp}</p>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
                    >
                      {currentQ + 1 >= mockQuestions.length ? "Finish Interview" : "Next Question"}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* COMPLETE */}
        {phase === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center py-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-emerald-500/30 mx-auto mb-4"
              >
                <CheckCircle2 className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2">Interview Complete!</h1>
              <p className="text-slate-400">Here&apos;s your performance summary</p>
            </div>

            {/* Score cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass border border-white/7 rounded-2xl p-5 text-center">
                <div className={`text-4xl font-black mb-1 ${avgScore >= 80 ? "text-emerald-400" : avgScore >= 60 ? "text-amber-400" : "text-rose-400"}`}>
                  {avgScore}
                </div>
                <div className="text-xs text-slate-500">Overall Score</div>
              </div>
              <div className="glass border border-white/7 rounded-2xl p-5 text-center">
                <div className="text-4xl font-black text-white mb-1">{allFeedback.filter((f) => f.score >= 70).length}</div>
                <div className="text-xs text-slate-500">Strong Answers</div>
              </div>
              <div className="glass border border-white/7 rounded-2xl p-5 text-center">
                <div className="text-4xl font-black text-indigo-400 mb-1">+{Math.round(avgScore * 0.8)}xp</div>
                <div className="text-xs text-slate-500">XP Earned</div>
              </div>
            </div>

            {/* Per-question breakdown */}
            <div className="glass border border-white/7 rounded-2xl p-5 space-y-3">
              <h2 className="font-semibold text-white text-sm flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-400" />
                Question Breakdown
              </h2>
              {mockQuestions.map((question, i) => {
                const fb = allFeedback[i];
                return (
                  <div key={question.id} className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      !fb || fb.score === 0 ? "bg-white/5 text-slate-600" :
                      fb.score >= 80 ? "bg-emerald-500/15 text-emerald-400" :
                      fb.score >= 60 ? "bg-amber-500/15 text-amber-400" :
                      "bg-rose-500/15 text-rose-400"
                    }`}>
                      {!fb || fb.score === 0 ? "–" : fb.score}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300 truncate">{question.question}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border mt-1 inline-block ${typeColors[question.type]}`}>
                        {typeLabels[question.type]}
                      </span>
                    </div>
                    {fb && fb.score > 0 && (
                      <div className="flex gap-1 shrink-0">
                        {[...Array(Math.round(fb.score / 20))].map((_, j) => (
                          <Star key={j} className="w-3 h-3 text-amber-400 fill-amber-400" />
                        ))}
                        {[...Array(5 - Math.round(fb.score / 20))].map((_, j) => (
                          <Star key={j} className="w-3 h-3 text-white/10" />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 justify-center">
              <Link
                href="/dashboard"
                className="px-5 py-2.5 glass border border-white/10 text-slate-300 text-sm rounded-xl hover:border-white/20 transition-all"
              >
                Back to Dashboard
              </Link>
              <Link
                href="/interview"
                className="px-7 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold text-sm rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
              >
                New Interview
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

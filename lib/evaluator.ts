/**
 * Heuristic answer evaluator — no LLM, no API credits.
 * Works offline, no rate limits, scores based on:
 *  1. Length  (how developed the answer is)
 *  2. Required concept coverage  (core keywords — missing ALL caps score at 20)
 *  3. Optional concept coverage  (supporting keywords)
 *  4. Structure  (examples, comparisons, trade-offs)
 *  5. Behavioural STAR structure  (for behavioural questions)
 */

export interface EvalResult {
  score: number;        // 0-100
  strengths: string[];
  improvements: string[];
}

interface QuestionForEval {
  type?: string;
  required_keywords?: string[];
  keywords?: string[];
}

export function evaluateAnswer(
  answer: string,
  question: QuestionForEval,
  questionType: "behavioral" | "technical" | "theory" = "theory"
): EvalResult {
  const lower     = answer.toLowerCase().trim();
  const words     = lower.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // ── Instant fail for junk / one-liner answers ──────────────────────────────
  if (wordCount < 6) {
    const coreHint = (question.required_keywords ?? question.keywords ?? []).slice(0, 3);
    return {
      score: Math.max(0, wordCount - 1),   // 1-5 at most
      strengths: [],
      improvements: [
        `Answer is too short (${wordCount} word${wordCount === 1 ? "" : "s"}) — write at least 2-3 full sentences`,
        coreHint.length > 0
          ? `Core concepts to cover: ${coreHint.join(", ")}`
          : "Describe the concept, give a real-world example, and explain any trade-offs",
      ],
    };
  }

  // ── 1. Length score  (max 20) ───────────────────────────────────────────────
  const lengthScore =
    wordCount >= 120 ? 20 :
    wordCount >= 80  ? 16 :
    wordCount >= 50  ? 11 :
    wordCount >= 25  ? 6  :
    wordCount >= 10  ? 3  : 0;

  // ── 2. Required keyword coverage  (max 45) ─────────────────────────────────
  // Use explicit required_keywords if set, otherwise treat the first ~40% of
  // keywords as required (so we don't need to annotate every question).
  const allKws    = question.keywords ?? [];
  const required  = (question.required_keywords?.length ?? 0) > 0
    ? question.required_keywords!
    : allKws.slice(0, Math.max(1, Math.ceil(allKws.length * 0.4)));

  const reqHit      = required.filter(k => lower.includes(k.toLowerCase()));
  const reqRatio    = required.length > 0 ? reqHit.length / required.length : 0;
  const reqScore    = Math.round(reqRatio * 45);
  const hardGate    = required.length > 0 && reqHit.length === 0;  // zero required hit → cap at 20

  // ── 3. Optional keyword coverage  (max 25) ─────────────────────────────────
  const optional    = allKws.filter(k => !required.includes(k));
  const optHit      = optional.filter(k => lower.includes(k.toLowerCase()));
  // If no optional keywords defined, give a neutral base so long answers aren't penalised
  const optScore    = optional.length > 0
    ? Math.round((optHit.length / optional.length) * 25)
    : (allKws.length === 0 ? 12 : 0);   // behavioural: 12 pts baseline

  // ── 4. Structure bonus  (max 10) ───────────────────────────────────────────
  let structure = 0;
  const hasExample   = /\b(for example|for instance|such as|e\.g\.|like when|consider)\b/i.test(answer);
  const hasTradeoff  = /\b(however|but|whereas|trade.?off|compared to|on the other hand|advantage|disadvantage|difference between|unlike)\b/i.test(answer);
  if (hasExample)   structure += 5;
  if (hasTradeoff)  structure += 5;

  // ── 5. STAR bonus for behavioural  (max 10 replaces structure) ─────────────
  let starBonus = 0;
  if (questionType === "behavioral") {
    const hasSituation = /\b(when|situation|project|team|at work|in my|there was|once|last year|while working)\b/i.test(answer);
    const hasAction    = /\b\b(i |we |decided|implemented|took action|used|helped|resolved|led|escalated|built|wrote|fixed)\b/i.test(answer);
    const hasResult    = /\b(result|outcome|achieved|improved|learned|led to|because of|impact|ended up|as a result)\b/i.test(answer);
    if (hasSituation) starBonus += 4;
    if (hasAction)    starBonus += 3;
    if (hasResult)    starBonus += 3;
  }

  // ── Compute final score ────────────────────────────────────────────────────
  const structTotal = questionType === "behavioral" ? starBonus : structure;
  let   score       = Math.min(100, Math.max(0, lengthScore + reqScore + optScore + structTotal));
  if   (hardGate)   score = Math.min(score, 20);

  // ── Generate specific, answer-aware feedback ───────────────────────────────
  const strengths:    string[] = [];
  const improvements: string[] = [];

  // Length
  if (wordCount >= 80) {
    strengths.push(`Well-developed answer (${wordCount} words)`);
  } else {
    improvements.push(
      wordCount >= 30
        ? `Expand further (${wordCount} words) — aim for 80+ words with technical depth`
        : `Too brief (${wordCount} words) — write at least 3 full sentences`
    );
  }

  // Required keyword feedback
  if (reqHit.length > 0) {
    strengths.push(`Covered core concepts: ${reqHit.slice(0, 4).join(", ")}`);
  } else if (required.length > 0) {
    improvements.push(`Missing core concepts — must address: ${required.slice(0, 4).join(", ")}`);
  }

  // Optional keyword feedback (only suggest if improvements slot available)
  const allMissed = [...required, ...optional].filter(k => !lower.includes(k.toLowerCase()));
  if (allMissed.length > 0 && improvements.length < 3) {
    improvements.push(`Also worth mentioning: ${allMissed.slice(0, 3).join(", ")}`);
  }

  // Structure feedback
  const hasResult = /\b(result|outcome|achieved|improved|learned|led to|because of|impact|ended up|as a result)\b/i.test(answer);
  if (questionType === "behavioral") {
    if (starBonus >= 7) {
      strengths.push("Good STAR structure — situation, action, and result are present");
    } else if (starBonus < 4 && improvements.length < 3) {
      improvements.push("Structure with STAR: Situation → Task → Action → Result");
    }
    if (!hasResult && improvements.length < 3) {
      improvements.push("Describe the outcome — what changed because of your actions?");
    }
  } else {
    if (hasExample) {
      strengths.push("Good use of a concrete example");
    } else if (improvements.length < 3) {
      improvements.push("Add a real-world example to make your answer concrete");
    }
    if (hasTradeoff && improvements.length === 0) {
      strengths.push("Good discussion of trade-offs or comparisons");
    }
  }

  return {
    score,
    strengths:    strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
  };
}

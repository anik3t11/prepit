import { NextResponse } from "next/server";

// Language IDs for Judge0 CE
const LANGUAGE_IDS: Record<string, number> = {
  javascript: 63,   // Node.js 12.14.0
  typescript: 74,   // TypeScript 3.7.4
  python: 71,       // Python 3.8.1
  java: 62,         // Java (OpenJDK 13.0.1)
  cpp: 54,          // C++ (GCC 9.2.0)
  c: 50,            // C (GCC 9.2.0)
  go: 60,           // Go 1.13.5
  rust: 73,         // Rust 1.40.0
  ruby: 72,         // Ruby 2.7.0
  php: 68,          // PHP 7.4.1
  csharp: 51,       // C# Mono 6.6.0
  kotlin: 78,       // Kotlin 1.3.70
  swift: 83,        // Swift 5.2.3
  r: 80,            // R 4.0.0
  sql: 82,          // SQLite 3.27.2
};

// Judge0 status codes
const STATUS: Record<number, string> = {
  1:  "In Queue",
  2:  "Processing",
  3:  "Accepted",
  4:  "Wrong Answer",
  5:  "Time Limit Exceeded",
  6:  "Compilation Error",
  7:  "Runtime Error (SIGSEGV)",
  8:  "Runtime Error (SIGXFSZ)",
  9:  "Runtime Error (SIGFPE)",
  10: "Runtime Error (SIGABRT)",
  11: "Runtime Error (NZEC)",
  12: "Runtime Error (Other)",
  13: "Internal Error",
  14: "Exec Format Error",
};

export async function POST(req: Request) {
  try {
    const { code, language, stdin } = await req.json();

    const languageId = LANGUAGE_IDS[language];
    if (!languageId) {
      return NextResponse.json({ error: `Unsupported language: ${language}` }, { status: 400 });
    }

    // Use env var if set, otherwise fall back to public Judge0 CE demo
    const judgeUrl = process.env.NEXT_PUBLIC_JUDGE0_URL || "https://ce.judge0.com";
    const apiKey   = process.env.JUDGE0_API_KEY || "";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };
    if (apiKey) {
      headers["X-RapidAPI-Key"] = apiKey;
      headers["X-RapidAPI-Host"] = "judge0-ce.p.rapidapi.com";
    }

    const submitRes = await fetch(
      `${judgeUrl}/submissions?base64_encoded=false&wait=true`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          source_code: code,
          language_id: languageId,
          stdin: stdin ?? "",
        }),
      }
    );

    if (!submitRes.ok) {
      const text = await submitRes.text();
      return NextResponse.json(
        { error: `Judge0 error: ${submitRes.status} — ${text}` },
        { status: 502 }
      );
    }

    const result = await submitRes.json();

    // Normalise output
    return NextResponse.json({
      stdout:          result.stdout ?? "",
      stderr:          result.stderr ?? "",
      compile_output:  result.compile_output ?? "",
      time:            result.time ?? null,
      memory:          result.memory ?? null,
      status:          result.status?.id ?? 0,
      statusText:      STATUS[result.status?.id] ?? result.status?.description ?? "Unknown",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

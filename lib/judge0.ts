// Judge0 CE - Free open source code execution engine
// Self-host or use RapidAPI free tier

const JUDGE0_URL = process.env.NEXT_PUBLIC_JUDGE0_URL || "https://judge0-ce.p.rapidapi.com";
const JUDGE0_KEY = process.env.JUDGE0_API_KEY || "";

export const LANGUAGE_IDS: Record<string, number> = {
  javascript: 63,  // Node.js
  typescript: 74,
  python: 71,      // Python 3
  java: 62,
  cpp: 54,         // C++ (GCC 9.2.0)
  c: 50,
  go: 60,
  rust: 73,
  ruby: 72,
  php: 68,
  csharp: 51,
  kotlin: 78,
  swift: 83,
  r: 80,
  sql: 82,         // SQLite
};

export interface ExecutionResult {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  time: string | null;
  memory: number | null;
  status: {
    id: number;
    description: string;
  };
}

export async function executeCode(
  code: string,
  languageId: number,
  stdin?: string
): Promise<ExecutionResult> {
  const submitRes = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": JUDGE0_KEY,
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    },
    body: JSON.stringify({
      source_code: code,
      language_id: languageId,
      stdin: stdin || "",
    }),
  });

  return submitRes.json();
}

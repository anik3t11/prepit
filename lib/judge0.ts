// Judge0 CE — shared language map used by client pages and the /api/execute route

export const LANGUAGE_IDS: Record<string, number> = {
  javascript: 63,
  typescript: 74,
  python: 71,
  java: 62,
  cpp: 54,
  c: 50,
  go: 60,
  rust: 73,
  ruby: 72,
  php: 68,
  csharp: 51,
  kotlin: 78,
  swift: 83,
  r: 80,
  sql: 82,
};

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  compile_output: string;
  time: string | null;
  memory: number | null;
  status: number;
  statusText: string;
  error?: string;
}

/** Call from client components via the /api/execute proxy (avoids CORS + keeps API key server-side) */
export async function runCode(
  code: string,
  language: string,
  stdin?: string
): Promise<ExecutionResult> {
  const res = await fetch("/api/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, language, stdin: stdin ?? "" }),
  });
  return res.json();
}

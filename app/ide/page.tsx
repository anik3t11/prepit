"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  Play, RotateCcw, Settings, ChevronDown, Copy, CheckCheck,
  Terminal, Loader2, Maximize2, Code2, AlertCircle, Clock,
} from "lucide-react";
import { runCode, type ExecutionResult } from "@/lib/judge0";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const languages = [
  { id: "javascript", label: "JavaScript", ext: "js" },
  { id: "typescript", label: "TypeScript", ext: "ts" },
  { id: "python", label: "Python", ext: "py" },
  { id: "java", label: "Java", ext: "java" },
  { id: "cpp", label: "C++", ext: "cpp" },
  { id: "go", label: "Go", ext: "go" },
  { id: "rust", label: "Rust", ext: "rs" },
  { id: "sql", label: "SQL", ext: "sql" },
];

const starterCode: Record<string, string> = {
  javascript: `// PrepIt IDE - JavaScript
// Write your solution here

function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// Test
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6));       // [1, 2]
`,
  python: `# PrepIt IDE - Python
# Write your solution here

from typing import List

def two_sum(nums: List[int], target: int) -> List[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Test
print(two_sum([2, 7, 11, 15], 9))  # [0, 1]
print(two_sum([3, 2, 4], 6))        # [1, 2]
`,
  java: `// PrepIt IDE - Java
import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(Arrays.toString(sol.twoSum(new int[]{2, 7, 11, 15}, 9)));
    }
}
`,
  cpp: `// PrepIt IDE - C++
#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.count(complement)) {
            return {map[complement], i};
        }
        map[nums[i]] = i;
    }
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    auto result = twoSum(nums, 9);
    cout << "[" << result[0] << ", " << result[1] << "]" << endl;
    return 0;
}
`,
  go: `// PrepIt IDE - Go
package main

import "fmt"

func twoSum(nums []int, target int) []int {
    seen := make(map[int]int)
    for i, num := range nums {
        complement := target - num
        if j, ok := seen[complement]; ok {
            return []int{j, i}
        }
        seen[num] = i
    }
    return nil
}

func main() {
    fmt.Println(twoSum([]int{2, 7, 11, 15}, 9))
    fmt.Println(twoSum([]int{3, 2, 4}, 6))
}
`,
  typescript: `// PrepIt IDE - TypeScript

function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}

console.log(twoSum([2, 7, 11, 15], 9));
console.log(twoSum([3, 2, 4], 6));
`,
  rust: `// PrepIt IDE - Rust
use std::collections::HashMap;

fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
    let mut map: HashMap<i32, usize> = HashMap::new();
    for (i, &num) in nums.iter().enumerate() {
        let complement = target - num;
        if let Some(&j) = map.get(&complement) {
            return vec![j as i32, i as i32];
        }
        map.insert(num, i);
    }
    vec![]
}

fn main() {
    println!("{:?}", two_sum(vec![2, 7, 11, 15], 9));
    println!("{:?}", two_sum(vec![3, 2, 4], 6));
}
`,
  sql: `-- PrepIt IDE - SQL

-- Create sample tables
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    department VARCHAR(50),
    salary DECIMAL(10, 2),
    hire_date DATE
);

-- Problem: Find the average salary per department
-- and return departments with avg salary > 70000

SELECT
    department,
    COUNT(*) as headcount,
    ROUND(AVG(salary), 2) as avg_salary,
    MIN(salary) as min_salary,
    MAX(salary) as max_salary
FROM employees
GROUP BY department
HAVING AVG(salary) > 70000
ORDER BY avg_salary DESC;
`,
};

export default function IDEPage() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(starterCode["javascript"]);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [outputTab, setOutputTab] = useState<"output" | "ai">("output");

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCode(starterCode[lang] || `// Start coding in ${lang}`);
    setShowLangMenu(false);
    setResult(null);
  };

  const handleRun = async () => {
    setRunning(true);
    setResult(null);
    setOutputTab("output");
    try {
      const res = await runCode(code, language);
      setResult(res);
    } catch {
      setResult({ stdout: "", stderr: "Network error — could not reach execution server.", compile_output: "", time: null, memory: null, status: 0, statusText: "Error" });
    }
    setRunning(false);
  };

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const handleReset = () => {
    setCode(starterCode[language] || "");
    setResult(null);
  };

  const activeLang = languages.find((l) => l.id === language);

  return (
    <div className="h-full flex flex-col rounded-2xl overflow-hidden border border-white/7">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d1a] border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3">
          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-2 px-3 py-1.5 glass border border-white/10 rounded-lg text-sm text-slate-300 hover:border-white/20 transition-all"
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              {activeLang?.label}
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showLangMenu && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-1 left-0 glass border border-white/10 rounded-xl overflow-hidden z-50 min-w-[160px] shadow-xl shadow-black/50"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => handleLanguageChange(lang.id)}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-white/5 transition-colors ${
                      language === lang.id ? "text-indigo-300 bg-indigo-500/10" : "text-slate-400"
                    }`}
                  >
                    {lang.label}
                    <span className="ml-auto text-xs text-slate-600">.{lang.ext}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          <div className="h-4 w-px bg-white/8" />

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-1.5 text-slate-600 hover:text-slate-300 transition-colors">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 text-slate-600 hover:text-slate-300 transition-colors">
            <Settings className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRun}
            disabled={running}
            className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-60"
          >
            {running ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5" fill="white" />
            )}
            {running ? "Running..." : "Run Code"}
          </button>
        </div>
      </div>

      {/* Editor + Output */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <MonacoEditor
            height="100%"
            language={language}
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

        {/* Output panel */}
        <div className="w-80 shrink-0 border-l border-white/5 flex flex-col bg-[#0d0d1a]">
          {/* Tabs */}
          <div className="flex border-b border-white/5 shrink-0">
            {(["output", "ai"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setOutputTab(tab)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors ${
                  outputTab === tab
                    ? "text-indigo-400 border-b-2 border-indigo-500"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {tab === "output" ? <Terminal className="w-3.5 h-3.5" /> : <span className="text-base">✨</span>}
                {tab === "output" ? "Output" : "AI Hints"}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {outputTab === "output" ? (
              result ? (
                <div className="space-y-3">
                  {/* Status badge */}
                  <div className={`flex items-center gap-2 text-xs font-medium px-2.5 py-1.5 rounded-lg w-fit ${
                    result.status === 3 ? "bg-emerald-500/15 text-emerald-400" :
                    result.status === 6 ? "bg-rose-500/15 text-rose-400" :
                    result.status === 0 ? "bg-rose-500/15 text-rose-400" :
                    "bg-amber-500/15 text-amber-400"
                  }`}>
                    {result.status === 3 ? "✓" : "✗"} {result.statusText}
                  </div>

                  {/* stdout */}
                  {result.stdout && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Output</p>
                      <pre className="text-xs text-emerald-300 font-mono leading-relaxed whitespace-pre-wrap bg-white/3 rounded-lg p-3">{result.stdout}</pre>
                    </div>
                  )}

                  {/* compile error */}
                  {result.compile_output && (
                    <div>
                      <p className="text-xs text-rose-400 mb-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />Compile Error</p>
                      <pre className="text-xs text-rose-300 font-mono leading-relaxed whitespace-pre-wrap bg-rose-500/5 rounded-lg p-3 border border-rose-500/15">{result.compile_output}</pre>
                    </div>
                  )}

                  {/* stderr */}
                  {result.stderr && (
                    <div>
                      <p className="text-xs text-amber-400 mb-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />Stderr</p>
                      <pre className="text-xs text-amber-300 font-mono leading-relaxed whitespace-pre-wrap bg-amber-500/5 rounded-lg p-3 border border-amber-500/15">{result.stderr}</pre>
                    </div>
                  )}

                  {/* error from our proxy */}
                  {result.error && (
                    <pre className="text-xs text-rose-300 font-mono bg-rose-500/5 rounded-lg p-3 border border-rose-500/15">{result.error}</pre>
                  )}

                  {/* Stats */}
                  {(result.time || result.memory) && (
                    <div className="flex gap-3 pt-1 border-t border-white/5">
                      {result.time && (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />{result.time}s
                        </span>
                      )}
                      {result.memory && (
                        <span className="text-xs text-slate-500">
                          {(result.memory / 1024).toFixed(1)} MB
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-600">
                  <Terminal className="w-8 h-8 mb-2 opacity-30" />
                  <p className="text-xs">Click &quot;Run Code&quot; to see output</p>
                </div>
              )
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-400 leading-relaxed">
                  <strong className="text-indigo-400">Hint 1:</strong> Think about how a hash map can reduce the time complexity from O(n²) to O(n).
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  <strong className="text-violet-400">Hint 2:</strong> Store each number&apos;s index as you iterate. For each new number, check if its complement already exists.
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  <strong className="text-cyan-400">Complexity:</strong> O(n) time, O(n) space.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

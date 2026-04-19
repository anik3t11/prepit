"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Mic, MicOff, Clock, ChevronRight,
  CheckCircle2, XCircle, Loader2, Zap, SkipForward,
  MessageSquare, Brain, Star, BarChart2, ArrowLeft,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Question {
  id: number;
  type: "behavioral" | "technical" | "system-design";
  question: string;
  hint: string;
  followUp: string;
  keywords: string[]; // concepts a strong answer should cover
}

interface AIFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
}

// ─── Question Banks ──────────────────────────────────────────────────────────

const BEHAVIORAL_BANK: Question[] = [
  {
    id: 200, type: "behavioral",
    question: "Tell me about a time you had to deal with a difficult teammate. How did you handle it?",
    hint: "Use STAR: Situation → Task → Action → Result.",
    followUp: "What would you do differently now?",
    keywords: [],
  },
  {
    id: 201, type: "behavioral",
    question: "Describe a project where you had to learn a new technology quickly under pressure.",
    hint: "Focus on your learning process, specific steps taken, and the outcome.",
    followUp: "How do you generally stay current with new technologies in your field?",
    keywords: [],
  },
  {
    id: 202, type: "behavioral",
    question: "Tell me about a time you disagreed with your manager or team lead. What did you do?",
    hint: "Show that you can voice concerns professionally and still commit to team decisions.",
    followUp: "What did you learn about handling conflict at work?",
    keywords: [],
  },
  {
    id: 203, type: "behavioral",
    question: "Give an example of a time you had to prioritize multiple tasks with conflicting deadlines.",
    hint: "Walk through how you assessed urgency vs importance and communicated with stakeholders.",
    followUp: "What tools or frameworks do you use to stay organized?",
    keywords: [],
  },
  {
    id: 204, type: "behavioral",
    question: "Describe a situation where you identified a problem before it became critical. What did you do?",
    hint: "Focus on proactivity — what signals did you spot, and how did you act on them?",
    followUp: "How do you build a habit of proactive problem-spotting?",
    keywords: [],
  },
];

const ROLE_BANKS: Record<string, Question[]> = {

  "Data Analyst": [
    {
      id: 1, type: "technical",
      question: "Explain the difference between INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN in SQL. When would you use each?",
      hint: "Think about which rows each join keeps when there is no matching row on one side.",
      followUp: "Can you write a query using a LEFT JOIN to find all customers who have never placed an order?",
      keywords: ["inner join", "left join", "right join", "outer join", "null", "matching rows", "unmatched"],
    },
    {
      id: 2, type: "technical",
      question: "What are window functions in SQL? Explain ROW_NUMBER, RANK, DENSE_RANK, and LAG/LEAD with examples.",
      hint: "Window functions operate over a set of rows without collapsing them like GROUP BY does.",
      followUp: "How would you use a window function to calculate a running total?",
      keywords: ["window", "over", "partition by", "row_number", "rank", "dense_rank", "lag", "lead", "running total"],
    },
    {
      id: 3, type: "technical",
      question: "You have a dataset with significant missing values. Walk me through your process for handling them.",
      hint: "Consider the type of missingness (MCAR, MAR, MNAR) before choosing a strategy.",
      followUp: "When is it better to drop rows vs impute values?",
      keywords: ["missing", "null", "imputation", "mean", "median", "mode", "drop", "mcar", "mar", "fillna", "strategy"],
    },
    {
      id: 4, type: "technical",
      question: "What is the difference between a star schema and a snowflake schema in a data warehouse?",
      hint: "Focus on normalization, query performance, and maintenance trade-offs.",
      followUp: "Which would you choose for a real-time dashboard and why?",
      keywords: ["star schema", "snowflake", "fact table", "dimension", "normalized", "denormalized", "join", "performance"],
    },
    {
      id: 5, type: "technical",
      question: "Explain p-value, confidence interval, and statistical significance. How do you interpret an A/B test result?",
      hint: "Be precise — p-value is not the probability the null hypothesis is true.",
      followUp: "What is the difference between Type I and Type II errors in A/B testing?",
      keywords: ["p-value", "null hypothesis", "confidence interval", "significance", "alpha", "type i", "type ii", "a/b test", "reject"],
    },
    {
      id: 6, type: "technical",
      question: "How would you calculate and interpret cohort retention using SQL or Python? Walk through the logic.",
      hint: "Cohort = group of users who started in the same period. Retention = % still active in later periods.",
      followUp: "What business decisions could you make from a cohort retention chart?",
      keywords: ["cohort", "retention", "group by", "date", "user", "percentage", "period", "active"],
    },
    {
      id: 7, type: "technical",
      question: "A KPI you track suddenly dropped by 30% overnight. How do you investigate and communicate the issue?",
      hint: "Think about data pipeline issues, segment breakdowns, external factors, and stakeholder communication.",
      followUp: "How do you distinguish a data quality issue from a real business problem?",
      keywords: ["segment", "breakdown", "data quality", "pipeline", "trend", "hypothesis", "stakeholder", "root cause", "filter"],
    },
    {
      id: 8, type: "technical",
      question: "Explain the difference between correlation and causation. Give an example where confusing the two could lead to a bad business decision.",
      hint: "Think about lurking variables (confounders) and why experiments are better than observational data for proving causation.",
      followUp: "What techniques can you use to establish causation in the absence of a controlled experiment?",
      keywords: ["correlation", "causation", "confounder", "spurious", "experiment", "observational", "control", "randomization"],
    },
  ],

  "Data Scientist": [
    {
      id: 10, type: "technical",
      question: "Explain the bias-variance trade-off. How does it affect model selection and regularization?",
      hint: "Underfitting = high bias; overfitting = high variance. Regularization (L1/L2) penalizes complexity.",
      followUp: "How would you detect and fix overfitting in a gradient boosting model?",
      keywords: ["bias", "variance", "overfitting", "underfitting", "regularization", "l1", "l2", "cross-validation", "complexity"],
    },
    {
      id: 11, type: "technical",
      question: "What is the difference between precision, recall, F1-score, and AUC-ROC? When do you optimize for each?",
      hint: "Think about the cost of false positives vs false negatives in different domains (fraud, cancer screening).",
      followUp: "What is the precision-recall curve, and when do you prefer it over ROC?",
      keywords: ["precision", "recall", "f1", "auc", "roc", "false positive", "false negative", "threshold", "imbalanced"],
    },
    {
      id: 12, type: "technical",
      question: "Walk me through how a Random Forest works. What are the key hyperparameters to tune?",
      hint: "Ensemble of decision trees, bagging, feature subsampling — explain each component.",
      followUp: "How does Random Forest differ from Gradient Boosting in how errors are corrected?",
      keywords: ["random forest", "bagging", "decision tree", "feature importance", "n_estimators", "max_depth", "bootstrap", "ensemble"],
    },
    {
      id: 13, type: "technical",
      question: "How do you handle class imbalance in a classification problem?",
      hint: "Consider resampling (SMOTE, undersampling), class weights, threshold tuning, and choosing the right metric.",
      followUp: "What are the risks of using accuracy as the primary metric on an imbalanced dataset?",
      keywords: ["smote", "oversampling", "undersampling", "class weight", "threshold", "imbalanced", "minority", "accuracy"],
    },
    {
      id: 14, type: "technical",
      question: "Explain how gradient descent works. What is the difference between batch, mini-batch, and stochastic gradient descent?",
      hint: "Focus on convergence speed, memory requirements, and noise in gradient estimates.",
      followUp: "What are adaptive learning rate optimizers (Adam, RMSProp) and when do you use them?",
      keywords: ["gradient descent", "learning rate", "batch", "stochastic", "convergence", "loss function", "backpropagation"],
    },
    {
      id: 15, type: "technical",
      question: "How would you deploy a machine learning model to production and monitor it over time?",
      hint: "Think about serving (REST API / batch), versioning, data drift, model drift, and retraining triggers.",
      followUp: "What is data drift vs concept drift? How do you detect each?",
      keywords: ["deployment", "api", "serving", "monitoring", "data drift", "model drift", "retraining", "mlops", "pipeline"],
    },
    ...BEHAVIORAL_BANK.slice(0, 3),
  ],

  "ML Engineer": [
    {
      id: 20, type: "technical",
      question: "What is the difference between a data scientist and an ML engineer? What does the ML engineering lifecycle look like?",
      hint: "ML engineers focus on production-readiness: pipelines, serving, scale, reliability, monitoring.",
      followUp: "What MLOps tools have you used or would you choose for a new project?",
      keywords: ["pipeline", "production", "serving", "mlops", "monitoring", "retraining", "feature store", "model registry"],
    },
    {
      id: 21, type: "technical",
      question: "How do you build a scalable ML feature pipeline? What are the main challenges?",
      hint: "Consider real-time vs batch features, feature consistency between training and serving (training-serving skew).",
      followUp: "What is training-serving skew and how do you prevent it?",
      keywords: ["feature pipeline", "batch", "streaming", "training-serving skew", "consistency", "feature store", "transformation"],
    },
    {
      id: 22, type: "technical",
      question: "Explain transformer architecture and the self-attention mechanism.",
      hint: "Key=Value=Query matrices, multi-head attention, positional encoding, feed-forward layers.",
      followUp: "How does BERT differ from GPT in terms of pre-training objective and use cases?",
      keywords: ["transformer", "attention", "query", "key", "value", "multi-head", "positional encoding", "encoder", "decoder"],
    },
    {
      id: 23, type: "technical",
      question: "What techniques do you use to reduce model inference latency in production?",
      hint: "Quantization, pruning, distillation, batching, caching, hardware accelerators.",
      followUp: "What is model quantization and what are the accuracy trade-offs?",
      keywords: ["quantization", "pruning", "distillation", "latency", "batching", "caching", "onnx", "tensorrt", "inference"],
    },
    ...BEHAVIORAL_BANK.slice(0, 3),
  ],

  "Data Engineer": [
    {
      id: 30, type: "technical",
      question: "Explain the difference between batch processing and stream processing. Give an example of when you'd use each.",
      hint: "Batch = high latency, high throughput; streaming = low latency, event-by-event or micro-batch.",
      followUp: "How does Apache Kafka differ from Apache Flink in the streaming ecosystem?",
      keywords: ["batch", "streaming", "latency", "throughput", "kafka", "spark", "flink", "event", "real-time"],
    },
    {
      id: 31, type: "technical",
      question: "What is the difference between ELT and ETL? When would you choose each approach?",
      hint: "ETL transforms before loading; ELT loads raw data first and transforms in the warehouse.",
      followUp: "How does the rise of cloud data warehouses (BigQuery, Snowflake) change this decision?",
      keywords: ["etl", "elt", "extract", "transform", "load", "data warehouse", "bigquery", "snowflake", "raw"],
    },
    {
      id: 32, type: "technical",
      question: "How do you ensure data quality in a data pipeline? What checks do you implement?",
      hint: "Schema validation, null checks, referential integrity, row count reconciliation, freshness checks.",
      followUp: "How would you handle a pipeline failure that caused downstream dashboards to show stale data?",
      keywords: ["data quality", "validation", "schema", "null", "reconciliation", "freshness", "monitoring", "alert", "dbt"],
    },
    {
      id: 33, type: "technical",
      question: "Explain partitioning and clustering in a column-oriented data warehouse. How do they affect query performance?",
      hint: "Partitioning prunes entire partitions; clustering sorts data within partitions for better scans.",
      followUp: "What are the trade-offs of over-partitioning a table?",
      keywords: ["partitioning", "clustering", "columnar", "prune", "scan", "bigquery", "snowflake", "query cost", "performance"],
    },
    {
      id: 34, type: "technical",
      question: "What is data lineage and why is it important? How would you implement it?",
      hint: "Lineage tracks where data comes from, how it was transformed, and where it flows — critical for debugging and compliance.",
      followUp: "Which tools have you used or would you recommend for data lineage tracking?",
      keywords: ["lineage", "provenance", "transformation", "tracking", "openlineage", "dbt", "compliance", "debugging", "metadata"],
    },
    ...BEHAVIORAL_BANK.slice(0, 3),
  ],

  "Software Engineer": [
    {
      id: 40, type: "technical",
      question: "What is the time and space complexity of common sorting algorithms? When would you choose quicksort over mergesort?",
      hint: "Compare average vs worst-case for quicksort, and the stable/in-place trade-offs of mergesort.",
      followUp: "What is introsort, and why do most standard libraries use it instead of pure quicksort?",
      keywords: ["quicksort", "mergesort", "o(n log n)", "o(n²)", "in-place", "stable", "worst case", "pivot", "space complexity"],
    },
    {
      id: 41, type: "technical",
      question: "Explain the difference between a process and a thread. What is a race condition and how do you prevent it?",
      hint: "Processes have separate memory; threads share it. Race conditions arise from uncoordinated shared state.",
      followUp: "What is a deadlock? How do you detect and prevent one?",
      keywords: ["process", "thread", "race condition", "mutex", "lock", "synchronization", "deadlock", "shared memory", "concurrent"],
    },
    {
      id: 42, type: "technical",
      question: "What is the difference between TCP and UDP? When would you use each?",
      hint: "TCP = reliable, ordered, connection-oriented; UDP = fast, connectionless, best-effort.",
      followUp: "How does QUIC improve on TCP+TLS for web applications?",
      keywords: ["tcp", "udp", "reliable", "ordered", "connection", "latency", "handshake", "streaming", "acknowledgement"],
    },
    {
      id: 43, type: "system-design",
      question: "Design a URL shortener like bit.ly. Walk through your architecture, data model, and scaling approach.",
      hint: "Consider hashing strategy, read/write ratio, database choice, caching, and redirect latency.",
      followUp: "How would you handle 1 billion URLs with sub-10ms redirect latency?",
      keywords: ["hash", "database", "cache", "redis", "cdn", "read", "write", "base62", "collision", "scale", "latency"],
    },
    {
      id: 44, type: "technical",
      question: "Explain SOLID principles. Give a concrete example of how violating one caused a real problem.",
      hint: "S=Single Responsibility, O=Open/Closed, L=Liskov, I=Interface Segregation, D=Dependency Inversion.",
      followUp: "How does dependency injection help with the Dependency Inversion Principle?",
      keywords: ["single responsibility", "open closed", "liskov", "interface segregation", "dependency inversion", "solid", "coupling"],
    },
    {
      id: 45, type: "technical",
      question: "What are the trade-offs between SQL and NoSQL databases? When would you choose each?",
      hint: "SQL: ACID, schema, relational; NoSQL: horizontal scale, flexible schema, eventual consistency.",
      followUp: "What is the CAP theorem, and how does it affect your database choice in a distributed system?",
      keywords: ["sql", "nosql", "acid", "cap theorem", "consistency", "availability", "partition", "schema", "horizontal scale"],
    },
    ...BEHAVIORAL_BANK.slice(0, 2),
  ],

  "Backend Engineer": [
    {
      id: 50, type: "technical",
      question: "What is the difference between REST, GraphQL, and gRPC? When would you choose each?",
      hint: "REST = resource-based, stateless; GraphQL = flexible queries; gRPC = binary, low-latency internal services.",
      followUp: "What are the main drawbacks of GraphQL at scale?",
      keywords: ["rest", "graphql", "grpc", "http", "protobuf", "schema", "over-fetching", "under-fetching", "latency"],
    },
    {
      id: 51, type: "technical",
      question: "Explain database indexing. How do B-Tree and hash indexes differ? How do you decide what to index?",
      hint: "B-Tree = range queries, sorted order; Hash = equality lookups only. Over-indexing slows writes.",
      followUp: "What is a covering index and when does it eliminate a table scan?",
      keywords: ["index", "b-tree", "hash", "range query", "equality", "write overhead", "covering index", "query planner"],
    },
    {
      id: 52, type: "technical",
      question: "What are common strategies for caching? Explain cache-aside, write-through, and write-back patterns.",
      hint: "Cache-aside = app manages; write-through = sync write to cache+DB; write-back = async flush to DB.",
      followUp: "How do you handle cache invalidation? What is the 'thundering herd' problem?",
      keywords: ["cache-aside", "write-through", "write-back", "invalidation", "ttl", "redis", "memcached", "thundering herd", "eviction"],
    },
    {
      id: 53, type: "technical",
      question: "What is database connection pooling? Why is it important and what happens when the pool is exhausted?",
      hint: "Creating connections is expensive; pooling reuses them. Pool exhaustion causes request queuing or timeouts.",
      followUp: "What are typical connection pool size formulas and how do you tune them?",
      keywords: ["connection pool", "reuse", "overhead", "pgbouncer", "pool size", "timeout", "queue", "thread"],
    },
    ...BEHAVIORAL_BANK.slice(0, 3),
  ],

  "Full Stack Dev": [
    {
      id: 60, type: "technical",
      question: "Explain the browser's critical rendering path. How do you optimize Time to First Paint (TTFP) and Time to Interactive (TTI)?",
      hint: "DOM → CSSOM → Render Tree → Layout → Paint → Composite. Blocking resources delay render.",
      followUp: "What is the difference between defer and async on a script tag?",
      keywords: ["dom", "cssom", "render tree", "layout", "paint", "blocking", "defer", "async", "critical path", "ttfp", "tti"],
    },
    {
      id: 61, type: "technical",
      question: "What is the difference between Server-Side Rendering (SSR), Static Site Generation (SSG), and Client-Side Rendering (CSR)?",
      hint: "Trade-offs: SEO, TTFB, personalization, infrastructure complexity.",
      followUp: "When would you use Incremental Static Regeneration (ISR) in Next.js?",
      keywords: ["ssr", "ssg", "csr", "hydration", "ttfb", "seo", "static", "dynamic", "next.js", "isr"],
    },
    {
      id: 62, type: "technical",
      question: "Explain event loop, microtask queue, and macrotask queue in JavaScript. Give an example of execution order.",
      hint: "Microtasks (Promises, queueMicrotask) always flush before macrotasks (setTimeout, setInterval).",
      followUp: "How does async/await relate to the Promise microtask queue under the hood?",
      keywords: ["event loop", "microtask", "macrotask", "promise", "settimeout", "async", "await", "call stack", "queue"],
    },
    {
      id: 63, type: "technical",
      question: "What are the main security vulnerabilities in web apps (OWASP Top 10)? How do you prevent XSS and SQL injection?",
      hint: "XSS = injected scripts run in victim's browser; SQLi = malicious SQL via unsanitized input. Escape and parameterize.",
      followUp: "What is Content Security Policy (CSP) and how does it mitigate XSS?",
      keywords: ["xss", "sql injection", "owasp", "sanitize", "parameterized query", "csp", "csrf", "escape", "input validation"],
    },
    ...BEHAVIORAL_BANK.slice(0, 2),
  ],

  "Product Manager": [
    {
      id: 70, type: "technical",
      question: "How do you prioritize a product backlog with limited engineering capacity? Walk through a framework you use.",
      hint: "RICE (Reach, Impact, Confidence, Effort), ICE, MoSCoW, or value vs effort matrix.",
      followUp: "How do you handle stakeholder pushback when you deprioritize their request?",
      keywords: ["rice", "ice", "moscow", "prioritization", "impact", "effort", "value", "stakeholder", "trade-off"],
    },
    {
      id: 71, type: "technical",
      question: "How do you define success metrics for a new feature launch? Walk through a real or hypothetical example.",
      hint: "Cover leading vs lagging indicators, primary vs guardrail metrics, and how you'd instrument the feature.",
      followUp: "What is the difference between a metric moving because of your feature vs external factors?",
      keywords: ["metric", "kpi", "success", "north star", "leading", "lagging", "guardrail", "instrumentation", "baseline"],
    },
    {
      id: 72, type: "technical",
      question: "How do you decide whether to run an A/B test or roll out a feature directly?",
      hint: "Sample size, statistical significance, reversibility of change, and speed of learnings.",
      followUp: "What is a network effect and why can it make A/B testing misleading?",
      keywords: ["a/b test", "experiment", "sample size", "statistical significance", "rollout", "control", "treatment", "network effect"],
    },
    {
      id: 73, type: "behavioral",
      question: "Describe a time you had to say 'no' to a high-priority request from an executive or key stakeholder.",
      hint: "Focus on how you used data and reasoning, and how you managed the relationship.",
      followUp: "How do you keep stakeholders aligned when priorities shift?",
      keywords: [],
    },
    ...BEHAVIORAL_BANK.slice(0, 3),
  ],

  "QA Engineer": [
    {
      id: 80, type: "technical",
      question: "Explain the testing pyramid. How do you balance unit, integration, and end-to-end tests?",
      hint: "Unit = fast, cheap, many; integration = moderate; E2E = slow, expensive, few but high confidence.",
      followUp: "What are the signs that a test suite has too many E2E tests (ice cream cone anti-pattern)?",
      keywords: ["testing pyramid", "unit test", "integration test", "e2e", "coverage", "flaky", "fast", "cost", "isolation"],
    },
    {
      id: 81, type: "technical",
      question: "What is the difference between functional and non-functional testing? Give examples of each.",
      hint: "Functional = what the system does; non-functional = how well it does it (performance, security, usability).",
      followUp: "How do you approach performance testing for a high-traffic API?",
      keywords: ["functional", "non-functional", "performance", "security", "usability", "load test", "stress test", "regression"],
    },
    {
      id: 82, type: "technical",
      question: "How do you approach testing a REST API? What are the key scenarios to cover?",
      hint: "Happy path, edge cases, error codes, auth, rate limiting, schema validation, boundary values.",
      followUp: "What tools would you use for API test automation and why?",
      keywords: ["api", "rest", "status code", "schema", "boundary", "auth", "postman", "pytest", "automation", "edge case"],
    },
    ...BEHAVIORAL_BANK.slice(0, 3),
  ],

  "Business Analyst": [
    {
      id: 90, type: "technical",
      question: "Walk me through how you would gather and document requirements from a non-technical stakeholder.",
      hint: "Discovery meetings, user stories, use cases, acceptance criteria, sign-off process.",
      followUp: "How do you handle conflicting requirements from different stakeholders?",
      keywords: ["requirements", "user stories", "acceptance criteria", "stakeholder", "use case", "sign-off", "scope", "elicitation"],
    },
    {
      id: 91, type: "technical",
      question: "Explain the difference between a use case and a user story. When do you use each?",
      hint: "Use cases = more formal, step-by-step flows; user stories = lightweight, from user's perspective.",
      followUp: "What is a 'Definition of Done' and why does it matter in Agile?",
      keywords: ["use case", "user story", "as a user", "acceptance criteria", "agile", "definition of done", "persona"],
    },
    {
      id: 92, type: "technical",
      question: "How do you perform a gap analysis? Walk through a real or hypothetical example.",
      hint: "Current state → desired state → identify gaps → prioritize solutions.",
      followUp: "How do you get organizational buy-in for the recommended changes?",
      keywords: ["gap analysis", "current state", "future state", "as-is", "to-be", "gap", "recommendation", "process"],
  },
    ...BEHAVIORAL_BANK.slice(0, 3),
  ],

  "DevOps Engineer": [
    {
      id: 100, type: "technical",
      question: "Explain the difference between containers and virtual machines. What problem does Kubernetes solve that Docker alone does not?",
      hint: "VMs virtualize hardware; containers share kernel. Kubernetes handles orchestration: scheduling, scaling, self-healing.",
      followUp: "What is a Kubernetes Deployment vs a StatefulSet? When do you use each?",
      keywords: ["container", "virtual machine", "docker", "kubernetes", "orchestration", "scheduling", "scaling", "pod", "statefulset"],
    },
    {
      id: 101, type: "technical",
      question: "What is Infrastructure as Code (IaC)? Explain the difference between Terraform and Ansible.",
      hint: "Terraform = declarative, state-based provisioning; Ansible = imperative, agentless configuration management.",
      followUp: "How do you manage Terraform state in a team environment?",
      keywords: ["iac", "terraform", "ansible", "declarative", "imperative", "state", "idempotent", "provisioning", "configuration"],
    },
    {
      id: 102, type: "technical",
      question: "Describe a CI/CD pipeline you've built or worked with. What happens at each stage?",
      hint: "Source → build → test (unit/integration) → security scan → staging deploy → E2E → production deploy.",
      followUp: "How do you implement blue-green or canary deployments in a CI/CD pipeline?",
      keywords: ["ci/cd", "pipeline", "build", "test", "deploy", "staging", "production", "blue-green", "canary", "rollback"],
    },
    ...BEHAVIORAL_BANK.slice(0, 3),
  ],

  "Cybersecurity Engineer": [
    {
      id: 110, type: "technical",
      question: "Explain the difference between symmetric and asymmetric encryption. How does TLS use both?",
      hint: "Asymmetric (RSA/ECC) for key exchange; symmetric (AES) for bulk data encryption. TLS handshake combines both.",
      followUp: "What is Perfect Forward Secrecy (PFS) and why does it matter?",
      keywords: ["symmetric", "asymmetric", "rsa", "aes", "tls", "key exchange", "handshake", "certificate", "forward secrecy"],
    },
    {
      id: 111, type: "technical",
      question: "What is the OWASP Top 10? Explain how you would mitigate SQL injection and XSS in a web application.",
      hint: "Parameterized queries for SQLi; output encoding/CSP for XSS. Defense in depth.",
      followUp: "What is a WAF (Web Application Firewall) and what are its limitations?",
      keywords: ["owasp", "sql injection", "xss", "parameterized", "sanitize", "csp", "input validation", "waf", "defense in depth"],
    },
    {
      id: 112, type: "technical",
      question: "Describe the kill chain model in cybersecurity. How does it help with threat detection and response?",
      hint: "Reconnaissance → Weaponization → Delivery → Exploitation → Installation → C2 → Actions on Objectives.",
      followUp: "How does the MITRE ATT&CK framework extend the kill chain model?",
      keywords: ["kill chain", "reconnaissance", "exploitation", "delivery", "command and control", "mitre", "att&ck", "threat", "detection"],
    },
    ...BEHAVIORAL_BANK.slice(0, 3),
  ],
};

// Fallback for roles without a specific bank
ROLE_BANKS["Senior SDE"]         = ROLE_BANKS["Software Engineer"];
ROLE_BANKS["Cloud Architect"]    = ROLE_BANKS["DevOps Engineer"];
ROLE_BANKS["SAP Consultant"]     = [...BEHAVIORAL_BANK];

// ─── Evaluation Logic ────────────────────────────────────────────────────────

function evaluateAnswer(answer: string, question: Question): AIFeedback {
  const lower = answer.toLowerCase().trim();
  const wordCount = lower.split(/\s+/).filter(Boolean).length;

  // 1. Length score (max 25)
  const lengthScore =
    wordCount >= 120 ? 25 :
    wordCount >= 70  ? 18 :
    wordCount >= 35  ? 10 :
    wordCount >= 10  ? 4  : 0;

  // 2. Keyword coverage (max 50)
  const kws = question.keywords;
  const hit  = kws.filter((k) => lower.includes(k.toLowerCase()));
  const keywordScore = kws.length > 0
    ? Math.round((hit.length / kws.length) * 50)
    : 25; // behavioral has no keywords — give neutral score

  // 3. Structure bonus (max 20)
  let structureScore = 0;
  if (question.type === "behavioral") {
    if (/\b(when|situation|project|team|at work|in my|there was|once|last year)\b/i.test(answer)) structureScore += 7;
    if (/\b(i |we |decided|implemented|took action|used|helped|resolved|led|escalated)\b/i.test(answer)) structureScore += 7;
    if (/\b(result|outcome|achieved|improved|learned|led to|because of|impact|ended up)\b/i.test(answer)) structureScore += 6;
  } else {
    if (/\b(for example|such as|for instance|e\.g\.|like when|consider)\b/i.test(answer)) structureScore += 10;
    if (/\b(however|but|whereas|trade-?off|compared to|on the other hand|advantage|disadvantage|pros|cons)\b/i.test(answer)) structureScore += 10;
  }

  const rawScore = 5 + lengthScore + keywordScore + structureScore;
  const score    = Math.min(100, Math.max(8, rawScore));

  // ── Generate specific, answer-aware feedback ──
  const strengths: string[]    = [];
  const improvements: string[] = [];

  // Length feedback
  if (wordCount >= 70) {
    strengths.push("Well-developed answer with sufficient depth");
  } else if (wordCount >= 30) {
    improvements.push("Expand your response — aim for 70+ words with concrete examples or technical detail");
  } else {
    improvements.push("Answer is too brief. Provide specific details, examples, and reasoning (aim for 70+ words)");
  }

  // Keyword feedback (technical questions)
  if (kws.length > 0) {
    if (hit.length > 0) {
      strengths.push(`Correctly covered: ${hit.slice(0, 3).join(", ")}`);
    }
    const missed = kws.filter((k) => !lower.includes(k.toLowerCase()));
    if (missed.length > 0) {
      improvements.push(`Key concepts to also mention: ${missed.slice(0, 3).join(", ")}`);
    }
  }

  // Behavioral-specific
  if (question.type === "behavioral") {
    if (structureScore >= 14) {
      strengths.push("Good STAR structure — situation, action, and result are all present");
    } else if (structureScore < 7) {
      improvements.push("Use the STAR method: Situation → Task → Action → Result");
    }
    if (!/\b(result|outcome|achieved|improved|learned|impact|led to|ended up)\b/i.test(answer)) {
      improvements.push("Quantify or describe the outcome — what changed because of your actions?");
    }
  } else {
    // Technical
    if (/\b(for example|such as|for instance|e\.g\.|consider)\b/i.test(answer)) {
      strengths.push("Good use of concrete examples to support your explanation");
    } else {
      improvements.push("Add a concrete real-world example or use case to strengthen your answer");
    }
    if (question.type === "system-design" && wordCount < 80) {
      improvements.push("System design answers need more depth — cover trade-offs, scale, and failure modes");
    }
  }

  return {
    score,
    strengths:    strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
  };
}

// ─── Question Selection ──────────────────────────────────────────────────────

function selectQuestions(role: string, round: string, type: string, duration: string): Question[] {
  const count =
    duration === "15 min" ? 3 :
    duration === "30 min" ? 5 :
    duration === "45 min" ? 7 : 8;

  const bank = ROLE_BANKS[role] ?? ROLE_BANKS["Software Engineer"];

  // Filter by round type
  let pool: Question[];
  if (round === "screening" || round === "final" || round === "managerial") {
    // Mostly behavioral
    pool = bank.filter((q) => q.type === "behavioral");
    const tech = bank.filter((q) => q.type === "technical").slice(0, 1);
    pool = [...pool, ...tech];
  } else if (round === "system-design") {
    const sd   = bank.filter((q) => q.type === "system-design");
    const tech = bank.filter((q) => q.type === "technical");
    const beh  = bank.filter((q) => q.type === "behavioral").slice(0, 1);
    pool = [...sd, ...tech, ...beh];
  } else {
    // Technical rounds 1 & 2
    if (type === "behavioral") {
      pool = bank.filter((q) => q.type === "behavioral");
    } else if (type === "technical") {
      pool = bank.filter((q) => q.type !== "behavioral");
    } else {
      pool = bank; // mixed
    }
  }

  // Shuffle and slice
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  // Always include at least 1 behavioral and 1 technical if mixed
  const selected = shuffled.slice(0, count);
  return selected.length > 0 ? selected : bank.slice(0, count);
}

// ─── UI Helpers ──────────────────────────────────────────────────────────────

const typeColors: Record<string, string> = {
  behavioral:     "text-violet-400 bg-violet-500/10 border-violet-500/20",
  technical:      "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  "system-design":"text-amber-400 bg-amber-500/10 border-amber-500/20",
};
const typeLabels: Record<string, string> = {
  behavioral:     "Behavioral",
  technical:      "Technical",
  "system-design":"System Design",
};

type Phase = "intro" | "interview" | "complete";

// ─── Component ──────────────────────────────────────────────────────────────

export default function InterviewSessionPage() {
  const [sessionConfig, setSessionConfig] = useState<{
    role: string; round: string; type: string; duration: string; company: string;
  } | null>(null);

  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [qTimer, setQTimer] = useState(120);
  const [isRecording, setIsRecording] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [allFeedback, setAllFeedback] = useState<AIFeedback[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load config from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("prepit_session_config");
      if (raw) setSessionConfig(JSON.parse(raw));
    } catch {
      // ignore parse errors
    }
  }, []);

  // Derive questions from config
  const questions = useMemo<Question[]>(() => {
    if (!sessionConfig) return selectQuestions("Software Engineer", "technical-1", "mixed", "30 min");
    return selectQuestions(
      sessionConfig.role,
      sessionConfig.round,
      sessionConfig.type,
      sessionConfig.duration
    );
  }, [sessionConfig]);

  // Global timer
  useEffect(() => {
    if (phase !== "interview") return;
    const t = setInterval(() => setTimeLeft((p) => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, [phase]);

  // Per-question timer reset
  useEffect(() => {
    if (phase !== "interview" || evaluating) return;
    setQTimer(120);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // Simulate brief evaluation delay (real AI call would go here)
    await new Promise((r) => setTimeout(r, 900));

    const q = questions[currentQ];
    const result = evaluateAnswer(answer, q);

    setFeedback(result);
    setEvaluating(false);
    setShowFollowUp(true);
  };

  const handleNext = () => {
    setAnswers((p) => [...p, answer]);
    setAllFeedback((p) => [...p, feedback!]);
    setAnswer("");
    setFeedback(null);
    setShowHint(false);
    setShowFollowUp(false);
    if (currentQ + 1 >= questions.length) {
      setPhase("complete");
    } else {
      setCurrentQ((p) => p + 1);
    }
  };

  const handleSkip = () => {
    setAnswers((p) => [...p, ""]);
    setAllFeedback((p) => [...p, { score: 0, strengths: [], improvements: ["Skipped — no answer provided"] }]);
    setAnswer("");
    setFeedback(null);
    setShowHint(false);
    setShowFollowUp(false);
    if (currentQ + 1 >= questions.length) {
      setPhase("complete");
    } else {
      setCurrentQ((p) => p + 1);
    }
  };

  const avgScore =
    allFeedback.length > 0
      ? Math.round(allFeedback.reduce((a, b) => a + b.score, 0) / allFeedback.length)
      : 0;

  const q = questions[currentQ] ?? questions[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AnimatePresence mode="wait">

        {/* ── INTRO ── */}
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center text-center gap-6 py-12"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Your Interview is Ready</h1>
              {sessionConfig && (
                <p className="text-indigo-300 font-medium text-sm mb-2">
                  {sessionConfig.role}{sessionConfig.company ? ` · ${sessionConfig.company}` : ""}
                </p>
              )}
              <p className="text-slate-400 max-w-md">
                You&apos;ll answer <strong className="text-white">{questions.length}</strong> role-specific questions.
                Feedback is evaluated based on your actual answer — not random.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
              {[
                { label: "Questions", value: questions.length },
                { label: "Duration",  value: sessionConfig?.duration ?? "30 min" },
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
              <p>• Type naturally — more detail = higher score</p>
              <p>• Use STAR method for behavioral questions</p>
              <p>• Use "for example…" to demonstrate technical depth</p>
            </div>
            <div className="flex gap-3">
              <Link href="/interview"
                className="px-5 py-2.5 glass border border-white/10 text-slate-300 text-sm rounded-xl hover:border-white/20 transition-all"
              >
                <ArrowLeft className="w-4 h-4 inline mr-1.5" />Back
              </Link>
              <button
                onClick={() => setPhase("interview")}
                className="px-7 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
              >
                Start Interview <ChevronRight className="w-4 h-4 inline ml-1.5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── INTERVIEW ── */}
        {phase === "interview" && (
          <motion.div key="interview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Header bar */}
            <div className="flex items-center justify-between glass border border-white/7 rounded-2xl px-5 py-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm text-slate-300">
                  <Zap className="w-4 h-4 text-indigo-400" />
                  <span className="font-medium">Question {currentQ + 1}</span>
                  <span className="text-slate-600">/ {questions.length}</span>
                </div>
                <div className="flex gap-1.5">
                  {questions.map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all ${
                      i < currentQ ? "w-4 bg-emerald-500" : i === currentQ ? "w-4 bg-indigo-500" : "w-1.5 bg-white/10"
                    }`} />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className={`flex items-center gap-1.5 font-mono font-medium ${qTimer < 30 ? "text-rose-400" : "text-slate-300"}`}>
                  <Clock className="w-3.5 h-3.5" />{fmt(qTimer)}
                  <span className="text-slate-600 text-xs font-normal">q</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-1.5 text-slate-400 font-mono text-xs">
                  <Clock className="w-3 h-3" />{fmt(timeLeft)} left
                </div>
              </div>
            </div>

            {/* Question card */}
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="glass border border-white/7 rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${typeColors[q.type]}`}>
                  {typeLabels[q.type]}
                </span>
                {sessionConfig?.role && (
                  <span className="text-xs text-slate-600 px-2.5 py-1 rounded-full border border-white/8 bg-white/3">
                    {sessionConfig.role}
                  </span>
                )}
              </div>

              <p className="text-white text-lg font-medium leading-relaxed">{q.question}</p>

              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-3 text-sm text-amber-300/80"
                >
                  <span className="font-semibold text-amber-400">Hint: </span>{q.hint}
                </motion.div>
              )}

              <textarea
                ref={textareaRef}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here… the more detail you provide, the more accurate the feedback"
                disabled={evaluating || showFollowUp}
                rows={6}
                className="w-full px-4 py-3 bg-white/3 border border-white/8 rounded-xl text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/30 transition-all resize-none disabled:opacity-60"
              />

              {/* Word count indicator */}
              <div className="flex items-center justify-between -mt-2">
                <span className={`text-xs ${
                  answer.trim().split(/\s+/).filter(Boolean).length >= 70
                    ? "text-emerald-500"
                    : answer.trim().split(/\s+/).filter(Boolean).length >= 30
                    ? "text-amber-500"
                    : "text-slate-600"
                }`}>
                  {answer.trim() ? `${answer.trim().split(/\s+/).filter(Boolean).length} words` : ""}
                </span>
                <span className="text-xs text-slate-600">Aim for 70+ words for full credit</span>
              </div>

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
                      <MessageSquare className="w-3.5 h-3.5" />Hint
                    </button>
                  )}
                  <button
                    onClick={handleSkip}
                    disabled={evaluating}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors"
                  >
                    <SkipForward className="w-3.5 h-3.5" />Skip
                  </button>
                </div>

                {!showFollowUp && (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!answer.trim() || evaluating}
                    className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {evaluating ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" />Evaluating…</>
                    ) : (
                      <>Submit Answer<ChevronRight className="w-3.5 h-3.5" /></>
                    )}
                  </button>
                )}
              </div>
            </motion.div>

            {/* AI Feedback */}
            <AnimatePresence>
              {feedback && !evaluating && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="glass border border-white/7 rounded-2xl p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white text-sm">AI Feedback</h3>
                    <div className="flex items-center gap-1.5">
                      <div className={`text-lg font-black ${
                        feedback.score >= 80 ? "text-emerald-400" :
                        feedback.score >= 55 ? "text-amber-400" : "text-rose-400"
                      }`}>
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
                      {feedback.strengths.length > 0 ? (
                        <ul className="space-y-1">
                          {feedback.strengths.map((s) => (
                            <li key={s} className="text-xs text-slate-400 leading-relaxed">{s}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-slate-600">No standout strengths detected</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-amber-400 mb-1.5 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Improve
                      </p>
                      <ul className="space-y-1">
                        {feedback.improvements.map((s) => (
                          <li key={s} className="text-xs text-slate-400 leading-relaxed">{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {showFollowUp && (
                    <div className="bg-indigo-500/8 border border-indigo-500/20 rounded-xl p-3">
                      <p className="text-xs font-medium text-indigo-400 mb-1">Follow-up question:</p>
                      <p className="text-sm text-slate-300">{q.followUp}</p>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
                    >
                      {currentQ + 1 >= questions.length ? "Finish Interview" : "Next Question"}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── COMPLETE ── */}
        {phase === "complete" && (
          <motion.div key="complete" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center py-6">
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-emerald-500/30 mx-auto mb-4"
              >
                <CheckCircle2 className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2">Interview Complete!</h1>
              <p className="text-slate-400">Here&apos;s your performance summary</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="glass border border-white/7 rounded-2xl p-5 text-center">
                <div className={`text-4xl font-black mb-1 ${avgScore >= 80 ? "text-emerald-400" : avgScore >= 55 ? "text-amber-400" : "text-rose-400"}`}>
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

            <div className="glass border border-white/7 rounded-2xl p-5 space-y-3">
              <h2 className="font-semibold text-white text-sm flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-400" />Question Breakdown
              </h2>
              {questions.map((question, i) => {
                const fb = allFeedback[i];
                return (
                  <div key={question.id} className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      !fb || fb.score === 0 ? "bg-white/5 text-slate-600" :
                      fb.score >= 80 ? "bg-emerald-500/15 text-emerald-400" :
                      fb.score >= 55 ? "bg-amber-500/15 text-amber-400" :
                      "bg-rose-500/15 text-rose-400"
                    }`}>
                      {!fb || fb.score === 0 ? "–" : fb.score}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300 truncate">{question.question}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border mt-1 inline-block ${typeColors[question.type]}`}>
                        {typeLabels[question.type]}
                      </span>
                      {fb && fb.improvements.length > 0 && fb.score < 70 && (
                        <p className="text-xs text-slate-500 mt-1 truncate">{fb.improvements[0]}</p>
                      )}
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
              <Link href="/dashboard"
                className="px-5 py-2.5 glass border border-white/10 text-slate-300 text-sm rounded-xl hover:border-white/20 transition-all"
              >
                Back to Dashboard
              </Link>
              <Link href="/interview"
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

export type QuestionType = "coding" | "theory";

export interface TestCase {
  nums?: number[]; target?: number; // Two Sum
  input?: unknown[]; // generic
  expected: string;
  label: string;
}

export interface FullQuestion {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  track: string;
  tags: string[];
  type: QuestionType;
  time: string;
  description: string;
  hints: string[];
  // coding only
  examples?: { input: string; output: string; explanation?: string }[];
  constraints?: string[];
  starterCode?: string;
  solution?: string;
  testCases?: TestCase[];
  // theory only
  keywords?: string[];
  sampleAnswer?: string;
}

const QUESTIONS_LIST: FullQuestion[] = [

  // ─── DATA ANALYST ────────────────────────────────────────────────────────────

  {
    id: 101, type: "theory", difficulty: "Medium", time: "15 min",
    title: "SQL Window Functions (RANK, DENSE_RANK, ROW_NUMBER)",
    track: "Data Analyst", tags: ["SQL", "Window Functions"],
    description: `Explain the difference between **RANK**, **DENSE_RANK**, and **ROW_NUMBER** window functions in SQL.

- When does RANK leave gaps in the sequence?
- When does DENSE_RANK not leave gaps?
- When is ROW_NUMBER guaranteed unique?

Provide a concrete SQL example showing how they differ when two rows have the same value.`,
    hints: ["Think about what happens when two employees have the same salary", "RANK leaves a gap; DENSE_RANK doesn't", "ROW_NUMBER always increments regardless of ties"],
    keywords: ["rank", "dense_rank", "row_number", "window", "over", "partition by", "ties", "gap", "order by"],
  },
  {
    id: 102, type: "theory", difficulty: "Easy", time: "10 min",
    title: "Write a query to find duplicate records",
    track: "Data Analyst", tags: ["SQL"],
    description: `Given a table \`users(id, email, name)\`, write a SQL query to find all **duplicate email addresses** (emails that appear more than once).

Also write a follow-up query to delete the duplicates while keeping the row with the lowest \`id\`.`,
    hints: ["GROUP BY + HAVING COUNT > 1 finds duplicates", "Use a subquery or CTE to delete while keeping one row", "ROW_NUMBER() is a clean way to mark duplicates for deletion"],
    keywords: ["group by", "having", "count", "duplicate", "cte", "row_number", "partition by", "delete", "subquery"],
  },
  {
    id: 103, type: "theory", difficulty: "Hard", time: "30 min",
    title: "Optimize a slow-running JOIN query",
    track: "Data Analyst", tags: ["SQL", "Performance"],
    description: `A query joining three tables (orders, customers, products) takes 45 seconds on a 10M-row dataset.

Walk through your **step-by-step process** to diagnose and fix the performance issue.

Cover: EXPLAIN/EXPLAIN ANALYZE, indexes, join order, avoiding SELECT *, and query rewrites.`,
    hints: ["Start with EXPLAIN to see the query plan", "Check if join columns are indexed", "Filter early — push WHERE clauses before JOINs where possible"],
    keywords: ["explain", "index", "query plan", "join", "filter", "select *", "cardinality", "nested loop", "hash join", "partition pruning"],
  },
  {
    id: 104, type: "theory", difficulty: "Medium", time: "20 min",
    title: "CTEs vs Subqueries — when to use each?",
    track: "Data Analyst", tags: ["SQL"],
    description: `Compare **Common Table Expressions (CTEs)** and **subqueries** in SQL.

- When do you prefer a CTE over a subquery?
- Can CTEs be recursive? Give a use case.
- Does a CTE always improve performance vs a subquery?`,
    hints: ["CTEs improve readability and can be referenced multiple times", "Recursive CTEs are great for hierarchical data (org charts, trees)", "In most databases a CTE is not automatically materialized"],
    keywords: ["cte", "with", "subquery", "readability", "recursive", "materialized", "reuse", "hierarchy"],
  },
  {
    id: 105, type: "theory", difficulty: "Medium", time: "20 min",
    title: "Pivot a table using CASE statements",
    track: "Data Analyst", tags: ["SQL"],
    description: `Given a table \`sales(month, category, revenue)\` in long format, write a SQL query to **pivot it** into wide format with one column per category.

Explain the CASE + GROUP BY technique, and mention when you'd use a database-native PIVOT clause instead.`,
    hints: ["SUM(CASE WHEN category = 'A' THEN revenue END) per group", "GROUP BY month collapses the rows", "Some databases (SQL Server, Oracle) have PIVOT syntax"],
    keywords: ["pivot", "case when", "group by", "sum", "aggregate", "wide format", "long format", "conditional aggregation"],
  },
  {
    id: 111, type: "theory", difficulty: "Medium", time: "20 min",
    title: "Pandas: merge, groupby, pivot_table",
    track: "Data Analyst", tags: ["Python", "Pandas"],
    description: `Explain the following Pandas operations with code examples:

1. **merge** — how is it different from SQL JOIN? What are the \`how\` parameter options?
2. **groupby** — explain split-apply-combine. Show aggregating multiple columns.
3. **pivot_table** — when do you use it over groupby?`,
    hints: ["pd.merge is the Pandas equivalent of SQL JOIN", "groupby().agg() can apply multiple functions at once", "pivot_table is syntactic sugar over groupby for 2D reshaping"],
    keywords: ["merge", "groupby", "pivot_table", "agg", "apply", "how", "left", "inner", "split-apply-combine", "index"],
  },
  {
    id: 112, type: "theory", difficulty: "Easy", time: "10 min",
    title: "Handle missing data in a DataFrame",
    track: "Data Analyst", tags: ["Python", "Pandas", "Data Cleaning"],
    description: `A DataFrame has missing values across multiple columns. Describe your end-to-end process:

1. How do you **detect** missing values?
2. What strategies do you use to **impute** vs **drop**?
3. How do you decide which approach to use for a given column?`,
    hints: ["df.isnull().sum() gives a quick overview", "Impute numeric with mean/median; categorical with mode or 'Unknown'", "Drop rows only when missingness is random and < 5% of data"],
    keywords: ["isnull", "fillna", "dropna", "imputation", "mean", "median", "mode", "missing", "mcar", "strategy"],
  },
  {
    id: 113, type: "theory", difficulty: "Medium", time: "15 min",
    title: "Explain vectorized operations vs loops in Pandas",
    track: "Data Analyst", tags: ["Python", "Performance"],
    description: `Why are vectorized operations in Pandas/NumPy significantly faster than Python for-loops?

- Explain the underlying reason (C-level operations, SIMD).
- Show a before/after example converting a loop to a vectorized operation.
- When is \`apply()\` acceptable vs when should you avoid it?`,
    hints: ["Pandas is built on NumPy which runs compiled C code", "apply() is still essentially a Python loop — avoid for large DataFrames", "Use .str, .dt accessors and built-in aggregation functions instead"],
    keywords: ["vectorized", "numpy", "loop", "apply", "c", "performance", "broadcasting", "str accessor", "dt accessor"],
  },
  {
    id: 114, type: "theory", difficulty: "Hard", time: "40 min",
    title: "Build a cohort retention analysis in Python",
    track: "Data Analyst", tags: ["Python", "Analytics"],
    description: `Walk through building a **cohort retention analysis** from a raw events table with columns \`user_id, event_date\`.

1. How do you define and assign cohorts?
2. How do you calculate retention for each period?
3. How would you visualize the result as a heatmap?

Provide Python/Pandas pseudocode for key steps.`,
    hints: ["Cohort = the month/week a user first appeared", "Retention period = difference between event_date and first_event_date", "pivot_table to reshape, then divide by cohort size"],
    keywords: ["cohort", "retention", "groupby", "first", "merge", "period", "pivot_table", "heatmap", "seaborn", "percentage"],
  },
  {
    id: 121, type: "theory", difficulty: "Medium", time: "15 min",
    title: "Explain p-value and statistical significance",
    track: "Data Analyst", tags: ["Statistics"],
    description: `Explain what a **p-value** is in plain English and in statistical terms.

- What does it mean if p < 0.05?
- What does it NOT mean? (common misconceptions)
- What is a Type I and Type II error in this context?`,
    hints: ["p-value is the probability of seeing your result (or more extreme) if the null hypothesis were true", "p < 0.05 does NOT mean the null is false with 95% probability", "Type I = false positive (reject true null); Type II = false negative (fail to reject false null)"],
    keywords: ["p-value", "null hypothesis", "significance", "alpha", "type i", "type ii", "false positive", "false negative", "reject"],
  },
  {
    id: 122, type: "theory", difficulty: "Hard", time: "25 min",
    title: "A/B Testing — how do you determine sample size?",
    track: "Data Analyst", tags: ["Statistics", "A/B Testing"],
    description: `Walk through how you determine the required **sample size** before running an A/B test.

Cover: baseline conversion rate, minimum detectable effect (MDE), statistical power, significance level, and how changing each affects sample size.

What mistakes do analysts commonly make in A/B test design?`,
    hints: ["Larger MDE = smaller sample needed; smaller MDE = larger sample", "Power = 1 - P(Type II error), typically set at 0.8", "Peeking (checking results early and stopping) inflates Type I error"],
    keywords: ["sample size", "mde", "minimum detectable effect", "power", "alpha", "baseline", "conversion", "peeking", "significance"],
  },
  {
    id: 123, type: "theory", difficulty: "Easy", time: "10 min",
    title: "Central Limit Theorem — explain with example",
    track: "Data Analyst", tags: ["Statistics"],
    description: `Explain the **Central Limit Theorem (CLT)** in plain language and with a concrete example.

- Why does it matter for statistical inference?
- What are the conditions under which it applies?
- How does it justify using the normal distribution in hypothesis tests?`,
    hints: ["CLT: the distribution of sample means approaches normal as n increases, regardless of the original distribution", "Typically n ≥ 30 is sufficient", "It allows us to compute confidence intervals and p-values even for non-normal data"],
    keywords: ["central limit theorem", "sample mean", "normal distribution", "n", "sampling distribution", "standard error", "inference"],
  },
  {
    id: 124, type: "theory", difficulty: "Medium", time: "15 min",
    title: "What is multicollinearity and how do you detect it?",
    track: "Data Analyst", tags: ["Statistics", "Regression"],
    description: `Explain **multicollinearity** in regression models.

- Why is it a problem?
- How do you detect it (VIF, correlation matrix)?
- How do you fix it?`,
    hints: ["Multicollinearity = two or more predictors are highly correlated", "VIF > 5 or 10 is a common threshold for concern", "Fixes: remove one correlated variable, PCA, ridge regression"],
    keywords: ["multicollinearity", "vif", "variance inflation factor", "correlation", "regression", "coefficients", "unstable", "pca", "ridge"],
  },
  {
    id: 131, type: "theory", difficulty: "Medium", time: "30 min",
    title: "Design a KPI dashboard for an e-commerce site",
    track: "Data Analyst", tags: ["Business Intelligence"],
    description: `You are asked to build a KPI dashboard for an e-commerce company's leadership team.

- What **metrics** would you include and why?
- How would you structure the layout (executive summary vs drill-down)?
- What data sources would you need to connect?
- How would you handle data freshness requirements?`,
    hints: ["Think revenue, conversion rate, CAC, LTV, cart abandonment, NPS", "Executive dashboards should show trends, not just snapshots", "Consider daily refresh vs real-time depending on the KPI"],
    keywords: ["kpi", "conversion rate", "cac", "ltv", "revenue", "dashboard", "metrics", "data source", "refresh", "trend", "drill-down"],
  },
  {
    id: 132, type: "theory", difficulty: "Easy", time: "15 min",
    title: "Explain star schema vs snowflake schema",
    track: "Data Analyst", tags: ["Data Warehousing"],
    description: `Compare **star schema** and **snowflake schema** in data warehousing.

- What are fact tables and dimension tables?
- When does snowflake normalization help vs hurt?
- Which would you choose for a BI tool like Tableau or Power BI?`,
    hints: ["Star: denormalized dimensions, simple joins, faster queries", "Snowflake: normalized dimensions, more tables, less storage but more joins", "BI tools prefer star schema for performance and simplicity"],
    keywords: ["star schema", "snowflake", "fact table", "dimension", "denormalized", "normalized", "join", "query performance", "bi"],
  },
  {
    id: 133, type: "theory", difficulty: "Medium", time: "20 min",
    title: "What metrics would you track for user churn?",
    track: "Data Analyst", tags: ["Business Intelligence", "Metrics"],
    description: `You are a data analyst at a SaaS company. Define a framework for measuring and **predicting user churn**.

- What is your churn definition?
- Which leading indicators would you track?
- How would you build an early-warning system?`,
    hints: ["Churn definition varies: 30-day inactivity, cancelled subscription, etc.", "Leading indicators: login frequency, feature usage, support tickets", "Cohort analysis shows churn by acquisition period"],
    keywords: ["churn", "retention", "leading indicator", "cohort", "engagement", "feature usage", "prediction", "definition", "early warning"],
  },

  // ─── SDE ─────────────────────────────────────────────────────────────────────

  {
    id: 201, type: "coding", difficulty: "Easy", time: "15 min",
    title: "Two Sum",
    track: "Software Engineer", tags: ["Array", "Hash Map"],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return **indices** of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] == 9" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    ],
    constraints: ["2 ≤ nums.length ≤ 10⁴", "-10⁹ ≤ nums[i] ≤ 10⁹", "Only one valid answer exists."],
    hints: ["A brute-force approach is O(n²). Can you do better?", "A hash map lets you look up complements in O(1)."],
    starterCode: `function twoSum(nums, target) {\n  // Your solution here\n};`,
    solution: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n};`,
    testCases: [
      { nums: [2,7,11,15], target: 9,  expected: "[0,1]",  label: "nums=[2,7,11,15], target=9" },
      { nums: [3,2,4],     target: 6,  expected: "[1,2]",  label: "nums=[3,2,4], target=6"     },
      { nums: [3,3],       target: 6,  expected: "[0,1]",  label: "nums=[3,3], target=6"       },
    ],
  },
  {
    id: 202, type: "coding", difficulty: "Medium", time: "25 min",
    title: "LRU Cache Implementation",
    track: "Software Engineer", tags: ["Design", "Hash Map", "Linked List"],
    description: `Design a data structure that follows the **Least Recently Used (LRU) cache** eviction policy.

Implement the \`LRUCache\` class:
- \`LRUCache(capacity)\` — initializes with positive size capacity
- \`get(key)\` — returns the value if key exists, otherwise -1. Marks as recently used.
- \`put(key, value)\` — inserts or updates the key. If capacity is exceeded, evict the LRU item.

Both operations must run in **O(1)** average time.`,
    examples: [
      { input: 'LRUCache(2); put(1,1); put(2,2); get(1); put(3,3); get(2); put(4,4); get(1); get(3); get(4)', output: '1, -1, -1, 3, 4', explanation: "Key 2 is evicted when 3 is inserted (1 was recently used). Key 1 is evicted when 4 is inserted." },
    ],
    constraints: ["1 ≤ capacity ≤ 3000", "0 ≤ key ≤ 10⁴", "All get/put calls are valid"],
    hints: ["A HashMap gives O(1) lookup. A doubly linked list maintains access order.", "Keep a dummy head and tail to simplify edge cases.", "On get: move node to front. On put with eviction: remove from tail."],
    starterCode: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    // Your implementation here\n  }\n\n  get(key) {\n    // return value or -1\n  }\n\n  put(key, value) {\n    // insert/update, evict LRU if over capacity\n  }\n}`,
    solution: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n  }\n  get(key) {\n    if (!this.map.has(key)) return -1;\n    const val = this.map.get(key);\n    this.map.delete(key);\n    this.map.set(key, val);\n    return val;\n  }\n  put(key, value) {\n    if (this.map.has(key)) this.map.delete(key);\n    else if (this.map.size >= this.capacity) this.map.delete(this.map.keys().next().value);\n    this.map.set(key, value);\n  }\n}`,
    testCases: [
      { expected: "1,-1,-1,3,4", label: "LRU standard sequence" },
    ],
  },
  {
    id: 203, type: "theory", difficulty: "Hard", time: "30 min",
    title: "Merge K Sorted Lists",
    track: "Software Engineer", tags: ["Linked List", "Heap", "Divide & Conquer"],
    description: `You are given an array of \`k\` linked lists, each sorted in ascending order. Merge all the linked lists into one sorted linked list.

**Approach 1:** Naive — merge two at a time. What's the time complexity?

**Approach 2:** Min-Heap (Priority Queue). Walk through the algorithm and derive O(n log k) complexity.

**Approach 3:** Divide and Conquer. How does it achieve the same complexity?`,
    hints: ["Min-heap: push first node from each list, pop min, push next from that list", "O(n log k): n total nodes, log k for heap operations", "Divide & Conquer: pair-merge like merge sort"],
    keywords: ["min heap", "priority queue", "divide and conquer", "merge", "o(n log k)", "linked list", "k-way merge"],
  },
  {
    id: 204, type: "coding", difficulty: "Easy", time: "20 min",
    title: "Binary Search Tree Operations",
    track: "Software Engineer", tags: ["BST", "Tree", "Recursion"],
    description: `Implement the following operations on a **Binary Search Tree**:

1. \`insert(root, val)\` — insert a value, return the new root
2. \`search(root, val)\` — return the node if found, null otherwise
3. \`inorder(root)\` — return all values in sorted order

What is the time complexity of each operation in average and worst case?`,
    examples: [
      { input: "insert(null,5), insert(root,3), insert(root,7), inorder(root)", output: "[3,5,7]" },
    ],
    constraints: ["Node values are unique integers", "Tree can be unbalanced"],
    hints: ["BST property: left < node < right", "Inorder traversal gives sorted output", "Worst case O(n) for a skewed tree"],
    starterCode: `function insert(root, val) {\n  // Your solution here\n}\n\nfunction search(root, val) {\n  // Your solution here\n}\n\nfunction inorder(root) {\n  // Return array of values in sorted order\n}`,
    solution: `function insert(root, val) {\n  if (!root) return { val, left: null, right: null };\n  if (val < root.val) root.left = insert(root.left, val);\n  else root.right = insert(root.right, val);\n  return root;\n}\nfunction search(root, val) {\n  if (!root || root.val === val) return root;\n  return val < root.val ? search(root.left, val) : search(root.right, val);\n}\nfunction inorder(root) {\n  if (!root) return [];\n  return [...inorder(root.left), root.val, ...inorder(root.right)];\n}`,
    testCases: [
      { expected: "3,5,7", label: "Inorder of [5,3,7]" },
    ],
  },
  {
    id: 205, type: "theory", difficulty: "Medium", time: "25 min",
    title: "Graph — Detect cycle in directed graph",
    track: "Software Engineer", tags: ["Graph", "DFS"],
    description: `Explain two algorithms to detect a cycle in a **directed graph**:

1. **DFS with coloring** (white/grey/black) — walk through the algorithm
2. **Kahn's algorithm** (topological sort via BFS + in-degree) — when is this preferred?

What is the time and space complexity of each?

Give a real-world example where cycle detection matters (e.g., dependency resolution).`,
    hints: ["Grey node = currently in recursion stack; if you reach a grey node, there's a cycle", "Kahn's: if not all nodes are processed (remaining in-degree > 0), a cycle exists", "Package managers (npm, pip) use this to detect circular dependencies"],
    keywords: ["dfs", "cycle", "directed", "grey", "recursion stack", "topological sort", "kahn", "in-degree", "o(v+e)", "dependency"],
  },
  {
    id: 206, type: "coding", difficulty: "Medium", time: "30 min",
    title: "Dynamic Programming — Coin Change",
    track: "Software Engineer", tags: ["DP", "BFS"],
    description: `Given an array of coin denominations \`coins\` and an integer \`amount\`, return the **fewest number of coins** needed to make up that amount.

If no combination can make up the amount, return \`-1\`.

You may use each coin denomination an **unlimited** number of times.`,
    examples: [
      { input: "coins = [1,5,11], amount = 15", output: "3", explanation: "11 + 1 + ... wait — optimal is 5+5+5=3 coins" },
      { input: "coins = [2], amount = 3", output: "-1" },
    ],
    constraints: ["1 ≤ coins.length ≤ 12", "1 ≤ coins[i] ≤ 2³¹-1", "0 ≤ amount ≤ 10⁴"],
    hints: ["Build dp[i] = min coins to make amount i", "dp[0] = 0; dp[i] = min(dp[i - coin] + 1) for each coin", "Initialize dp[i] = Infinity, return -1 if dp[amount] is still Infinity"],
    starterCode: `function coinChange(coins, amount) {\n  // Your solution here\n};`,
    solution: `function coinChange(coins, amount) {\n  const dp = Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++) {\n    for (const coin of coins) {\n      if (coin <= i) dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n};`,
    testCases: [
      { expected: "3",  label: "coins=[1,5,11], amount=15" },
      { expected: "-1", label: "coins=[2], amount=3" },
      { expected: "0",  label: "coins=[1], amount=0" },
    ],
  },
  {
    id: 211, type: "theory", difficulty: "Medium", time: "45 min",
    title: "Design a URL Shortener",
    track: "Software Engineer", tags: ["System Design"],
    description: `Design a URL shortening service like **bit.ly** that:
- Accepts a long URL and returns a short code (e.g., \`short.ly/abc123\`)
- Redirects \`short.ly/abc123\` → original URL in < 10ms
- Handles 100M URLs and 1B redirects/day

Cover: API design, hashing strategy, database schema, caching, and how you scale reads.`,
    hints: ["Base62 encoding of an auto-increment ID gives short, unique codes", "Read:write ratio is very high — cache hot URLs in Redis", "Use a CDN for ultra-low latency redirects"],
    keywords: ["base62", "hash", "redis", "cache", "cdn", "database", "read", "write", "scale", "collision", "api", "redirect", "short code"],
  },
  {
    id: 212, type: "theory", difficulty: "Hard", time: "60 min",
    title: "Design Netflix Architecture",
    track: "Software Engineer", tags: ["System Design"],
    description: `Design a video streaming platform like **Netflix** at scale.

Cover:
1. Video upload pipeline (encoding, CDN storage)
2. Video delivery and adaptive bitrate streaming (ABR)
3. Recommendation service
4. How Netflix handles 200M+ concurrent streams`,
    hints: ["Videos are transcoded into multiple resolutions/bitrates", "Open Connect CDN puts servers close to ISPs", "Recommendations use collaborative filtering + embeddings"],
    keywords: ["cdn", "transcoding", "adaptive bitrate", "hls", "dash", "microservices", "recommendation", "collaborative filtering", "open connect", "encoding"],
  },
  {
    id: 213, type: "theory", difficulty: "Medium", time: "40 min",
    title: "Design a Rate Limiter",
    track: "Software Engineer", tags: ["System Design"],
    description: `Design a **rate limiter** that allows at most N requests per user per minute.

Compare these algorithms:
1. Fixed window counter
2. Sliding window log
3. Token bucket
4. Leaky bucket

Which would you use for a REST API and why?`,
    hints: ["Fixed window can spike at boundaries (double the limit)", "Token bucket is smoothest but requires per-user state", "Redis with atomic increment + TTL is a common implementation"],
    keywords: ["fixed window", "sliding window", "token bucket", "leaky bucket", "redis", "atomic", "ttl", "boundary", "api gateway"],
  },
  {
    id: 214, type: "theory", difficulty: "Hard", time: "50 min",
    title: "Design a Notification System",
    track: "Software Engineer", tags: ["System Design"],
    description: `Design a notification system that sends **push, email, and SMS** notifications to 100M users.

Cover:
- How do you handle different channels (iOS push, Android, email, SMS)?
- How do you guarantee at-least-once delivery?
- How do you handle user preferences and opt-outs?
- How do you handle spikes (e.g., breaking news)?`,
    hints: ["Decouple producers and consumers with a message queue (Kafka, SQS)", "Third-party providers: APNs/FCM for push, SendGrid for email, Twilio for SMS", "Use a worker pool pattern to fan out to multiple channels"],
    keywords: ["kafka", "queue", "push notification", "apns", "fcm", "email", "sms", "at-least-once", "idempotency", "fan-out", "opt-out"],
  },
  {
    id: 221, type: "theory", difficulty: "Medium", time: "20 min",
    title: "Explain SOLID principles with examples",
    track: "Software Engineer", tags: ["OOP", "Design"],
    description: `Explain each of the 5 SOLID principles with a concrete code example showing a **violation** and the **corrected version**:

- S: Single Responsibility
- O: Open/Closed
- L: Liskov Substitution
- I: Interface Segregation
- D: Dependency Inversion`,
    hints: ["SRP violation: a class that both parses and saves data", "OCP: use inheritance/composition rather than modifying existing classes", "DI: inject dependencies rather than constructing them inside the class"],
    keywords: ["single responsibility", "open closed", "liskov", "interface segregation", "dependency inversion", "solid", "coupling", "injection"],
  },
  {
    id: 222, type: "theory", difficulty: "Medium", time: "25 min",
    title: "Implement Observer design pattern",
    track: "Software Engineer", tags: ["Design Patterns"],
    description: `Explain the **Observer pattern** and walk through an implementation.

- What problem does it solve?
- How does it differ from polling?
- Implement a simple event emitter with \`subscribe\`, \`unsubscribe\`, and \`notify\` methods.
- Where is Observer used in real frameworks (React, RxJS, DOM events)?`,
    hints: ["Observer = pub/sub: one subject notifies many observers", "Avoids tight coupling — subject doesn't know observer types", "React useEffect with deps, DOM addEventListener are real examples"],
    keywords: ["observer", "pub/sub", "subscribe", "notify", "event", "decoupling", "react", "rxjs", "listener", "pattern"],
  },
  {
    id: 223, type: "theory", difficulty: "Easy", time: "10 min",
    title: "Singleton vs Static — what's the difference?",
    track: "Software Engineer", tags: ["OOP", "Design Patterns"],
    description: `Compare the **Singleton pattern** and **static classes/methods**:

- When do you need a Singleton vs a static utility class?
- How do you implement a thread-safe Singleton?
- What are the downsides of Singleton (global state, testing)?`,
    hints: ["Singleton: one instance, can implement interfaces and be injected", "Static: no instance, can't be mocked easily in tests", "Double-checked locking or initialization-on-demand for thread safety"],
    keywords: ["singleton", "static", "instance", "thread-safe", "global state", "testing", "mock", "lazy initialization"],
  },

  // ─── ML / AI ─────────────────────────────────────────────────────────────────

  {
    id: 301, type: "theory", difficulty: "Medium", time: "15 min",
    title: "Explain bias-variance tradeoff",
    track: "ML / AI", tags: ["Machine Learning", "Fundamentals"],
    description: `Explain the **bias-variance tradeoff** in machine learning.

- What causes high bias (underfitting)?
- What causes high variance (overfitting)?
- How do regularization, cross-validation, and ensemble methods address this?
- Draw/describe the U-shaped test error curve.`,
    hints: ["High bias = model too simple, can't capture signal", "High variance = model memorizes training data, fails on unseen data", "Regularization adds a penalty term that shrinks weights, reducing variance"],
    keywords: ["bias", "variance", "overfitting", "underfitting", "regularization", "cross-validation", "ensemble", "l1", "l2", "complexity"],
  },
  {
    id: 302, type: "theory", difficulty: "Medium", time: "20 min",
    title: "Gradient Descent — types and when to use each",
    track: "ML / AI", tags: ["Machine Learning", "Optimization"],
    description: `Compare **Batch**, **Stochastic (SGD)**, and **Mini-batch** gradient descent.

- How does each compute the gradient?
- Trade-offs in convergence speed, memory, and noise.
- Explain **learning rate schedules** and **adaptive optimizers** (Adam, RMSProp).`,
    hints: ["Batch = exact gradient but slow per step; SGD = noisy but fast", "Mini-batch balances both — typical in deep learning", "Adam combines momentum + RMSProp for adaptive per-parameter rates"],
    keywords: ["batch", "stochastic", "mini-batch", "learning rate", "adam", "rmsprop", "momentum", "convergence", "gradient", "schedule"],
  },
  {
    id: 303, type: "theory", difficulty: "Medium", time: "15 min",
    title: "How does Random Forest reduce overfitting?",
    track: "ML / AI", tags: ["Ensemble", "Tree Models"],
    description: `Explain how **Random Forest** reduces overfitting compared to a single decision tree.

Cover:
1. Bagging (bootstrap aggregation)
2. Feature subsampling at each split
3. How averaging/voting reduces variance
4. Key hyperparameters to tune`,
    hints: ["Each tree is trained on a bootstrapped sample — high variance individually", "Feature subsampling decorrelates the trees", "Averaging many high-variance models reduces overall variance"],
    keywords: ["bagging", "bootstrap", "feature subsampling", "variance", "averaging", "decorrelated", "n_estimators", "max_depth", "max_features"],
  },
  {
    id: 304, type: "theory", difficulty: "Hard", time: "45 min",
    title: "Implement k-means clustering from scratch",
    track: "ML / AI", tags: ["Unsupervised Learning"],
    description: `Walk through implementing **k-means clustering** from scratch:

1. Initialization strategies (random, k-means++)
2. Assignment step
3. Update step
4. Convergence criterion
5. How to choose k (elbow method, silhouette score)?

What are k-means' limitations?`,
    hints: ["k-means++ initializes centroids spread apart, improving convergence", "Assignment: assign each point to nearest centroid (Euclidean distance)", "k-means fails on non-spherical clusters and is sensitive to outliers"],
    keywords: ["k-means", "centroid", "assignment", "update", "convergence", "elbow", "silhouette", "k-means++", "euclidean", "initialization"],
  },
  {
    id: 311, type: "theory", difficulty: "Hard", time: "20 min",
    title: "Explain BERT Architecture",
    track: "ML / AI", tags: ["NLP", "Transformers"],
    description: `Explain the **BERT** (Bidirectional Encoder Representations from Transformers) architecture.

- How does bidirectionality differ from GPT's left-to-right approach?
- What are the two pre-training objectives (MLM and NSP)?
- How is BERT fine-tuned for downstream tasks?`,
    hints: ["BERT uses masked language modeling — predict randomly masked tokens", "Bidirectional means the model sees both left and right context simultaneously", "Fine-tuning adds a task-specific head (classification, QA) on top"],
    keywords: ["bert", "bidirectional", "masked language model", "mlm", "nsp", "encoder", "fine-tuning", "pre-training", "transformer", "attention"],
  },
  {
    id: 312, type: "theory", difficulty: "Hard", time: "25 min",
    title: "What is attention mechanism in Transformers?",
    track: "ML / AI", tags: ["Transformers", "Deep Learning"],
    description: `Explain **self-attention** and **multi-head attention** in Transformers.

- Derive the scaled dot-product attention formula: softmax(QKᵀ/√d)V
- Why do we scale by √d?
- What does each attention head learn?
- What is positional encoding and why is it needed?`,
    hints: ["Q, K, V are learned linear projections of the input", "Scaling prevents softmax saturation in high dimensions", "Multiple heads learn different types of relationships (syntactic, semantic)"],
    keywords: ["attention", "query", "key", "value", "scaled dot product", "multi-head", "softmax", "positional encoding", "transformer", "d_model"],
  },
  {
    id: 313, type: "theory", difficulty: "Medium", time: "15 min",
    title: "Vanishing gradient problem and solutions",
    track: "ML / AI", tags: ["Deep Learning"],
    description: `Explain the **vanishing gradient problem** in deep neural networks.

- Why does it occur (chain rule in backprop)?
- How do ReLU, batch normalization, residual connections, and gradient clipping each address it?`,
    hints: ["Sigmoid/tanh derivatives are < 1; multiplying many < 1 values → 0", "ReLU has derivative 1 for positive values — no saturation", "ResNets use skip connections to allow gradients to flow directly"],
    keywords: ["vanishing gradient", "backpropagation", "chain rule", "relu", "batch normalization", "residual", "skip connection", "sigmoid", "saturate"],
  },
  {
    id: 321, type: "theory", difficulty: "Hard", time: "20 min",
    title: "How do you monitor model drift in production?",
    track: "ML / AI", tags: ["MLOps"],
    description: `Explain the difference between **data drift** and **concept drift**, and describe how you monitor for each in production.

- What metrics do you track?
- How do you set up alerting?
- When do you retrain vs when is drift acceptable?`,
    hints: ["Data drift = input distribution changes; concept drift = the relationship between input and output changes", "Monitor PSI, KL divergence for feature distributions", "Track model performance metrics (accuracy, AUC) against a held-out validation set"],
    keywords: ["data drift", "concept drift", "psi", "kl divergence", "monitoring", "retraining", "alert", "distribution", "mlops", "performance"],
  },
  {
    id: 322, type: "theory", difficulty: "Medium", time: "15 min",
    title: "Feature store — what is it and why use it?",
    track: "ML / AI", tags: ["MLOps"],
    description: `Explain what a **feature store** is and the problems it solves.

- What is training-serving skew and how does a feature store prevent it?
- What are offline vs online feature stores?
- Name one open-source and one managed feature store.`,
    hints: ["Training-serving skew = features computed differently during training vs inference", "Online store: low-latency key-value (Redis); Offline store: historical data (S3/BigQuery)", "Examples: Feast (open source), Tecton, SageMaker Feature Store"],
    keywords: ["feature store", "training-serving skew", "online", "offline", "feast", "tecton", "reuse", "consistency", "low latency"],
  },
  {
    id: 323, type: "theory", difficulty: "Hard", time: "25 min",
    title: "A/B testing a new ML model in production",
    track: "ML / AI", tags: ["MLOps", "Experimentation"],
    description: `Walk through how you would **A/B test a new ML model** against the current production model.

- How do you split traffic?
- What metrics do you track?
- What is a shadow deployment and when would you use it?
- How do you decide when to fully roll out the new model?`,
    hints: ["Shadow mode: new model runs but its predictions are not served (safe testing)", "Track both ML metrics (AUC) and business metrics (CTR, revenue)", "Gradual rollout (5% → 25% → 100%) reduces blast radius"],
    keywords: ["a/b test", "traffic split", "shadow mode", "canary", "rollout", "ml metric", "business metric", "experiment", "statistical significance"],
  },

  // ─── DATA ENGINEERING ────────────────────────────────────────────────────────

  {
    id: 401, type: "theory", difficulty: "Hard", time: "30 min",
    title: "Design an idempotent data pipeline",
    track: "Data Engineering", tags: ["Pipelines", "Design"],
    description: `What does **idempotency** mean in the context of a data pipeline, and why is it important?

Walk through techniques to make a pipeline idempotent:
- Overwrite (full refresh) vs upsert strategies
- Partition-based overwrite
- Deduplication with unique keys
- Handling late-arriving data`,
    hints: ["Idempotent: running the pipeline twice gives the same result as running it once", "Overwriting a partition is a clean idempotent strategy", "Upsert (INSERT ... ON CONFLICT) handles duplicates at the row level"],
    keywords: ["idempotent", "overwrite", "upsert", "partition", "deduplication", "late data", "insert on conflict", "deterministic"],
  },
  {
    id: 402, type: "theory", difficulty: "Medium", time: "20 min",
    title: "Batch vs Stream processing — when to use each?",
    track: "Data Engineering", tags: ["Architecture"],
    description: `Compare **batch processing** and **stream processing**:

- Latency, throughput, and complexity trade-offs
- Use cases where each is the right choice
- What is the **Lambda architecture**? What problem does **Kappa architecture** solve?`,
    hints: ["Batch: process large chunks at intervals; streaming: process events as they arrive", "Lambda = batch layer + speed layer + serving layer", "Kappa: only a streaming layer — simpler but harder to reprocess history"],
    keywords: ["batch", "streaming", "latency", "throughput", "lambda architecture", "kappa architecture", "kafka", "spark", "flink", "real-time"],
  },
  {
    id: 403, type: "theory", difficulty: "Hard", time: "25 min",
    title: "Handle late-arriving data in a streaming pipeline",
    track: "Data Engineering", tags: ["Streaming"],
    description: `In a streaming pipeline (e.g., Flink or Spark Structured Streaming), how do you handle **late-arriving events**?

Cover:
- Event time vs processing time
- Watermarks — what are they and how do you set them?
- Side outputs / late data handling
- How does this affect windowing accuracy?`,
    hints: ["Event time = when the event happened; processing time = when it arrived at the system", "Watermark = threshold for how late we tolerate events before closing a window", "Side output captures events that arrive after the watermark — can be reprocessed later"],
    keywords: ["event time", "processing time", "watermark", "late data", "window", "side output", "flink", "spark streaming", "tolerance"],
  },
  {
    id: 411, type: "theory", difficulty: "Medium", time: "20 min",
    title: "Explain Apache Spark vs Hadoop MapReduce",
    track: "Data Engineering", tags: ["Big Data"],
    description: `Compare **Apache Spark** and **Hadoop MapReduce**:

- Why is Spark typically 10–100x faster than MapReduce?
- What are RDDs, DataFrames, and Datasets in Spark?
- When would you still choose MapReduce (if ever)?`,
    hints: ["Spark processes in-memory; MapReduce writes intermediate results to disk between stages", "RDD = low-level, untyped; DataFrame = structured, SQL-like, optimized by Catalyst", "MapReduce is more mature for extremely large sequential batch jobs with huge data spillover"],
    keywords: ["spark", "mapreduce", "in-memory", "rdd", "dataframe", "dag", "catalyst", "lazy evaluation", "disk", "shuffle"],
  },
  {
    id: 412, type: "theory", difficulty: "Hard", time: "40 min",
    title: "Design a data lake on AWS S3",
    track: "Data Engineering", tags: ["Cloud", "Architecture"],
    description: `Design a **data lake on AWS S3** for a company ingesting 10TB/day from multiple sources.

Cover:
1. Folder/partition structure
2. File format choices (Parquet vs CSV vs ORC)
3. Cataloging and schema management (Glue, Hive Metastore)
4. Governance and access control
5. Query layer (Athena, Redshift Spectrum)`,
    hints: ["Partition by date/region for query pruning", "Parquet = columnar, compressed — best for analytics", "Glue Crawler auto-discovers schema; Glue Data Catalog registers it"],
    keywords: ["s3", "parquet", "partition", "glue", "athena", "data lake", "columnar", "schema", "governance", "iam", "catalog"],
  },
  {
    id: 413, type: "theory", difficulty: "Hard", time: "30 min",
    title: "Kafka partitioning strategy for high throughput",
    track: "Data Engineering", tags: ["Kafka", "Streaming"],
    description: `Explain Kafka's **partitioning model** and how to design a partitioning strategy for a high-throughput pipeline.

- How does partition count affect parallelism and consumer throughput?
- What is the trade-off of using a custom partition key?
- How do you avoid hot partitions?`,
    hints: ["Each partition is consumed by exactly one consumer in a group — more partitions = more parallelism", "Custom key ensures ordering per key but risks hot partitions if keys are skewed", "Use a hash of a high-cardinality field (user_id) to distribute evenly"],
    keywords: ["kafka", "partition", "consumer group", "parallelism", "throughput", "hot partition", "key", "ordering", "replication", "offset"],
  },
  {
    id: 421, type: "theory", difficulty: "Medium", time: "25 min",
    title: "Slowly Changing Dimensions (SCD Type 2)",
    track: "Data Engineering", tags: ["Data Modeling"],
    description: `Explain **Slowly Changing Dimensions (SCD)** and the differences between Type 1, Type 2, and Type 3.

Walk through a concrete implementation of **SCD Type 2** in SQL:
- What columns do you add (effective_date, end_date, is_current)?
- How do you handle new records vs changed records?`,
    hints: ["SCD Type 1: overwrite old value — no history kept", "SCD Type 2: insert new row with version dates — full history", "SCD Type 3: add a 'previous value' column — limited history"],
    keywords: ["scd", "type 1", "type 2", "type 3", "effective_date", "end_date", "is_current", "history", "slowly changing", "dimension"],
  },
  {
    id: 422, type: "theory", difficulty: "Hard", time: "35 min",
    title: "Optimize a query on a 1B-row partitioned table",
    track: "Data Engineering", tags: ["SQL", "Performance"],
    description: `A query on a 1-billion-row BigQuery/Snowflake table takes 5 minutes. Walk through your optimization process.

Cover: partition pruning, clustering keys, materialized views, avoiding SELECT *, reducing shuffles, and approximate aggregations.`,
    hints: ["Filter on the partition column first — otherwise full table scan", "Clustering/sorting reduces bytes scanned within a partition", "Materialized views pre-compute expensive aggregations"],
    keywords: ["partition pruning", "clustering", "materialized view", "select *", "shuffle", "bytes scanned", "approximate", "bigquery", "snowflake", "index"],
  },

  // ─── CLOUD / DEVOPS ───────────────────────────────────────────────────────────

  {
    id: 501, type: "theory", difficulty: "Hard", time: "30 min",
    title: "Kubernetes Pod Scheduling",
    track: "Cloud / DevOps", tags: ["Kubernetes"],
    description: `Explain how the Kubernetes **scheduler** decides where to place a Pod.

Cover:
1. Filtering phase (taints, tolerations, affinity, resource requests)
2. Scoring phase (least allocated, spread)
3. Node affinity vs pod affinity vs taints/tolerations
4. What happens when no node is suitable?`,
    hints: ["Filtering removes nodes that can't run the pod; scoring ranks the remaining ones", "Taints repel pods unless they have a matching toleration", "PodPending status means no suitable node was found"],
    keywords: ["scheduler", "filtering", "scoring", "taint", "toleration", "affinity", "resource request", "node", "pending", "priority"],
  },
  {
    id: 502, type: "theory", difficulty: "Medium", time: "15 min",
    title: "Difference between Deployment and StatefulSet",
    track: "Cloud / DevOps", tags: ["Kubernetes"],
    description: `Compare Kubernetes **Deployment** and **StatefulSet**:

- What guarantees does StatefulSet provide that Deployment doesn't?
- When do you use each?
- How do pod names and persistent volumes differ?`,
    hints: ["Deployment pods are interchangeable; StatefulSet pods have stable network IDs and persistent storage", "Use StatefulSet for databases, Kafka, ZooKeeper", "StatefulSet pods are named pod-0, pod-1, pod-2 — guaranteed ordering"],
    keywords: ["deployment", "statefulset", "stable identity", "persistent volume", "headless service", "ordered", "stateful", "database"],
  },
  {
    id: 503, type: "theory", difficulty: "Medium", time: "20 min",
    title: "How does Kubernetes handle rolling updates?",
    track: "Cloud / DevOps", tags: ["Kubernetes", "Deployment"],
    description: `Walk through how Kubernetes performs a **rolling update** for a Deployment.

- What do \`maxSurge\` and \`maxUnavailable\` control?
- How do you roll back a failed update?
- What is the difference between RollingUpdate and Recreate strategies?`,
    hints: ["maxSurge = extra pods allowed above desired count during update", "maxUnavailable = pods that can be down during update", "kubectl rollout undo deployment/myapp rolls back"],
    keywords: ["rolling update", "maxsurge", "maxunavailable", "rollback", "recreate", "deployment strategy", "kubectl", "readiness probe"],
  },
  {
    id: 511, type: "theory", difficulty: "Hard", time: "45 min",
    title: "Design a multi-region failover on AWS",
    track: "Cloud / DevOps", tags: ["AWS", "High Availability"],
    description: `Design a **multi-region active-passive failover** system on AWS with an RTO of < 5 minutes.

Cover: Route 53 health checks, RDS Multi-AZ vs cross-region read replica promotion, S3 cross-region replication, and how you test failover without impacting production.`,
    hints: ["Route 53 failover routing policy switches DNS when primary health check fails", "RDS cross-region read replica can be promoted to primary in ~5 min", "Use AWS Aurora Global Database for sub-second RPO"],
    keywords: ["route 53", "failover", "rto", "rpo", "rds", "aurora", "cross-region", "s3 replication", "health check", "dns", "active-passive"],
  },
  {
    id: 512, type: "theory", difficulty: "Medium", time: "20 min",
    title: "When to use SQS vs SNS vs EventBridge?",
    track: "Cloud / DevOps", tags: ["AWS", "Messaging"],
    description: `Compare **Amazon SQS**, **SNS**, and **EventBridge**:

- SQS: point-to-point queue — when to use it?
- SNS: pub/sub fan-out — when to use it?
- EventBridge: event bus with routing rules — when does it add value over SNS?

Give a concrete architecture example using all three together.`,
    hints: ["SQS decouples producers from consumers and buffers load spikes", "SNS fan-out: one message → multiple SQS queues", "EventBridge shines for routing events based on content/source (cross-account, SaaS events)"],
    keywords: ["sqs", "sns", "eventbridge", "queue", "pub/sub", "fan-out", "routing", "decoupling", "fifo", "dlq"],
  },
  {
    id: 513, type: "theory", difficulty: "Easy", time: "15 min",
    title: "Explain IAM roles vs IAM users and best practices",
    track: "Cloud / DevOps", tags: ["AWS", "Security"],
    description: `Explain the difference between **IAM users**, **IAM roles**, and **IAM groups** in AWS.

- When should an EC2 instance use a role instead of an access key?
- What is the principle of least privilege?
- What are common IAM security mistakes?`,
    hints: ["Roles are assumed temporarily and provide short-lived credentials — safer than long-lived access keys", "Never embed access keys in code; use instance profiles or IRSA", "Use IAM conditions to restrict by IP, MFA, or time"],
    keywords: ["iam", "role", "user", "group", "policy", "principle of least privilege", "access key", "instance profile", "assume role", "mfa"],
  },
  {
    id: 521, type: "theory", difficulty: "Medium", time: "25 min",
    title: "Design a CI/CD pipeline with GitHub Actions",
    track: "Cloud / DevOps", tags: ["CI/CD"],
    description: `Design a production-grade **CI/CD pipeline** using GitHub Actions for a Node.js application.

Include stages: lint → unit tests → build → Docker image → push to registry → deploy to staging → smoke test → deploy to production.

How do you handle secrets, rollbacks, and environment promotion?`,
    hints: ["Use GitHub Secrets for credentials; never hardcode", "Require manual approval step before production deploy", "docker/build-push-action handles building and pushing images"],
    keywords: ["github actions", "workflow", "ci/cd", "lint", "test", "docker", "registry", "staging", "production", "secrets", "rollback"],
  },
  {
    id: 522, type: "theory", difficulty: "Medium", time: "15 min",
    title: "Blue/Green vs Canary deployment strategies",
    track: "Cloud / DevOps", tags: ["Deployment"],
    description: `Compare **Blue/Green** and **Canary** deployment strategies.

- How does each work mechanically?
- What are the trade-offs in cost, risk, and rollback speed?
- When would you use a canary over blue/green?`,
    hints: ["Blue/Green: two identical environments, instant DNS switch, instant rollback", "Canary: gradually route % of traffic to new version, watch metrics", "Canary is lower risk for large user bases; blue/green needs double infrastructure"],
    keywords: ["blue/green", "canary", "traffic split", "rollback", "dns", "deployment", "risk", "infrastructure cost", "feature flag"],
  },

  // ─── QA ──────────────────────────────────────────────────────────────────────

  {
    id: 601, type: "theory", difficulty: "Easy", time: "15 min",
    title: "What is the testing pyramid? Explain each layer.",
    track: "QA / Testing", tags: ["Fundamentals"],
    description: `Explain the **testing pyramid** and what each layer represents:

- Unit tests
- Integration tests
- End-to-end (E2E) tests

Why should the pyramid be widest at the bottom? What is the "ice cream cone" anti-pattern?`,
    hints: ["Unit tests: fast, isolated, cheap — you should have many", "E2E tests: slow, brittle, expensive — use sparingly for critical paths", "Ice cream cone = inverted pyramid: too many E2E, few unit tests — expensive and flaky"],
    keywords: ["unit test", "integration test", "e2e", "pyramid", "fast", "isolated", "brittle", "ice cream cone", "cost", "coverage"],
  },
  {
    id: 602, type: "theory", difficulty: "Easy", time: "10 min",
    title: "Difference between regression and smoke testing",
    track: "QA / Testing", tags: ["Fundamentals"],
    description: `Compare **regression testing** and **smoke testing**:

- What is the purpose of each?
- When in the release cycle do you run each?
- What is a sanity test, and how does it differ from a smoke test?`,
    hints: ["Smoke test = quick check that the build is stable enough to test further", "Regression = full suite to ensure new changes haven't broken existing functionality", "Sanity = focused check on a specific new feature or bug fix"],
    keywords: ["smoke test", "regression test", "sanity test", "build", "release", "stability", "existing functionality", "new changes"],
  },
  {
    id: 603, type: "theory", difficulty: "Medium", time: "20 min",
    title: "How do you prioritize test cases under time pressure?",
    track: "QA / Testing", tags: ["Test Strategy"],
    description: `Your team has 2 days to test a release but the full test suite takes 5 days. How do you decide which tests to run?

Cover: risk-based testing, critical path coverage, requirements traceability, and how you communicate the risk of incomplete coverage to stakeholders.`,
    hints: ["Prioritize tests for new/changed code + highest business impact features", "Use a risk matrix: probability × impact", "Document explicitly what's NOT tested and get stakeholder sign-off"],
    keywords: ["risk-based testing", "priority", "critical path", "traceability", "coverage", "stakeholder", "impact", "probability", "regression", "time pressure"],
  },
  {
    id: 611, type: "theory", difficulty: "Medium", time: "25 min",
    title: "Selenium Page Object Model",
    track: "QA / Testing", tags: ["Automation"],
    description: `Explain the **Page Object Model (POM)** design pattern for Selenium.

- What problem does it solve (code duplication, fragility)?
- Walk through the structure: page class, locators, action methods.
- How does POM differ from Page Factory?`,
    hints: ["POM separates test logic from UI interaction code", "Each page has a class with locators and methods (loginPage.enterPassword())", "Changes to UI only require updating one class, not every test"],
    keywords: ["page object model", "pom", "selenium", "locator", "abstraction", "reuse", "maintainability", "page factory", "test logic"],
  },
  {
    id: 612, type: "theory", difficulty: "Medium", time: "15 min",
    title: "Cypress vs Playwright — tradeoffs?",
    track: "QA / Testing", tags: ["Automation"],
    description: `Compare **Cypress** and **Playwright** for E2E test automation:

- Architecture differences (same vs different process)
- Browser support
- Parallelization and CI integration
- When would you choose one over the other?`,
    hints: ["Cypress runs in the browser (same process) — easier debugging but limited multi-tab support", "Playwright supports Chrome, Firefox, Safari and multi-tab/multi-origin", "Playwright is better for complex scenarios; Cypress is better for developer-friendly quick setup"],
    keywords: ["cypress", "playwright", "browser support", "parallelization", "multi-tab", "ci", "architecture", "debugging", "webkit", "chromium"],
  },
  {
    id: 613, type: "theory", difficulty: "Medium", time: "20 min",
    title: "How do you handle flaky tests?",
    track: "QA / Testing", tags: ["Automation", "Best Practices"],
    description: `What are **flaky tests** and why are they dangerous to CI/CD pipelines?

Walk through your process for:
1. Detecting flaky tests (quarantine, retry analysis)
2. Root causes (timing, environment, test order dependency)
3. Fixing strategies (explicit waits, test isolation, idempotent setup)`,
    hints: ["Flaky = passes and fails without code changes — erodes trust in CI", "Root causes: implicit sleeps, shared state, network dependencies, race conditions", "Quarantine flaky tests so they don't block the pipeline while being fixed"],
    keywords: ["flaky", "quarantine", "retry", "timing", "explicit wait", "isolation", "idempotent", "race condition", "ci pipeline", "trust"],
  },
  {
    id: 621, type: "theory", difficulty: "Medium", time: "25 min",
    title: "Write Postman test scripts for an auth API",
    track: "QA / Testing", tags: ["API Testing"],
    description: `Walk through how you would test an authentication API (\`POST /login\`) using Postman:

- What **positive test cases** would you write?
- What **negative test cases** (invalid creds, empty fields, SQL injection)?
- How do you chain requests (login → use token → call protected endpoint)?
- How do you run these in a CI pipeline with Newman?`,
    hints: ["Positive: valid credentials → 200 + token", "Negative: wrong password → 401, missing body → 400, locked account → 403", "Postman environment variables store the token for subsequent requests"],
    keywords: ["postman", "api test", "positive", "negative", "auth", "token", "chaining", "newman", "ci", "environment variable", "status code"],
  },
  {
    id: 622, type: "theory", difficulty: "Easy", time: "15 min",
    title: "Explain load testing vs stress testing vs spike testing",
    track: "QA / Testing", tags: ["Performance Testing"],
    description: `Compare **load**, **stress**, and **spike** testing:

- What is the goal of each?
- How do the traffic patterns differ?
- What tools would you use (k6, JMeter, Locust)?
- What metrics do you watch?`,
    hints: ["Load test = expected traffic, verify performance meets SLAs", "Stress test = push beyond capacity to find breaking point", "Spike test = sudden burst, see how system handles and recovers"],
    keywords: ["load test", "stress test", "spike test", "k6", "jmeter", "locust", "throughput", "latency", "p99", "breaking point", "recovery"],
  },

  // ─── FULL STACK ───────────────────────────────────────────────────────────────

  {
    id: 701, type: "theory", difficulty: "Medium", time: "15 min",
    title: "React reconciliation and virtual DOM",
    track: "Full Stack", tags: ["React", "Frontend"],
    description: `Explain React's **reconciliation** algorithm and the role of the virtual DOM.

- How does React diff two virtual DOM trees?
- What is the role of \`key\` props in lists?
- What changed in React Fiber?`,
    hints: ["React assumes elements of different types produce different trees (O(n) heuristic)", "Keys help React identify which items changed in a list without remounting all", "Fiber: incremental rendering — can pause, abort, reuse work"],
    keywords: ["reconciliation", "virtual dom", "diffing", "fiber", "key", "re-render", "incremental", "heuristic", "component type"],
  },
  {
    id: 702, type: "theory", difficulty: "Easy", time: "10 min",
    title: "Explain CSS specificity and the cascade",
    track: "Full Stack", tags: ["CSS", "Frontend"],
    description: `Explain how CSS **specificity** is calculated and how the **cascade** resolves conflicts.

- What is the specificity order (inline > ID > class > element)?
- How does \`!important\` override specificity?
- What is the difference between specificity and inheritance?`,
    hints: ["Specificity: 0-0-0-0 (inline, ID, class, element)", "Two rules with equal specificity: last one wins (cascade)", "Inheritance: color/font inherit by default; margin/padding do not"],
    keywords: ["specificity", "cascade", "inline", "id", "class", "element", "important", "inheritance", "override", "selector"],
  },
  {
    id: 703, type: "theory", difficulty: "Hard", time: "30 min",
    title: "Optimize a React app with 10k list items",
    track: "Full Stack", tags: ["React", "Performance"],
    description: `A React component renders a list of 10,000 items and scrolls sluggishly. Walk through your optimization process.

Cover: virtualization (react-window), memoization (useMemo, React.memo, useCallback), pagination vs infinite scroll, and profiling with React DevTools.`,
    hints: ["Virtual list: only render visible items (~20 rows) regardless of list size", "React.memo prevents re-renders when props haven't changed", "Profile first — don't optimize blindly; identify the actual bottleneck"],
    keywords: ["virtualization", "react-window", "memo", "usememo", "usecallback", "profiler", "lazy load", "pagination", "infinite scroll", "render"],
  },
  {
    id: 711, type: "theory", difficulty: "Medium", time: "15 min",
    title: "REST vs GraphQL — when to choose what?",
    track: "Full Stack", tags: ["API Design"],
    description: `Compare **REST** and **GraphQL** APIs:

- Over-fetching and under-fetching in REST
- How GraphQL's single endpoint and query language solves this
- N+1 problem in GraphQL and how DataLoader solves it
- When REST is still the better choice`,
    hints: ["GraphQL shines when clients have diverse data needs (mobile vs web)", "N+1: each item in a list triggers a separate DB query — DataLoader batches these", "REST is simpler for public APIs, caching (HTTP), and teams unfamiliar with GraphQL"],
    keywords: ["rest", "graphql", "over-fetching", "under-fetching", "n+1", "dataloader", "single endpoint", "query", "mutation", "caching"],
  },
  {
    id: 712, type: "theory", difficulty: "Hard", time: "35 min",
    title: "Design an authentication flow with JWT + refresh tokens",
    track: "Full Stack", tags: ["Auth", "Security"],
    description: `Walk through a secure **JWT authentication flow** with short-lived access tokens and long-lived refresh tokens.

- Where do you store each token (httpOnly cookie vs localStorage)?
- How do you handle token rotation and refresh?
- How do you invalidate tokens on logout?
- What are common JWT security pitfalls?`,
    hints: ["Access token: 15 min TTL, in memory or httpOnly cookie", "Refresh token: httpOnly cookie only — never localStorage (XSS risk)", "Token rotation: issue a new refresh token on each refresh, invalidate old one"],
    keywords: ["jwt", "access token", "refresh token", "httponlycookie", "localstorage", "xss", "rotation", "invalidation", "expiry", "security"],
  },
  {
    id: 713, type: "theory", difficulty: "Medium", time: "20 min",
    title: "SQL N+1 problem — how to detect and fix?",
    track: "Full Stack", tags: ["Database", "Performance"],
    description: `Explain the **N+1 query problem** in ORMs and APIs.

- Walk through a concrete example (loading posts + their authors)
- How do you detect it in production (query logs, APM)?
- How do you fix it (eager loading, JOINs, DataLoader)?`,
    hints: ["N+1: 1 query to get N records + N queries to fetch related data for each record", "Eager loading (include/preload) fetches everything in 1-2 queries", "DataLoader batches and deduplicates queries in a single tick"],
    keywords: ["n+1", "eager loading", "lazy loading", "join", "dataloader", "orm", "query log", "batch", "include", "preload"],
  },

  // ─── BACKEND ─────────────────────────────────────────────────────────────────

  {
    id: 801, type: "theory", difficulty: "Medium", time: "20 min",
    title: "Design idempotent REST endpoints",
    track: "Backend", tags: ["API Design"],
    description: `Explain **idempotency** in REST APIs.

- Which HTTP methods are idempotent by spec (GET, PUT, DELETE)?
- Why is POST not idempotent, and how do you make it so?
- Walk through using an **idempotency key** header for payment APIs.`,
    hints: ["POST /payments called twice should not charge twice — use idempotency key", "Store idempotency key + result in Redis with TTL; return cached result on duplicate", "PUT is idempotent; PATCH may not be"],
    keywords: ["idempotent", "get", "put", "delete", "post", "idempotency key", "payment", "redis", "duplicate", "cache"],
  },
  {
    id: 802, type: "theory", difficulty: "Medium", time: "15 min",
    title: "Versioning strategy for a public API",
    track: "Backend", tags: ["API Design"],
    description: `Compare strategies for **versioning a public REST API**:

1. URL versioning (\`/v1/users\`)
2. Header versioning (\`Accept: application/vnd.api.v2+json\`)
3. Query param versioning (\`?version=2\`)

What are the trade-offs? How do you deprecate old versions gracefully?`,
    hints: ["URL versioning is most visible and easy to test in a browser", "Header versioning is cleaner but harder to cache and test", "Sunset header warns clients of deprecation with a date"],
    keywords: ["versioning", "url", "header", "query param", "deprecation", "sunset", "breaking change", "backward compatible", "client"],
  },
  {
    id: 811, type: "theory", difficulty: "Easy", time: "15 min",
    title: "When to use SQL vs NoSQL?",
    track: "Backend", tags: ["Databases"],
    description: `Compare **SQL (relational)** and **NoSQL** databases.

When do you choose each? Cover: data structure, consistency requirements, scale patterns, and query flexibility.

Give an example of a system that would use both.`,
    hints: ["SQL: structured data, complex joins, ACID transactions (banking, e-commerce orders)", "NoSQL: flexible schema, horizontal scale, high write throughput (user sessions, product catalog)", "Many production systems use both — polyglot persistence"],
    keywords: ["sql", "nosql", "relational", "acid", "schema", "horizontal scale", "join", "flexibility", "cap theorem", "polyglot persistence"],
  },
  {
    id: 812, type: "theory", difficulty: "Medium", time: "20 min",
    title: "Explain database indexing and its tradeoffs",
    track: "Backend", tags: ["Databases", "Performance"],
    description: `Explain how **B-Tree indexes** work and their impact on query performance.

- How does an index speed up reads? (Avoid full table scan)
- How does it slow down writes? (Index maintenance)
- What is a covering index?
- When should you NOT add an index?`,
    hints: ["B-Tree: balanced tree where each leaf points to actual row(s)", "Covering index: all columns in the query are in the index — no table lookup needed", "Avoid indexing low-cardinality columns (e.g., boolean) — poor selectivity"],
    keywords: ["b-tree", "index", "full table scan", "write overhead", "covering index", "selectivity", "cardinality", "composite index", "query planner"],
  },
  {
    id: 813, type: "theory", difficulty: "Hard", time: "30 min",
    title: "Implement optimistic vs pessimistic locking",
    track: "Backend", tags: ["Databases", "Concurrency"],
    description: `Compare **optimistic** and **pessimistic** locking strategies for handling concurrent database updates.

- When does each make sense?
- How do you implement optimistic locking with a \`version\` column?
- What is a deadlock and how does pessimistic locking cause them?`,
    hints: ["Optimistic: no lock, check version at commit time; retry on conflict — good for low contention", "Pessimistic: lock the row immediately (SELECT FOR UPDATE) — good for high contention", "Deadlock: two transactions wait for each other's lock — detected and rolled back by DB"],
    keywords: ["optimistic locking", "pessimistic locking", "version column", "select for update", "conflict", "retry", "deadlock", "concurrency", "transaction"],
  },

  // ─── PRODUCT MANAGER ─────────────────────────────────────────────────────────

  {
    id: 901, type: "theory", difficulty: "Medium", time: "20 min",
    title: "How would you improve YouTube's homepage?",
    track: "Product Manager", tags: ["Product Sense"],
    description: `You are the PM for YouTube's homepage. Walk through how you would identify and prioritize improvements.

Cover: clarifying the goal, user segmentation, pain points, generating solutions, defining success metrics, and how you'd validate your hypothesis.`,
    hints: ["Clarify: improve for which metric? Watch time? New user retention?", "Segment users: new vs returning, casual vs power users", "Success metrics: CTR on recommendations, session length, D7 retention"],
    keywords: ["goal", "user segment", "pain point", "hypothesis", "metric", "watch time", "retention", "recommendation", "validation", "prioritization"],
  },
  {
    id: 902, type: "theory", difficulty: "Medium", time: "15 min",
    title: "Define success metrics for a new feature launch",
    track: "Product Manager", tags: ["Metrics"],
    description: `You are launching a **dark mode** feature for a social app. Define the success metrics.

Cover: primary metric, guardrail metrics, leading vs lagging indicators, and how long you would wait before declaring success or failure.`,
    hints: ["Primary: adoption rate (% of users who enable dark mode)", "Guardrail: ensure dark mode users don't have lower engagement than light mode", "Leading indicator: feature toggle rate; lagging: 30-day retention"],
    keywords: ["primary metric", "guardrail", "leading", "lagging", "adoption", "engagement", "retention", "experiment", "success criterion"],
  },
  {
    id: 903, type: "theory", difficulty: "Hard", time: "25 min",
    title: "How do you prioritize a backlog with competing stakeholders?",
    track: "Product Manager", tags: ["Prioritization"],
    description: `You have 20 backlog items and 4 stakeholders each insisting their items are top priority. How do you prioritize?

Walk through a framework (RICE, MoSCoW, or value/effort matrix) and explain how you communicate decisions to disappointed stakeholders.`,
    hints: ["RICE: Reach × Impact × Confidence / Effort — gives a numeric score", "Separate the 'what' (priority decision) from the 'why' (data/strategy)", "Async written decisions reduce meeting overhead and create a paper trail"],
    keywords: ["rice", "moscow", "value", "effort", "stakeholder", "framework", "communicate", "data-driven", "tradeoff", "roadmap"],
  },
  {
    id: 911, type: "theory", difficulty: "Hard", time: "25 min",
    title: "Daily Active Users dropped 10% — root cause analysis",
    track: "Product Manager", tags: ["Metrics", "Analytics"],
    description: `DAU dropped 10% week-over-week. Walk through your root cause analysis framework.

Cover: ruling out data/tracking issues first, segmenting by platform/region/user type, checking recent releases/marketing, and how you communicate findings to leadership.`,
    hints: ["First: is the data correct? Check tracking, pipeline, timezone issues", "Segment: is it iOS only? New users? A specific region?", "Timeline: correlate with recent deploys, marketing changes, external events"],
    keywords: ["dau", "root cause", "segment", "platform", "region", "tracking issue", "deploy", "marketing", "funnel", "cohort"],
  },
  {
    id: 912, type: "theory", difficulty: "Medium", time: "20 min",
    title: "How do you run an A/B test as a PM?",
    track: "Product Manager", tags: ["Experimentation"],
    description: `Walk through how you would design and run an A/B test as a PM for a new checkout flow.

Cover: hypothesis, control vs treatment, sample size calculation, duration, guardrail metrics, and how you make the ship/no-ship decision.`,
    hints: ["Hypothesis: changing the CTA button to green will increase checkout completion by 5%", "Pre-calculate sample size based on baseline rate and MDE before starting", "Don't peek early — let the test run to its planned end"],
    keywords: ["hypothesis", "control", "treatment", "sample size", "mde", "significance", "guardrail", "ship decision", "duration", "peeking"],
  },

  // ─── CYBERSECURITY ────────────────────────────────────────────────────────────

  {
    id: 1001, type: "theory", difficulty: "Medium", time: "25 min",
    title: "Explain OWASP Top 10 with examples",
    track: "Cybersecurity", tags: ["Application Security"],
    description: `Explain at least **5 of the OWASP Top 10** vulnerabilities with a concrete example and mitigation for each.

Include:
- Injection (SQL, command)
- Broken authentication
- XSS
- Insecure direct object reference (IDOR)
- Security misconfiguration`,
    hints: ["SQL injection: unsanitized user input in a query — fix: parameterized queries", "IDOR: /api/orders/123 — fix: check ownership before returning data", "XSS: injected script runs in victim's browser — fix: output encoding + CSP"],
    keywords: ["owasp", "sql injection", "xss", "idor", "authentication", "misconfiguration", "parameterized", "output encoding", "csp", "authorization"],
  },
  {
    id: 1002, type: "theory", difficulty: "Easy", time: "15 min",
    title: "How does SQL injection work? How to prevent it?",
    track: "Cybersecurity", tags: ["Application Security"],
    description: `Walk through a **SQL injection attack** step by step.

1. Show a vulnerable query
2. Show how an attacker can extract data or bypass auth
3. Show the fix using parameterized queries / prepared statements
4. What is second-order SQL injection?`,
    hints: ["Vulnerable: SELECT * FROM users WHERE user = '\" + input + \"'", "Attack: input = ' OR '1'='1 bypasses auth", "Fix: use ?/$ placeholders — DB treats input as data, not SQL"],
    keywords: ["sql injection", "parameterized query", "prepared statement", "input", "sanitize", "second-order", "bypass", "auth", "union"],
  },
  {
    id: 1003, type: "theory", difficulty: "Medium", time: "20 min",
    title: "Describe a CSRF attack and mitigation",
    track: "Cybersecurity", tags: ["Application Security"],
    description: `Explain a **Cross-Site Request Forgery (CSRF)** attack:

1. How does it work? (browser auto-sends cookies)
2. Walk through a concrete attack scenario (bank transfer)
3. Mitigations: CSRF token, SameSite cookie attribute, checking Origin/Referer header`,
    hints: ["CSRF exploits the fact that browsers automatically include cookies for a domain", "Victim visits attacker's page which submits a form to bank.com — session cookie is included", "SameSite=Strict prevents cookies being sent with cross-site requests"],
    keywords: ["csrf", "cross-site", "cookie", "samesite", "csrf token", "origin header", "referer", "forged request", "session"],
  },
  {
    id: 1011, type: "theory", difficulty: "Medium", time: "20 min",
    title: "TLS handshake — step by step",
    track: "Cybersecurity", tags: ["Network Security", "Cryptography"],
    description: `Walk through the **TLS 1.3 handshake** step by step.

- What cryptographic operations happen?
- How is the session key established without transmitting it?
- What is Perfect Forward Secrecy (PFS) and why does TLS 1.3 mandate it?`,
    hints: ["TLS 1.3: 1-RTT handshake — ClientHello + KeyShare, ServerHello + Certificate + Finished", "ECDHE key exchange: both sides generate ephemeral keys, compute shared secret — never transmitted", "PFS: even if the server's private key leaks later, past sessions can't be decrypted"],
    keywords: ["tls", "handshake", "ecdhe", "key exchange", "certificate", "session key", "forward secrecy", "symmetric", "asymmetric", "1-rtt"],
  },
  {
    id: 1012, type: "theory", difficulty: "Hard", time: "30 min",
    title: "Zero Trust Architecture — principles and implementation",
    track: "Cybersecurity", tags: ["Network Security", "Architecture"],
    description: `Explain **Zero Trust Architecture** and how it differs from the traditional perimeter security model.

Cover:
1. Core principle: "never trust, always verify"
2. Microsegmentation
3. Identity-based access (BeyondCorp, ZTNA)
4. How you would migrate a legacy network to Zero Trust`,
    hints: ["Traditional: trust everything inside the firewall — breach one machine and you're in", "Zero Trust: every request is authenticated and authorized regardless of network location", "Implementation: strong identity (MFA), least-privilege access, encrypted internal traffic"],
    keywords: ["zero trust", "never trust always verify", "microsegmentation", "identity", "mfa", "beyondcorp", "ztna", "perimeter", "lateral movement"],
  },

  // ─── BUSINESS ANALYST ────────────────────────────────────────────────────────

  {
    id: 1101, type: "theory", difficulty: "Medium", time: "20 min",
    title: "How do you elicit requirements from stakeholders?",
    track: "Business Analyst", tags: ["Requirements"],
    description: `Walk through your process for eliciting and documenting requirements from non-technical stakeholders.

Cover: discovery workshops, interviews, observation, use cases, user stories, acceptance criteria, and getting sign-off.`,
    hints: ["Start with 'what problem are we solving?' not 'what features do you want?'", "Use open-ended questions to surface implicit requirements", "Document decisions and assumptions — get written sign-off"],
    keywords: ["elicitation", "requirements", "user stories", "acceptance criteria", "stakeholder", "workshop", "interview", "sign-off", "use case", "assumption"],
  },
  {
    id: 1102, type: "theory", difficulty: "Easy", time: "15 min",
    title: "Write a use case for an ATM withdrawal",
    track: "Business Analyst", tags: ["Requirements", "Use Cases"],
    description: `Write a formal **use case** for "Withdraw Cash from an ATM".

Include: actor, preconditions, main flow, alternative flows (insufficient funds, wrong PIN), postconditions, and exceptions.`,
    hints: ["Actor: Customer, ATM System, Bank Backend", "Main flow: insert card → enter PIN → select amount → dispense cash → update balance", "Alternative flow: insufficient funds → display message, offer different amount"],
    keywords: ["use case", "actor", "precondition", "main flow", "alternative flow", "postcondition", "exception", "atm", "formal specification"],
  },
  {
    id: 1103, type: "theory", difficulty: "Easy", time: "10 min",
    title: "Functional vs Non-functional requirements — examples",
    track: "Business Analyst", tags: ["Requirements"],
    description: `Explain the difference between **functional** and **non-functional requirements** with 3 examples of each from a real application (e.g., an e-commerce checkout system).

What happens when non-functional requirements are ignored?`,
    hints: ["Functional: what the system does (user can add item to cart)", "Non-functional: how well it does it (checkout page loads in < 2s)", "Ignored NFRs lead to: slow pages, security breaches, unscalable systems"],
    keywords: ["functional", "non-functional", "performance", "security", "usability", "scalability", "requirement", "nfr", "constraint"],
  },
  {
    id: 1111, type: "theory", difficulty: "Medium", time: "25 min",
    title: "Create a BPMN diagram for an order fulfillment process",
    track: "Business Analyst", tags: ["Process Modeling"],
    description: `Describe (or draw textually) a **BPMN process diagram** for an e-commerce order fulfillment process from customer order to delivery.

Cover: pools/lanes, tasks, gateways (exclusive, parallel), events (start, intermediate, end), and how you handle the exception path (out of stock).`,
    hints: ["Pools: Customer, Order Management System, Warehouse, Shipping", "Exclusive gateway: in stock? → Yes: pick & pack → No: notify customer", "Parallel gateway: payment verification and stock check can happen in parallel"],
    keywords: ["bpmn", "pool", "lane", "gateway", "exclusive", "parallel", "task", "event", "process", "exception path", "fulfillment"],
  },
  {
    id: 1112, type: "theory", difficulty: "Medium", time: "20 min",
    title: "AS-IS vs TO-BE process mapping",
    track: "Business Analyst", tags: ["Process Modeling"],
    description: `Explain the **AS-IS / TO-BE process mapping** technique:

- What is the purpose of each?
- How do you identify improvement opportunities when comparing them?
- What is a gap analysis in this context?
- Walk through a real example (e.g., manual invoice processing → automated).`,
    hints: ["AS-IS: documents current state — often reveals hidden inefficiencies and pain points", "TO-BE: the desired future state after improvement", "Gap = difference between AS-IS and TO-BE; gap analysis prioritizes what to change first"],
    keywords: ["as-is", "to-be", "current state", "future state", "gap analysis", "process improvement", "pain point", "automation", "inefficiency"],
  },

  // ─── BEHAVIORAL ──────────────────────────────────────────────────────────────

  {
    id: 1201, type: "theory", difficulty: "Medium", time: "10 min",
    title: "Tell me about a time you dealt with a difficult teammate",
    track: "Behavioral", tags: ["STAR", "Interpersonal"],
    description: `Using the **STAR method** (Situation, Task, Action, Result), describe a specific time you worked with a difficult teammate.

Focus on: what made the situation challenging, the concrete steps you took, and the measurable outcome. Avoid vague or hypothetical answers.`,
    hints: ["Be specific — name a real project and the nature of the difficulty", "Focus on your actions, not the other person's flaws", "End with a clear result: relationship improved, project delivered, lesson learned"],
    keywords: ["situation", "task", "action", "result", "conflict", "communication", "specific", "outcome", "relationship", "lesson"],
  },
  {
    id: 1202, type: "theory", difficulty: "Medium", time: "10 min",
    title: "Describe a project where you failed — what did you learn?",
    track: "Behavioral", tags: ["STAR", "Self-Awareness"],
    description: `Describe a **professional failure** using the STAR method.

This question tests self-awareness and growth mindset. Interviewers want to see:
- A real failure (not a humble-brag like "I worked too hard")
- Ownership without excessive self-blame
- A concrete lesson you applied afterward`,
    hints: ["Choose a real failure with real consequences", "Own your specific contribution to the failure — don't blame external factors entirely", "The 'Result' here is what you learned and how you changed"],
    keywords: ["failure", "ownership", "lesson", "growth", "self-awareness", "accountability", "improved", "changed", "mistake"],
  },
  {
    id: 1203, type: "theory", difficulty: "Easy", time: "10 min",
    title: "Tell me about a time you took initiative",
    track: "Behavioral", tags: ["STAR", "Leadership"],
    description: `Describe a time you **proactively identified a problem or opportunity** and took action without being asked.

Show: what you noticed, why others hadn't acted, what you specifically did, and the impact.`,
    hints: ["The initiative should be beyond your job description — that's what makes it stand out", "Quantify the impact where possible (saved X hours, increased Y by Z%)", "Show it wasn't a one-off — connect it to how you generally work"],
    keywords: ["initiative", "proactive", "identified", "opportunity", "impact", "beyond scope", "quantified", "self-directed"],
  },
  {
    id: 1204, type: "theory", difficulty: "Medium", time: "10 min",
    title: "How do you handle conflicting priorities?",
    track: "Behavioral", tags: ["STAR", "Time Management"],
    description: `Give a specific example of a time you had **multiple high-priority tasks** with conflicting deadlines.

Walk through: how you assessed urgency vs importance, how you communicated trade-offs to stakeholders, and what the outcome was.`,
    hints: ["Use a real example with two specific competing priorities", "Show structured thinking: Eisenhower matrix, stakeholder communication", "Outcome should show no tasks were dropped silently — you managed expectations"],
    keywords: ["priority", "deadline", "stakeholder", "communication", "trade-off", "urgency", "importance", "outcome", "manage expectations"],
  },
  {
    id: 1211, type: "theory", difficulty: "Medium", time: "10 min",
    title: "Describe your leadership style with an example",
    track: "Behavioral", tags: ["Leadership"],
    description: `Describe your **leadership style** and give a concrete example that demonstrates it.

- Are you directive, coaching, delegating, or situational?
- How do you adapt your style for different team members?
- What is one leadership weakness you are actively improving?`,
    hints: ["Name your style but show nuance — 'I adapt based on the person's experience level'", "The example should show impact on the team, not just your personal contribution", "Admitting a weakness shows maturity — pair it with what you're doing to improve"],
    keywords: ["leadership", "style", "coaching", "delegate", "situational", "adapt", "team", "impact", "weakness", "growth"],
  },
  {
    id: 1212, type: "theory", difficulty: "Easy", time: "10 min",
    title: "How do you give constructive feedback?",
    track: "Behavioral", tags: ["Leadership", "Communication"],
    description: `Walk through how you give **constructive feedback** to a peer or direct report.

Use a specific example. Show: the situation, how you framed the feedback, how the recipient responded, and what changed.`,
    hints: ["SBI model: Situation → Behavior → Impact (avoids personal attacks)", "Give feedback promptly and privately", "End with a question: 'What support do you need?' — turns critique into collaboration"],
    keywords: ["feedback", "constructive", "sbi", "situation behavior impact", "timely", "private", "specific", "improvement", "response"],
  },
  {
    id: 1213, type: "theory", difficulty: "Easy", time: "10 min",
    title: "Where do you see yourself in 5 years?",
    track: "Behavioral", tags: ["Career"],
    description: `Answer the classic "**Where do you see yourself in 5 years?**" question in a way that:

- Shows ambition without being unrealistic
- Aligns your goals with the company's direction
- Demonstrates you've thought about the role and growth path`,
    hints: ["Don't say 'in your position' (too aggressive) or 'I don't know' (unprepared)", "Connect your growth to the company's mission — shows you've researched them", "Be honest about skill areas you want to develop"],
    keywords: ["growth", "ambition", "company alignment", "skills", "career path", "realistic", "contribution", "long-term"],
  },
];

// Build a lookup map for O(1) access
export const QUESTIONS: Record<number, FullQuestion> = {};
for (const q of QUESTIONS_LIST) {
  QUESTIONS[q.id] = q;
}

export function getQuestion(id: number): FullQuestion | null {
  return QUESTIONS[id] ?? null;
}

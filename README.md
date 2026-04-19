# PrepIt — Ace Every Interview

> AI-powered interview preparation platform covering 20+ tech roles. Practice questions, mock interviews, live IDE, global leaderboard, and AI feedback — all in one place.

---

## What is PrepIt?

PrepIt is a full-stack SaaS platform that helps software engineers and tech professionals prepare for interviews. It combines:

- **AI question generation** from job descriptions (paste JD → get targeted questions)
- **20+ tech tracks**: SDE, Data Science, ML/AI, Data Engineering, Cloud/DevOps, QA, Full Stack, Backend, Business Analyst, Product Manager, SAP/ERP, Cybersecurity, Behavioral, DBMS, and more
- **In-browser IDE** with Monaco editor + Judge0 code execution (40+ languages)
- **AI mock interviewer** with per-answer scoring, follow-ups, and feedback
- **Global leaderboard** with XP, streaks, and rank tracking
- **Performance analytics** with skill radar chart highlighting weak areas
- **Affiliate course recommendations** after weak-area detection (Udemy, Coursera)
- **Google AdSense** for free users — non-intrusive, never during active interview/coding

### Monetization
| Plan | Price | Notes |
|------|-------|-------|
| Free | $0 | 20 questions/day, basic AI, ads shown |
| Pro | $9/month | Unlimited, full AI, mock interviews, no ads |
| Team | $29/month | 5 seats, admin dashboard, custom question banks |

---

## Tech Stack (100% free/open-source to start)

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.4 (App Router) |
| UI | Tailwind CSS v4, Framer Motion, Lucide React |
| Charts | Recharts |
| Editor | Monaco Editor (`@monaco-editor/react`) |
| Auth + DB | Supabase (PostgreSQL) |
| Code Execution | Judge0 CE (self-hosted or RapidAPI) |
| AI | Anthropic Claude API |
| Hosting | Vercel (free tier) |

---

## Project Structure

```
prepit/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout (SEO metadata)
│   ├── globals.css                 # Dark theme, glass utilities, animations
│   │
│   ├── auth/
│   │   ├── sign-in/page.tsx        # Email + GitHub OAuth sign-in
│   │   └── sign-up/page.tsx        # 2-step: credentials → track selection
│   │
│   ├── dashboard/
│   │   ├── layout.tsx              # Sidebar + header shell
│   │   └── page.tsx                # Stats, activity chart, quick actions, recent questions
│   │
│   ├── practice/
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Question browser with filters + search
│   │   └── [id]/
│   │       ├── layout.tsx          # Full-height (no scroll) for editor
│   │       └── page.tsx            # Split-pane: problem description + Monaco editor + AI feedback
│   │
│   ├── interview/
│   │   ├── layout.tsx
│   │   ├── page.tsx                # 3-step wizard: role/type/JD → ready screen
│   │   └── session/
│   │       ├── layout.tsx
│   │       └── page.tsx            # Live interview: timer, questions, AI scoring, results
│   │
│   ├── ide/
│   │   ├── layout.tsx              # Full-height layout (overflow-hidden, p-3)
│   │   └── page.tsx                # Monaco editor, 8 languages, output panel, AI hints
│   │
│   ├── leaderboard/
│   │   ├── layout.tsx
│   │   └── page.tsx                # Track tabs, podium top-3, full ranked table
│   │
│   ├── profile/
│   │   ├── layout.tsx
│   │   └── page.tsx                # Avatar, radar skill chart, achievements, settings tabs
│   │
│   └── settings/
│       ├── layout.tsx
│       └── page.tsx                # Notifications, Appearance, Privacy/Security, Billing plans
│
├── components/
│   ├── landing/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Tracks.tsx
│   │   ├── CTA.tsx
│   │   └── Footer.tsx
│   └── dashboard/
│       ├── Sidebar.tsx             # Collapsible sidebar, streak badge, active route highlight
│       └── DashboardHeader.tsx     # Search, notifications, user avatar
│
├── lib/
│   ├── utils.ts                    # cn() helper (clsx + tailwind-merge)
│   ├── supabase.ts                 # Typed Supabase client
│   └── judge0.ts                   # Code execution: LANGUAGE_IDS map + executeCode()
│
└── .env.local                      # API keys (never commit — see Environment Variables below)
```

---

## Environment Variables

Create `.env.local` at the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Judge0 (code execution)
NEXT_PUBLIC_JUDGE0_URL=https://judge0-ce.p.rapidapi.com   # or self-hosted
JUDGE0_API_KEY=your_rapidapi_key

# Anthropic (AI feedback)
ANTHROPIC_API_KEY=your_anthropic_api_key
```

---

## Getting Started

```bash
# 1. Clone
git clone <your-repo-url>
cd prepit

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Fill in the values above

# 4. Run dev server
npm run dev
# Opens at http://localhost:3000

# 5. Build for production
npm run build
```

---

## Current State (as of initial commit)

### Completed & Building Clean (14 routes, 0 TypeScript errors)
- Full landing page (Navbar, Hero, Features, HowItWorks, Tracks, CTA, Footer)
- Auth pages: Sign In + Sign Up (2-step with track selection) — UI complete, Supabase wiring TODO
- Dashboard with stats, weekly activity chart (Recharts), quick actions, recent questions
- Practice browser: topic/difficulty filters, search, question list, slide-in detail panel
- Practice question page (`/practice/[id]`): Monaco editor, run/submit, AI feedback panel, hints, solution tab
- Interview wizard (`/interview`): 3-step setup (role, JD paste, ready screen)
- Interview session (`/interview/session`): timed live interview, per-answer AI scoring, follow-ups, results screen
- IDE (`/ide`): Monaco editor, 8 languages, mock Judge0 execution, AI hints tab
- Leaderboard: track tabs, top-3 podium, full ranked table, "You" row highlighted
- Profile: skill radar chart, achievements, settings tabs
- Settings: notifications toggles, theme/language, security, billing plan cards (Free/Pro/Team)
- Collapsible sidebar with active route detection and streak badge

### Wired as Mock (TODO: connect real APIs)
| Feature | File | What to wire |
|---------|------|-------------|
| Sign in / Sign up | `app/auth/*/page.tsx` | Replace `setTimeout` redirects with Supabase `signIn` / `signUp` |
| Code execution | `app/ide/page.tsx`, `app/practice/[id]/page.tsx` | Replace mock `setTimeout` with `lib/judge0.ts` → `executeCode()` |
| AI feedback | `app/interview/session/page.tsx`, `app/practice/[id]/page.tsx` | Replace mock feedback with Claude API (`ANTHROPIC_API_KEY`) |
| Questions DB | `app/practice/page.tsx` | Replace hardcoded `questions[]` with Supabase query |
| Leaderboard | `app/leaderboard/page.tsx` | Replace hardcoded rankings with Supabase real-time query |
| XP / streaks | `components/dashboard/Sidebar.tsx` | Pull from Supabase `user_progress` table |

### Known Caveats
- **Lucide React v0.5+** removed social brand icons (`Github`, `Twitter`, `Linkedin`). Using `GitFork`, `X`, `Globe` as substitutes throughout.
- **Monaco Editor** requires `dynamic(() => import(...), { ssr: false })` — browser-only, no SSR.
- **Tailwind v4** — no `tailwind.config.ts`. All customization is in `app/globals.css` via `@theme` directive.
- **IDE + Practice `[id]` layouts** use `overflow-hidden` + `p-3` so Monaco fills full remaining height.
- All other layouts use `min-w-0` on the flex-1 child to prevent content overflow past the sidebar.

---

## Database Schema (Supabase)

```sql
-- Users (extended from Supabase auth.users)
create table users (
  id uuid references auth.users primary key,
  full_name text,
  track text,                    -- e.g. "Software Engineer"
  avatar_url text,
  xp integer default 0,
  streak integer default 0,
  last_active date,
  plan text default 'free'       -- 'free' | 'pro' | 'team'
);

-- Questions
create table questions (
  id serial primary key,
  title text not null,
  description text,
  difficulty text,               -- 'Easy' | 'Medium' | 'Hard'
  topic text,
  track text[],
  tags text[],
  starter_code jsonb,            -- { language: code }
  solution_code jsonb,
  created_at timestamptz default now()
);

-- User progress per question
create table user_progress (
  id serial primary key,
  user_id uuid references users(id),
  question_id integer references questions(id),
  status text,                   -- 'solved' | 'in-progress' | 'unsolved'
  score integer,
  attempts integer default 0,
  last_attempted timestamptz,
  unique(user_id, question_id)
);

-- Interview sessions
create table interviews (
  id serial primary key,
  user_id uuid references users(id),
  role text,
  jd_text text,
  questions jsonb,
  answers jsonb,
  scores jsonb,
  overall_score integer,
  completed_at timestamptz
);
```

---

## Roadmap

### Phase 3 — Backend Wiring
- [ ] Supabase auth (replace mock redirects)
- [ ] Real questions in DB + Supabase queries
- [ ] Judge0 integration for live code execution
- [ ] Claude API for real AI question generation + feedback
- [ ] XP / streak system updating on question solve

### Phase 4 — Growth Features
- [ ] JD-based question generation (paste JD → Claude generates targeted questions)
- [ ] Voice interview mode (Web Speech API + TTS)
- [ ] Affiliate course recommendations (post weak-area detection)
- [ ] Google AdSense placement (side panel, between sessions)
- [ ] Email reminders (daily streak alerts via Supabase Edge Functions)
- [ ] Company-specific question packs (Google, Amazon, Meta)

### Phase 5 — Monetization
- [ ] Stripe integration for Pro/Team subscriptions
- [ ] Usage-based limits enforcement (20 q/day for free tier)
- [ ] Team admin dashboard
- [ ] Custom question banks for Team plan

---

## Restart Guide (if you lose access to this account)

If you need to continue development with a new AI assistant or a fresh session:

1. **Clone this repo** and run `npm install`
2. **Read this README** top to bottom — it describes every file and what is built vs mocked
3. **Check `lib/judge0.ts`** and `lib/supabase.ts` for the API integration patterns already in place
4. **The mock data** (questions, users, leaderboard rankings) is hardcoded in the page files — search for `const questions =` or `const mockQuestions =` to find them
5. **Start from Phase 3** in the roadmap above — that is where real backend wiring begins
6. Tell the new AI assistant:

> *"This is PrepIt, an AI-powered interview prep SaaS. The full UI is complete across 14 routes — landing page, auth, dashboard, practice browser, question solver with Monaco editor, interview session with live AI scoring, IDE with 8 languages, leaderboard, profile, and settings. Everything currently uses mock data and setTimeout. Phase 3 is to wire in real APIs: Supabase auth, Judge0 code execution, and the Claude API for AI feedback. The README has the full project structure, DB schema, and integration map."*

---

## License

MIT — build freely, ship fast.

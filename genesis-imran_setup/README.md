# MindPulse

> Built with [Railtracks](https://railtracks.ai)

MindPulse is an AI-powered journaling app that listens between the lines. Users write freely — and when the app detects a pattern of struggle across multiple entries, it proactively surfaces real, nearby Toronto therapists and mental health resources. No prompting required. The agent notices. The agent acts.

Built for:
- **Sun Life** — Best Health Care Hack Using Agentic AI
- **Google** — Best AI for Community Impact
- **Railtracks** Bonus Award

---

## What It Does

1. **Write** a journal entry — freeform, private, no judgment
2. **AI analysis** runs automatically on save — emotion scores (joy, sadness, anxiety, anger, gratitude, calm, loneliness, hope) + a warm therapeutic reflection note
3. **After 3 consecutive struggling entries**, a Railtracks-powered agent proactively recommends 2–3 real Toronto therapists or crisis resources matched to the user's specific situation
4. **Book** — each recommendation has a direct call or website link the user can act on immediately
5. **Insights page** — mood trends, emotion patterns, and wellbeing metrics over time

The user never asks for help. The app notices they need it.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend & routing | Next.js 16 App Router + TypeScript |
| Styling | Tailwind CSS 4 |
| Auth & database | Supabase (PostgreSQL + Row-Level Security) |
| Emotion AI | GPT-OSS-120B via HuggingFace endpoint (OpenAI SDK) |
| Agentic recommendations | Railtracks + FastAPI (Python) |

---

## Project Structure

```
app/
  (auth)/           # Login, signup pages
  (protected)/      # Dashboard, journal, insights, profile
  actions.ts        # Server actions (auth, journal CRUD, AI calls)
components/
  auth/             # Auth form
  dashboard/        # Stats, entries list, emotion overview
  entries/          # Entry card, analysis panel, resource card
  insights/         # Mood trend chart, emotion patterns, wellbeing metrics
  layout/           # App shell, navigation
  profile/          # Profile summary
  ui/               # Shared UI primitives
lib/
  journal-ai.ts     # GPT emotion analysis (do not modify)
  journal-analysis.ts # Emotion scoring utilities + isStrugglingEntry()
  journal.ts        # Supabase data access
  recommend.ts      # Next.js → Railtracks service connector
hooks/
  use-journal-search.ts
railtracks-agent/
  agent.py          # Railtracks agent definition
  app.py            # FastAPI server
  resources.py      # Curated Toronto therapist/resource list
supabase/
  schema.sql        # Full database schema with RLS policies
types/
  database.ts       # Generated Supabase types
```

---

## Setup

### Prerequisites

- Node.js 20+
- Python 3.11+
- A Supabase account

### 1. Clone and install

```bash
npm install
```

### 2. Environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=your-key
```

### 3. Database schema

In your Supabase project, open **SQL Editor** and run the contents of `supabase/schema.sql`. This creates the `journal_entries` table, indexes, RLS policies, and the `analysis_recommendations` column.

### 4. Supabase Auth

In **Authentication → Providers → Email**, disable email confirmation for local dev if you want instant signup without inbox confirmation.

### 5. Run the app

**Terminal 1 — Next.js:**
```bash
npm run dev
```

**Terminal 2 — Railtracks agent:**
```bash
cd railtracks-agent
pip install -r requirements.txt
python -m uvicorn app:app --reload --port 8000
```

Open `http://localhost:3000`.

---

## How the Agentic Recommendation Works

The recommendation system is intentionally conservative — it only triggers after sustained struggle, not a single bad day.

1. On every journal save, `isStrugglingEntry()` checks if the emotion analysis shows sadness + anxiety + anger + loneliness ≥ 45% combined
2. If the current entry is struggling, the app fetches the 2 most recent previous entries
3. If all 3 are struggling, it calls the Railtracks agent at `POST /recommend`
4. The agent selects 2–3 resources from a curated Toronto therapist list matched to the entry's specific context
5. Recommendations are stored in `analysis_recommendations` (JSONB) and displayed as a soft card on the entry detail page

**The user never asked for help.** The agent noticed the pattern and acted.

---

## Demo Flow

1. Sign up and log in
2. Write a positive entry → emotion analysis appears, no recommendations
3. Write 3 consecutive struggling entries (e.g. *"I bombed my exam, I always fail, I feel so alone"*)
4. Open the 3rd entry → therapist recommendations appear automatically with booking links
5. Show the Insights page — mood trends and emotion patterns over time

---

## Deployment

- Deploy the Next.js app to **Vercel** — add the same env vars in project settings
- Deploy the Railtracks agent to any Python host (Railway, Render, Fly.io)
- Set `RAILTRACKS_URL` env var in Vercel to point to your deployed agent URL
- In Supabase Auth settings, add your production URL and `/auth/callback` as allowed redirect URLs

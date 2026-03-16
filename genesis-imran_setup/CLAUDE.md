# MindPulse (Quiet Journal) — AI Journaling Companion

Built with Railtracks

## Project Overview
An AI-powered journaling app where users write freely, and an AI agent analyzes entries for emotions, detects cognitive distortions, and **proactively recommends nearby Toronto therapists when it detects the user is struggling** — without the user ever asking for help.

## Target Categories
- (Sun Life) Best Health Care Hack Using Agentic AI
- (Google) Best AI for Community Impact
- Railtracks Bonus Award

## What Already Exists (DO NOT BREAK THESE)
The Next.js app is already built and working. DO NOT rewrite or restructure existing code. Only ADD to it.

Existing stack:
- **Next.js 16** App Router with TypeScript
- **Supabase** Auth + PostgreSQL with row-level security
- **OpenAI SDK** calling GPT-OSS-120B on HuggingFace endpoint
- **Tailwind CSS 4** for styling
- Login, signup, logout, protected routes
- Journal entry CRUD (create, read, delete)
- AI emotion analysis on save (joy, sadness, anxiety, anger, gratitude, calm, loneliness, hope)
- Therapeutic reflection note generation
- Dashboard with stats, entries list, search
- Insights page with mood trends, emotion patterns, wellbeing metrics
- Profile page

Existing AI lives in `lib/journal-ai.ts` — calls GPT-OSS-120B via OpenAI SDK, returns emotion scores + therapeutic note. This works. Don't touch it.

## What Needs to Be Added

### 1. Railtracks Python Microservice (for bonus award + agentic behavior)
A small Python FastAPI + Railtracks service that runs alongside the Next.js app. Its job: take an entry's text and emotion analysis, and if the user seems to be struggling, proactively recommend relevant Toronto therapists/resources.

**File structure to ADD in project root:**
```
railtracks-agent/
├── agent.py           # Railtracks agent definition
├── app.py             # FastAPI server
├── resources.py       # Curated Toronto therapist list
├── requirements.txt   # MUST include: railtracks, fastapi, uvicorn, python-dotenv
├── .env               # OPENAI_API_KEY=hackathon-key
└── pyproject.toml     # MUST include railtracks in dependencies
```

### 2. Railtracks Agent (`agent.py`)
```python
import railtracks as rt
from pydantic import BaseModel, Field
from typing import List
from dotenv import load_dotenv
from resources import TORONTO_RESOURCES
import os

load_dotenv()

model = rt.llm.OpenAICompatibleProvider(
    "openai/gpt-oss-120b",
    api_base="https://vjioo4r1vyvcozuj.us-east-2.aws.endpoints.huggingface.cloud/v1",
    api_key=os.getenv("OPENAI_API_KEY", "test"),
)

class Resource(BaseModel):
    name: str = Field(description="Name of the resource")
    type: str = Field(description="therapist, program, hotline, or clinic")
    description: str = Field(description="Why this resource matches what the user wrote")
    contact: str = Field(description="Phone number or website")

class RecommendationResult(BaseModel):
    should_recommend: bool = Field(description="True if the user seems to be struggling")
    reasoning: str = Field(description="Brief warm explanation")
    resources: List[Resource] = Field(description="2-3 relevant resources, empty if should_recommend is false")

RecommendationAgent = rt.agent_node(
    name="MindPulse Resource Agent",
    llm=model,
    system_message=f"""You are a caring mental health resource recommender for a journaling app in Toronto, Canada.

You receive a journal entry and its emotion analysis. Your job:
1. Determine if the user seems to be struggling (high sadness, anxiety, anger, loneliness, or distressing content)
2. If yes, select 2-3 relevant resources from the list below matching their situation
3. If the entry is positive/neutral, set should_recommend to false

Match resources to context:
- Student stress → Good2Talk, BounceBack
- Anxiety/rumination → AbilitiCBT, RISE Clinic
- General low mood → Well Beings, PathWell, BounceBack
- Loneliness → Hard Feelings community space, ConnexOntario
- Anger/frustration → Canadian Therapy (24/7), On Your Mind Counselling
- Crisis language → ALWAYS include 988 + Toronto Distress Centre

Be warm. Never diagnose. Frame as "you might find it helpful" not "you need help."

AVAILABLE RESOURCES:
{TORONTO_RESOURCES}""",
    output_schema=RecommendationResult,
)

flow = rt.Flow("mindpulse-recommendations", entry_point=RecommendationAgent)
```

### 3. FastAPI Server (`app.py`)
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from agent import flow

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.post("/recommend")
async def recommend_resources(data: dict):
    text = data.get("text", "")
    emotions = data.get("emotions", {})
    prompt = f"Journal entry: {text}\n\nEmotion analysis: {emotions}"
    result = flow.invoke(prompt)
    return {
        "should_recommend": result.structured.should_recommend,
        "reasoning": result.structured.reasoning,
        "resources": [r.dict() for r in result.structured.resources],
    }

@app.get("/health")
async def health():
    return {"status": "ok"}
```

### 4. Toronto Resources (`resources.py`)
```python
TORONTO_RESOURCES = """
DOWNTOWN TORONTO THERAPISTS & CLINICS (real verified locations):
- RISE Anxiety & Depression Psychology Clinic: 500 Queens Quay W Suite 108. Anxiety & depression specialist. 4.9/5. Phone: 514-232-6445
- PathWell: 40 University Ave Suite 603. Counselling & coaching. 4.7/5. Phone: 647-241-5438
- Well Beings Counselling: 401 Bay St Suite 1605. General counselling. 5.0/5. Phone: 647-490-2522
- Canadian Therapy: 477 Richmond St W. Open 24/7. 4.9/5. Phone: 647-559-0149
- BeWell Downtown Health Centre: 80 Richmond St W Suite 1607. ADHD, therapy. 4.8/5. Phone: 647-715-3900
- Hatch-Me Therapy: 600 Sherbourne St #609. Inclusive, evening hours. 5.0/5. Phone: 416-786-1518
- On Your Mind Counselling: 52 Church St. Walk-in, open Sundays. 4.3/5. Phone: 888-222-6841
- Hard Feelings Mental Health: 353 Church St. Community space, free resources. 5.0/5. Phone: 647-740-3335
- Sunnyside Healing Arts: 2333 Dundas St W. Holistic. 5.0/5. Phone: 416-220-1100
- AERCs Therapy: 1849 Yonge St Suite 301. Trauma/PTSD. 5.0/5. Phone: 416-486-2300

FREE / LOW-COST:
- BounceBack Ontario: Free CBT program. bouncebackontario.ca
- AbilitiCBT: Free online CBT (Ontario funded). abiliticbt.com
- Good2Talk: 1-866-925-5454 — free for post-secondary students
- CAMH: Canada's largest mental health hospital. Intake: 416-535-8501
- Wellness Together Canada: wellnesstogether.ca — free counselling
- Hard Feelings (353 Church St): Free lending library, drop-in
- ConnexOntario: 1-866-531-2600 — free 24/7 helpline

CRISIS LINES:
- 988 Suicide Crisis Helpline: Call or text 988 (24/7)
- Toronto Distress Centre: 416-408-4357 (24/7)
- Crisis Text Line: Text HOME to 741741
- Kids Help Phone: 1-800-668-6868
"""
```

### 5. requirements.txt
```
railtracks
fastapi
uvicorn
python-dotenv
```

### 6. pyproject.toml
```toml
[project]
name = "mindpulse-agent"
version = "0.1.0"
dependencies = ["railtracks", "fastapi", "uvicorn", "python-dotenv"]
```

### 7. Connect Next.js → Railtracks Service
Create new file `lib/recommend.ts`:
```typescript
import "server-only";

const RAILTRACKS_URL = process.env.RAILTRACKS_URL || "http://localhost:8000";

export type RecommendedResource = {
  name: string;
  type: string;
  description: string;
  contact: string;
};

export type RecommendationResult = {
  should_recommend: boolean;
  reasoning: string;
  resources: RecommendedResource[];
};

export async function getRecommendations(
  text: string,
  emotions: Record<string, number>,
): Promise<RecommendationResult | null> {
  try {
    const response = await fetch(`${RAILTRACKS_URL}/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, emotions }),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    console.error("Railtracks service unavailable");
    return null;
  }
}
```

### 8. Wire Into Entry Save Flow
In `app/actions.ts`, inside `createEntryAction`, AFTER the existing `analyzeJournalEntry` call, add:
```typescript
let recommendations = null;
if (analysis?.emotions) {
  const { getRecommendations } = await import("@/lib/recommend");
  recommendations = await getRecommendations(content, analysis.emotions);
}
```
Then store `recommendations` in the new `analysis_recommendations` column.

### 9. Update Database Schema
Add to `supabase/schema.sql`:
```sql
alter table public.journal_entries
  add column if not exists analysis_recommendations jsonb;
```

### 10. Frontend: Resource Card
When viewing a journal entry with recommendations where `should_recommend` is true, show a card below the existing analysis panel:
- Soft warm background (sage green or soft blue, NOT red/alarming)
- Title: "Some support nearby" or "You might find these helpful"
- List each resource: name, why it's relevant, contact
- Footer note: "These are suggestions, not prescriptions. You're always in control."

## Railtracks Bonus Award Checklist
- [ ] `railtracks` is in `railtracks-agent/requirements.txt`
- [ ] `railtracks` is in `railtracks-agent/pyproject.toml`
- [ ] README.md says "Built with Railtracks" 
- [ ] The Railtracks agent actually runs and produces recommendations
- [ ] Check the Devpost submission box

## Running the Full Project
Terminal 1 (Next.js):
```bash
npm install
npm run dev
```

Terminal 2 (Railtracks agent):
```bash
cd railtracks-agent
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

## Demo Flow (3 minutes)
1. Open the app, show login
2. Write a positive entry → emotion analysis appears, no resource recommendations
3. Write a struggling entry ("I bombed my exam, I always fail, everyone probably thinks I'm stupid") → emotion analysis + **therapist recommendations automatically appear**
4. Show Insights page → mood trends, emotion patterns over time
5. Pitch: "The user never asked for help. The agent noticed they needed it and acted. These are real therapists within walking distance of this building."

## Do NOT
- Do not rewrite or restructure the existing Next.js app
- Do not modify `lib/journal-ai.ts` — it works
- Do not make the recommendation card alarming or clinical
- Do not forget CORS middleware on FastAPI
- Do not forget "Built with Railtracks" in README.md

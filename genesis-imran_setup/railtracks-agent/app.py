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
    result = await flow.ainvoke(prompt)
    return {
        "should_recommend": result.structured.should_recommend,
        "reasoning": result.structured.reasoning,
        "resources": [r.dict() for r in result.structured.resources],
    }

@app.get("/health")
async def health():
    return {"status": "ok"}

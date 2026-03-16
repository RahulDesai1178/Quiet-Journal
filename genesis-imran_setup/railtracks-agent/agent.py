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

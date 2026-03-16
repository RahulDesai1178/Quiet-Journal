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

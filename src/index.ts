// src/index.ts

import { Router } from "./router";
import { fetchUserData, fetchCourseEnrollments } from "./trainerCentral";
import { analyzeSentiment } from "./sentimentAnalysis";

const router = new Router();

/**
 * Example endpoint: /analyze-sentiment?userId=123
 * 1. Reads userId from query param.
 * 2. Fetches data from TrainerCentral using your token.
 * 3. Uses LangChain for sentiment analysis.
 * 4. Returns a JSON response.
 */
router.on("/analyze-sentiment", async ({ request, env }) => {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    if (!userId) {
      return new Response("Missing userId parameter", { status: 400 });
    }

    const trainerCentralToken = env.TRAINER_CENTRAL_TOKEN;
    const openAiKey = env.OPENAI_API_KEY;

    // 1. Fetch data from TrainerCentral
    const userProfile = await fetchUserData(userId, trainerCentralToken);
    const userCourses = await fetchCourseEnrollments(userId, trainerCentralToken);

    // 2. Construct a userMetrics object from the data
    const userMetrics = {
      userId,
      age: userProfile.age ?? null,
      location: userProfile.location ?? null,
      courseCount: userCourses?.length ?? 0,
      // Potentially add more data from other endpoints:
      // lessons, averageTimeOnPage, testScores, timeSignedIn, etc.
    };

    // 3. Analyze sentiment using LangChain
    const sentimentResult = await analyzeSentiment(userMetrics, openAiKey);

    // 4. Return the result
    return new Response(
      JSON.stringify({ userId, sentimentResult }, null, 2),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
});

// Default Worker export
export default {
  async fetch(request: Request, env: any): Promise<Response> {
    return router.route(request, env);
  },
};

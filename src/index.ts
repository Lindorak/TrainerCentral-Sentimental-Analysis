// src/index.ts

import { Router } from "./router";
import { fetchUserData, fetchCourseEnrollments } from "./trainerCentral";
import { analyzeSentiment } from "./sentimentAnalysis";

const router = new Router();

// Example endpoint: /analyze-sentiment?userId=123
router.on("/analyze-sentiment", async ({ request, env }) => {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  if (!userId) {
    return new Response("Missing userId", { status: 400 });
  }

  try {
    // In practice, you'd secure the token or retrieve from env
    const trainerCentralToken = env.TRAINER_CENTRAL_TOKEN;

    // 1. Fetch data from TrainerCentral
    const userProfile = await fetchUserData(userId, trainerCentralToken);
    const userCourses = await fetchCourseEnrollments(userId, trainerCentralToken);

    // 2. Create a user metrics object
    const userMetrics = {
      userId,
      age: userProfile.age,
      location: userProfile.location,
      courseCount: userCourses.length,
      // ... add more metrics (time on page, tests, etc.) ...
    };

    // 3. Analyze sentiment with LangChain
    const sentimentResult = await analyzeSentiment(userMetrics);

    // 4. Return response
    return new Response(
      JSON.stringify({ userId, sentiment: sentimentResult }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
});

// Handle all requests
export default {
  fetch(request: Request, env: any) {
    return router.route(request, env);
  },
};

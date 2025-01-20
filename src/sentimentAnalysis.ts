// src/sentimentAnalysis.ts

import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate, LLMChain } from "langchain/chains";

/**
 * Analyze user engagement metrics with LangChain. 
 * The result is a text string containing the LLM's output.
 */
export async function analyzeSentiment(userData: Record<string, any>, openAiKey: string): Promise<string> {
  // Initialize the LLM with your API key
  const llm = new OpenAI({
    openAIApiKey: openAiKey,
    temperature: 0.3,
  });

  // Build a prompt to interpret numeric/categorical user data for sentiment
  const template = `
    You are an AI analyzing user engagement data. 
    Data (JSON):
    {userData}

    Return a sentiment rating between -1 (very negative) and +1 (very positive),
    along with a short reasoning.
  `;

  const prompt = new PromptTemplate({
    template,
    inputVariables: ["userData"],
  });

  const chain = new LLMChain({ llm, prompt });
  const response = await chain.call({
    userData: JSON.stringify(userData, null, 2),
  });

  // response.text contains the raw LLM output
  return response.text.trim();
}

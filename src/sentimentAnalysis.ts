// src/sentimentAnalysis.ts
import { OpenAI } from "langchain/llms/openai"; 
import { LLMChain, PromptTemplate } from "langchain/chains";

// Example: Summarizing numeric user data into a short sentiment rating
export async function analyzeSentiment(userData: any) {
  // Configure your LLM (OpenAI API as an example)
  const llm = new OpenAI({
    openAIApiKey: "YOUR_OPENAI_API_KEY",
    temperature: 0.3,
  });

  // Create a prompt template; you can refine these instructions
  const template = `
    You are a service that determines user sentiment based on numeric and categorical data:
    {userData}

    Return a sentiment rating (between -1 and +1) and a short summary.
  `;

  const prompt = new PromptTemplate({
    template,
    inputVariables: ["userData"],
  });

  // Create and run the chain
  const chain = new LLMChain({ llm, prompt });
  const response = await chain.call({
    userData: JSON.stringify(userData, null, 2),
  });

  return response.text;
}

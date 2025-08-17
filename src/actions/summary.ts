"use server";

import OpenAI from "openai";
import { ISummary } from "../types/summary";
import Summary from "../models/summary.model";
import { initialStateType } from "../components/forms/HandleServerAction";
import serverActionWrapper from "../utils/serverActionWrapper";
import connectDB from "../db/connectDB";
import getAuthenticatedUser from "../utils/getAuthenticatedUser";
import Topic from "../models/topic.model";

export const generateSummary = async (
  topicName: string
): Promise<ISummary | initialStateType> => {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: 401, message: "Unauthorized. Please Login" };

    const prompt = `Generate a concise summary of the topic "${topicName}".
Include:
- keyPoints (as an array)
- takeAways (as an array)
Return ONLY JSON in the following format:
{
  "keyPoints": ["...", "..."],
  "takeAways": ["...", "..."]
}`;

    const client = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });

    const response = await client.chat.completions.create({
      model: "mistralai/mistral-7b-instruct",
      messages: [{ role: "user", content: prompt }],
    });

    return JSON.parse(
      response.choices[0]?.message?.content ||
        '{"keyPoints": [], "takeAways": []}'
    );
  } catch (err) {
    console.error("Error generating summary:", err);
    return {
      keyPoints: [],
      takeAways: [],
    };
  }
};

export const saveSummary = serverActionWrapper(
  async (
    summary: ISummary,
    topicId: string
    // summaryId: string
  ): Promise<initialStateType> => {
    await connectDB();

    const topic = await Topic.findById(topicId).select("_id").lean();
    if (!topic) return { status: 404, message: "Topic not found" };

    const newSummary = await Summary.create({ ...summary, topicId });
    if (!newSummary) return { status: 400, message: "Failed to save summary" };

    const { _id, keyPoints, takeAways } = newSummary;

    return {
      status: 201,
      message: "Successfully saved summary",
      data: { _id: _id.toString(), keyPoints, takeAways },
    };
  }
);

export const deleteSummary = serverActionWrapper(async (summaryId: string) => {
  await connectDB();

  const deletedSummary = await Summary.findByIdAndDelete(summaryId);
  if (!deletedSummary)
    return { status: 400, message: "Failed to delete summary" };

  const { _id, keyPoints, takeAways } = deletedSummary;

  return {
    status: 200,
    message: "Successfully deleted summary",
    data: { _id: _id.toString(), keyPoints, takeAways },
  };
});

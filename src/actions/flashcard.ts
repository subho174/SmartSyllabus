"use server";

import OpenAI from "openai";
import { IFlashcard } from "../types/flashcard";
import getAuthenticatedUser from "../utils/getAuthenticatedUser";
import { initialStateType } from "../components/forms/HandleServerAction";
import serverActionWrapper from "../utils/serverActionWrapper";
import Topic from "../models/topic.model";
import FlashCard from "../models/flashcard.model";
import connectDB from "../db/connectDB";

export const generateFlashcard = async (
  topicName: string
): Promise<IFlashcard[] | initialStateType> => {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: 401, message: "Unauthorized. Please Login" };

    const prompt = `Create 5 flashcards for the topic "${topicName}".
Each flashcard should contain:
- "question": an interesting, thought-provoking question that encourages deeper understanding or gives extra knowledge not already in a simple summary. Avoid repeating plain definitions.
- "answer": a concise, clear explanation  and suitable for quick memorization (1-3 sentences max).
-  Use plain, understandable language. Avoid long paragraphs.
Focus on curiosity-driven learning (why, how, implications, real-world application).
Return ONLY JSON in the format:
[
  { "question": "string", "answer": "string" },
  { "question": "string", "answer": "string" }
]
Do not include explanations, markdown, or extra text.   
`;

    const client = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });

    const response = await client.chat.completions.create({
      model: "mistralai/mistral-7b-instruct",
      messages: [{ role: "user", content: prompt }],
    });

    return JSON.parse(response.choices[0]?.message?.content || "[]");
  } catch (err) {
    console.error("Error generating flashcards:", err);
    return [];
  }
};

export const saveFlashcard = serverActionWrapper(
  async (topicId: string, flashcard: IFlashcard) => {
    await connectDB();

    const topic = await Topic.findById(topicId).select("_id").lean();
    if (!topic) return { status: 404, message: "Topic not found" };

    const newFlashcard = await FlashCard.create({ topicId, ...flashcard });
    if (!newFlashcard)
      return { status: 400, message: "Failed to save flashcard" };

    const { _id, question, answer } = newFlashcard;

    return {
      status: 201,
      message: "Successfully saved flashcard",
      data: { _id: _id.toString(), question, answer },
    };
  }
);

export const deleteFlashcard = serverActionWrapper(
  async (flashcardId: string) => {
    await connectDB();

    const deletedFlashcard = await FlashCard.findByIdAndDelete(flashcardId);
    if (!deletedFlashcard)
      return { status: 400, message: "Failed to delete flashcard" };

    const { _id, question, answer } = deletedFlashcard;

    return {
      status: 200,
      message: "Successfully deleted summary",
      data: { _id: _id.toString(), question, answer },
    };
  }
);

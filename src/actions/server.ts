"use server";

import connectDB from "../db/connectDB";
import Course from "../models/course.model";
import Topic from "../models/topic.model";
import { courseSchema } from "../schemas/courseSchema";
import getAuthenticatedUser from "../utils/getAuthenticatedUser";
import { topicSchema } from "../schemas/topicSchema";
import OpenAI from "openai";
import { ISummary } from "../types/summary";
import Summary from "../models/summary.model";
import { initialStateType } from "../components/forms/HandleServerAction";
import formActionWrapper from "../utils/formActionWrapper";
import serverActionWrapper from "../utils/serverActionWrapper";

export const addCourse = formActionWrapper(async (prevState, formData) => {
  const user = await getAuthenticatedUser();
  if (!user) return { status: 401, message: "Unauthorized. Please Login" };

  const validatedData = courseSchema.parse({
    title: formData.get("title"),
  });

  await connectDB();

  const course = await Course.create({
    ...validatedData,
    createdBy: user.id,
  });

  if (!course) return { status: 400, message: "Failed to create course" };

  return { status: 201, message: "Created new course successfully" };
});

export const addTopic = formActionWrapper(async (prevState, formData) => {
  const user = await getAuthenticatedUser();
  if (!user) return { status: 401, message: "Unauthorized. Please Login" };

  const validatedData = topicSchema.parse({
    title: formData.get("title"),
    courseId: formData.get("courseId"),
  });

  await connectDB();

  const course = await Course.findById(validatedData.courseId)
    .select("_id")
    .lean();

  if (!course) return { status: 404, message: "Course not found" };

  const topic = await Topic.create(validatedData);
  if (!topic) return { status: 400, message: "Failed to add topic" };

  return { status: 201, message: "Added new topic successfully" };
});

export const generateSummary = async (topicName: string): Promise<ISummary> => {
  try {
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
    try {
      await connectDB();

      const newSummary = await Summary.create({ ...summary, topicId });
      if (!newSummary)
        return { status: 400, message: "Failed to save summary" };

      const { _id, keyPoints, takeAways } = newSummary;

      return {
        status: 201,
        message: "Successfully saved summary",
        data: { _id: _id.toString(), keyPoints, takeAways },
      };
    } catch (error) {
      console.error(error);
      return { status: 500, message: "Internal Server Error" };
    }
  }
);

export const deleteSummary = serverActionWrapper(async (summaryId: string) => {
  try {
    const deletedSummary = await Summary.findByIdAndDelete(summaryId);
    if (!deletedSummary)
      return { status: 400, message: "Failed to delete summary" };

    const { _id, keyPoints, takeAways } = deletedSummary;

    return {
      status: 200,
      message: "Successfully deleted summary",
      data: { _id: _id.toString(), keyPoints, takeAways },
    };
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Internal Server Error" };
  }
});

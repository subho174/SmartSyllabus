"use server";

import connectDB from "../db/connectDB";
import Course from "../models/course.model";
import Topic from "../models/topic.model";
import { courseSchema } from "../schemas/courseSchema";
import getAuthenticatedUser from "../utils/getAuthenticatedUser";
import { topicSchema } from "../schemas/topicSchema";
import serverWrapper from "../utils/serverWrapper";

export const addCourse = serverWrapper(async (prevState, formData) => {
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

export const addTopic = serverWrapper(async (prevState, formData) => {
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

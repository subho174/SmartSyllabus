'use server';

import { initialStateType } from "../components/HandleServerAction";
import connectDB from "../db/connectDB";
import Course from "../models/course.model";
import getAuthenticatedUser from "../utils/getAuthenticatedUser";

export const addCourse = async (
  prevState: initialStateType,
  formData: FormData
): Promise<initialStateType> => {
  const title = formData.get("title") as string;

  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: 401, message: "Unauthorized. Please Login" };

    await connectDB();

    const course = await Course.create({ title, createdBy: user.id });
    if (!course) return { status: 400, message: "Failed to create course" };

    return { status: 201, message: "Created new course successfully" };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

import connectDB from "@/src/db/connectDB";
import FlashCard from "@/src/models/flashcard.model";
import getAuthenticatedUser from "@/src/utils/getAuthenticatedUser";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const topicId = searchParams.get("topicId");

    const user = await getAuthenticatedUser();
    if (!user)
      return NextResponse.json(
        { message: "Unauthorized. Please Login" },
        { status: 401 }
      );

    await connectDB();

    const flashcards = await FlashCard.find({ topicId })
      .select("-topicId -__v")
      .lean();

    if (!flashcards)
      return NextResponse.json(
        { message: "Failed to fetch flashcards" },
        { status: 404 }
      );

    return NextResponse.json(
      { message: "Flashcards fetched successfully", data: flashcards },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

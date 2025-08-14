import connectDB from "@/src/db/connectDB";
import Summary from "@/src/models/summary.model";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const topicId = searchParams.get("topicId");

    await connectDB();

    const summaries = await Summary.find({ topicId })
      .select("-topicId -__v")
      .lean();

    if (!summaries)
      return NextResponse.json(
        { message: "Failed to fetch summaries" },
        { status: 404 }
      );

    return NextResponse.json(
      { message: "Summaries fetched successfully", data: summaries },
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

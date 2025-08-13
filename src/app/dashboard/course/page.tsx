import AddTopicForm from "@/src/components/forms/AddTopicForm";
import { TopicCard } from "@/src/components/cards/TopicCard";
import connectDB from "@/src/db/connectDB";
import Topic from "@/src/models/topic.model";
import getAuthenticatedUser from "@/src/utils/getAuthenticatedUser";
import { redirect } from "next/navigation";
import { ITopic } from "@/src/types/topic";

export default async function CourseDetailPage({
  searchParams,
}: {
  searchParams: Promise<{ courseId: string }>;
}) {
  // const topics = [
  //   { id: "1", title: "Binary Trees", status: "in_progress" },
  //   { id: "2", title: "Graphs", status: "not_started" },
  // ];
  let topics: ITopic[] = [];
  const { courseId } = await searchParams;

  try {
    // (await getAuthenticatedUser()) ?? redirect("/sign-in");

    await connectDB();

    topics = await Topic.find({ courseId }).select("title status").lean();
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Course Title</h2>

        <AddTopicForm courseId={courseId} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics?.map((topic) => (
          <TopicCard
            key={topic._id}
            topic={{ ...topic, _id: topic._id!.toString() }}
          />
        ))}
      </div>
    </div>
  );
}

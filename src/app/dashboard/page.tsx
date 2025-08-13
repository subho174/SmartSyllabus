import { CourseCard } from "@/src/components/cards/CourseCard";
import AddCourseForm from "@/src/components/forms/AddCourseForm";
import connectDB from "@/src/db/connectDB";
import Course from "@/src/models/course.model";
import { ICourse } from "@/src/types/course";
import getAuthenticatedUser from "@/src/utils/getAuthenticatedUser";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  // const courses = [
  //   { id: "1", title: "DSA", progress: 60 },
  //   { id: "2", title: "Thermodynamics", progress: 30 },
  // ];
  let courses: ICourse[] = [];

  try {
    const user = (await getAuthenticatedUser()) ?? redirect("/sign-in");

    await connectDB();

    courses = await Course.find({ createdBy: user.id }).select("title").lean();
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Courses</h2>
        <AddCourseForm />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course, i) => (
          <CourseCard
            key={i}
            course={{ ...course, _id: course._id?.toString()! }}
          />
        ))}
      </div>
    </div>
  );
}

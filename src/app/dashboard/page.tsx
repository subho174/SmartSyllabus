import { CourseCard } from "@/src/components/CourseCard";
import HandleServerAction from "@/src/components/HandleServerAction";
import Course from "@/src/models/course.model";
import { addCourse } from "@/src/server-action/server";
import getAuthenticatedUser from "@/src/utils/getAuthenticatedUser";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  //   const courses = [
  //     { id: "1", title: "DSA", progress: 60 },
  //     { id: "2", title: "Thermodynamics", progress: 30 },
  //   ];
  const user = (await getAuthenticatedUser()) ?? redirect("/sign-in");

  const courses = await Course.find({ createdBy: user.id })
    .select("title")
    .lean();

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Courses</h2>
        <HandleServerAction
          submitFunction={addCourse}
          modalHeaderText="Add New Course"
          btnText="Add course"
          loadingBtnText="Adding"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course, i) => (
          <CourseCard key={i} course={{ title: course.title }} />
        ))}
      </div>
    </div>
  );
}

"use client";

import { Card, CardBody } from "@heroui/react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function CourseCard({
  course,
}: {
  course: { _id: string; title: string };
}) {
  return (
    <Card className="hover:shadow-xl transition-shadow">
      <CardBody className="flex flex-row justify-between items-center p-4 space-y-2">
        <h3 className="text-lg font-semibold">{course.title}</h3>
        {/* <p className="text-sm text-muted-foreground">Progress: {course.progress}%</p> */}
        <Link href={`/dashboard/course?courseId=${course._id}`}>
          <ChevronRight />
        </Link>
      </CardBody>
    </Card>
  );
}

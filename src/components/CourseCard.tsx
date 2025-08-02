'use client';

import { Card, CardBody } from "@heroui/react";

export function CourseCard({ course }: { course: { title: string} }) {
  return (
    // <Link href={`/dashboard/${course.id}`} className="block">
      <Card className="hover:shadow-xl transition-shadow">
        <CardBody className="p-4 space-y-2">
          <h3 className="text-lg font-semibold">{course.title}</h3>
          {/* <p className="text-sm text-muted-foreground">Progress: {course.progress}%</p> */}
        </CardBody>
      </Card>
    // </Link>
  );
}
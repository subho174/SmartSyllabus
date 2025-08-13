"use client";

import { Card, CardBody } from "@heroui/react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function TopicCard({
  topic,
}: {
  topic: { _id: string; title: string; status: string };
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardBody
        className="p-4
        flex flex-row justify-between items-center "
      >
        <div>
          <h3 className="font-semibold text-base">{topic.title}</h3>
          <p className="text-sm text-muted-foreground">
            Status: {topic.status}
          </p>
        </div>
        <Link href={`course/topic?topicId=${topic._id}`}>
          <ChevronRight />
        </Link>
      </CardBody>
    </Card>
  );
}

"use client";

import { ITopic } from "@/src/types/topic";
import { Card, CardBody, Chip } from "@heroui/react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function TopicCard({ topic }: { topic: ITopic }) {
  const getColor = (): "primary" | "success" | "warning" => {
    switch (topic.status) {
      case "In progress":
        return "warning";
      case "Completed":
        return "success";
      default:
        return "primary";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardBody
        className="p-4
        flex flex-row justify-between items-center "
      >
        <div>
          <h3 className="font-semibold mb-2 text-base">{topic.title}</h3>

          <Chip color={getColor()} size="sm">
            {topic.status}
          </Chip>
        </div>
        <Link href={`course/topic?topicId=${topic._id}&title=${topic.title}`}>
          <ChevronRight />
        </Link>
      </CardBody>
    </Card>
  );
}

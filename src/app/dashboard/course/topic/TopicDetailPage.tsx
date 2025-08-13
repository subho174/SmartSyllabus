"use client";

import { FlashcardPanel } from "@/src/components/cards/FlashCardPanel";
import { QuizPanel } from "@/src/components/cards/QuizPanel";
import { SummaryPanel } from "@/src/components/cards/SummaryPanel";
import { Tabs, Tab } from "@heroui/react";

export default function TopicDetailPage({ topicId }: { topicId: string }) {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Topic Title</h2>

      <Tabs aria-label="Options">
        <Tab key="summary" title="AI Summary">
          <SummaryPanel />
        </Tab>
        <Tab key="flashcards" title="Flashcards">
          <FlashcardPanel />
        </Tab>
        <Tab key="quiz" title="Quiz">
          <QuizPanel />
        </Tab>
      </Tabs>
    </div>
  );
}

"use client";

import { FlashcardPanel } from "@/src/components/cards/FlashCardPanel";
import { QuizPanel } from "@/src/components/cards/QuizPanel";
import { SummaryPanel } from "@/src/components/cards/SummaryPanel";
import { Tabs, Tab } from "@heroui/react";
import { useEffect, useState } from "react";

export default function TopicDetailPage({
  topicId,
  title,
}: {
  topicId: string;
  title: string;
}) {
  const [activeTab, setactiveTab] = useState("summary");

  useEffect(() => {
    const saved = localStorage.getItem("activeTab");
    if (saved) setactiveTab(saved);
  }, []);

  const renderPanel = () => {
    switch (activeTab) {
      case "summary":
        return <SummaryPanel topicId={topicId} title={title} />;
      case "flashcards":
        return <FlashcardPanel topicId={topicId} title={title} />;
      case "quiz":
        return <QuizPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>

      <Tabs
        aria-label="Options"
        selectedKey={activeTab}
        onSelectionChange={(key) => {
          const tab = key as string;
          setactiveTab(tab);
          localStorage.setItem("activeTab", tab);
        }}
      >
        <Tab key="summary" title="AI Summary" />
        <Tab key="flashcards" title="Flashcards" />
        <Tab key="quiz" title="Quiz" />
      </Tabs>

      <div className="mt-4">{renderPanel()}</div>
    </div>
  );
}

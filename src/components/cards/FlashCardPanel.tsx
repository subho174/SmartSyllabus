import { Card, CardBody } from "@heroui/react";

const flashcards = [
  { question: "What is a pointer?", answer: "A variable that stores a memory address." },
  { question: "What is a linked list?", answer: "A linear data structure of nodes." }
];

export function FlashcardPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {flashcards.map((card, i) => (
        <Card key={i} className="hover:shadow-lg transition-shadow">
          <CardBody className="p-4 space-y-2">
            <p className="font-semibold">Q: {card.question}</p>
            <p className="text-muted-foreground">A: {card.answer}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

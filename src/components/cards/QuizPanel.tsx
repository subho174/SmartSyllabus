import { Button } from "@heroui/button";

const quiz = [
  {
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correctIndex: 1,
  },
];

export function QuizPanel() {
  return (
    <div className="space-y-6">
      {quiz.map((q, i) => (
        <div key={i} className="space-y-2">
          <h4 className="font-semibold">{q.question}</h4>
          <div className="grid grid-cols-2 gap-2">
            {q.options.map((opt, j) => (
              <Button key={j}>{opt}</Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

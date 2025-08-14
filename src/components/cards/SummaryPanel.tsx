"use client";

import React, { useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
Button;
import { Card, CardBody, CardHeader } from "@heroui/card";
import { CheckCircleIcon, Loader2, Save, SparklesIcon } from "lucide-react";
import { Button } from "@heroui/button";
import { generateSummary, saveSummary } from "@/src/actions/server";
import { ISummary } from "@/src/types/summary";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Pagination } from "@heroui/react";

export function SummaryPanel({
  topicId,
  title,
}: {
  topicId: string;
  title: string;
}) {
  const [summaries, setsummaries] = useState<ISummary[]>([]);
  const [isPendingGeneration, startGenerateTransition] = useTransition();
  const [isPendingSave, startSaveTransition] = useTransition();
  const [index, setindex] = useState(0);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["summaries"],
    queryFn: async () =>
      (await axios.get(`/api/summary?topicId=${topicId}`)).data,
  });
  useEffect(() => {
    if (data) setsummaries(data.data);
  }, [data]);

  const handleGenerateSummary = () => {
    startGenerateTransition(async () => {
      try {
        const result = await generateSummary(title);
        toast.success("Summary generated successfully");
        // setSummary(result);
        setsummaries((prev) => {
          const updated = [...prev, result];
          setindex(updated.length - 1);
          return updated;
        });
      } catch (err) {
        console.error("Failed to generate summary", err);
        toast.error("Failed to generate summary");
      }
    });
  };

  const handleSaveSummary = () => {
    startSaveTransition(async () => {
      try {
        const result = await saveSummary(
          // summary!,
          summaries[index],
          topicId
          // summaries[index]._id!
        );
        toast.success(result.message);
      } catch (err) {
        console.error("Failed to save summary", err);
        toast.error("Failed to save summary");
      }
    });
  };
  console.log(summaries[index], index, summaries);

  return (
    <Card className="relative overflow-hidden border-none bg-gradient-to-b mt-4 from-muted/40 to-background shadow-sm">
      {/* Background accents */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/10 to-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-sky-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />
      </div>

      {summaries?.length > 0 ? (
        <>
          <CardHeader className="flex flex-col gap-4 mt-6 max-w-2xl mx-auto text-center">
            <p className="text-2xl sm:text-3xl font-semibold">
              AI Summary for <span className="text-primary">{title}</span>
            </p>
          </CardHeader>

          <CardBody className="flex flex-col gap-4 md:px-6 pb-8 sm:px-10">
            {/* Key Points */}
            {summaries[index].keyPoints?.length > 0 && (
              <div>
                <h3 className="font-semibold mt-4 text-lg">Key Points</h3>
                <ul className="space-y-2 mt-2">
                  {summaries[index].keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircleIcon className="h-4 w-4 flex-shrink-0 text-green-500 mt-1" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Main Takeaways */}
            {summaries[index].takeAways?.length > 0 && (
              <div>
                <h3 className="font-semibold mt-4 text-lg">Takeaways</h3>
                <ul className="space-y-2 mt-2">
                  {summaries[index].takeAways.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircleIcon className="h-4 w-4 flex-shrink-0 text-blue-500 mt-1" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {!summaries[index].takeAways?.length &&
              !summaries[index].keyPoints?.length && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-muted/50 p-4 rounded-lg text-lg font-semibold text-center"
                >
                  Failed to generate summary
                </motion.div>
              )}
            <div className="flex mx-3 sm:justify-end mt-4 gap-4">
              {/* Regenerate Button */}
              <Button
                onClick={handleGenerateSummary}
                disabled={isPendingGeneration}
                variant="flat"
                className="self-center"
              >
                {isPendingGeneration ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Regenerating…
                  </>
                ) : (
                  <>
                    <span className="mr-1 inline-flex">
                      <SparklesIcon className="h-5 w-5 transition-transform group-hover:rotate-90" />
                    </span>
                    Regenerate
                  </>
                )}
              </Button>

              <Button
                onClick={handleSaveSummary}
                disabled={isPendingSave}
                variant="flat"
                className="self-center"
              >
                {isPendingSave ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <span className="mr-1 inline-flex">
                      <Save className="h-5 w-5" />
                    </span>
                    Save
                  </>
                )}
              </Button>
            </div>

            <Pagination
              page={index + 1}
              onChange={(page) => setindex(page - 1)}
              loop
              showControls
              color="success"
              total={summaries.length}
              className="justify-items-center mt-4"
            />
          </CardBody>
        </>
      ) : (
        <>
          <CardHeader className="flex flex-col gap-8 mt-8 max-w-md mx-auto items-center text-center">
            <p className="text-2xl sm:text-3xl">No summary generated yet</p>
            <p className="mx-auto max-w-2xl text-base leading-relaxed">
              Once you generate a summary, it will appear here with key
              highlights, takeaways, and quick links.
            </p>
          </CardHeader>

          <CardBody className="flex flex-col items-center gap-4 p-6 sm:p-8">
            <motion.div
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 160,
                damping: 14,
                delay: 0.05,
              }}
              className="mt-2"
            >
              <Button
                onClick={handleGenerateSummary}
                disabled={isPendingGeneration}
                className="group h-11 rounded-2xl px-5 text-base shadow-md"
              >
                {isPendingGeneration ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <span className="mr-1 inline-flex">
                      <SparklesIcon className="h-5 w-5 transition-transform group-hover:rotate-90" />
                    </span>
                    Generate Summary
                  </>
                )}
              </Button>
            </motion.div>
          </CardBody>
        </>
      )}
    </Card>
  );
}

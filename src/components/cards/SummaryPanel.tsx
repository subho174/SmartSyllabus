"use client";

import React, { useCallback, useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { CheckCircleIcon, SparklesIcon } from "lucide-react";
import { Button } from "@heroui/button";
import {
  deleteSummary,
  generateSummary,
  saveSummary,
} from "@/src/actions/summary";
import { ISummary } from "@/src/types/summary";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Pagination, useDisclosure } from "@heroui/react";
import SummaryLoader from "../loader/SummaryLoader";
import SummaryError from "../error/Error";
import WarningModal from "./WarningModal";
import SharedCTA from "@/src/components/cards/SharedCTA";

export function SummaryPanel({
  topicId,
  title,
}: {
  topicId: string;
  title: string;
}) {
  const [summaries, setsummaries] = useState<ISummary[]>([]);
  const [index, setindex] = useState(0);
  const [isSmall, setIsSmall] = useState(false);

  const [isPendingGeneration, startGenerateTransition] = useTransition();
  const [isPendingSave, startSaveTransition] = useTransition();
  const [isPendingDelete, startDeleteTransition] = useTransition();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data, refetch, isPending, isError, error } = useQuery({
    queryKey: ["summaries", topicId],
    queryFn: async () =>
      (await axios.get(`/api/summary?topicId=${topicId}`)).data,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const checkSize = () => setIsSmall(window.innerWidth < 500);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  useEffect(() => {
    if (data) setsummaries(data.data);
  }, [data]);

  const disableButtons = useCallback(
    () => isPendingGeneration || isPendingSave || isPendingDelete,
    [isPendingGeneration, isPendingSave, isPendingDelete]
  );

  const handleGenerateSummary = useCallback(() => {
    startGenerateTransition(async () => {
      try {
        const result = await generateSummary(title);
        if ("status" in result) {
          toast.error(result.message || "Failed to generate summary");
          return;
        }

        if (result.keyPoints?.length === 0 && result.takeAways?.length === 0) {
          toast.error("Failed to generate summary");
          return;
        }

        setsummaries((prev) => {
          const updated = [...prev, result];
          setindex(updated.length - 1);
          return updated;
        });

        toast.success("Summary generated successfully");
      } catch (err) {
        console.error("Failed to generate summary", err);
        toast.error("Failed to generate summary");
      }
    });
  }, [startGenerateTransition, title]);

  const handleSaveSummary = useCallback(() => {
    const savedSummaries = summaries.filter((summary) => summary._id);

    if (savedSummaries.length >= 3) {
      onOpen();
      return;
    }

    startSaveTransition(async () => {
      try {
        const { data, message } = await saveSummary(summaries[index], topicId);

        if (!data) {
          toast.error(message);
          return;
        }

        setsummaries((prev) => {
          const updated = [...prev];
          updated[index] = data as ISummary;
          return updated;
        });

        toast.success(message);
      } catch (err) {
        console.error("Failed to save summary", err);
        toast.error("Failed to save summary");
      }
    });
  }, [summaries, index, topicId, onOpen, startSaveTransition]);

  const handleDeleteSummary = useCallback(() => {
    startDeleteTransition(async () => {
      try {
        const { data, message } = await deleteSummary(summaries[index]._id!);

        if (!data) {
          toast.error(message);
          return;
        }

        setsummaries(() => {
          const updated = summaries.filter(
            (summary) => summary._id !== data?._id
          );
          return updated;
        });

        setindex((prev) => (prev === summaries.length - 1 ? prev - 1 : prev));

        toast.success(message);
      } catch (err) {
        console.error("Failed to delete summary", err);
        toast.error("Failed to delete summary");
      }
    });
  }, [startDeleteTransition, summaries, index]);

  if (isPending) return <SummaryLoader />;
  if (isError) return <SummaryError error={error} refetch={refetch} />;

  return (
    <>
      <WarningModal isOpen={isOpen} onClose={onClose} itemType="Summary" />
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

              <SharedCTA
                isPendingGeneration={isPendingGeneration}
                generateHandler={handleGenerateSummary}
                isPendingSave={isPendingSave}
                saveHandler={handleSaveSummary}
                isPendingDelete={isPendingDelete}
                deleteHandler={handleDeleteSummary}
                disableButtons={disableButtons}
                items={summaries}
                index={index}
              />

              <Pagination
                page={index + 1}
                onChange={(page) => setindex(page - 1)}
                loop
                showControls
                dotsJump={2}
                siblings={isSmall ? 0 : 1}
                boundaries={isSmall ? 0 : 1}
                isCompact={isSmall}
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
                  isDisabled={disableButtons()}
                  isLoading={isPendingGeneration}
                  startContent={
                    !isPendingGeneration && (
                      <SparklesIcon className="h-5 w-5 transition-transform group-hover:rotate-90" />
                    )
                  }
                  className="group h-11 rounded-2xl px-5 text-base shadow-md"
                >
                  {isPendingGeneration ? "Generating.." : "Generate Summary"}
                </Button>
              </motion.div>
            </CardBody>
          </>
        )}
      </Card>
    </>
  );
}

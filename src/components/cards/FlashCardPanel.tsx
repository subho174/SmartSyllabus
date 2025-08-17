"use client";

import {
  deleteFlashcard,
  generateFlashcard,
  saveFlashcard,
} from "@/src/actions/flashcard";
import { IFlashcard } from "@/src/types/flashcard";
import { Button, Card, useDisclosure } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, SparklesIcon } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import WarningModal from "./WarningModal";
import SharedCTA from "@/src/components/cards/SharedCTA";
import FlashcardLoader from "../loader/FlashcardLoader";
import Error from "../error/Error";

export function FlashcardPanel({
  topicId,
  title,
}: {
  topicId: string;
  title: string;
}) {
  const [isPendingGeneration, startGenerateTransition] = useTransition();
  const [isPendingSave, startSaveTransition] = useTransition();
  const [isPendingDelete, startDeleteTransition] = useTransition();

  const [flashcards, setflashcards] = useState<IFlashcard[]>([]);
  const [index, setindex] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data, refetch, isPending, isError, error } = useQuery({
    queryKey: ["flashcards", topicId],
    queryFn: async () =>
      (await axios.get(`/api/flashcards?topicId=${topicId}`)).data,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) setflashcards(data.data);
  }, [data]);

  const handleGenerateFlashcards = useCallback(() => {
    startGenerateTransition(async () => {
      try {
        const result = await generateFlashcard(title);
        if ("status" in result) {
          toast.error(result.message || "Failed to generate flashcards");
          return;
        }

        if (result?.length === 0) {
          toast.error("Failed to generate flashcards");
          return;
        }

        setflashcards((prev) => {
          const updated = [...prev, ...result];
          setindex(prev.length);
          return updated;
        });

        toast.success("Flashcards generated successfully");
      } catch (err) {
        console.error("Failed to generate flashcards", err);
        toast.error("Failed to generate flashcards");
      }
    });
  }, [title, startGenerateTransition]);

  const handleSaveFlashcard = useCallback(() => {
    const savedFlashcards = flashcards.filter((flashcard) => flashcard._id);

    if (savedFlashcards.length >= 10) {
      onOpen();
      return;
    }

    startSaveTransition(async () => {
      try {
        const { data, message } = await saveFlashcard(
          topicId,
          flashcards[index]
        );

        if (!data) {
          toast.error(message);
          return;
        }

        setflashcards((prev) => {
          const updated = [...prev];
          updated[index] = data as IFlashcard;
          return updated;
        });

        toast.success(message);
      } catch (err) {
        console.error("Failed to save flashcard", err);
        toast.error("Failed to save flashcard");
      }
    });
  }, [flashcards, onOpen, topicId, index, startSaveTransition]);

  const handleDeleteFlashcard = useCallback(() => {
    startDeleteTransition(async () => {
      try {
        const { data, message } = await deleteFlashcard(flashcards[index]._id!);

        if (!data) {
          toast.error(message);
          return;
        }

        setflashcards(() => {
          const updated = flashcards.filter(
            (flashcard) => flashcard._id !== data?._id
          );
          return updated;
        });

        setindex((prev) => (prev === flashcards.length - 1 ? prev - 1 : prev));

        toast.success(message);
      } catch (err) {
        console.error("Failed to delete flashcard", err);
        toast.error("Failed to delete flashcard");
      }
    });
  }, [flashcards, index, startDeleteTransition]);

  const prevCard = () =>
    setindex((i) => (i === 0 ? flashcards.length - 1 : i - 1));
  const nextCard = () =>
    setindex((i) => (i === flashcards.length - 1 ? 0 : i + 1));

  const disableButtons = useCallback(
    () => isPendingGeneration || isPendingSave || isPendingDelete,
    [isPendingGeneration, isPendingSave, isPendingDelete]
  );

  if (isPending) return <FlashcardLoader />;
  if (isError) return <Error error={error} refetch={refetch} />;

  return (
    <>
      <WarningModal isOpen={isOpen} onClose={onClose} itemType="Flashcard" />
      <Card className="relative overflow-hidden border-none bg-gradient-to-b mt-4 from-muted/40 to-background flex flex-col items-center shadow-sm">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/10 to-emerald-500/10 blur-xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-sky-500/10 via-purple-500/10 to-pink-500/10 blur-xl" />
        </div>

        {flashcards?.length > 0 ? (
          <>
            <div className="flex flex-col gap-4 mt-6 max-w-2xl mx-auto text-center">
              <p className="text-2xl sm:text-3xl font-semibold">
                Flashcards for <span className="text-primary">{title}</span>
              </p>
              <p className="text-sm text-gray-400">
                Card {index + 1} of {flashcards.length}
              </p>
            </div>

            <div className="flex flex-col items-center mt-6">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative overflow-hidden rounded-2xl border border-white/10 
              bg-gradient-to-b from-white/5 to-white/0 
              backdrop-blur-xl shadow-lg p-6 max-w-md w-full
              hover:scale-[1.01] hover:shadow-xl transition-all duration-300"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                >
                  <div
                    className="absolute -top-20 -right-20 h-48 w-48 rounded-full 
                  bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-transparent blur-xl"
                  />
                  <div
                    className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full 
                  bg-gradient-to-tr from-teal-400/10 via-cyan-400/10 to-transparent blur-xl"
                  />
                </div>

                {flashcards[index].question && flashcards[index].answer ? (
                  <>
                    <p className="font-semibold text-lg sm:text-xl mb-3 text-white relative z-10">
                      Q{index + 1}. {flashcards[index].question}
                    </p>
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed relative z-10">
                      {flashcards[index].answer}
                    </p>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-muted/50 p-4 rounded-lg text-lg font-semibold text-center"
                  >
                    Failed to generate flashcard
                  </motion.div>
                )}
              </motion.div>

              <div className="flex justify-between items-center w-full max-w-md mt-8">
                <Button
                  variant="flat"
                  onClick={prevCard}
                  isDisabled={index === 0 || disableButtons()}
                  startContent={<ChevronLeft className="w-4 h-4" />}
                >
                  Previous
                </Button>

                <Button
                  variant="flat"
                  onClick={nextCard}
                  isDisabled={
                    index === flashcards.length - 1 || disableButtons()
                  }
                  endContent={<ChevronRight className="w-4 h-4" />}
                >
                  Next
                </Button>
              </div>
            </div>

            <SharedCTA
              isPendingGeneration={isPendingGeneration}
              generateHandler={handleGenerateFlashcards}
              isPendingSave={isPendingSave}
              saveHandler={handleSaveFlashcard}
              isPendingDelete={isPendingDelete}
              deleteHandler={handleDeleteFlashcard}
              disableButtons={disableButtons}
              items={flashcards}
              index={index}
            />
          </>
        ) : (
          <>
            {/* No flashcards state */}
            <div className="flex flex-col gap-8 mt-8 max-w-md mx-auto items-center text-center">
              <p className="text-2xl sm:text-3xl">
                No flashcards available yet
              </p>
              <p className="mx-auto max-w-2xl text-base leading-relaxed">
                Once you generate flashcards, they will appear here with
                questions and answers.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 p-6 sm:p-8">
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
                  onClick={handleGenerateFlashcards}
                  isDisabled={disableButtons()}
                  isLoading={isPendingGeneration}
                  startContent={
                    !isPendingGeneration && (
                      <SparklesIcon className="h-5 w-5 transition-transform group-hover:rotate-90" />
                    )
                  }
                  className="group h-11 rounded-2xl px-5 text-base shadow-md"
                >
                  {isPendingGeneration ? "Generating.." : "Generate flashcards"}
                </Button>
              </motion.div>
            </div>
          </>
        )}
      </Card>
    </>
  );
}

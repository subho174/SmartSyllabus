import { Card, CardBody } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import { motion } from "framer-motion";

const FlashcardLoader = () => {
  return (
    <Card className="relative overflow-hidden border-none bg-gradient-to-b mt-4 from-muted/40 to-background flex flex-col items-center shadow-sm">
      {/* Animated gradient glow background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/10 to-emerald-500/10 blur-xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-sky-500/10 via-purple-500/10 to-pink-500/10 blur-xl animate-pulse" />
      </div>

      <CardBody className="flex flex-col items-center gap-6 w-full max-w-2xl p-6">
        {/* Title skeleton */}
        <div className="flex flex-col items-center gap-2 text-center w-full">
          <Skeleton className="h-7 w-48 rounded-lg bg-muted/30" />
          <Skeleton className="h-4 w-32 rounded-md bg-muted/30" />
        </div>

        {/* Flashcard skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 
          bg-gradient-to-b from-white/5 to-white/0 
          backdrop-blur-xl shadow-lg p-6 max-w-md w-full"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-transparent blur-xl animate-pulse" />
            <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-gradient-to-tr from-teal-400/10 via-cyan-400/10 to-transparent blur-xl animate-pulse" />
          </div>

          <div className="flex flex-col gap-4">
            <Skeleton className="h-6 w-3/4 rounded-md bg-muted/30" />
            <Skeleton className="h-4 w-full rounded-md bg-muted/30" />
            <Skeleton className="h-4 w-5/6 rounded-md bg-muted/30" />
            <Skeleton className="h-4 w-2/3 rounded-md bg-muted/30" />
          </div>
        </motion.div>

        {/* Navigation buttons skeleton */}
        <div className="flex justify-between items-center w-full max-w-md mt-4">
          <Skeleton className="h-10 w-24 rounded-xl bg-muted/30" />
          <Skeleton className="h-10 w-24 rounded-xl bg-muted/30" />
        </div>
      </CardBody>
    </Card>
  );
};

export default FlashcardLoader;

import { Card, CardBody, CardHeader } from "@heroui/card";
import SkeletonBlock from "./SkeletonBlock";

const SummaryLoader = () => {
  return (
    <Card className="relative overflow-hidden border-none bg-gradient-to-b mt-4 from-muted/40 to-background shadow-sm">
      {/* Background accents */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/10 to-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-sky-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />
      </div>

      {/* Title */}
      <CardHeader className="flex flex-col gap-4 mt-6 max-w-2xl mx-auto text-center">
        <SkeletonBlock className="h-8 w-72 rounded-lg" />
      </CardHeader>

      <CardBody className="flex flex-col gap-4 md:px-6 pb-8 sm:px-10">
        {/* Key Points */}
        <SkeletonBlock className="h-6 w-32 rounded-lg mt-2" />
        {[...Array(3)].map((_, i) => (
          <div key={`kp-${i}`} className="flex items-center gap-2">
            <SkeletonBlock className="h-4 w-4 rounded-full" delay={i * 0.1} />
            <SkeletonBlock className="h-4 flex-1 rounded-lg" delay={i * 0.1} />
          </div>
        ))}

        {/* Takeaways */}
        <SkeletonBlock className="h-6 w-28 rounded-lg mt-6" />
        {[...Array(3)].map((_, i) => (
          <div key={`tw-${i}`} className="flex items-center gap-2">
            <SkeletonBlock className="h-4 w-4 rounded-full" delay={i * 0.1} />
            <SkeletonBlock className="h-4 flex-1 rounded-lg" delay={i * 0.1} />
          </div>
        ))}

        {/* Buttons */}
        <div className="flex justify-end mt-6 gap-4">
          <SkeletonBlock className="h-10 w-32 rounded-xl" />
          <SkeletonBlock className="h-10 w-24 rounded-xl" />
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4 gap-2">
          {[...Array(3)].map((_, i) => (
            <SkeletonBlock
              key={`pg-${i}`}
              className="h-3 w-3 rounded-full"
              delay={i * 0.1}
            />
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default SummaryLoader;

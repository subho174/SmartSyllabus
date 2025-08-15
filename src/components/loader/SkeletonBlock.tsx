import { cn } from "@heroui/theme";
import { motion } from "framer-motion";

const SkeletonBlock = ({
  className,
  delay = 0,
}: {
  className: string;
  delay?: number;
}) => {
  return (
    <motion.div
      className={cn("rounded-md bg-gray-300 dark:bg-gray-700", className)}
      animate={{
        filter: [
          "brightness(0.85)", // dimmer
          "brightness(1.35)", // glowing
          "brightness(0.85)", // back to dim
        ],
      }}
      transition={{
        repeat: Infinity,
        repeatType: "loop",
        duration: 1.6,
        ease: "easeInOut",
        delay,
      }}
    />
  );
};

export default SkeletonBlock;

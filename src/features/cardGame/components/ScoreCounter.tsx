import { AnimatePresence, motion } from "motion/react";
import { shadow } from "@/shared/styles";
export function ScoreCounter({
  score,
  maxScore,
}: {
  score: number;
  maxScore: number;
}) {
  return (
    <p
      className={`flex justify-center items-baseline pt-6 text-4xl sm:pt-10 sm:text-6xl lining-nums tabular-nums ${shadow}`}
    >
      <span className="relative overflow-clip inline-block py-5 -my-5 mask-[linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={score}
            className="inline-block"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {score}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="ml-1 text-[0.5em] opacity-60">/{maxScore}</span>
    </p>
  );
}

import type { CardType } from "../deck/types";
import { motion } from "motion/react";
import Tilt from "react-parallax-tilt";
import backCard from "../deck/assets/00-back.svg";
import { useSettingsContext } from "@/shared/settings/useSettingsContext";
import { useSound } from "@/shared/sound/useSound";
import { sounds } from "@/shared/sound/sounds";
import { FLIP_DURATION_MS } from "../flipDuration";

export function Card({
  cardObject,
  onClick,
  round,
  hasWikiInfo,
  gameLock,
  onInfoClick,
  index,
}: {
  cardObject: CardType;
  onClick: () => void;
  round: number;
  hasWikiInfo: boolean;
  gameLock: boolean;
  onInfoClick: () => void;
  index: number;
}) {
  const playSound = useSound();
  const { settings } = useSettingsContext();
  const end = round * 360;
  const start = end - 360;
  const dealDelay = 0.05 + index * 0.08;
  return (
    <motion.div
      className="@container min-w-0"
      layout
      initial={{ opacity: 0, y: 16, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{
        layout: { duration: 0.6, delay: 0.6 },
        opacity: { duration: 0, delay: dealDelay },
        default: { duration: 0.4, delay: dealDelay, ease: "easeOut" },
      }}
    >
      <div className="-mb-1 filter-[drop-shadow(0_10px_10px_rgba(0,0,0,0.75))] pointer-fine:filter-[drop-shadow(0_3px_3px_rgba(0,0,0,0.85))_drop-shadow(0_22px_24px_rgba(0,0,0,0.6))]">
        <Tilt
          className={`[clip-path:inset(2%_3%_round_8%/5.4%)] ${gameLock ? "[&_.glare-wrapper]:invisible" : ""}`}
          tiltAngleXManual={gameLock ? 0 : null}
          tiltAngleYManual={gameLock ? 0 : null}
          tiltMaxAngleX={16}
          tiltMaxAngleY={16}
          transitionSpeed={600}
          glareEnable
          glareColor="var(--color-glare)"
          glareMaxOpacity={0.15}
          glarePosition="all"
          glareBorderRadius="24px"
        >
          <div className="perspective-distant">
            <motion.button
              className="group block w-full aspect-49/74 transform-3d select-none rounded-[8%/5.4%] outline-none"
              type="button"
              animate={{
                rotateY:
                  round === 0
                    ? 0
                    : [start, start + 180, start + 180, start + 180, end],
              }}
              transition={{ duration: FLIP_DURATION_MS / 1000 }}
              onClick={onClick}
            >
              <img
                className="absolute inset-0 backface-hidden filter-[url(#warm)]"
                src={cardObject.icon}
                alt={cardObject.name}
                draggable={false}
              />
              <img
                className="absolute inset-0 backface-hidden rotate-y-180 filter-[url(#warm)]"
                // cursor-[url(/cursors/runeArrow.png)_1_1,auto]
                src={backCard}
                alt=""
                draggable={false}
              />
              {/* Focus ring as its own layer on top of the card art: an outline
                  would be painted under the images and cut off by the clip-path */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-[2%_3%] rounded-[8%/5.4%] opacity-0 ring-[6px] ring-inset ring-focusborder group-focus-visible:opacity-100"
              />
            </motion.button>
          </div>
        </Tilt>
      </div>
      <motion.div
        key={round}
        animate={{
          opacity: round === 0 ? 1 : [1, 0, 0, 0, 1],
        }}
        transition={{ duration: 2.4, times: [0, 0.125, 0.5, 0.875, 1] }}
        className="flex justify-center pt-[max(0.5rem,2cqw)] pb-[10cqw] will-change-[opacity]"
      >
        {!hasWikiInfo || !settings.tooltipsOn ? (
          <p className="text-[max(0.7rem,9cqw)] leading-tight opacity-90 [text-shadow:0_2px_4px_rgba(0,0,0,0.7)]">
            {cardObject.name}
          </p>
        ) : (
          <button
            className="focus-visible:outline-1 -focus-visible:-outline-offset-3 focus-visible:outline-focusborder transition-colors duration-200 underline decoration-dotted decoration-[1.5px] underline-offset-[0.25em] decoration-text/50 hover:decoration-text text-[max(0.7rem,9cqw)] leading-tight opacity-90 [text-shadow:0_2px_4px_rgba(0,0,0,0.7)]"
            type="button"
            onClick={() => {
              onInfoClick();
              playSound(sounds.toggleOnSound);
            }}
          >
            {cardObject.name}
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

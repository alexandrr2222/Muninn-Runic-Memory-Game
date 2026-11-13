import { sounds } from "@/shared/sound/sounds";
import { useSound } from "@/shared/sound/useSound";
import type { CardType } from "@/shared/types";
import { useEffect, useRef } from "react";

export function CardPopUp({
  infoCard,
  onClose,
}: {
  infoCard: CardType | null;
  onClose: () => void;
}) {
  const popUpRef = useRef<HTMLDialogElement>(null);
  const playSound = useSound();
  const actionStyle =
    "px-6 text-xl opacity-85 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text";

  useEffect(() => {
    if (!infoCard) return;
    popUpRef.current?.showModal();
    popUpRef.current?.focus();
  }, [infoCard]);

  if (!infoCard) return;
  return (
    <dialog
      ref={popUpRef}
      onClose={onClose}
      className="outline-none bg-transparent m-auto w-[min(44rem,100vw)] max-h-svh overflow-y-auto bg-[radial-gradient(closest-side,rgba(0,0,0,0.55),transparent)] px-6 py-8 sm:p-20 text-center text-text opacity-0 transition-all transition-discrete duration-300 motion-reduce:transition-none open:opacity-100 starting:open:opacity-0 backdrop:bg-black/0 backdrop:backdrop-blur-none backdrop:transition-all backdrop:transition-discrete backdrop:duration-300 open:backdrop:bg-black/60 open:backdrop:backdrop-blur-[5px] starting:open:backdrop:bg-black/0 starting:open:backdrop:backdrop-blur-none"
    >
      <h3 className="font-norse text-5xl sm:text-6xl [text-shadow:0_2px_4px_rgba(0,0,0,0.7)]">
        {infoCard.fetchedWikiTitle + " / " + infoCard.name}
      </h3>

      <p className="mt-6 text-lg sm:mt-8 sm:text-xl leading-relaxed [text-shadow:0_2px_4px_rgba(0,0,0,0.7)]">
        {infoCard.fetchedWikiExtract}
      </p>

      <div className="mx-auto mt-6 flex w-fit justify-center border-t border-text/30 pt-6">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={infoCard.fetchedWikiUrl}
          onClick={() => playSound(sounds.toggleOnSound)}
          className={`group whitespace-nowrap ${actionStyle}`}
        >
          Read more{" "}
          <span className="inline-block transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            ↗
          </span>
        </a>
        <button
          type="button"
          onClick={() => {
            if (popUpRef.current) popUpRef.current.close();
          }}
          className={actionStyle}
        >
          Close
        </button>
      </div>
    </dialog>
  );
}

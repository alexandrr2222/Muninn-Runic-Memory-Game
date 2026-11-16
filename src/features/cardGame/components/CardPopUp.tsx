import { sounds } from "@/shared/sound/sounds";
import { useSound } from "@/shared/sound/useSound";
import type { WikiDataType } from "@/shared/types";
import { useEffect, useRef } from "react";

export function CardPopUp({
  wikiData,
  onClose,
}: {
  wikiData: WikiDataType | undefined;
  onClose: () => void;
}) {
  const popUpRef = useRef<HTMLDialogElement>(null);
  const playSound = useSound();
  const actionStyle =
    "px-6 text-xl opacity-85 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text";

  useEffect(() => {
    if (!wikiData) return;
    popUpRef.current?.showModal();
    popUpRef.current?.focus();
  }, [wikiData]);

  if (!wikiData) return;
  return (
    <dialog
      ref={popUpRef}
      onClose={onClose}
      className="outline-none bg-transparent m-auto w-[min(44rem,100vw)] max-h-svh overflow-y-auto bg-[radial-gradient(closest-side,rgba(0,0,0,0.55),transparent)] px-6 py-8 sm:p-20 text-center text-text opacity-0 transition-all transition-discrete duration-300 motion-reduce:transition-none open:opacity-100 starting:open:opacity-0 backdrop:bg-black/0 backdrop:backdrop-blur-none backdrop:transition-all backdrop:transition-discrete backdrop:duration-300 open:backdrop:bg-black/60 open:backdrop:backdrop-blur-[5px] starting:open:backdrop:bg-black/0 starting:open:backdrop:backdrop-blur-none"
    >
      <h3 className="font-norse text-5xl sm:text-6xl [text-shadow:0_2px_4px_rgba(0,0,0,0.7)]">
        {wikiData.title + " / " + wikiData.cardName}
      </h3>

      <p className="mt-6 text-lg sm:mt-8 sm:text-xl leading-relaxed [text-shadow:0_2px_4px_rgba(0,0,0,0.7)]">
        {wikiData.extract}
      </p>

      <div className="mx-auto mt-6 flex w-fit justify-center border-t border-text/30 pt-6">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={wikiData.url}
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

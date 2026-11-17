import { sounds } from "@/shared/sound/sounds";
import { useSound } from "@/shared/sound/useSound";
import { useEffect, useRef, useState, type ReactNode } from "react";

export function Modal({
  children,
  onClose,
  title,
  open,
}: {
  children: ReactNode;
  onClose: () => void;
  title: string;
  open: boolean;
}) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const playSound = useSound();

  // stores last props so when they actually change they dont dissapear before fade out
  const [internalTitle, setInternalTitle] = useState<string>();
  const [internalChildren, setInternalChildren] = useState<ReactNode>();
  if ((title !== internalTitle || children !== internalChildren) && open) {
    setInternalTitle(title);
    setInternalChildren(children);
  }

  useEffect(() => {
    // important for Tutorial.tsx that opens only once
    if (!open) return;
    modalRef.current?.showModal();
    modalRef.current?.focus();
  }, [open]);

  return (
    <dialog
      ref={modalRef}
      onClose={() => {
        playSound(sounds.toggleOnSound);
        onClose();
      }}
      className="outline-none bg-transparent m-auto w-[min(44rem,100vw)] max-h-svh overflow-y-auto bg-[radial-gradient(closest-side,rgba(0,0,0,0.55),transparent)] px-6 py-8 sm:p-20 text-center text-text opacity-0 transition-all transition-discrete duration-300 motion-reduce:transition-none open:opacity-100 starting:open:opacity-0 backdrop:bg-black/0 backdrop:backdrop-blur-none backdrop:transition-all backdrop:transition-discrete backdrop:duration-300 open:backdrop:bg-black/60 open:backdrop:backdrop-blur-[5px] starting:open:backdrop:bg-black/0 starting:open:backdrop:backdrop-blur-none"
    >
      <h3 className="font-norse text-5xl sm:text-6xl [text-shadow:0_2px_4px_rgba(0,0,0,0.7)]">
        {internalTitle}
      </h3>
      {internalChildren}
    </dialog>
  );
}

import type { ReactNode } from "react";

export function ModalText({ children }: { children: ReactNode }) {
  return (
    <p className="mt-6 text-lg sm:mt-8 sm:text-xl leading-relaxed [text-shadow:0_2px_4px_rgba(0,0,0,0.7)]">
      {children}
    </p>
  );
}

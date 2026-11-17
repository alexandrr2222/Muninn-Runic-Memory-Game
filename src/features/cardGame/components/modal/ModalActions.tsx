import type { ReactNode } from "react";

export function ModalActions({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto mt-6 flex w-fit justify-center border-t border-text/30 pt-6">
      {children}
    </div>
  );
}

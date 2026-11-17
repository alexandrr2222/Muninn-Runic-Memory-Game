import { actionButton } from "./styles";

export function ModalCloseButton({ text }: { text: string }) {
  return (
    <form method="dialog">
      <button type="submit" className={actionButton}>
        {text}
      </button>
    </form>
  );
}

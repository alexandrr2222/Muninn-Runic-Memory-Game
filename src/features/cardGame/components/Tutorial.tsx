import { ModalText } from "./modal/ModalText";
import { Modal } from "./modal/Modal";
import { ModalCloseButton } from "./modal/ModalCloseButton";
import { ModalActions } from "./modal/ModalActions";

export function Tutorial({ amountOfCards }: { amountOfCards: number }) {
  return (
    <Modal
      onClose={() => localStorage.setItem("seenTutorial", "true")}
      title="How to play"
      open={!localStorage.getItem("seenTutorial")}
    >
      <ModalText>
        Pick a rune each round, but never pick the same rune twice, because the
        cards reshuffle after every pick. Pick all {amountOfCards} without
        repeating one to win.
      </ModalText>
      <ModalActions>
        <ModalCloseButton text="Understood!" />
      </ModalActions>
    </Modal>
  );
}

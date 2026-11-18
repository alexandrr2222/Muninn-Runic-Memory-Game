import type { CardType } from "../deck/types";
import type { GameStatusType } from "../game/memoryGame";
import { Modal } from "./modal/Modal";
import { ModalActions } from "./modal/ModalActions";
import { ModalCloseButton } from "./modal/ModalCloseButton";
import { ModalText } from "./modal/ModalText";

export function EndDialog({
  gameStatus,
  onClose,
  losingCard,
}: {
  gameStatus: GameStatusType;
  onClose: () => void;
  losingCard: CardType | undefined;
}) {
  return (
    <Modal
      open={gameStatus !== null}
      onClose={onClose}
      title={gameStatus === "lost" ? "You lost!" : "You won!"}
    >
      {losingCard ? (
        <>
          <img
            src={losingCard.icon}
            alt={losingCard.name}
            draggable={false}
            className="mx-auto mt-6 w-36 sm:mt-8 sm:w-56 select-none filter-[url(#warm)_drop-shadow(0_14px_18px_rgba(0,0,0,0.75))]"
          />
          <ModalText>
            <span>
              You already picked
              <span className="text-highlight italic">
                {" " + losingCard.name + "."}
              </span>
            </span>
            <br />
            Each rune can only be picked once.
          </ModalText>
        </>
      ) : null}
      <ModalActions>
        <ModalCloseButton text="Play again" />
      </ModalActions>
    </Modal>
  );
}

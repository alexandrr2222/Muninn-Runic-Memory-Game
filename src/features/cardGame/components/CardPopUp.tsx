import { sounds } from "@/shared/sound/sounds";
import { useSound } from "@/shared/sound/useSound";
import type { WikiDataType } from "../wiki/fetchWiki";
import { Modal } from "./modal/Modal";
import { ModalText } from "./modal/ModalText";
import { ModalActions } from "./modal/ModalActions";
import { ModalCloseButton } from "./modal/ModalCloseButton";
import { actionButton } from "./modal/styles";

export function CardPopUp({
  wikiData,
  onClose,
}: {
  wikiData: WikiDataType | undefined;
  onClose: () => void;
}) {
  const playSound = useSound();
  return (
    <Modal
      onClose={onClose}
      title={wikiData?.title + " / " + wikiData?.cardName}
      open={wikiData !== undefined}
    >
      <ModalText>{wikiData?.extract}</ModalText>
      <ModalActions>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={wikiData?.url}
          onClick={() => playSound(sounds.toggleOnSound)}
          className={`group whitespace-nowrap ${actionButton}`}
        >
          Read more{" "}
          <span className="inline-block transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            ↗
          </span>
        </a>
        <ModalCloseButton text="Close" />
      </ModalActions>
    </Modal>
  );
}

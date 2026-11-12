import { useEffect, useRef, useState } from "react";
import { Card } from "./Card";
import { cards } from "./CardsArray";
import { shuffle } from "./shuffleCards";
import type { CardType } from "@/shared/types";
import { EndDialog } from "./EndDialog";
import { sounds } from "@/shared/sound/sounds";
import { fetchWiki } from "@/features/cardInfo/wikiFetch";
import type { WikiDataType } from "@/shared/types";
import { CardPopUp } from "@/features/cardInfo/CardPopUp";
import { Tutorial } from "@/features/cardGame/Tutorial";
import { useSound } from "@/shared/sound/useSound";
import { ScoreCounter } from "./ScoreCounter";
export function CardGame() {
  const playSound = useSound();
  const popUpRef = useRef<HTMLDialogElement>(null);
  const [wikiData, setWikiData] = useState<Array<WikiDataType>>([]);
  useEffect(() => {
    fetchWiki(cards, setWikiData);
  }, []);
  const [deck, setDeck] = useState(() => shuffle(cards));
  const [clickedCards, setClickedCards] = useState<Array<CardType>>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [gameStatus, setGameStatus] = useState<null | "won" | "lost">(null);
  const [round, setRound] = useState(0);
  const [gameLock, setGameLock] = useState(false);
  const [lastCard, setLastCard] = useState<CardType | null>(null);
  const [lastInfo, setLastInfo] = useState<CardType | null>(null);
  const rate = 1 + (clickedCards.length / cards.length) * (1.23 - 1);
  function handleCardClick(cardObject: CardType) {
    if (gameLock) return;
    setGameLock(true);
    setTimeout(() => {
      setGameLock(false);
    }, 2000);
    setLastCard(cardObject);
    if (clickedCards.some((cc) => cc.id === cardObject.id)) {
      playSound(sounds.loseSound);
      setGameStatus("lost");
      dialogRef.current?.showModal();
      dialogRef.current?.focus();
    } else if (clickedCards.length === cards.length - 1) {
      playSound(sounds.winSound);
      setClickedCards([...clickedCards, cardObject]);
      setGameStatus("won");
      dialogRef.current?.showModal();
      dialogRef.current?.focus();
    } else {
      const randomKnock =
        sounds.knockSoundArray[
          Math.floor(Math.random() * sounds.knockSoundArray.length)
        ];
      randomKnock.playbackRate = rate;
      randomKnock.currentTime = 0;
      playSound(randomKnock);

      setClickedCards([...clickedCards, cardObject]);
      setDeck(shuffle(cards));
      setRound(round + 1);
    }
  }
  let lastWikiData;
  if (lastInfo !== null)
    lastWikiData = wikiData.find((data) => data.id === lastInfo.id);
  return (
    <main className="flex-1 flex flex-col justify-center pt-6 sm:pt-10 lg:pt-15">
      <Tutorial />
      <CardPopUp
        popUpRef={popUpRef}
        title={lastWikiData?.title + " / " + lastInfo?.name}
        text={lastWikiData?.extract}
        url={lastWikiData?.url}
      ></CardPopUp>
      <EndDialog
        dialogRef={dialogRef}
        onClick={() => {
          if (dialogRef.current) dialogRef.current.close();
        }}
        onClose={() => {
          playSound(sounds.toggleOnSound);

          setGameLock(true);
          setTimeout(() => {
            setGameLock(false);
          }, 2000);
          setRound(round + 1);
          setClickedCards([]);
          setDeck(shuffle(cards));
        }}
        statusText={gameStatus === "won" ? "You won" : `You lost`}
        lastCard={lastCard}
      />
      <div
        className="board mx-auto grid w-full grid-cols-[repeat(var(--cols),minmax(0,1fr))] gap-x-(--gap-x) gap-y-(--gap-y)"
        style={{ "--count": cards.length } as React.CSSProperties}
      >
        {deck.map((c, i) => {
          return (
            <Card
              index={i}
              cardObject={c}
              key={c.id}
              onClick={handleCardClick}
              round={round}
              gameLock={gameLock}
              wikiData={wikiData[c.id - 1]}
              setLastInfo={setLastInfo}
              popUpRef={popUpRef}
            />
          );
        })}
      </div>
      <ScoreCounter score={clickedCards.length} maxScore={cards.length} />
    </main>
  );
}

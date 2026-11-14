import { useEffect, useState } from "react";
import { Card } from "./components/Card";
import { baseCards } from "./CardsArray";
import { shuffle } from "./shuffleCards";
import type { CardType } from "@/shared/types";
import { EndDialog } from "./components/EndDialog";
import { sounds } from "@/shared/sound/sounds";
import { CardPopUp } from "@/features/cardGame/components/CardPopUp";
import { Tutorial } from "@/features/cardGame/components/Tutorial";
import { useSound } from "@/shared/sound/useSound";
import { ScoreCounter } from "./components/ScoreCounter";
import { fetchWiki } from "./wikiFetch";
export function CardGame() {
  const playSound = useSound();
  const [cards, setCards] = useState<Array<CardType>>(shuffle(baseCards));
  useEffect(() => {
    fetchWiki(cards, setCards);
  }, []);

  const [round, setRound] = useState(0);
  const [gameLock, setGameLock] = useState(false);
  const [lastCard, setLastCard] = useState<CardType | null>(null);

  const [clickedCards, setClickedCards] = useState<Array<CardType>>([]);
  const [gameStatus, setGameStatus] = useState<null | "won" | "lost">(null);

  const [infoCard, setInfoCard] = useState<CardType | null>(null);
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
    } else if (clickedCards.length === cards.length - 1) {
      playSound(sounds.winSound);
      setClickedCards([...clickedCards, cardObject]);
      setGameStatus("won");
    } else {
      const randomKnock =
        sounds.knockSoundArray[
          Math.floor(Math.random() * sounds.knockSoundArray.length)
        ];
      randomKnock.playbackRate = rate;
      randomKnock.currentTime = 0;
      playSound(randomKnock);

      setClickedCards([...clickedCards, cardObject]);
      setCards(shuffle(cards));
      setRound(round + 1);
    }
  }
  function restartGame() {
    playSound(sounds.toggleOnSound);
    setGameLock(true);
    setTimeout(() => {
      setGameLock(false);
    }, 2000);
    setRound(round + 1);
    setClickedCards([]);
    setCards(shuffle(cards));
    setGameStatus(null);
  }
  return (
    <main className="flex-1 flex flex-col justify-center pt-6 sm:pt-10 lg:pt-15">
      <Tutorial />
      <CardPopUp
        infoCard={infoCard}
        onClose={() => {
          playSound(sounds.toggleOnSound);
          setInfoCard(null);
        }}
      />
      <EndDialog
        onClose={restartGame}
        gameStatus={gameStatus}
        lastCard={lastCard}
      />
      <div
        className="board mx-auto grid w-full grid-cols-[repeat(var(--cols),minmax(0,1fr))] gap-x-(--gap-x) gap-y-(--gap-y)"
        style={{ "--count": cards.length } as React.CSSProperties}
      >
        {cards.map((c, i) => {
          return (
            <Card
              index={i}
              cardObject={c}
              key={c.id}
              onClick={handleCardClick}
              round={round}
              gameLock={gameLock}
              onInfoClick={() => {
                setInfoCard(c);
                playSound(sounds.toggleOnSound);
              }}
            />
          );
        })}
      </div>
      <ScoreCounter score={clickedCards.length} maxScore={cards.length} />
    </main>
  );
}

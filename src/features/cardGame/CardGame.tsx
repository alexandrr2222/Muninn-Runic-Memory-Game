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
  // effect
  const playSound = useSound();
  // rule
  const [cards, setCards] = useState<Array<CardType>>(shuffle(baseCards));
  const [clickedCards, setClickedCards] = useState<Array<CardType>>([]);
  // data
  useEffect(() => {
    fetchWiki(cards, setCards);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // view
  const [infoCard, setInfoCard] = useState<CardType | null>(null);

  // effects for animation
  const [round, setRound] = useState(0);
  const [gameLock, setGameLock] = useState(false);
  // rule
  const [losingCard, setLosingCard] = useState<CardType | null>(null);

  // effect
  const rate = 1 + (clickedCards.length / cards.length) * (1.23 - 1);

  function handleCardClick(cardObject: CardType) {
    // effect
    if (gameLock) return;
    setGameLock(true);
    setTimeout(() => {
      setGameLock(false);
    }, 2000);

    // effect(sound) mixed mostly with rules
    if (clickedCards.some((cc) => cc.id === cardObject.id)) {
      playSound(sounds.loseSound);
      setLosingCard(cardObject);
    } else if (clickedCards.length === cards.length - 1) {
      playSound(sounds.winSound);
      setClickedCards([...clickedCards, cardObject]);
    } else {
      const randomKnock =
        sounds.knockSoundArray[
          Math.floor(Math.random() * sounds.knockSoundArray.length)
        ];
      randomKnock.playbackRate = rate;
      randomKnock.currentTime = 0;
      playSound(randomKnock);

      // rules
      setClickedCards([...clickedCards, cardObject]);
      setCards(shuffle(cards));
      setRound(round + 1);
    }
  }
  function restartGame() {
    // effect
    playSound(sounds.toggleOnSound);
    setGameLock(true);
    setTimeout(() => {
      setGameLock(false);
    }, 2000);
    setRound(round + 1);
    // rules
    setClickedCards([]);
    setCards(shuffle(cards));
    setLosingCard(null);
  }
  const gameStatus =
    clickedCards.length === cards.length
      ? "won"
      : losingCard !== null
        ? "lost"
        : null;
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
        losingCard={losingCard}
        gameStatus={gameStatus}
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

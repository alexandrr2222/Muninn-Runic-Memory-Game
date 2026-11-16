import { useEffect, useState } from "react";
import { Card } from "./components/Card";
import { baseCards } from "./CardsArray";
import type { CardType, WikiDataType } from "@/shared/types";
import { EndDialog } from "./components/EndDialog";
import { sounds } from "@/shared/sound/sounds";
import { CardPopUp } from "@/features/cardGame/components/CardPopUp";
import { Tutorial } from "@/features/cardGame/components/Tutorial";
import { useSound } from "@/shared/sound/useSound";
import { ScoreCounter } from "./components/ScoreCounter";
import { fetchWiki } from "./wikiFetch";
import { getStatus, newGame, pickCard, type GameType } from "./memoryGame";

export function CardGame() {
  const [game, setGame] = useState<GameType>(() => newGame(baseCards));

  const [wikiData, setWikiData] = useState<Array<WikiDataType> | null>(null);
  const [infoCard, setInfoCard] = useState<CardType | null>(null);

  useEffect(() => {
    fetchWiki(baseCards).then(setWikiData);
  }, []);

  const [round, setRound] = useState(0);
  const [gameLock, setGameLock] = useState(false);
  const playSound = useSound();

  function handleCardClick(c: CardType) {
    if (gameLock) return;
    setGameLock(true);
    setTimeout(() => {
      setGameLock(false);
    }, 2000);

    const next = pickCard(game, c.id);
    setGame(next);
    const status = getStatus(next);
    if (status === "lost") playSound(sounds.loseSound);
    else if (status === "won") playSound(sounds.winSound);
    else {
      playSound(sounds.winSound, {
        rateProgress: game.clickedCardIds.length / game.cards.length,
        soundArray: sounds.knockSoundArray,
      });
      setRound(round + 1);
    }
  }
  function restartGame() {
    playSound(sounds.toggleOnSound);
    setGame(newGame(game.cards));
    setGameLock(true);
    setTimeout(() => {
      setGameLock(false);
    }, 2000);
    setRound(round + 1);
  }

  return (
    <main className="flex-1 flex flex-col justify-center pt-6 sm:pt-10 lg:pt-15">
      <Tutorial />
      <CardPopUp
        wikiData={wikiData?.find((wd) => wd.id === infoCard?.id)}
        onClose={() => {
          playSound(sounds.toggleOnSound);
          setInfoCard(null);
        }}
      />
      <EndDialog
        onClose={restartGame}
        losingCard={game.cards.find((c) => c.id === game.losingCardId)}
        gameStatus={getStatus(game)}
      />
      <div
        className="board mx-auto grid w-full grid-cols-[repeat(var(--cols),minmax(0,1fr))] gap-x-(--gap-x) gap-y-(--gap-y)"
        style={{ "--count": game.cards.length } as React.CSSProperties}
      >
        {game.cards.map((c, i) => {
          return (
            <Card
              index={i}
              cardObject={c}
              key={c.id}
              onClick={() => {
                handleCardClick(c);
              }}
              wikiData={wikiData?.find((wd) => wd.id === c.id)}
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
      <ScoreCounter
        score={game.clickedCardIds.length}
        maxScore={game.cards.length}
      />
    </main>
  );
}

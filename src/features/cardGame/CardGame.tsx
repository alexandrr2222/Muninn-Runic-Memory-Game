import { useState } from "react";
import { Card } from "./components/Card";
import type { CardType } from "./types";
import { EndDialog } from "./components/EndDialog";
import { CardPopUp } from "@/features/cardGame/components/CardPopUp";
import { Tutorial } from "@/features/cardGame/components/Tutorial";
import { ScoreCounter } from "./components/ScoreCounter";
import { useMemoryGame } from "./useMemoryGame";
import { useWikiData } from "./useWikiData";

export function CardGame() {
  const [infoCard, setInfoCard] = useState<CardType | null>(null);

  const getWikiFor = useWikiData();

  const {
    score,
    maxScore,
    cards,
    gameStatus,
    losingCard,
    round,
    gameLock,
    applyCard,
    restart,
  } = useMemoryGame();

  return (
    <main className="flex-1 flex flex-col justify-center pt-6 sm:pt-10 lg:pt-15">
      <Tutorial />
      <CardPopUp
        wikiData={getWikiFor(infoCard?.id)}
        onClose={() => setInfoCard(null)}
      />
      <EndDialog
        onClose={restart}
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
              onClick={() => applyCard(c.id)}
              hasWikiInfo={getWikiFor(c.id) ? true : false}
              round={round}
              gameLock={gameLock}
              onInfoClick={() => setInfoCard(c)}
            />
          );
        })}
      </div>
      <ScoreCounter score={score} maxScore={maxScore} />
    </main>
  );
}

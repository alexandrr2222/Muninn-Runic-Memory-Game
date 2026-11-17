import { useState } from "react";
import { getStatus, newGame, pickCard, type GameType } from "./memoryGame";
import { useSound } from "@/shared/sound/useSound";
import { baseCards } from "./CardsArray";
import { sounds } from "@/shared/sound/sounds";
import { FLIP_DURATION_MS } from "./flipDuration";

// React shell around memoryGame: holds the state,
// locks input during the card flip, plays sounds
export function useMemoryGame() {
  const [game, setGame] = useState<GameType>(() => newGame(baseCards));
  const [round, setRound] = useState(0);
  const [gameLock, setGameLock] = useState(false);
  const playSound = useSound();

  const score = game.clickedCardIds.length;
  const maxScore = game.cards.length;
  const cards = game.cards;
  const losingCard = game.cards.find((c) => c.id === game.losingCardId);
  const gameStatus = getStatus(game);

  function startLockCycle() {
    setGameLock(true);
    setTimeout(() => {
      setGameLock(false);
    }, FLIP_DURATION_MS);
  }

  function restart() {
    playSound(sounds.toggleOnSound);
    setGame(newGame(game.cards));
    startLockCycle();
    setRound(round + 1);
  }

  function applyCard(cardId: number) {
    if (gameLock) return;
    startLockCycle();

    const next = pickCard(game, cardId);
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
  return {
    score,
    maxScore,
    cards,
    gameStatus,
    losingCard,
    round,
    gameLock,
    applyCard,
    restart,
  };
}

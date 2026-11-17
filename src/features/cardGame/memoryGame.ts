import type { CardType } from "./types";
import { shuffle } from "./shuffleCards";

export type GameType = {
  cards: Array<CardType>;
  clickedCardIds: Array<number>;
  losingCardId: number | null;
};
export type GameStatusType = null | "won" | "lost";
// applies players click: picking a same card loses the game,
// picking last unpicked card wins the game otherwise
// reshuffles cards
export function pickCard(game: GameType, cardId: number): GameType {
  const status = getStatus(game);
  if (status !== null) return game;

  // lose
  if (game.clickedCardIds.includes(cardId))
    return { ...game, losingCardId: cardId };
  // win
  else if (game.clickedCardIds.length === game.cards.length - 1)
    return { ...game, clickedCardIds: [...game.clickedCardIds, cardId] };

  // continue
  return {
    ...game,
    clickedCardIds: [...game.clickedCardIds, cardId],
    cards: shuffle(game.cards),
  };
}

// Creates a fresh, shuffled game from these cards
export function newGame(cards: Array<CardType>): GameType {
  return { cards: shuffle(cards), clickedCardIds: [], losingCardId: null };
}

// returns whether the game is won, lost or still in progress
export function getStatus(game: GameType): GameStatusType {
  if (game.clickedCardIds.length === game.cards.length) return "won";
  else if (game.losingCardId !== null) return "lost";
  else return null;
}

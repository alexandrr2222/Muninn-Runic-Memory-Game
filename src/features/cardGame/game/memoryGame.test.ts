import { describe, it, expect } from "vitest";
import { newGame, pickCard, getStatus } from "./memoryGame";
import type { CardType } from "../deck/types";

// Small fake deck: the rules don't care what the cards are,
// and the tests shouldn't depend on real assets.
const cards: Array<CardType> = [
  { id: 0, name: "A", icon: "", wikiTitle: "" },
  { id: 1, name: "B", icon: "", wikiTitle: "" },
  { id: 2, name: "C", icon: "", wikiTitle: "" },
];

describe("newGame", () => {
  it("starts with nothing picked and no result", () => {
    const game = newGame(cards);

    expect(game.clickedCardIds).toEqual([]);
    expect(game.losingCardId).toBeNull();
    expect(getStatus(game)).toBeNull();
  });

  it("keeps the same cards, in any order", () => {
    const game = newGame(cards);

    expect(game.cards).toHaveLength(cards.length);
    expect(game.cards).toEqual(expect.arrayContaining(cards));
  });
});

describe("pickCard", () => {
  it("records a new pick and keeps the game going", () => {
    const game = pickCard(newGame(cards), 0);

    expect(game.clickedCardIds).toEqual([0]);
    expect(getStatus(game)).toBeNull();
  });

  it("does not change the game it was given", () => {
    const before = newGame(cards);
    pickCard(before, 0);

    expect(before.clickedCardIds).toEqual([]);
  });

  it("loses when the same card is picked twice", () => {
    let game = newGame(cards);
    game = pickCard(game, 1);
    game = pickCard(game, 1);

    expect(getStatus(game)).toBe("lost");
    expect(game.losingCardId).toBe(1);
  });

  it("wins when every card is picked once", () => {
    let game = newGame(cards);
    for (const card of cards) game = pickCard(game, card.id);

    expect(getStatus(game)).toBe("won");
    expect(game.clickedCardIds).toHaveLength(cards.length);
  });

  it("ignores picks after the game is lost", () => {
    let game = newGame(cards);
    game = pickCard(game, 0);
    game = pickCard(game, 0);

    expect(pickCard(game, 2)).toBe(game);
  });

  it("ignores picks after the game is won", () => {
    let game = newGame(cards);
    for (const card of cards) game = pickCard(game, card.id);

    expect(pickCard(game, 0)).toBe(game);
  });
});

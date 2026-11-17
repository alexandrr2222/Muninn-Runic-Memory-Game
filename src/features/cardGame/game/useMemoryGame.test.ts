// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMemoryGame } from "./useMemoryGame";
import { baseCards } from "../deck/cards";
import { sounds } from "@/shared/sound/sounds";

// Replace useSound with a spy: the tests check which sound was asked for,
// and jsdom can't actually play audio.
const playSound = vi.hoisted(() => vi.fn());
vi.mock("@/shared/sound/useSound", () => ({ useSound: () => playSound }));

const FLIP_DURATION_MS = 2000;
const [first, second] = baseCards;

function renderGame() {
  return renderHook(() => useMemoryGame());
}
type Game = ReturnType<typeof renderGame>["result"];

function pick(game: Game, cardId: number) {
  act(() => game.current.applyCard(cardId));
}
function waitForFlip() {
  act(() => vi.advanceTimersByTime(FLIP_DURATION_MS));
}

beforeEach(() => {
  vi.useFakeTimers();
  playSound.mockClear();
});
afterEach(() => {
  vi.useRealTimers();
});

describe("useMemoryGame", () => {
  it("starts a fresh, unlocked game", () => {
    const { result } = renderGame();

    expect(result.current.score).toBe(0);
    expect(result.current.maxScore).toBe(baseCards.length);
    expect(result.current.gameStatus).toBeNull();
    expect(result.current.losingCard).toBeUndefined();
    expect(result.current.round).toBe(0);
    expect(result.current.gameLock).toBe(false);
  });

  it("scores a new pick, starts the next round and plays a knock", () => {
    const { result } = renderGame();

    pick(result, first.id);

    expect(result.current.score).toBe(1);
    expect(result.current.round).toBe(1);
    expect(playSound).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ soundArray: sounds.knockSoundArray }),
    );
  });

  it("ignores picks while the cards are flipping", () => {
    const { result } = renderGame();

    pick(result, first.id);
    pick(result, second.id);

    expect(result.current.gameLock).toBe(true);
    expect(result.current.score).toBe(1);
  });

  it("unlocks once the flip is over", () => {
    const { result } = renderGame();

    pick(result, first.id);
    waitForFlip();
    pick(result, second.id);

    expect(result.current.score).toBe(2);
  });

  it("loses on a repeated pick and plays the lose sound", () => {
    const { result } = renderGame();

    pick(result, first.id);
    waitForFlip();
    pick(result, first.id);

    expect(result.current.gameStatus).toBe("lost");
    expect(result.current.losingCard?.id).toBe(first.id);
    expect(playSound).toHaveBeenLastCalledWith(sounds.loseSound);
  });

  it("wins after picking every card once and plays the win sound", () => {
    const { result } = renderGame();

    for (const card of baseCards) {
      pick(result, card.id);
      waitForFlip();
    }

    expect(result.current.gameStatus).toBe("won");
    expect(result.current.score).toBe(baseCards.length);
    expect(playSound).toHaveBeenLastCalledWith(sounds.winSound);
  });

  it("restart resets the game and starts a new round", () => {
    const { result } = renderGame();
    pick(result, first.id);
    waitForFlip();
    pick(result, first.id);
    const roundBefore = result.current.round;

    act(() => result.current.restart());

    expect(result.current.score).toBe(0);
    expect(result.current.gameStatus).toBeNull();
    expect(result.current.losingCard).toBeUndefined();
    expect(result.current.round).toBe(roundBefore + 1);
    expect(playSound).toHaveBeenLastCalledWith(sounds.toggleOnSound);
  });

  it("restart works even while the cards are flipping", () => {
    const { result } = renderGame();
    pick(result, first.id);

    act(() => result.current.restart());

    expect(result.current.score).toBe(0);
  });
});

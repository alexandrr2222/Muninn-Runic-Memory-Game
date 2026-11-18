# Muninn

A memory card game built around the 16 runes of the Younger Futhark. Every round the cards reshuffle. Pick each rune exactly once to win.

Named after one of Odin's ravens, whose name means "memory".

**Play it:** https://muninn-5cy.pages.dev

## About

Built as the memory card project for The Odin Project's React course, then refactored using the ideas from _A Philosophy of Software Design_. The rune names link to their Wikipedia entries, pulled live from the Wikipedia REST API.

Stack: React, TypeScript, Vite, Tailwind CSS v4, Motion, react-parallax-tilt. Tested with Vitest and React Testing Library.

## How it's built

```
src/
├── app/                  entry point, header, global styles
├── features/
│   ├── cardGame/
│   │   ├── CardGame.tsx      the screen: renders, holds no game logic
│   │   ├── game/             rules (pure) and the React hook around them
│   │   ├── deck/             the 16 runes, their type and card art
│   │   ├── wiki/             fetching rune info from Wikipedia
│   │   └── components/       cards, score, dialogs and the shared Modal
│   └── musicPlayer/
└── shared/               settings, sound, generic UI
```

Folder boundaries are enforced by `eslint-plugin-boundaries`: shared code can't import from features, and features can't import from the app.

### Design decisions

- **The game rules are pure functions.** `game/memoryGame.ts` takes the current game and returns the next one, with no React, timers or sound. `useMemoryGame` is a thin shell around it that holds the state, locks input during the card flip and plays sounds. That's what makes the rules easy to test.
- **Wikipedia data is kept apart from game state.** It's server data: it arrives once, can fail, and never changes during play. It lives in its own hook, so a slow response can't overwrite a shuffle or wipe progress. Failed requests are simply left out, and the card falls back to its name.
- **Status is derived, not stored.** Won or lost is computed from the game state, so a "lost with no losing card" state can't exist.
- **One Modal owns the dialog behaviour.** Opening, closing (through native `<form method="dialog">`), the close sound and the fade-out live in one component. It keeps showing its last content while it fades out, so no dialog flashes the wrong text on close.
- **Timing that has to match lives in one constant.** The input lock and the card flip animation read the same `FLIP_DURATION_MS`.
- **The palette goes through one "night light" knob.** Every color is multiplied by a warm white point set by two CSS variables, so the warmth of the whole page can be tuned in one place.

## Testing

30 tests cover:

- the game rules: picking a card twice loses, picking every card wins, picks after the game ends are ignored
- `useMemoryGame`: the input lock during the flip, restarting, and which sound plays (with fake timers and a mocked sound hook)
- fetching from Wikipedia, with `fetch` mocked: title clean-up and failed requests
- settings: defaults, merging saved values, broken saved data, saving changes

## What I learned

- **Separating rules from React.** Pure functions for the logic plus a small hook for state and side effects. The rules became testable without rendering anything.
- **Server state vs client state.** Data from an API and data the app creates have different lifetimes, so they get different homes.
- **Deep modules and information hiding.** The screen gets finished values and two actions from the game hook, and never sees how the game works inside.
- **useEffect for side effects**, like syncing the music player with settings, and when an effect isn't needed at all (a lazy `useState` initializer or an event handler is often enough).
- **Fetching in parallel** with `Promise.allSettled`, so one failed request doesn't break the other fifteen.
- **Native `<dialog>`**: `showModal()`, closing with `<form method="dialog">`, and keeping exit animations working when React state resets.
- **Testing**: Vitest, React Testing Library's `renderHook`, mocking modules and `fetch`, and fake timers.
- **Keys and layout animations**: stable keys let Motion animate cards to their new positions on every shuffle instead of re-mounting them.
- **Browser audio quirks**: autoplay is blocked until the user interacts, and `play()` returns a promise that can reject.
- **Responsive layout without breakpoint soup**: CSS variables and `calc()` size the board to fit the screen, and container queries scale each label with its card.
- **Mobile performance**: heavy CSS filters like stacked drop shadows get recalculated every frame during animations and choke phones.

## Running locally

    bun install
    bun run dev

Tests and lint:

    bun run test
    bun run lint

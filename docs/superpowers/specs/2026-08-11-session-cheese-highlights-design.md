# Session-only cheese highlights

## Goal

The memory map must show unopened cheese markers in grayscale and markers opened during the current page lifetime in full color with a glow. The map must not show the `已找到` label.

## State behavior

- The collected cheese IDs live only in React state.
- Opening one of the first nine memories lights its cheese for the remainder of the current page lifetime.
- Returning from a memory detail to the map preserves highlights.
- Refreshing or reopening the site starts with every cheese marker gray.
- The tenth cheese unlocks only after the first nine cheeses have been opened during the current page lifetime.
- Refreshing relocks the tenth cheese but does not change site content or other page behavior.

## Implementation

- Initialize `collectedIds` as an empty `Set` in `App` and remove local storage reads and writes.
- Remove the collected status label from `MemoryMap` while retaining the collected class.
- Make the default marker grayscale; make collected and unlocked markers full color with the existing glow.
- Remove the unused progress storage module and update tests to exercise session-only state and refresh-style remount behavior.

## Validation

- Unit tests prove clicks persist across in-app navigation but not across an application remount.
- Browser QA checks gray initial markers, bright clicked markers, no `已找到` text, and gray markers after reload.
- Run the full Vitest suite, production build, and Sites packaging tests.

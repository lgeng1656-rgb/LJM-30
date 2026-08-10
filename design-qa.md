# Design QA — 李金蔓三十岁生日网站

## Evidence

- Source visual truth: the six user-provided screenshots and the corrected hero artwork supplied on 2026-08-10.
- Final side-by-side comparison: `docs/qa/finale-comparison.png` (reference left, implementation right).
- Final text-position comparison: `docs/qa/finale-position-comparison.png` (annotated target left, implementation right).
- 1600 × 900 implementation captures:
  - `docs/qa/hero-1600x900.png`
  - `docs/qa/map-1600x900.png`
  - `docs/qa/memory-1600x900.png`
  - `docs/qa/video-1600x900.png`
  - `docs/qa/finale-1600x900.png`
- Browser: Codex in-app Browser against `http://127.0.0.1:4173/`.
- State: public and unauthenticated; hero, 0/9 map, memory 07, final-video page, and birthday banner.

## Focused comparison

- Every state is contained by one viewport-centered 16:9 stage with no site header, navigation, outer card, page padding, or scrolling.
- Hero uses the user's corrected Tom-and-Jerry source image and crops it to fill 16:9 without distortion.
- Map fills the stage edge to edge. Nodes 01–09 open memories in any order; node 10 is visually distinct, locked at 0/9, and unlocks after the ninth memory.
- Memory detail remains inside the 16:9 stage and keeps the scrapbook media frame, note, and navigation controls visible at once.
- The final-video page reads “前面的九段快乐都找到了” and uses the full stage.
- Finale fills the stage. The old subtitle is absent, and “李金蔓，生日快乐！” fits completely inside the cloth banner.
- The final message is centered in the user-marked lower banner area rather than along the cloth's top edge.
- Finale entry includes scene settling plus a center-out banner-copy reveal, with a reduced-motion fallback.

## Findings

No actionable P0, P1, or P2 differences remain.

- [P3] Portrait displays letterbox the fixed 16:9 experience.
  - This is intentional because the user explicitly requested a 16:9 full-screen composition on every page.
  - A small landscape-viewing hint appears only on portrait screens.

## Primary interactions tested

- Entered the map from the hero.
- Opened memory 07 before memory 01.
- Returned to the map with progress retained.
- Confirmed cheese 10 stayed disabled before 9/9.
- Opened all nine memories in non-chronological order.
- Confirmed cheese 10 unlocked and opened the main-video page directly.
- Continued to the final banner and confirmed the removed subtitle did not render.
- Confirmed no browser console errors.

## Implementation checklist

- [x] Corrected user-supplied hero artwork
- [x] Full-screen 16:9 stage on every state
- [x] Nine nonlinear memory nodes
- [x] Cheese 10 as the final surprise
- [x] Image/video memory placeholders
- [x] Persistent valid 01–09 progress
- [x] “前面的九段” final-video copy
- [x] Concise birthday text fully inside banner
- [x] Banner-unfurl motion and reduced-motion support

final result: passed

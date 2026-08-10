# Design QA — 李金蔓三十岁生日网站

## Evidence

- Source visual truth: `C:\Users\32442\Documents\ChatGPT\李金蔓三十岁网站\docs\qa\reference-board.png`
- Combined comparison: `C:\Users\32442\Documents\ChatGPT\李金蔓三十岁网站\docs\qa\design-comparison.png`
- Implementation captures:
  - `docs/qa/implementation-home.png`
  - `docs/qa/implementation-map.png`
  - `docs/qa/implementation-detail.png`
  - `docs/qa/implementation-finale.png`
- Browser: Codex in-app Browser against `http://127.0.0.1:4173/`.
- Desktop CSS viewport: 1280 × 720, device pixel ratio 1.3125. Captures are 1265 × 712 or 1309 × 873 depending on visible browser chrome and page state.
- Mobile CSS viewport: 390 × 844. Body width remained within the viewport; the map intentionally owns a 900 px horizontally scrollable canvas inside a 341 px container.
- Source pixels: 1536 × 1024. The source is a six-state concept board rather than one runtime viewport, so fidelity was normalized by comparing the complete source board with four matching implementation states in one 2048 × 1365 contact sheet. No density-only differences were filed.
- State: public, unauthenticated; desktop home, 0/10 map, memory 07 detail, 10/10 final banner; mobile home and 10/10 map.

## Full-view comparison

The source board and implementation state contact sheet were opened together. The implementation preserves the source's cream paper field, warm brown calligraphic hierarchy, cheese-yellow and coral controls, rounded scrapbook frames, playful cat-and-mouse chase, map route, media frame, and warm celebration ending. The implementation uses generated standalone production assets rather than cropping the source board.

## Focused comparison

- Hero: checked two-line desktop title, visible primary CTA, left-copy/right-illustration balance, arch focal point and first-viewport height.
- Map: checked ten readable cheese controls, dotted-route context, 0/10 progress hierarchy, paper frame, and mobile horizontal exploration.
- Memory detail: checked 4:3 photo frame, four-slot rail, ruled-note treatment, title hierarchy and navigation controls.
- Finale: checked blank-cloth text placement, Tom/Jerry scale, warm arch, string lights, coral replay button and banner readability.
- Typography: checked display font personality, body/control weights, line height and mobile wrapping.

## Findings

No actionable P0, P1 or P2 differences remain.

- [P3] Mobile map requires horizontal panning.
  - Location: `.memory-map` at 390 px viewport.
  - Evidence: the full illustrated map remains 900 px wide inside a 341 px scroll container.
  - Impact: visitors see fewer stops at once, but touch targets stay legible and the large-map exploration metaphor is preserved.
  - Follow-up: add a subtle first-use pan cue only if user testing shows the gesture is missed.

## Comparison history

### Iteration 1

- [P2] Desktop hero title wrapped to four lines and pushed the CTA below the first viewport.
- [P2] Header navigation crowded at medium desktop width.
- Fixes: reduced desktop display scale, increased the copy column, moved hero copy upward, and introduced the compact header breakpoint at 1180 px.
- Post-fix evidence: `docs/qa/implementation-home.png` shows a two-line title, visible CTA, balanced illustration and fully visible navigation.

### Iteration 2

- [P2] Opening a memory from a lower map node preserved the map's scroll position, displaying the middle of the detail page.
- Fix: added screen-transition scroll restoration and a regression test.
- Post-fix evidence: `docs/qa/implementation-detail.png`; browser measurement reported `scrollY: 0` and the correct memory heading.

## Required fidelity surfaces

- Fonts and typography: passed. Display text uses a Chinese calligraphic serif stack; body and control type use a deliberate Chinese sans-serif stack. Desktop and mobile wrapping are readable.
- Spacing and layout rhythm: passed. Open paper layouts, scrapbook frames and route canvas match the concept without generic card grids.
- Colors and visual tokens: passed. Cream paper, cheese yellow, coral, sage and warm brown are centralized in `tokens.css` and remain consistent across states.
- Image quality and asset fidelity: passed. Hero, map, cheese and finale are project-local raster assets generated in the same watercolor storybook direction. No emoji, CSS character drawings or rough SVG substitutes are used.
- Copy and content: passed. Above-the-fold copy preserves the approved title and “开始追奶酪” CTA. Supporting copy, tip note and navigation correspond to the approved reference/spec; no extra badge, metric or marketing claim was introduced.

## Primary interactions tested

- Entered the map from the hero.
- Opened memory 07 before memory 01.
- Returned to the map with progress retained.
- Opened all ten memories in non-chronological order.
- Confirmed the final button stayed locked before completion and unlocked at 10/10.
- Confirmed missing media falls back to designed copy instead of blocking the flow.
- Continued from the blessing-video page to the final birthday banner.
- Checked browser console warnings/errors: none during the detail-state inspection.

## Implementation checklist

- [x] Desktop hero fidelity
- [x] Ten-node nonlinear map
- [x] Image/video memory frame and missing-media state
- [x] Persistent progress
- [x] Finale unlock and manual continuation
- [x] Birthday banner ending
- [x] 390 × 844 responsive check
- [x] Keyboard-visible semantic buttons and focus styles
- [x] Reduced-motion support

final result: passed

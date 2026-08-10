# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Confirmed Birthday Experience

- Treat `C:\Users\32442\Desktop\30岁生日\ChatGPT Image 2026年8月10日 19_49_18.png` as the visual source of truth.
- Use a cream paper scrapbook style with cheese yellow, coral pink, sage green, warm brown copy, rounded photo frames, and playful chase motion.
- 李金蔓 is Jerry. Tom represents work, tiredness, and everyday troubles; the finale turns the chase into companionship and celebration.
- Ten memories are non-chronological and can be opened in any order. Unlock the main blessing video only after all ten have been opened.
- The public site has no password. Build and verify locally before GitHub and Cloudflare deployment.

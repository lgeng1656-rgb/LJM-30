# Intro Video Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full-stage opening video that attempts audible autoplay, falls back to click-to-play, and allows entry to the existing home screen only after playback ends.

**Architecture:** A focused `IntroVideo` component owns media playback states and reports entry through `onEnter`. `App` adds an initial `intro` screen before the existing flow. The downloaded user asset is served from `public/media/intro/tom-and-jerry.mp4` without any COS credentials.

**Tech Stack:** React 19, TypeScript, HTML video, CSS, Vitest, Testing Library, Vite

## Global Constraints

- Never store the signed COS URL, temporary access key, security token, or signature in the repository.
- Attempt autoplay with sound, but show a click-to-play fallback when the browser rejects it.
- Do not allow normal clicks to skip a video that has not ended.
- Refreshing or reopening starts the intro again; internal navigation does not.
- Do not change the existing birthday home, map, memory, finale, or cheese-state behavior.

---

### Task 1: Build the intro component with media-state tests

**Files:**
- Create: `src/components/IntroVideo.tsx`
- Create: `src/components/IntroVideo.test.tsx`
- Modify: `src/styles/global.css`
- Create: `public/media/intro/tom-and-jerry.mp4`

**Interfaces:**
- Consumes: `videoSrc: string`, `onEnter: () => void`
- Produces: `IntroVideo` with autoplay-blocked, ended, and failed states

- [ ] **Step 1: Write failing component tests**

Render `IntroVideo`, stub `HTMLMediaElement.play`, and prove these behaviors:

```tsx
expect(screen.getByLabelText("生日开场视频")).toHaveAttribute("src", "/media/intro/tom-and-jerry.mp4");
fireEvent.click(screen.getByLabelText("生日开场视频"));
expect(onEnter).not.toHaveBeenCalled();
fireEvent.ended(screen.getByLabelText("生日开场视频"));
expect(screen.getByText("点击任意位置进入")).toBeInTheDocument();
fireEvent.click(screen.getByRole("button", { name: "点击任意位置进入" }));
expect(onEnter).toHaveBeenCalledOnce();
```

Also reject `play()` and assert `点击播放`; fire a media error and assert `直接进入`.

- [ ] **Step 2: Run tests and verify RED**

Run: `npm.cmd test -- --run src/components/IntroVideo.test.tsx`

Expected: FAIL because `IntroVideo` does not exist.

- [ ] **Step 3: Implement the minimal component**

Use a video ref and attempt unmuted playback on mount:

```tsx
type IntroVideoProps = { videoSrc: string; onEnter: () => void };

export function IntroVideo({ videoSrc, onEnter }: IntroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackBlocked, setPlaybackBlocked] = useState(false);
  const [ended, setEnded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    videoRef.current?.play().catch(() => setPlaybackBlocked(true));
  }, []);
```

The click-to-play button calls `video.play()` directly from the click handler. Only the ended overlay calls `onEnter`. The failure button also calls `onEnter` so the visitor cannot be trapped.

- [ ] **Step 4: Add the stable asset and styles**

Copy the downloaded 2.05 MB video to `public/media/intro/tom-and-jerry.mp4`. Add `.intro-video` styles for a dark 16:9 stage, contained video, full-stage overlay button, and cream-paper prompt.

- [ ] **Step 5: Run component tests and verify GREEN**

Run: `npm.cmd test -- --run src/components/IntroVideo.test.tsx`

Expected: all intro media-state tests pass.

---

### Task 2: Add intro before the existing App flow

**Files:**
- Modify: `src/app/App.tsx`
- Modify: `src/app/App.test.tsx`

**Interfaces:**
- Consumes: `IntroVideo({ videoSrc, onEnter })`
- Produces: `Screen = "intro" | "home" | "map" | "memory" | "finale"`

- [ ] **Step 1: Write the failing App entry test**

Render `App`, assert the intro video is present and the home heading is absent, fire `ended`, click `点击任意位置进入`, and assert the existing home heading appears.

- [ ] **Step 2: Run the App test and verify RED**

Run: `npm.cmd test -- --run src/app/App.test.tsx`

Expected: FAIL because `App` still starts on `home`.

- [ ] **Step 3: Wire the intro screen**

Import `IntroVideo`, extend the union, initialize `screen` as `intro`, and render:

```tsx
{screen === "intro" && (
  <IntroVideo videoSrc="/media/intro/tom-and-jerry.mp4" onEnter={() => setScreen("home")} />
)}
```

Update existing App tests with a helper that completes the intro before exercising the old flow.

- [ ] **Step 4: Run App tests and verify GREEN**

Run: `npm.cmd test -- --run src/app/App.test.tsx`

Expected: all App entry and existing birthday-flow tests pass.

---

### Task 3: Full validation and rendered QA

**Files:**
- Verify only; no planned source changes

**Interfaces:**
- Consumes: completed Tasks 1 and 2
- Produces: automated and browser evidence

- [ ] **Step 1: Run automated checks**

```powershell
npm.cmd test -- --run
npm.cmd run build
npm.cmd run test:sites
git diff --check
```

Expected: all tests pass, the production build includes the intro video, Sites packaging passes, and no whitespace errors appear.

- [ ] **Step 2: Run browser QA**

Verify the intro is the first screen, the video asset loads, audible autoplay is attempted, blocked autoplay presents `点击播放`, clicks cannot skip playback, ended playback presents `点击任意位置进入`, entry reveals the old home, refresh returns to intro, and the console is clean.

- [ ] **Step 3: Review and commit the exact scope**

Stage only the intro component, tests, App integration, styles, stable video asset, and this plan. Commit with `feat: add birthday intro video`.

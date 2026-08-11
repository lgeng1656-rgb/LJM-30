# Session-only Cheese Highlights Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make cheese highlights last only for the current page lifetime, remove the collected label, and reset every marker to grayscale after reload.

**Architecture:** `App` owns an in-memory `Set<string>` initialized empty and passes it to `MemoryMap`; no browser storage participates. `MemoryMap` exposes state through collected/unlocked classes, while CSS renders default markers gray and collected markers in full color with a glow.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Testing Library, Vite

## Global Constraints

- Do not change birthday content, screen order, image assets, or the ten-memory unlock rule.
- Returning from a memory detail to the map preserves highlights.
- Reloading or reopening resets cheese highlights and relocks cheese ten.
- Do not add dependencies or unrelated refactors.

---

### Task 1: Replace persisted progress with page-lifetime state

**Files:**
- Modify: `src/app/App.test.tsx`
- Modify: `src/app/App.tsx`
- Delete: `src/features/progress/storage.ts`
- Delete: `src/features/progress/storage.test.ts`

**Interfaces:**
- Consumes: existing `MemoryMap` prop `collectedIds: Set<string>`
- Produces: `App` initializes `collectedIds` with `new Set<string>()` and updates it only through React state

- [ ] **Step 1: Write the failing lifecycle test**

Add a test that renders `App`, opens cheese `01`, returns to the map, verifies the marker has `cheese-node--collected`, unmounts, renders a fresh `App`, enters the map again, and verifies the same marker no longer has that class.

```tsx
it("keeps highlights only for the current page lifetime", async () => {
  const user = userEvent.setup();
  const first = render(<App />);

  await user.click(screen.getByRole("button", { name: "开始追奶酪" }));
  const cheeseOne = screen.getByRole("button", { name: /打开第 01 块奶酪/ });
  await user.click(cheeseOne);
  await user.click(screen.getByRole("button", { name: "返回奶酪地图" }));
  expect(screen.getByRole("button", { name: /打开第 01 块奶酪/ })).toHaveClass("cheese-node--collected");

  first.unmount();
  render(<App />);
  await user.click(screen.getByRole("button", { name: "开始追奶酪" }));
  expect(screen.getByRole("button", { name: /打开第 01 块奶酪/ })).not.toHaveClass("cheese-node--collected");
});
```

- [ ] **Step 2: Run the lifecycle test and verify RED**

Run: `npm.cmd test -- --run src/app/App.test.tsx`

Expected: FAIL because `loadProgress()` restores cheese `01` from `localStorage` after remount.

- [ ] **Step 3: Implement in-memory-only progress**

In `App.tsx`, remove the storage import, initialize an empty set, and stop saving:

```tsx
const [collectedIds, setCollectedIds] = useState<Set<string>>(() => new Set());

const openMemory = (index: number) => {
  setCollectedIds((current) => new Set(current).add(birthdayContent.memories[index].id));
  setSelectedIndex(index);
  setScreen("memory");
};
```

Remove `src/features/progress/storage.ts` and its dedicated test because the module has no remaining consumer.

- [ ] **Step 4: Update finale tests to unlock through real clicks**

Remove direct `localStorage` setup from the finale test. Enter the map and open each of `01` through `09`, returning to the map after every memory, before clicking cheese ten.

- [ ] **Step 5: Run the App tests and verify GREEN**

Run: `npm.cmd test -- --run src/app/App.test.tsx`

Expected: all App tests pass and no test seeds `localStorage` progress.

- [ ] **Step 6: Commit session-only state**

```powershell
git add -- src/app/App.tsx src/app/App.test.tsx src/features/progress/storage.ts src/features/progress/storage.test.ts
git commit -m "fix: reset cheese highlights on reload"
```

---

### Task 2: Remove the collected label and style gray-to-bright markers

**Files:**
- Modify: `src/components/MemoryMap.tsx`
- Modify: `src/components/optimized-artwork.test.tsx`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `collectedIds.has(memory.id)` and existing classes `cheese-node--collected`, `cheese-node--unlocked`
- Produces: no collected text node; default grayscale filter; collected/unlocked full-color glow

- [ ] **Step 1: Write the failing map presentation test**

Render `MemoryMap` with `01` collected, assert the first marker has the collected class, and assert `已找到` is absent:

```tsx
const { container } = render(
  <MemoryMap
    memories={[{ id: "01", title: "Memory", note: "Note", media: [] }]}
    collectedIds={new Set(["01"])}
    onOpen={() => undefined}
    onOpenFinale={() => undefined}
  />,
);

expect(container.querySelector(".cheese-node--collected")).toBeInTheDocument();
expect(container).not.toHaveTextContent("已找到");
```

- [ ] **Step 2: Run the component test and verify RED**

Run: `npm.cmd test -- --run src/components/optimized-artwork.test.tsx`

Expected: FAIL because `MemoryMap` still renders `已找到`.

- [ ] **Step 3: Remove the label and implement visual states**

Delete the collected stamp element from `MemoryMap.tsx`. In `global.css`, make the base filter grayscale while keeping the existing shadow, then explicitly restore color for collected/unlocked markers:

```css
.cheese-node {
  filter: grayscale(1) drop-shadow(0 8px 8px rgba(121, 75, 23, 0.22));
}

.cheese-node--collected,
.cheese-node--unlocked {
  filter: grayscale(0) drop-shadow(0 0 12px rgba(248, 178, 39, 0.9));
}
```

Remove `.cheese-node__stamp` from the shared stamp/hint selector because it no longer exists.

- [ ] **Step 4: Run the component test and verify GREEN**

Run: `npm.cmd test -- --run src/components/optimized-artwork.test.tsx`

Expected: all optimized artwork and map presentation tests pass.

- [ ] **Step 5: Commit map presentation**

```powershell
git add -- src/components/MemoryMap.tsx src/components/optimized-artwork.test.tsx src/styles/global.css
git commit -m "style: show session cheese highlights"
```

---

### Task 3: Full regression and rendered QA

**Files:**
- Verify only; no planned source changes

**Interfaces:**
- Consumes: completed behavior from Tasks 1 and 2
- Produces: build, test, and browser evidence

- [ ] **Step 1: Run automated verification**

Run these commands in the repository root:

```powershell
npm.cmd test -- --run
npm.cmd run build
npm.cmd run test:sites
git diff --check
```

Expected: all Vitest tests pass, the build exits `0`, all Sites tests pass, and `git diff --check` produces no errors.

- [ ] **Step 2: Run browser QA**

Open `http://127.0.0.1:5173/` and verify:

1. Initial map markers render grayscale.
2. Opening cheese `01` and returning makes only cheese `01` full color and glowing.
3. The map contains no `已找到` text.
4. Reloading and entering the map makes cheese `01` grayscale again.
5. Page title, meaningful content, image assets, and console health remain correct.

- [ ] **Step 3: Review the final diff**

Run: `git status --short` and `git diff --stat`

Expected: only the planned feature files plus previously approved image-optimization changes are present; no unrelated files are modified.

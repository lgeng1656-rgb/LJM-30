import { useState } from "react";
import { birthdayContent } from "../content/memories";
import { Finale } from "../components/Finale";
import { Hero } from "../components/Hero";
import { MemoryDetail } from "../components/MemoryDetail";
import { MemoryMap } from "../components/MemoryMap";
import { loadProgress, saveProgress } from "../features/progress/storage";

type Screen = "home" | "map" | "memory" | "finale";

export function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [collectedIds, setCollectedIds] = useState<Set<string>>(() => loadProgress());

  const openMemory = (index: number) => {
    const next = new Set(collectedIds).add(birthdayContent.memories[index].id);
    setCollectedIds(next);
    saveProgress(next);
    setSelectedIndex(index);
    setScreen("memory");
  };

  const shiftMemory = (delta: number) => {
    const nextIndex = (selectedIndex + delta + birthdayContent.memories.length) % birthdayContent.memories.length;
    openMemory(nextIndex);
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <button className="brand" type="button" onClick={() => setScreen("home")}>猫鼠三十 · 追光之旅</button>
        <nav aria-label="主要导航">
          <button type="button" onClick={() => setScreen("home")}>首页</button>
          <button type="button" onClick={() => setScreen("map")}>奶酪收集</button>
          <button type="button" onClick={() => setScreen("map")}>人生游乐地图</button>
          <button type="button" disabled={collectedIds.size < 10} onClick={() => setScreen("finale")}>生日视频</button>
        </nav>
        <span className="header-progress" aria-label={`已收集 ${collectedIds.size} 块奶酪`}>
          {collectedIds.size}/10
        </span>
      </header>

      <main>
        {screen === "home" && <Hero onStart={() => setScreen("map")} />}
        {screen === "map" && (
          <MemoryMap
            memories={birthdayContent.memories}
            collectedIds={collectedIds}
            onOpen={openMemory}
            onOpenFinale={() => setScreen("finale")}
          />
        )}
        {screen === "memory" && (
          <MemoryDetail
            memory={birthdayContent.memories[selectedIndex]}
            onPrevious={() => shiftMemory(-1)}
            onNext={() => shiftMemory(1)}
            onBack={() => setScreen("map")}
          />
        )}
        {screen === "finale" && (
          <Finale videoSrc={birthdayContent.finaleVideo} onReturnToMap={() => setScreen("map")} />
        )}
      </main>
    </div>
  );
}

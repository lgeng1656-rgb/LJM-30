import { useState } from "react";
import { birthdayContent } from "../content/memories";
import { Finale } from "../components/Finale";
import { Hero } from "../components/Hero";
import { IntroVideo } from "../components/IntroVideo";
import { MemoryDetail } from "../components/MemoryDetail";
import { MemoryMap } from "../components/MemoryMap";

type Screen = "intro" | "home" | "map" | "memory" | "finale";

export function App() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [collectedIds, setCollectedIds] = useState<Set<string>>(() => new Set());

  const openMemory = (index: number) => {
    setCollectedIds((current) => new Set(current).add(birthdayContent.memories[index].id));
    setSelectedIndex(index);
    setScreen("memory");
  };

  const shiftMemory = (delta: number) => {
    const nextIndex = (selectedIndex + delta + birthdayContent.memories.length) % birthdayContent.memories.length;
    openMemory(nextIndex);
  };

  const openNextMemory = () => {
    const isLastMemory = selectedIndex === birthdayContent.memories.length - 1;
    if (isLastMemory && collectedIds.size === birthdayContent.memories.length) {
      setScreen("finale");
      return;
    }

    shiftMemory(1);
  };

  return (
    <main className="app-shell">
      <div className={`experience-stage experience-stage--${screen}`}>
        {screen === "intro" && (
          <IntroVideo videoSrc="/media/intro/tom-and-jerry.mp4" onEnter={() => setScreen("home")} />
        )}
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
            onNext={openNextMemory}
            onBack={() => setScreen("map")}
          />
        )}
        {screen === "finale" && (
          <Finale videoSrc={birthdayContent.finaleVideo} onReturnToMap={() => setScreen("map")} />
        )}
      </div>
    </main>
  );
}

import type { CSSProperties } from "react";
import type { MemoryItem } from "../content/types";

type MemoryMapProps = {
  memories: MemoryItem[];
  collectedIds: Set<string>;
  onOpen: (index: number) => void;
  onOpenFinale: () => void;
};

const nodePositions = [
  [30.6, 25.6], [55.8, 22.5], [82.5, 25.2], [87, 40.5], [84.5, 74],
  [70.4, 83.5], [50.4, 83.2], [19.8, 84.5], [29.2, 50.8], [39.2, 50.5],
];

export function MemoryMap({ memories, collectedIds, onOpen, onOpenFinale }: MemoryMapProps) {
  const complete = collectedIds.size === memories.length;
  const finalPosition = nodePositions[9];

  return (
    <section className="map-page" aria-label="十块奶酪回忆地图">
      <img className="memory-map__art" src="/assets/memory-map.png" alt="通往九段回忆和最后惊喜的人生游乐地图" />
      {memories.map((memory, index) => {
        const collected = collectedIds.has(memory.id);
        const [x, y] = nodePositions[index];
        return (
          <button
            className={`cheese-node${collected ? " cheese-node--collected" : ""}`}
            key={memory.id}
            onClick={() => onOpen(index)}
            style={{ "--node-x": `${x}%`, "--node-y": `${y}%` } as CSSProperties}
            type="button"
            aria-label={`打开第 ${memory.id} 块奶酪：${memory.title}`}
          >
            <img src="/assets/cheese.png" alt="" />
            <span className="cheese-node__number">{memory.id}</span>
            {collected && <span className="cheese-node__stamp">已找到</span>}
          </button>
        );
      })}
      <button
        className={`cheese-node cheese-node--final${complete ? " cheese-node--unlocked" : ""}`}
        disabled={!complete}
        onClick={onOpenFinale}
        style={{ "--node-x": `${finalPosition[0]}%`, "--node-y": `${finalPosition[1]}%` } as CSSProperties}
        type="button"
        aria-label="打开第 10 块奶酪：最后的惊喜"
      >
        <img src="/assets/cheese.png" alt="" />
        <span className="cheese-node__number">10</span>
        <span className="cheese-node__hint">{complete ? "最后惊喜" : `${collectedIds.size}/9`}</span>
      </button>
    </section>
  );
}

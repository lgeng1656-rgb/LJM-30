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

  return (
    <section className="map-page" aria-labelledby="map-title">
      <div className="section-heading">
        <div>
          <p className="section-number">02</p>
          <h1 id="map-title">10 块快乐奶酪</h1>
          <p className="progress-copy">已收集 {collectedIds.size} / 10 块快乐奶酪</p>
        </div>
        <p className="section-intro">每一块奶酪，都是没有顺序却闪闪发光的日子。</p>
      </div>

      <div className="memory-map">
        <div className="memory-map__stage">
          <img src="/assets/memory-map.png" alt="通往十段快乐回忆的人生游乐地图" />
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
        </div>
      </div>

      <div className="finale-unlock">
        <div>
          <strong>{complete ? "最后一块奶酪正在发光！" : "终点正在等你"}</strong>
          <span>{complete ? "主祝福视频已经解锁。" : `还差 ${memories.length - collectedIds.size} 块奶酪。`}</span>
        </div>
        <button className="button button--coral" type="button" disabled={!complete} onClick={onOpenFinale}>
          开启最后的惊喜
        </button>
      </div>
    </section>
  );
}

import { useState } from "react";
import type { MemoryItem } from "../content/types";
import { MediaFrame } from "./MediaFrame";

type MemoryDetailProps = {
  memory: MemoryItem;
  onPrevious: () => void;
  onNext: () => void;
  onBack: () => void;
};

export function MemoryDetail({ memory, onPrevious, onNext, onBack }: MemoryDetailProps) {
  const [selection, setSelection] = useState({ memoryId: memory.id, mediaIndex: 0 });
  const selectedMediaIndex = selection.memoryId === memory.id ? selection.mediaIndex : 0;

  const selectedMedia = memory.media[selectedMediaIndex] ?? memory.media[0];

  return (
    <section className="memory-detail" aria-labelledby="memory-title">
      <div className="memory-detail__media">
        <MediaFrame key={`${memory.id}-${selectedMediaIndex}`} item={selectedMedia} />
        {memory.media.length > 1 && (
          <div className="thumbnail-rail" aria-label="补充回忆素材位">
            {memory.media.map((item, index) => (
              <button
                aria-pressed={selectedMediaIndex === index}
                className={selectedMediaIndex === index ? "thumbnail-rail__item thumbnail-rail__item--active" : "thumbnail-rail__item"}
                key={item.src}
                onClick={() => setSelection({ memoryId: memory.id, mediaIndex: index })}
                type="button"
              >
                素材 {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      <article className="memory-detail__note">
        <p className="memory-index">{memory.id}</p>
        <h1 id="memory-title">{memory.title}</h1>
        <p>{memory.note}</p>
      </article>
      <div className="memory-detail__actions">
        <button className="button button--quiet" type="button" onClick={onPrevious}>上一块</button>
        <button className="button button--quiet" type="button" onClick={onBack}>返回奶酪地图</button>
        <button className="button button--quiet" type="button" onClick={onNext}>下一块</button>
      </div>
    </section>
  );
}

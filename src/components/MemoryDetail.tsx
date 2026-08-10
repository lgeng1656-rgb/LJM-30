import type { MemoryItem } from "../content/types";
import { MediaFrame } from "./MediaFrame";

type MemoryDetailProps = {
  memory: MemoryItem;
  onPrevious: () => void;
  onNext: () => void;
  onBack: () => void;
};

export function MemoryDetail({ memory, onPrevious, onNext, onBack }: MemoryDetailProps) {
  return (
    <section className="memory-detail" aria-labelledby="memory-title">
      <div className="memory-detail__media">
        <MediaFrame item={memory.media[0]} />
        <div className="thumbnail-rail" aria-label="补充回忆素材位">
          {Array.from({ length: 4 }, (_, index) => (
            <span key={index}>{index === 0 ? "主画面" : `素材 ${index + 1}`}</span>
          ))}
        </div>
      </div>
      <article className="memory-detail__note">
        <p className="memory-index">{memory.id}</p>
        <h1 id="memory-title">{memory.title}</h1>
        <p>{memory.note}</p>
        <div className="memory-detail__doodle" aria-hidden="true">快乐被好好收藏</div>
      </article>
      <div className="memory-detail__actions">
        <button className="button button--quiet" type="button" onClick={onPrevious}>上一块</button>
        <button className="button button--quiet" type="button" onClick={onBack}>返回奶酪地图</button>
        <button className="button button--quiet" type="button" onClick={onNext}>下一块</button>
      </div>
    </section>
  );
}

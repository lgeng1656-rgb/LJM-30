import { useState } from "react";
import type { MediaItem } from "../content/types";

type MediaFrameProps = {
  item: MediaItem;
};

export function MediaFrame({ item }: MediaFrameProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="media-frame media-frame--empty" role="img" aria-label={item.alt}>
        <img src="/assets/cheese.png" alt="" />
        <strong>这段回忆正在等你</strong>
        <span>把照片或短视频放进对应素材文件夹，它就会出现在这里。</span>
      </div>
    );
  }

  if (item.kind === "video") {
    return (
      <video className="media-frame" controls preload="metadata" poster={item.poster} onError={() => setFailed(true)}>
        <source src={item.src} />
      </video>
    );
  }

  return <img className="media-frame" src={item.src} alt={item.alt} loading="lazy" onError={() => setFailed(true)} />;
}

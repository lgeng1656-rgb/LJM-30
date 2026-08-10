import { useState } from "react";

type FinaleProps = {
  videoSrc: string;
  onReturnToMap: () => void;
};

export function Finale({ videoSrc, onReturnToMap }: FinaleProps) {
  const [revealed, setRevealed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  if (revealed) {
    return (
      <section className="birthday-finale" aria-labelledby="birthday-title">
        <img src="/assets/finale-banner.png" alt="汤姆和杰瑞在新旅程入口共同拉开生日横幅" />
        <div className="birthday-finale__copy">
          <h1 id="birthday-title">李金蔓，三十岁生日快乐！</h1>
          <p>新地图已开启，继续做最快乐的杰瑞。</p>
        </div>
        <button className="button button--coral birthday-finale__back" type="button" onClick={onReturnToMap}>
          再看一次回忆
        </button>
      </section>
    );
  }

  return (
    <section className="video-letter" aria-labelledby="video-title">
      <div className="video-letter__copy">
        <p className="section-number">11</p>
        <h1 id="video-title">最后一块奶酪，藏着一封会动的信</h1>
        <p>前面的十段快乐都找到了，现在把时间留给最重要的祝福。</p>
      </div>
      <div className="video-letter__frame">
        {videoFailed ? (
          <div className="video-letter__empty">
            <strong>主视频还没有放进来</strong>
            <span>之后替换 `/public/media/finale/blessing.mp4` 即可。</span>
          </div>
        ) : (
          <video aria-label="李金蔓生日祝福视频" controls preload="metadata" onEnded={() => setRevealed(true)} onError={() => setVideoFailed(true)}>
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
      </div>
      <button className="button button--primary" type="button" onClick={() => setRevealed(true)}>
        继续前往新地图
      </button>
    </section>
  );
}

import { useEffect, useRef, useState } from "react";

type IntroVideoProps = {
  videoSrc: string;
  onEnter: () => void;
};

export function IntroVideo({ videoSrc, onEnter }: IntroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackBlocked, setPlaybackBlocked] = useState(false);
  const [ended, setEnded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    void video.play().catch(() => setPlaybackBlocked(true));
  }, []);

  const startWithSound = async () => {
    const video = videoRef.current;
    if (!video) return;

    setPlaybackBlocked(false);
    video.muted = false;
    try {
      await video.play();
    } catch {
      setPlaybackBlocked(true);
    }
  };

  return (
    <section className="intro-video" aria-label="生日开场">
      <video
        ref={videoRef}
        className="intro-video__media"
        src={videoSrc}
        aria-label="生日开场视频"
        autoPlay
        playsInline
        preload="auto"
        onEnded={() => setEnded(true)}
        onError={() => setFailed(true)}
      />

      {playbackBlocked && !ended && !failed && (
        <button className="intro-video__overlay" type="button" onClick={startWithSound}>
          <span className="intro-video__prompt">点击播放</span>
        </button>
      )}

      {ended && !failed && (
        <button className="intro-video__overlay" type="button" onClick={onEnter} aria-label="点击任意位置进入">
          <span className="intro-video__prompt">点击任意位置进入</span>
        </button>
      )}

      {failed && (
        <div className="intro-video__overlay intro-video__overlay--failed" role="alert">
          <strong>开场视频暂时无法播放</strong>
          <button className="button button--primary" type="button" onClick={onEnter}>
            直接进入
          </button>
        </div>
      )}
    </section>
  );
}

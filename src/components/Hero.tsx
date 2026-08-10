type HeroProps = {
  onStart: () => void;
};

export function Hero({ onStart }: HeroProps) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__copy">
        <h1 id="hero-title">
          30 岁的第一场冒险，
          <span>由我们一起开启！</span>
        </h1>
        <p>烦恼在后面追，汤姆在身边闹，快乐奶酪要一块一块找回来。</p>
        <button className="button button--primary" type="button" onClick={onStart}>
          开始追奶酪
        </button>
      </div>
      <img
        className="hero__art"
        src="/assets/hero-adventure.png"
        alt="汤姆追着带着奶酪奔向新旅程的杰瑞"
      />
      <aside className="hero__note" aria-label="小贴士">
        <strong>小贴士</strong>
        <span>沿着快乐路线，把散落的十块奶酪都带回来。</span>
      </aside>
    </section>
  );
}

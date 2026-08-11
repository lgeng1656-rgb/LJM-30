import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Finale } from "./Finale";
import { Hero } from "./Hero";
import { MediaFrame } from "./MediaFrame";
import { MemoryMap } from "./MemoryMap";

describe("optimized artwork", () => {
  it("serves WebP artwork on the entry screen", () => {
    const { container } = render(<Hero onStart={() => undefined} />);

    expect(container.querySelector(".hero__art")).toHaveAttribute("src", "/assets/hero-adventure.webp");
  });

  it("serves WebP artwork and markers on the memory map", () => {
    const memories = [{ id: "01", title: "Memory", note: "Note", media: [] }];
    const { container } = render(
      <MemoryMap
        memories={memories}
        collectedIds={new Set(["01"])}
        onOpen={() => undefined}
        onOpenFinale={() => undefined}
      />,
    );

    expect(container.querySelector(".memory-map__art")).toHaveAttribute("src", "/assets/memory-map.webp");
    for (const marker of container.querySelectorAll(".cheese-node img")) {
      expect(marker).toHaveAttribute("src", "/assets/cheese.webp");
    }
    expect(container.querySelector(".cheese-node--collected")).toBeInTheDocument();
    expect(container).not.toHaveTextContent("已找到");
  });

  it("serves the optimized fallback artwork when memory media is missing", () => {
    const { container } = render(
      <MediaFrame item={{ kind: "image", src: "/missing.jpg", alt: "Missing memory" }} />,
    );

    fireEvent.error(container.querySelector(".media-frame") as HTMLImageElement);

    expect(container.querySelector(".media-frame--empty img")).toHaveAttribute("src", "/assets/cheese.webp");
  });

  it("serves WebP artwork in the birthday finale", () => {
    const { container } = render(<Finale videoSrc="/missing.mp4" onReturnToMap={() => undefined} />);

    fireEvent.click(container.querySelector(".video-letter__continue") as HTMLButtonElement);

    expect(container.querySelector(".birthday-finale > img")).toHaveAttribute("src", "/assets/finale-banner.webp");
  });
});

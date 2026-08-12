import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryDetail } from "./MemoryDetail";

describe("MemoryDetail media loading", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("preloads the remaining images in a multi-media memory", () => {
    const requestedSources: string[] = [];

    class PreloadImage {
      set src(value: string) {
        requestedSources.push(value);
      }
    }

    vi.stubGlobal("Image", PreloadImage);

    const { container } = render(
      <MemoryDetail
        memory={{
          id: "09",
          title: "去年生日",
          note: "回忆",
          media: [
            { kind: "image", src: "/media/memories/09/09.1.webp", alt: "素材 1" },
            { kind: "image", src: "/media/memories/09/09.2.webp", alt: "素材 2" },
            { kind: "image", src: "/media/memories/09/09.3.webp", alt: "素材 3" },
            { kind: "image", src: "/media/memories/09/09.4.webp", alt: "素材 4" },
          ],
        }}
        onPrevious={vi.fn()}
        onNext={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    expect(container.querySelector("img.media-frame")).toHaveAttribute("loading", "eager");
    expect(requestedSources).toEqual([
      "/media/memories/09/09.2.webp",
      "/media/memories/09/09.3.webp",
      "/media/memories/09/09.4.webp",
    ]);
  });
});

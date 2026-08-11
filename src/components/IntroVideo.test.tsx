import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { IntroVideo } from "./IntroVideo";

describe("birthday intro video", () => {
  afterEach(() => vi.restoreAllMocks());

  it("allows entry only after the video ends", async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    const onEnter = vi.fn();
    const user = userEvent.setup();
    render(<IntroVideo videoSrc="/media/intro/tom-and-jerry.mp4" onEnter={onEnter} />);

    const video = screen.getByLabelText("生日开场视频");
    expect(video).toHaveAttribute("src", "/media/intro/tom-and-jerry.mp4");
    await waitFor(() => expect(play).toHaveBeenCalledOnce());

    fireEvent.click(video);
    expect(onEnter).not.toHaveBeenCalled();

    fireEvent.ended(video);
    const enterButton = screen.getByRole("button", { name: "点击任意位置进入" });
    enterButton.focus();
    await user.keyboard("{Enter}");

    expect(onEnter).toHaveBeenCalledOnce();
  });

  it("offers click-to-play when audible autoplay is blocked", async () => {
    const play = vi
      .spyOn(HTMLMediaElement.prototype, "play")
      .mockRejectedValueOnce(new DOMException("Autoplay blocked", "NotAllowedError"))
      .mockResolvedValueOnce();
    const user = userEvent.setup();
    render(<IntroVideo videoSrc="/media/intro/tom-and-jerry.mp4" onEnter={() => undefined} />);

    await user.click(await screen.findByRole("button", { name: "点击播放" }));

    expect(play).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole("button", { name: "点击播放" })).not.toBeInTheDocument();
  });

  it("never traps the visitor when the video fails", async () => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    const onEnter = vi.fn();
    const user = userEvent.setup();
    render(<IntroVideo videoSrc="/media/intro/tom-and-jerry.mp4" onEnter={onEnter} />);

    fireEvent.error(screen.getByLabelText("生日开场视频"));
    expect(screen.getByText("开场视频暂时无法播放")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "直接进入" }));

    expect(onEnter).toHaveBeenCalledOnce();
  });
});

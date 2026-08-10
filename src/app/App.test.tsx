import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";

describe("birthday adventure entry", () => {
  beforeEach(() => localStorage.clear());

  it("returns the next screen to the top when opening the map", async () => {
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo;
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "开始追奶酪" }));

    expect(scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: "smooth" });
  });

  it("invites the visitor to start the cheese chase", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /30 岁的第一场冒险/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "开始追奶酪" }),
    ).toBeEnabled();
  });

  it("opens any cheese first and records it as collected", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "开始追奶酪" }));
    expect(
      screen.getByRole("heading", { name: "10 块快乐奶酪" }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: /打开第 07 块奶酪/ }),
    );

    expect(screen.getByRole("heading", { name: "被温柔接住的时候" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "返回奶酪地图" }));
    expect(screen.getByText("已收集 1 / 10 块快乐奶酪")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "开启最后的惊喜" }),
    ).toBeDisabled();
  });

  it("unlocks the blessing video and birthday banner after all memories", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "开始追奶酪" }));

    for (const id of ["07", "02", "10", "01", "05", "03", "09", "04", "08", "06"]) {
      await user.click(
        screen.getByRole("button", { name: new RegExp(`打开第 ${id} 块奶酪`) }),
      );
      await user.click(screen.getByRole("button", { name: "返回奶酪地图" }));
    }

    const finaleButton = screen.getByRole("button", { name: "开启最后的惊喜" });
    expect(finaleButton).toBeEnabled();
    await user.click(finaleButton);
    expect(screen.getByLabelText("李金蔓生日祝福视频")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "继续前往新地图" }));
    expect(screen.getByText("李金蔓，三十岁生日快乐！")).toBeInTheDocument();
  });
});

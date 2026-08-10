import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "./App";

describe("birthday adventure entry", () => {
  beforeEach(() => localStorage.clear());

  it("shows only the 16:9 experience without a site navigation", () => {
    render(<App />);

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /30 岁的第一场冒险/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "开始追奶酪" })).toBeEnabled();
  });

  it("records any of the first nine cheeses as a memory", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "开始追奶酪" }));
    await user.click(screen.getByRole("button", { name: /打开第 07 块奶酪/ }));

    expect(screen.getByRole("heading", { name: "被温柔接住的时候" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "返回奶酪地图" }));
    expect(screen.getByRole("button", { name: "打开第 10 块奶酪：最后的惊喜" })).toBeDisabled();
  });

  it("makes cheese ten the final surprise after the first nine memories", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "开始追奶酪" }));

    for (const id of ["07", "02", "01", "05", "03", "09", "04", "08", "06"]) {
      await user.click(screen.getByRole("button", { name: new RegExp(`打开第 ${id} 块奶酪`) }));
      await user.click(screen.getByRole("button", { name: "返回奶酪地图" }));
    }

    const finalCheese = screen.getByRole("button", { name: "打开第 10 块奶酪：最后的惊喜" });
    expect(finalCheese).toBeEnabled();
    await user.click(finalCheese);

    expect(screen.getByRole("heading", { name: "最后一块奶酪，藏着一封会动的信" })).toBeInTheDocument();
    expect(screen.getByText(/前面的九段快乐都找到了/)).toBeInTheDocument();
    expect(screen.getByLabelText("李金蔓生日祝福视频")).toBeInTheDocument();
  });

  it("reveals a concise birthday message inside the final banner", async () => {
    localStorage.setItem(
      "lijinman-birthday-progress-v2",
      JSON.stringify(["01", "02", "03", "04", "05", "06", "07", "08", "09"]),
    );
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "开始追奶酪" }));
    await user.click(screen.getByRole("button", { name: "打开第 10 块奶酪：最后的惊喜" }));
    await user.click(screen.getByRole("button", { name: "展开生日横幅" }));

    expect(screen.getByText("李金蔓，生日快乐！")).toBeInTheDocument();
    expect(screen.queryByText("新地图已开启，继续做最快乐的杰瑞。")).not.toBeInTheDocument();
  });
});

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

  it("keeps cheese highlights only for the current page lifetime", async () => {
    const user = userEvent.setup();
    const firstVisit = render(<App />);

    await user.click(firstVisit.container.querySelector(".button--primary") as HTMLButtonElement);
    await user.click(firstVisit.container.querySelector(".cheese-node") as HTMLButtonElement);
    await user.click(firstVisit.container.querySelectorAll(".memory-detail__actions button")[1] as HTMLButtonElement);

    expect(firstVisit.container.querySelector(".cheese-node")).toHaveClass("cheese-node--collected");

    firstVisit.unmount();
    const nextVisit = render(<App />);
    await user.click(nextVisit.container.querySelector(".button--primary") as HTMLButtonElement);

    expect(nextVisit.container.querySelector(".cheese-node")).not.toHaveClass("cheese-node--collected");
  });

  it("reveals a concise birthday message inside the final banner", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.click(container.querySelector(".button--primary") as HTMLButtonElement);
    for (let index = 0; index < 9; index += 1) {
      await user.click(container.querySelectorAll(".cheese-node")[index] as HTMLButtonElement);
      await user.click(container.querySelectorAll(".memory-detail__actions button")[1] as HTMLButtonElement);
    }
    await user.click(container.querySelector(".cheese-node--final") as HTMLButtonElement);
    await user.click(container.querySelector(".video-letter__continue") as HTMLButtonElement);

    expect(screen.getByText("李金蔓，生日快乐！")).toBeInTheDocument();
    expect(screen.queryByText("新地图已开启，继续做最快乐的杰瑞。")).not.toBeInTheDocument();
  });
});

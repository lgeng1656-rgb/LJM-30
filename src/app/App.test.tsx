import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";

async function enterBirthdayHome(user: ReturnType<typeof userEvent.setup>) {
  fireEvent.ended(screen.getByLabelText("生日开场视频"));
  await user.click(screen.getByRole("button", { name: "点击任意位置进入" }));
}

describe("birthday adventure entry", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  });

  it("shows the birthday home only after the intro finishes and the visitor enters", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    expect(screen.getByLabelText("生日开场视频")).toBeInTheDocument();
    expect(container.querySelector(".hero")).not.toBeInTheDocument();

    fireEvent.ended(screen.getByLabelText("生日开场视频"));
    await user.click(screen.getByRole("button", { name: "点击任意位置进入" }));

    expect(container.querySelector(".hero")).toBeInTheDocument();
  });

  it("shows only the 16:9 experience without a site navigation", async () => {
    const user = userEvent.setup();
    render(<App />);
    await enterBirthdayHome(user);

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /30 岁的第一场冒险/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "开始追奶酪" })).toBeEnabled();
  });

  it("removes the homepage introduction paragraph", async () => {
    const user = userEvent.setup();
    render(<App />);
    await enterBirthdayHome(user);

    expect(screen.queryByText("烦恼在后面追，汤姆在身边闹，快乐奶酪要一块一块找回来。")).not.toBeInTheDocument();
  });

  it("shows the approved title and note for every memory without the collection doodle", async () => {
    const user = userEvent.setup();
    render(<App />);
    await enterBirthdayHome(user);
    await user.click(screen.getByRole("button", { name: "开始追奶酪" }));

    const memories = [
      ["01", "小时候的你", "你总说小时候的你黑黑的 像个小黑蛋 所以他们叫你小黑 但是还好现在稍微褪色了一些哈哈哈哈哈哈"],
      ["02", "你的小学时期...", "这时候的你还算无忧无虑 但也有了自己的小心事 全都记录在了日记本上"],
      ["03", "收藏玻璃碎片的你", "爸爸妈妈开始频繁吵架了，你拿起碎片粘进了日记本... 不知道小小的你当时有多痛苦 还好现在一切都很好"],
      ["04", "准备高考的你", "你总说自己不厉害，可我觉得你超级厉害哇 考的分数都非常美好 521诶！！！"],
      ["05", "考试结束你应该和老姜去了敦煌吧", "这条路在8年后的夏天 我也沿着你的轨迹 试图寻找你当时的踪影 当然了，我也邀请你的朋友 给你准备了一份祝福 请看VCR"],
      ["06", "听说最开始刚考上体制内的你 并不满足", "你说 在外面的人想进来，在里面的人想出去 你也过了很久才让自己在这个环境里稍微踏实一点吧 可是没关系哒，我们现在这样都已经很好了"],
      ["07", "出柜ing...", "被妈妈看到了手机 就这样很突然的出柜了 你也终于放松了下来 脑子里不用再想那么多的东西 也不用再因为感情应付着家里 你说 你好久没这样放松过，和家里的关系也缓和了很多"],
      ["08", "这天 我们认识了", "谢谢你的勇敢啊 才有了我们的故事"],
      ["09", "去年生日", "诶嘿嘿嘿 去年是咱俩一起过的第一个生日 拍了美美的小照片 没想到吧 今年还是我给你过"],
    ] as const;

    for (const [id, title, note] of memories) {
      await user.click(screen.getByRole("button", { name: new RegExp(`打开第 ${id} 块奶酪`) }));
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
      expect(screen.getByText(note)).toBeInTheDocument();
      expect(screen.queryByText("快乐被好好收藏")).not.toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "返回奶酪地图" }));
    }
  });

  it("hides the thumbnail rail for memories with a single media item", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    await enterBirthdayHome(user);
    await user.click(screen.getByRole("button", { name: "开始追奶酪" }));

    await user.click(screen.getByRole("button", { name: /打开第 05 块奶酪/ }));

    expect(container.querySelector(".memory-detail video source")).toHaveAttribute(
      "src",
      "https://geng000-1454170689.cos.ap-guangzhou.myqcloud.com/%E8%80%81%E5%A7%9C%E7%A5%9D%E7%A6%8F.mp4",
    );
    expect(container.querySelector(".thumbnail-rail")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "返回奶酪地图" }));
    await user.click(screen.getByRole("button", { name: /打开第 01 块奶酪/ }));

    expect(container.querySelector(".memory-detail img.media-frame")).toHaveAttribute("src", "/media/memories/01/01.webp");
    expect(screen.queryByLabelText("补充回忆素材位")).not.toBeInTheDocument();
  });

  it("switches between the supplied media for memories eight and nine", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    await enterBirthdayHome(user);
    await user.click(screen.getByRole("button", { name: "开始追奶酪" }));

    await user.click(screen.getByRole("button", { name: /打开第 08 块奶酪/ }));

    expect(screen.getAllByRole("button", { name: /素材 \d/ })).toHaveLength(2);
    expect(container.querySelector(".memory-detail img.media-frame")).toHaveAttribute("src", "/media/memories/08/08.1.webp");
    await user.click(screen.getByRole("button", { name: "素材 2" }));
    expect(container.querySelector(".memory-detail img.media-frame")).toHaveAttribute("src", "/media/memories/08/08.2.webp");

    await user.click(screen.getByRole("button", { name: "返回奶酪地图" }));
    await user.click(screen.getByRole("button", { name: /打开第 09 块奶酪/ }));

    expect(screen.getAllByRole("button", { name: /素材 \d/ })).toHaveLength(4);
    await user.click(screen.getByRole("button", { name: "素材 4" }));
    expect(container.querySelector(".memory-detail img.media-frame")).toHaveAttribute("src", "/media/memories/09/09.4.webp");
  });

  it("records any of the first nine cheeses as a memory", async () => {
    const user = userEvent.setup();
    render(<App />);
    await enterBirthdayHome(user);

    await user.click(screen.getByRole("button", { name: "开始追奶酪" }));
    await user.click(screen.getByRole("button", { name: /打开第 07 块奶酪/ }));

    expect(screen.getByRole("heading", { name: "出柜ing..." })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "返回奶酪地图" }));
    expect(screen.getByRole("button", { name: "打开第 10 块奶酪：最后的惊喜" })).toBeDisabled();
  });

  it("makes cheese ten the final surprise after the first nine memories", async () => {
    const user = userEvent.setup();
    render(<App />);
    await enterBirthdayHome(user);
    await user.click(screen.getByRole("button", { name: "开始追奶酪" }));

    for (const id of ["07", "02", "01", "05", "03", "09", "04", "08", "06"]) {
      await user.click(screen.getByRole("button", { name: new RegExp(`打开第 ${id} 块奶酪`) }));
      await user.click(screen.getByRole("button", { name: "返回奶酪地图" }));
    }

    const finalCheese = screen.getByRole("button", { name: "打开第 10 块奶酪：最后的惊喜" });
    expect(finalCheese).toBeEnabled();
    await user.click(finalCheese);

    expect(screen.getByRole("heading", { name: "最后一块奶酪，藏着一封会动的信" })).toBeInTheDocument();
    expect(screen.queryByText(/前面的九段快乐都找到了/)).not.toBeInTheDocument();
    expect(screen.getByLabelText("李金蔓生日祝福视频")).toBeInTheDocument();
  });

  it("keeps cheese highlights only for the current page lifetime", async () => {
    const user = userEvent.setup();
    const firstVisit = render(<App />);
    await enterBirthdayHome(user);

    await user.click(firstVisit.container.querySelector(".button--primary") as HTMLButtonElement);
    await user.click(firstVisit.container.querySelector(".cheese-node") as HTMLButtonElement);
    await user.click(firstVisit.container.querySelectorAll(".memory-detail__actions button")[1] as HTMLButtonElement);

    expect(firstVisit.container.querySelector(".cheese-node")).toHaveClass("cheese-node--collected");

    firstVisit.unmount();
    const nextVisit = render(<App />);
    await enterBirthdayHome(user);
    await user.click(nextVisit.container.querySelector(".button--primary") as HTMLButtonElement);

    expect(nextVisit.container.querySelector(".cheese-node")).not.toHaveClass("cheese-node--collected");
  });

  it("reveals a concise birthday message inside the final banner", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    await enterBirthdayHome(user);

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

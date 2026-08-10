import type { BirthdayContent } from "./types";

const titles = [
  "第一次一起出发",
  "那些笑到停不下来的瞬间",
  "一起认真吃过的饭",
  "镜头里的小太阳",
  "平凡日子的闪光",
  "说走就走的小冒险",
  "被温柔接住的时候",
  "我们共同喜欢的风景",
  "生活送来的彩蛋",
  "下一站，继续快乐",
];

export const birthdayContent: BirthdayContent = {
  memories: titles.map((title, index) => {
    const id = String(index + 1).padStart(2, "0");
    return {
      id,
      title,
      note: "把属于这一块奶酪的照片、短视频和小故事放在这里。",
      media: [
        {
          kind: "image",
          src: `/media/memories/${id}/cover.jpg`,
          alt: `李金蔓的第 ${id} 段回忆`,
        },
      ],
    };
  }),
  finaleVideo: "/media/finale/blessing.mp4",
};

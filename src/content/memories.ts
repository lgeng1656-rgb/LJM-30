import type { BirthdayContent } from "./types";

const memories = [
  {
    title: "小时候的你",
    note: "你总说小时候的你黑黑的 像个小黑蛋 所以他们叫你小黑 但是还好现在稍微褪色了一些哈哈哈哈哈哈",
    imageFiles: ["01.webp"],
  },
  {
    title: "你的小学时期...",
    note: "这时候的你还算无忧无虑 但也有了自己的小心事 全都记录在了日记本上",
    imageFiles: ["02.webp"],
  },
  {
    title: "收藏玻璃碎片的你",
    note: "爸爸妈妈开始频繁吵架了，你拿起碎片粘进了日记本... 不知道小小的你当时有多痛苦 还好现在一切都很好",
    imageFiles: ["03.webp"],
  },
  {
    title: "准备高考的你",
    note: "你总说自己不厉害，可我觉得你超级厉害哇 考的分数都非常美好 521诶！！！",
    imageFiles: ["04.webp"],
  },
  {
    title: "考试结束你应该和老姜去了敦煌吧",
    note: "这条路在8年后的夏天 我也沿着你的轨迹 试图寻找你当时的踪影 当然了，我也邀请你的朋友 给你准备了一份祝福 请看VCR",
    imageFiles: [],
  },
  {
    title: "听说最开始刚考上体制内的你 并不满足",
    note: "你说 在外面的人想进来，在里面的人想出去 你也过了很久才让自己在这个环境里稍微踏实一点吧 可是没关系哒，我们现在这样都已经很好了",
    imageFiles: ["06.webp"],
  },
  {
    title: "出柜ing...",
    note: "被妈妈看到了手机 就这样很突然的出柜了 你也终于放松了下来 脑子里不用再想那么多的东西 也不用再因为感情应付着家里 你说 你好久没这样放松过，和家里的关系也缓和了很多",
    imageFiles: ["07.webp"],
  },
  {
    title: "这天 我们认识了",
    note: "谢谢你的勇敢啊 才有了我们的故事",
    imageFiles: ["08.1.webp", "08.2.webp"],
  },
  {
    title: "去年生日",
    note: "诶嘿嘿嘿 去年是咱俩一起过的第一个生日 拍了美美的小照片 没想到吧 今年还是我给你过",
    imageFiles: ["09.1.webp", "09.2.webp", "09.3.webp", "09.4.webp"],
  },
];

export const birthdayContent: BirthdayContent = {
  memories: memories.map(({ title, note, imageFiles }, index) => {
    const id = String(index + 1).padStart(2, "0");
    return {
      id,
      title,
      note,
      media: id === "05"
        ? [
            {
              kind: "video",
              src: "https://geng000-1454170689.cos.ap-guangzhou.myqcloud.com/%E8%80%81%E5%A7%9C%E7%A5%9D%E7%A6%8F.mp4",
              alt: "老姜为李金蔓准备的祝福视频",
            },
          ]
        : imageFiles.map((filename, mediaIndex) => ({
            kind: "image" as const,
            src: `/media/memories/${id}/${filename}`,
            alt: imageFiles.length > 1
              ? `李金蔓的第 ${id} 段回忆，素材 ${mediaIndex + 1}`
              : `李金蔓的第 ${id} 段回忆`,
          })),
    };
  }),
  finaleVideo: "https://geng000-1454170689.cos.ap-guangzhou.myqcloud.com/10.mp4",
};

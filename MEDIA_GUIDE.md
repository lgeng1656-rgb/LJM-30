# 生日网站素材替换指南

网站已经为九段回忆和一支主祝福视频留好位置。第十块奶酪会在前九段回忆收集完后解锁，并直接打开主祝福视频。所有素材都放在 `public/media` 下，路径中的大小写必须与配置完全一致。

## 九段回忆

每块奶酪对应一个目录：

```text
public/media/memories/01/
public/media/memories/02/
...
public/media/memories/09/
```

默认会读取每个目录里的 `cover.jpg`。最简单的替换方式，是把九张封面图分别命名为 `cover.jpg` 放入对应目录。

要使用视频或增加多张素材，请编辑 `src/content/memories.ts` 中对应项目的 `media`：

```ts
media: [
  {
    kind: "video",
    src: "/media/memories/03/story.mp4",
    poster: "/media/memories/03/poster.jpg",
    alt: "一起吃过的那家小店",
  },
  {
    kind: "image",
    src: "/media/memories/03/photo-02.webp",
    alt: "那天饭后一起散步",
  },
]
```

- 图片推荐使用 WebP 或高质量 JPEG。
- 视频推荐使用 H.264 编码的 MP4，网页兼容性最好。
- `alt` 请描述画面内容，方便图片加载失败或使用辅助阅读工具时理解。
- 每段回忆建议一个主素材，最多再增加四个补充素材。

## 主祝福视频

将最终视频命名为：

```text
public/media/finale/blessing.mp4
```

如果文件名不同，只需修改 `src/content/memories.ts` 中的：

```ts
finaleVideo: "/media/finale/blessing.mp4"
```

视频较大时，正式部署前会根据文件体积决定直接随网站发布，或改用 Cloudflare R2/Stream。

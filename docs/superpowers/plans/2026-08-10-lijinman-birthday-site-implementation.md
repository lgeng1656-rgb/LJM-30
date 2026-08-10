# 李金蔓三十岁生日网站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个移动端优先的猫鼠主题生日互动网站，让访客自由打开十块回忆奶酪，集齐后观看主祝福视频，并进入“李金蔓，三十岁生日快乐”的新地图终章。

**Architecture:** 使用 React + TypeScript + Vite 构建纯前端单页应用。回忆内容集中在类型安全的配置文件中，页面状态由 React 管理并同步至 `localStorage`；视觉由组件化 CSS 和用户提供的参考图约束。首版不使用后端，确认后发布至 GitHub 和 Cloudflare Pages，超大视频再按体积切换到 R2 或 Stream。

**Tech Stack:** React 19、TypeScript、Vite、Vitest、Testing Library、CSS Modules/全局设计令牌、Playwright（浏览器验收）、Cloudflare Pages/Wrangler。

## Global Constraints

- 回忆不按时间排序，十块奶酪可自由打开，不设置输赢、倒计时或失败惩罚。
- 每块奶酪支持标题、短文、一个主媒体位和最多四个补充媒体位。
- 十块奶酪全部打开后，才首次解锁主祝福视频和最终生日横幅。
- 所有素材通过集中配置和 `public/media` 文件夹替换，不建立素材后台或数据库。
- 手机端是主要体验；不依赖 hover 或精确鼠标操作。
- 视觉必须贴合参考图的奶油纸张、手账拼贴、暖黄奶酪、珊瑚粉与暖棕文字体系。
- 网站公开访问，不设置账号或密码。
- 本地确认前不创建 GitHub 远程仓库、不部署 Cloudflare。

## Planned File Structure

```text
src/
  app/App.tsx                  # 页面阶段切换与顶层流程
  app/App.test.tsx             # 关键旅程集成测试
  content/memories.ts          # 十段回忆与主视频配置
  content/types.ts             # 媒体和回忆类型
  features/progress/storage.ts # localStorage 读写与容错
  features/progress/storage.test.ts
  components/Hero.tsx          # 冒险启程首屏
  components/MemoryMap.tsx     # 十块奶酪和进度地图
  components/MemoryDetail.tsx  # 单段回忆媒体详情
  components/Finale.tsx        # 主视频与生日终章
  components/MediaFrame.tsx    # 图片、视频与占位相框
  styles/tokens.css            # 色彩、字体、间距、阴影令牌
  styles/global.css            # 页面、响应式、动效与无障碍样式
public/media/memories/         # 01–10 回忆素材目录
public/media/finale/           # 主祝福视频目录
e2e/birthday-flow.spec.ts      # 桌面与手机核心流程
MEDIA_GUIDE.md                 # 用户替换素材说明
```

---

### Task 1: 建立可测试的 React 项目骨架

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/app/App.tsx`
- Create: `src/app/App.test.tsx`
- Create: `src/test/setup.ts`

**Interfaces:**
- Produces: 默认导出 `App(): JSX.Element`；脚本 `npm run dev`, `npm run build`, `npm test`, `npm run test:e2e`。

- [ ] **Step 1: 写应用烟雾测试**

```tsx
import { render, screen } from '@testing-library/react'
import App from './App'

it('shows the birthday adventure entry', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: /30 岁的第一场冒险/ })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '开始追奶酪' })).toBeEnabled()
})
```

- [ ] **Step 2: 安装依赖并运行测试，确认因应用不存在而失败**

Run: `npm install && npm test -- --run`

Expected: FAIL，提示找不到 `App` 或目标标题。

- [ ] **Step 3: 创建最小入口和 App 组件**

```tsx
export default function App() {
  return (
    <main>
      <h1>30 岁的第一场冒险，由我们一起开启！</h1>
      <button type="button">开始追奶酪</button>
    </main>
  )
}
```

- [ ] **Step 4: 运行单测与构建**

Run: `npm test -- --run && npm run build`

Expected: 测试 PASS，Vite 构建成功且生成 `dist/`。

- [ ] **Step 5: 提交项目骨架**

```powershell
git add package.json package-lock.json vite.config.ts tsconfig*.json index.html src
git commit -m "chore: scaffold birthday site"
```

### Task 2: 定义回忆内容模型与可靠进度存储

**Files:**
- Create: `src/content/types.ts`
- Create: `src/content/memories.ts`
- Create: `src/features/progress/storage.ts`
- Create: `src/features/progress/storage.test.ts`

**Interfaces:**
- Produces: `MediaItem`, `MemoryItem`, `BirthdayContent` 类型；`birthdayContent: BirthdayContent`；`loadProgress(): Set<string>`；`saveProgress(ids: Set<string>): void`。

- [ ] **Step 1: 写存储失败与成功测试**

```ts
it('round-trips collected memory ids', () => {
  saveProgress(new Set(['01', '03']))
  expect([...loadProgress()]).toEqual(['01', '03'])
})

it('returns an empty set for malformed data', () => {
  localStorage.setItem('lijinman-birthday-progress', '{broken')
  expect([...loadProgress()]).toEqual([])
})
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- --run src/features/progress/storage.test.ts`

Expected: FAIL，函数尚未定义。

- [ ] **Step 3: 实现内容类型、十条初始内容与存储容错**

```ts
export type MediaItem = {
  kind: 'image' | 'video'
  src: string
  alt: string
  poster?: string
}

export type MemoryItem = {
  id: `${number}${number}`
  title: string
  note: string
  media: MediaItem[]
}
```

`memories.ts` 必须明确列出 `01` 到 `10`，初始标题依次使用“第一次一起出发”“那些笑到停不下来的瞬间”“一起认真吃过的饭”“镜头里的小太阳”“平凡日子的闪光”“说走就走的小冒险”“被温柔接住的时候”“我们共同喜欢的风景”“生活送来的彩蛋”“下一站，继续快乐”，媒体路径依次指向 `public/media/memories/01/` 到 `10/`；主视频使用 `/media/finale/blessing.mp4`。

- [ ] **Step 4: 运行存储测试和类型检查**

Run: `npm test -- --run src/features/progress/storage.test.ts && npm run build`

Expected: 全部 PASS。

- [ ] **Step 5: 提交内容模型**

```powershell
git add src/content src/features/progress
git commit -m "feat: add configurable memories and progress"
```

### Task 3: 实现参考图视觉系统与冒险首页

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Create: `src/components/Hero.tsx`
- Modify: `src/main.tsx`
- Modify: `src/app/App.tsx`
- Modify: `src/app/App.test.tsx`

**Interfaces:**
- Produces: `Hero({ onStart }: { onStart: () => void })`。
- Consumes: `App` 顶层页面状态。

- [ ] **Step 1: 扩充测试，验证点击开始进入地图**

```tsx
await user.click(screen.getByRole('button', { name: '开始追奶酪' }))
expect(screen.getByRole('heading', { name: '10 块快乐奶酪' })).toBeInTheDocument()
```

- [ ] **Step 2: 运行测试确认地图尚不存在**

Run: `npm test -- --run src/app/App.test.tsx`

Expected: FAIL，找不到“10 块快乐奶酪”。

- [ ] **Step 3: 实现首页和设计令牌**

令牌必须包含 `--paper: #fff8e9`、`--cheese: #f7bd42`、`--coral: #ee806e`、`--ink: #673d19`、`--sage: #9fa277`，以及统一的圆角、相纸阴影、内容最大宽度。首页使用语义化按钮、纸张纹理、手绘路线、奶酪和猫鼠装饰层；装饰层必须 `aria-hidden="true"`。

- [ ] **Step 4: 验证首页状态切换与减少动态效果**

Run: `npm test -- --run src/app/App.test.tsx && npm run build`

Expected: PASS；CSS 包含 `@media (prefers-reduced-motion: reduce)`。

- [ ] **Step 5: 提交首页**

```powershell
git add src/app src/components/Hero.tsx src/styles src/main.tsx
git commit -m "feat: build scrapbook adventure hero"
```

### Task 4: 实现非线性奶酪地图与收集进度

**Files:**
- Create: `src/components/MemoryMap.tsx`
- Modify: `src/app/App.tsx`
- Modify: `src/app/App.test.tsx`
- Modify: `src/styles/global.css`

**Interfaces:**
- Produces: `MemoryMap({ memories, collectedIds, onOpen, onOpenFinale })`。
- Consumes: `MemoryItem[]`, `Set<string>`；当十项完成时调用 `onOpenFinale()`。

- [ ] **Step 1: 写任意顺序打开与进度测试**

```tsx
await user.click(screen.getByRole('button', { name: /打开第 07 块奶酪/ }))
expect(screen.getByText('已收集 1 / 10 块快乐奶酪')).toBeInTheDocument()
expect(screen.getByRole('button', { name: '开启最后的惊喜' })).toBeDisabled()
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- --run src/app/App.test.tsx`

Expected: FAIL，缺少地图按钮或进度更新。

- [ ] **Step 3: 实现十节点手绘地图**

桌面端使用错落路线布局，手机端使用自然纵向路线；每个奶酪是至少 `44px` 的按钮。打开时立即计入已收集，显示完成印章并调用 `saveProgress`。最终按钮仅在 `collectedIds.size === memories.length` 时启用。

- [ ] **Step 4: 测试第 07 块可先于第 01 块打开且刷新状态恢复**

Run: `npm test -- --run src/app/App.test.tsx src/features/progress/storage.test.ts`

Expected: PASS。

- [ ] **Step 5: 提交地图功能**

```powershell
git add src/components/MemoryMap.tsx src/app src/styles/global.css
git commit -m "feat: add nonlinear cheese memory map"
```

### Task 5: 实现图片、短视频和回忆详情页

**Files:**
- Create: `src/components/MediaFrame.tsx`
- Create: `src/components/MemoryDetail.tsx`
- Modify: `src/app/App.tsx`
- Modify: `src/app/App.test.tsx`
- Modify: `src/styles/global.css`

**Interfaces:**
- Produces: `MediaFrame({ item, onError })`；`MemoryDetail({ memory, onPrevious, onNext, onBack })`。
- Consumes: `MediaItem`, `MemoryItem`；视频不得设置带声音的自动播放。

- [ ] **Step 1: 写媒体类型与导航测试**

```tsx
expect(screen.getByRole('img', { name: /第 07 段回忆/ })).toBeInTheDocument()
await user.click(screen.getByRole('button', { name: '下一块' }))
expect(screen.getByText('08')).toBeInTheDocument()
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- --run src/app/App.test.tsx`

Expected: FAIL，详情媒体和导航尚未实现。

- [ ] **Step 3: 实现相纸详情与媒体错误回退**

图片使用 `loading="lazy"`；视频使用 `controls`、`preload="metadata"` 和可选 `poster`。媒体 `onError` 后显示“这段回忆正在等待主人把照片放进来”的完整相框，不阻断上一块、下一块和返回地图。

- [ ] **Step 4: 运行集成测试与构建**

Run: `npm test -- --run && npm run build`

Expected: PASS，无 TypeScript 错误。

- [ ] **Step 5: 提交回忆详情**

```powershell
git add src/components/MediaFrame.tsx src/components/MemoryDetail.tsx src/app src/styles/global.css
git commit -m "feat: add memory photo and video viewer"
```

### Task 6: 实现主祝福视频与新地图终章

**Files:**
- Create: `src/components/Finale.tsx`
- Modify: `src/app/App.tsx`
- Modify: `src/app/App.test.tsx`
- Modify: `src/styles/global.css`

**Interfaces:**
- Produces: `Finale({ videoSrc, unlocked, onReturnToMap })`。
- Consumes: 完成状态和主视频路径；视频 `ended`、加载失败后跳过按钮、手动继续均可进入横幅场景。

- [ ] **Step 1: 写锁定、解锁和终章测试**

```tsx
expect(screen.queryByText('新地图已开启')).not.toBeInTheDocument()
// 收集十项并进入最终页后：
fireEvent.ended(screen.getByLabelText('李金蔓生日祝福视频'))
expect(screen.getByText('李金蔓，三十岁生日快乐！')).toBeInTheDocument()
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- --run src/app/App.test.tsx`

Expected: FAIL，终章组件尚不存在。

- [ ] **Step 3: 实现主视频、拱门与生日横幅**

主视频页面提供播放控制、重试和“继续前往新地图”；终章显示汤姆和杰瑞共同庆祝的视觉位置、横幅正文和“再看一次回忆”按钮。任何媒体错误都不得让最终页面永久锁死。

- [ ] **Step 4: 运行所有单测**

Run: `npm test -- --run && npm run build`

Expected: PASS。

- [ ] **Step 5: 提交终章**

```powershell
git add src/components/Finale.tsx src/app src/styles/global.css
git commit -m "feat: unlock birthday video and finale"
```

### Task 7: 增加可替换素材目录与操作说明

**Files:**
- Create: `public/media/memories/01/.gitkeep` through `public/media/memories/10/.gitkeep`
- Create: `public/media/finale/.gitkeep`
- Create: `MEDIA_GUIDE.md`
- Modify: `src/content/memories.ts`

**Interfaces:**
- Produces: 明确的素材命名约定；用户仅需复制文件并编辑 `memories.ts`。

- [ ] **Step 1: 创建十一组空素材目录**

目录 `01`–`10` 分别对应十块奶酪，`finale` 对应主祝福视频。

- [ ] **Step 2: 编写可执行的素材替换说明**

`MEDIA_GUIDE.md` 必须示例说明图片、视频、poster 的配置对象，推荐图片使用 WebP/JPEG、视频使用 H.264 MP4，并说明文件名区分大小写。

- [ ] **Step 3: 检查配置中所有路径均有对应目录**

Run: `rg -n "/media/" src/content/memories.ts MEDIA_GUIDE.md`

Expected: 十段回忆与主视频路径均可追溯到对应目录。

- [ ] **Step 4: 构建确认空素材不会阻塞页面**

Run: `npm run build`

Expected: PASS，缺失媒体由运行时相框优雅回退。

- [ ] **Step 5: 提交素材说明**

```powershell
git add public/media src/content/memories.ts MEDIA_GUIDE.md
git commit -m "docs: add birthday media replacement guide"
```

### Task 8: 浏览器视觉、响应式与核心旅程验收

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/birthday-flow.spec.ts`
- Modify: `package.json`
- Modify: `src/styles/global.css`

**Interfaces:**
- Produces: 可重复运行的桌面和手机端核心旅程测试。

- [ ] **Step 1: 写端到端测试**

```ts
test('collects ten memories and reaches the birthday banner', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: '开始追奶酪' }).click()
  for (const id of ['07', '02', '10', '01', '05', '03', '09', '04', '08', '06']) {
    await page.getByRole('button', { name: new RegExp(`打开第 ${id} 块奶酪`) }).click()
    await page.getByRole('button', { name: '返回奶酪地图' }).click()
  }
  await page.getByRole('button', { name: '开启最后的惊喜' }).click()
  await page.getByRole('button', { name: '继续前往新地图' }).click()
  await expect(page.getByText('李金蔓，三十岁生日快乐！')).toBeVisible()
})
```

- [ ] **Step 2: 启动本地站点并运行桌面/手机测试**

Run: `npm run test:e2e`

Expected: Chromium desktop 与 mobile viewport 全部 PASS。

- [ ] **Step 3: 使用浏览器对照参考图做视觉验收**

检查首屏构图、暖色纸张质感、字体层级、奶酪按钮、手账相框、横幅终章、手机端无横向溢出；记录至少五项对比并修复全部可修复偏差。

- [ ] **Step 4: 运行最终验证**

Run: `npm test -- --run && npm run build && npm run test:e2e`

Expected: 所有命令成功；无不可读文字、遮挡、溢出、失效按钮或被媒体错误卡死的流程。

- [ ] **Step 5: 提交本地确认版本**

```powershell
git add package.json package-lock.json playwright.config.ts e2e src/styles/global.css
git commit -m "test: verify birthday journey across viewports"
```

### Task 9: 用户确认后发布 GitHub 与 Cloudflare

**Files:**
- Create: `.gitignore`
- Create: `wrangler.jsonc` only if Cloudflare Pages direct upload requires it
- Modify: `README.md`

**Interfaces:**
- Consumes: 用户确认的本地构建、GitHub 身份与 Cloudflare 登录。
- Produces: GitHub 仓库 URL、Cloudflare 线上 URL 和可重复部署命令。

- [ ] **Step 1: 获取用户本地视觉确认并检查媒体体积**

Run: `Get-ChildItem public/media -Recurse -File | Measure-Object Length -Sum`

Expected: 获得总字节数；大视频不盲目打包进静态部署。

- [ ] **Step 2: 根据当时 Cloudflare 官方文档确认 Pages、R2 或 Stream 方案**

静态文件满足当前 Pages 限制时直接部署；不满足时将视频移至 R2/Stream 并只更新集中配置 URL。

- [ ] **Step 3: 创建 GitHub 仓库并推送当前分支**

Run: 使用已安装并登录的 GitHub 工具创建仓库、设置 `origin`、推送；不得覆盖已有远程或历史。

Expected: GitHub 默认分支包含本地已确认版本。

- [ ] **Step 4: 构建并部署 Cloudflare**

Run: `npm run build`，随后使用当时官方推荐的 Wrangler Pages 部署命令发布 `dist/`。

Expected: 获得 HTTPS 线上 URL，首页和深层交互均可访问。

- [ ] **Step 5: 线上回归与发布记录**

验证十块奶酪、媒体、刷新持久化、最终视频和横幅终章；将部署命令、项目名和 URL 写入 `README.md` 后提交。

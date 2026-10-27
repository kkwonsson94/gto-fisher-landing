# GTO Fisher 正式落地页

2026-10-27 用户确认的版本。仓库：https://github.com/kkwonsson94/gto-fisher-landing

保留完整产品矩阵、SVG Logo、柔和卡片渐隐和已修复边缘的光效；没有采用最后被撤回的强光/额外模糊试验。Fisher 独立覆盖，介绍区的留白与吸附/淡出位置联动。已移除首屏副文案、角色标签前的冗余说明及本地预览提示。

## 直接运行

需要 Node.js 24 或更新版本。网页成品、图片、字体和视频已包含在仓库中，不需要安装依赖即可查看：

```sh
git clone https://github.com/kkwonsson94/gto-fisher-landing.git
cd gto-fisher-landing
npm start
```

打开 http://127.0.0.1:4194/ 。也可以将根目录的 HTML、CSS、JS 和 assets/ 部署到静态服务器；不要部署 production/、tests/ 或配置文件。没有自动开通托管或修改原公网服务。

## 修改动画和重新打包

```sh
npm ci --prefix production/hero-remotion --ignore-scripts
npm run build
npm test
npm run studio
```

Remotion 中的正式合成为 `GTO-Fisher-Hero-Polish`（8 秒、1920×1080、30fps）。原版和扑克试验仅作为源码中的对照合成，不驱动落地页。

- `index.html`：正式页面结构。
- `hero.css`、`styles.css`、`discovery.css`、`solver.css`：页面样式。
- `production/hero-remotion/src/FisherFilm.tsx`：正式动画源。
- `production/hero-remotion/landing-layout.css`、`src/landing-layout.ts`：Fisher 位置和介绍留白。
- `src/landing.tsx`、`src/hero-entry.ts`：正式播放入口，资源与页面地址均相对当前站点。
- `hero-motion.js`、`hero-motion.css`、`assets/hero-motion/`：已打包的动画与资源；源码修改后用根目录 `npm run build` 更新。
- `media.js`、`discovery-content.js`：后续功能演示、案例、链接和提示词内容。

正常播放使用浏览器中的 Remotion Player，与已确认本地版采用同一合成和原生暂停/重播时钟。v6 MP4 保留为时钟及加载失败时的原生视频替代，不是新增视频导出。支持离屏暂停、减少动态偏好及现有动画开关。

验证包含行为测试、TypeScript、静态资源/视频分段读取、受保护路径与正式动画源一致性。浏览器自动视觉验收受当前设置限制；页面视觉沿用用户确认版。部分后续角色演示仍为现有占位素材，未接入真实解算、登录或支付。

开发依赖中的 Remotion/Zod 工具链沿用当前锁定版本；之前发现的工具链依赖安全提示未在本次归档中升级处理。上线服务只应暴露网页成品资源，不开放制作工具或本地预览服务。

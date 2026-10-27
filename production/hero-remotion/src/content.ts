// Swap source paths here when final artwork becomes available.
export const assets = {
  solver: 'hero-screens/solver-1920.webp',
  equity: 'hero-screens/equity-1920.webp',
  reports: 'hero-screens/aggregate-1920.webp',
  solutions: 'hero-screens/library-1920.webp',
  ai: 'product-screens/assistant.png',
  logo: 'brand/fisher-logo.svg',
};

export const keyframes = [
  {frame: 18, time: '00:00.60', title: '左侧策略卡片起手', detail: '首帧左移 14% / 叠卡微旋转 / 产品直接可见'},
  {frame: 54, time: '00:01.80', title: '错层展开产品能力', detail: '叠卡依次展开为横向素材带 / 光影跟随'},
  {frame: 99, time: '00:03.30', title: '选择与聚焦', detail: '拖拽指针 + 点击波纹 / 背景素材退焦'},
  {frame: 138, time: '00:04.60', title: '连续推近工作台', detail: '同一界面展开 / 内部轻推镜头后回稳'},
  {frame: 174, time: '00:05.80', title: 'GTO Fisher 品牌亮相', detail: '红蓝品牌 Logo + 产品名称 / 真实产品界面'},
  {frame: 234, time: '00:07.80', title: '完整产品界面与品牌定格', detail: '矩阵、牌桌、组合详情基本完整 / 避开 Fisher 覆盖区'},
] as const;

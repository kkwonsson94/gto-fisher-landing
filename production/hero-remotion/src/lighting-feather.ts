// One shared alpha profile for CSS and the boundary tests. Every bloom reaches
// zero before its element edge; the outer canvas matte catches travelling lights.
type Stop = readonly [position: number, alpha: number];
export const BLOOM_STOPS: readonly Stop[] = [
  [0, 1], [0.2, 0.86], [0.42, 0.5], [0.64, 0.18], [0.8, 0.035], [0.92, 0], [1, 0],
];
const horizontal: readonly Stop[] = [
  [0, 0], [0.02, 0.04], [0.05, 0.35], [0.09, 0.85], [0.12, 1],
  [0.76, 1], [0.84, 0.6], [0.92, 0.15], [0.98, 0.01], [1, 0],
];
const vertical: readonly Stop[] = [
  [0, 0], [0.03, 0.06], [0.07, 0.45], [0.12, 0.92], [0.15, 1],
  [0.72, 1], [0.84, 0.5], [0.94, 0.06], [0.98, 0.005], [1, 0],
];

function sample(stops: readonly Stop[], position: number) {
  if (!Number.isFinite(position) || position < 0 || position > 1) return 0;
  for (let index = 1; index < stops.length; index++) {
    const [end, to] = stops[index];
    const [start, from] = stops[index - 1];
    if (position <= end) return from + (to - from) * (position - start) / (end - start);
  }
  return 0;
}

export function getSoftBloomBackground(color: string, peakAlpha: number) {
  if (!/^#[\da-f]{6}$/i.test(color)) throw new Error('Soft light must use a six-digit hex colour.');
  const channels = [1, 3, 5].map((offset) => parseInt(color.slice(offset, offset + 2), 16));
  const peak = Number.isFinite(peakAlpha) ? Math.max(0, Math.min(1, peakAlpha)) : 0;
  return `radial-gradient(ellipse 50% 50% at 50% 50%, ${BLOOM_STOPS.map(([position, alpha]) =>
    `rgba(${channels.join(', ')}, ${(alpha * peak).toFixed(5)}) ${position * 100}%`).join(', ')})`;
}

function linearMask(direction: string, stops: readonly Stop[]) {
  return `linear-gradient(${direction}, ${stops.map(([position, alpha]) =>
    `rgba(0, 0, 0, ${alpha}) ${position * 100}%`).join(', ')})`;
}

export const LIGHT_CANVAS_MASK = `${linearMask('90deg', horizontal)}, ${linearMask('180deg', vertical)}`;

export function getBloomEdgeAlpha(x: number, y: number, width: number, height: number) {
  if (!(width > 0 && height > 0)) return 0;
  return sample(BLOOM_STOPS, Math.hypot((x - width / 2) / (width / 2), (y - height / 2) / (height / 2)));
}

export function getCanvasLightAlpha(x: number, y: number, width = 1920, height = 1080) {
  if (!(width > 0 && height > 0)) return 0;
  return sample(horizontal, x / width) * sample(vertical, y / height);
}

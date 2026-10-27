// Deterministic preview-only timing. No randomness, timers or product-data changes.
type Ease = (value: number) => number;
const smooth: Ease = (value) => value * value * (3 - 2 * value);
const dealEase: Ease = (value) => 1 - (1 - value) ** 3;

export function tween(time: number, start: number, end: number, from: number, to: number, ease: Ease = smooth) {
  const progress = Math.min(1, Math.max(0, (time - start) / (end - start)));
  return from + (to - from) * ease(progress);
}

export const POKER_FINAL_WORKSPACE = {left: 24, top: 64, width: 1344, height: 660} as const;
export const POKER_HOLD_START = 6.55;

export function getPokerCardState(time: number, index: number) {
  if (!Number.isInteger(index) || index < 0 || index > 4) throw new Error('Card index must be 0–4.');
  const slot = {left: 76 + index * 264, top: [420, 398, 390, 398, 420][index],
    width: 240, height: 180, rotate: [-7, -3.5, 0, 3.5, 7][index]};
  const dealStart = 0.4 + index * 0.13;
  const deal = tween(time, dealStart, dealStart + 0.92, 0, 1, dealEase);
  const flight = Math.sin(deal * Math.PI);
  const selected = index === 0 || index === 4;
  const initialOpacity = index === 0 ? 1 : 0.72 - index * 0.09;
  if (time < 2.15) return {
    left: (440 + index * 16) * (1 - deal) + slot.left * deal,
    top: (359 + index * 12) * (1 - deal) + slot.top * deal - flight * 74,
    width: 480 * (1 - deal) + slot.width * deal,
    height: 294 * (1 - deal) + slot.height * deal,
    rotate: (-3 + index * 2.5) * (1 - deal) + slot.rotate * deal + flight * (index - 2) * 2,
    opacity: initialOpacity * (1 - deal) + deal, scale: 1, blur: 0,
    footerHeight: 46, footerOpacity: 1, imageScale: 1,
    glow: 0, zIndex: 6 - index,
  };
  const pick = tween(time, 2.15, 3.05, 0, 1);
  if (!selected) return {
    left: slot.left + (2 - index) * 58 * pick,
    top: slot.top + (150 + index * 12) * pick,
    width: slot.width, height: slot.height,
    rotate: slot.rotate + (index - 2) * 7 * pick,
    opacity: 1 - pick, scale: 1 - pick * 0.18, blur: pick * 4,
    footerHeight: 46, footerOpacity: 1, imageScale: 1,
    glow: 0, zIndex: 1,
  };
  const pair = index === 0
    ? {left: 96, top: 270, width: 624, height: 362}
    : {left: 744, top: 270, width: 600, height: 362};
  const expand = tween(time, 3.65, 4.95, 0, 1);
  const leave = tween(time, 3.65, 4.4, 0, 1);
  const pairLeft = slot.left * (1 - pick) + pair.left * pick;
  const pairTop = slot.top * (1 - pick) + pair.top * pick - Math.sin(pick * Math.PI) * 34;
  const pairWidth = slot.width * (1 - pick) + pair.width * pick;
  const pairHeight = slot.height * (1 - pick) + pair.height * pick;
  return {
    left: index === 0 ? pairLeft * (1 - expand) + POKER_FINAL_WORKSPACE.left * expand : pairLeft + leave * 86,
    top: index === 0 ? pairTop * (1 - expand) + POKER_FINAL_WORKSPACE.top * expand : pairTop + leave * 58,
    width: index === 0 ? pairWidth * (1 - expand) + POKER_FINAL_WORKSPACE.width * expand : pairWidth,
    height: index === 0 ? pairHeight * (1 - expand) + POKER_FINAL_WORKSPACE.height * expand : pairHeight,
    rotate: slot.rotate * (1 - pick) + (index === 4 ? leave * 4 : 0),
    opacity: index === 0 ? 1 : 1 - leave,
    scale: index === 0 ? 1 : 1 - leave * 0.08,
    blur: index === 0 ? 0 : leave * 2,
    footerHeight: index === 0 ? 46 * (1 - expand) : 46,
    footerOpacity: index === 0 ? 1 - tween(time, 3.65, 4.25, 0, 1) : 1,
    imageScale: index === 0 ? 1 + 0.018 * tween(time, 2.15, 3.05, 0, 1) * (1 - tween(time, 3.65, 5.35, 0, 1)) : 1,
    glow: pick * (1 - tween(time, 3.65, 4.65, 0, 1)),
    zIndex: index === 0 ? 10 : 8,
  };
}

export function getMatrixRowState(time: number, row: number) {
  if (!Number.isInteger(row) || row < 0 || row > 12) throw new Error('Matrix row must be 0–12.');
  const reveal = tween(time, 4.55 + row * 0.045, 4.92 + row * 0.045, 0, 1);
  return {
    shade: tween(time, 3.65, 4.3, 0, 0.9) * (1 - reveal),
    light: Math.sin(reveal * Math.PI) * 0.32,
  };
}

const smooth = (value: number) => value * value * (3 - 2 * value);
function progress(time: number, start: number, end: number) {
  return smooth(Math.max(0, Math.min(1, (time - start) / (end - start))));
}
function pulse(time: number, start: number, inEnd: number, outStart: number, end: number) {
  return progress(time, start, inEnd) * (1 - progress(time, outStart, end));
}

export function getSurfacePolish(time: number, delay: number, softRetreat: boolean) {
  const spread = pulse(time, 0.9 + delay, 1.2 + delay, 1.8 + delay, 2.35 + delay);
  const expansion = softRetreat ? 0 : pulse(time, 3.65, 3.95, 4.55, 5.18);
  const travel = time < 3
    ? progress(time, 0.9 + delay, 2.35 + delay)
    : progress(time, 3.65, 5.18);
  return {
    edgeOpacity: spread * 0.72 + expansion * 0.58,
    sheenOpacity: spread * 0.52 + expansion * 0.38,
    travel,
    retreat: softRetreat ? progress(time, 2.22, 3.6) : 0,
  };
}

export function getAmbientPolish(time: number) {
  return {
    spreadOpacity: pulse(time, 0.5, 1.3, 1.9, 3.6) * 0.72,
    spreadX: -190 + progress(time, 0.5, 2.7) * 760,
    expansionOpacity: pulse(time, 3.2, 3.9, 4.7, 6.1) * 0.58,
    expansionX: 160 + progress(time, 3.2, 5.4) * 520,
  };
}

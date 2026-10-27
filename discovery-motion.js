const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

/** A pause-aware clock for uniform forward travel through repeated content. */
export function createPromptMotion({speed = 22} = {}) {
  let previousTime = null;

  return {
    advance(time, {position, cycleWidth, running}) {
      const width = Math.max(0, Number.isFinite(cycleWidth) ? cycleWidth : 0);
      const offset = Number.isFinite(position) ? position : 0;
      const remainder = width ? offset % width : 0;
      const current = remainder < 0 ? remainder + width : remainder;
      if (!running || !width || !Number.isFinite(time)) {
        previousTime = null;
        return {position:current};
      }
      if (previousTime === null) {
        previousTime = time;
        return {position:current};
      }

      // A delayed frame must not catch up for a suspended browser tab.
      const seconds = clamp(time - previousTime, 0, 64) / 1000;
      previousTime = time;
      const next = (current + speed * seconds) % width;
      return {position:next};
    },
    resetClock() { previousTime = null; },
  };
}

/** Expand the case fan before its sticky content reaches the navigation. */
export function getCaseSpread({top, viewportHeight, headerHeight = 80, compact = false, reducedMotion = false}) {
  if (compact || reducedMotion) return 1;
  const start = Math.max(1, viewportHeight * 0.6);
  const end = Math.min(headerHeight + 24, start - 1);
  return clamp((start - top) / (start - end), 0, 1);
}

/** A configured link may navigate only to an explicit web address. */
export function safeExternalHref(value) {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const url = new URL(value.trim());
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

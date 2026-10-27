export const OVERVIEW_STARTS = [0, 2000, 3900, 5700, 7350];
export const OVERVIEW_DURATION = 11000;

export function createOverviewTimeline({ reducedMotion = false } = {}) {
  let elapsed = reducedMotion ? OVERVIEW_DURATION : 0;
  let paused = reducedMotion;
  function snapshot() {
    const index = OVERVIEW_STARTS.findLastIndex(start => elapsed >= start);
    const end = OVERVIEW_STARTS[index + 1] ?? OVERVIEW_DURATION;
    return { index, elapsed, progress: (elapsed - OVERVIEW_STARTS[index]) / (end - OVERVIEW_STARTS[index]), paused, completed: elapsed >= OVERVIEW_DURATION };
  }
  return {
    snapshot,
    advance(delta, allowed) {
      if (allowed && !paused && Number.isFinite(delta) && delta > 0) elapsed = Math.min(OVERVIEW_DURATION, elapsed + delta);
      return snapshot();
    },
    select(index) {
      if (!Number.isInteger(index) || index < 0 || index >= OVERVIEW_STARTS.length) return;
      elapsed = OVERVIEW_STARTS[index]; paused = true;
    },
    pause() { paused = true; },
    play() { if (elapsed >= OVERVIEW_DURATION) elapsed = 0; paused = false; },
    replay() { elapsed = 0; paused = false; },
  };
}

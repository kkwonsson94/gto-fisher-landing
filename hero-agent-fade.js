// Scrolling selects a target state; CSS controls the fade's duration independently.
export function getAgentAway({ introTop, viewportHeight, headerHeight, introRestTop }, wasAway = false) {
  const usableHeight = Math.max(1, viewportHeight - headerHeight);
  // First hold the complete heading and character together, including at the anchor.
  const fadeStart = Math.min(headerHeight + usableHeight * .25, introRestTop - 24);
  // A small return buffer prevents flickering around the trigger point.
  return wasAway ? introTop < fadeStart + 20 : introTop <= fadeStart;
}

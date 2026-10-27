export function getPokerPreviewFrame(currentTime: number, ended: boolean, staticPreview: boolean) {
  if (ended || staticPreview) return 239;
  if (!Number.isFinite(currentTime)) return 0;
  return Math.max(0, Math.min(239, Math.floor(currentTime * 30)));
}

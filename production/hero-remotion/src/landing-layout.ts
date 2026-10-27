// Anchor to the film, not a stale viewport offset after copy is removed.
export function getAgentAnchor(filmTop: number, heroTop: number, filmWidth: number) {
  if (![filmTop, heroTop, filmWidth].every(Number.isFinite)) return 0;
  return Math.max(0, filmTop - heroTop + Math.min(32, Math.max(12, filmWidth * 0.025)));
}

type IntroductionMetrics = {
  viewportHeight: number;
  headerHeight: number;
  cardHeight: number;
  titleHeight: number;
  scrollPaddingTop: number;
  mobile: boolean;
};

// One shared introduction beat: pair the title with Fisher and leave a runway
// below them. The exit threshold matches the existing, unchanged fade controller.
export function getIntroductionSpacing(metrics: IntroductionMetrics) {
  const finite = (value: number, fallback: number) => Number.isFinite(value) ? Math.max(0, value) : fallback;
  const height = Math.max(240, finite(metrics.viewportHeight, 900));
  const header = finite(metrics.headerHeight, 76);
  const card = finite(metrics.cardHeight, 400);
  const title = finite(metrics.titleHeight, 220);
  const anchor = finite(metrics.scrollPaddingTop, 170);
  const mobile = metrics.mobile;
  const stickyTop = Math.max(header + 24,
    Math.min(mobile ? 210 : 280, height * 0.24, height - card - 24));
  const paddingTop = Math.max(mobile ? 96 : 180,
    stickyTop + (card - title) / 2 + height * 0.04 - anchor);
  const restTop = anchor + paddingTop;
  const fadeStart = Math.min(header + Math.max(1, height - header) * 0.25, restTop - 24);
  const exitClearance = mobile ? 40 : 64;
  const nextSectionTopAtExit = Math.max(height * (mobile ? 1.04 : 0.9), stickyTop + card + exitClearance);
  const paddingBottom = Math.max(mobile ? 160 : 240, height * 0.4, nextSectionTopAtExit - fadeStart - title);
  return {stickyTop, paddingTop, paddingBottom, fadeStart};
}

export function mountLocalLandingLayout() {
  const hero = document.querySelector<HTMLElement>('.hero-product-compact');
  const film = hero?.querySelector<HTMLElement>('.hero-film');
  const heading = hero?.querySelector<HTMLElement>('.hero-heading');
  const introTitle = hero?.querySelector<HTMLElement>('#meet-fisher-title');
  const card = hero?.querySelector<HTMLElement>('.hero-agent-card');
  const header = document.querySelector<HTMLElement>('.site-header');
  if (!hero || !film || !heading) return;
  let pending = 0;
  const measure = () => {
    pending = 0;
    const surface = film.getBoundingClientRect();
    const top = getAgentAnchor(surface.top, hero.getBoundingClientRect().top, surface.width);
    const spacing = introTitle && card && header ? getIntroductionSpacing({
      viewportHeight: innerHeight,
      headerHeight: header.getBoundingClientRect().height,
      cardHeight: card.getBoundingClientRect().height,
      titleHeight: introTitle.getBoundingClientRect().height,
      scrollPaddingTop: parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop),
      mobile: matchMedia('(max-width: 600px)').matches,
    }) : null;
    hero.style.setProperty('--hero-agent-anchor', `${top}px`);
    if (spacing) {
      hero.style.setProperty('--agent-top', `${spacing.stickyTop}px`);
      hero.style.setProperty('--intro-gap-top', `${spacing.paddingTop}px`);
      hero.style.setProperty('--intro-gap-bottom', `${spacing.paddingBottom}px`);
    }
  };
  const schedule = () => { if (!pending) pending = requestAnimationFrame(measure); };
  measure();
  const observer = new ResizeObserver(schedule);
  observer.observe(heading);
  observer.observe(film);
  if (introTitle) observer.observe(introTitle);
  if (card) observer.observe(card);
  if (header) observer.observe(header);
  addEventListener('resize', schedule, {passive: true});
  addEventListener('pagehide', () => {
    cancelAnimationFrame(pending);
    observer.disconnect();
    removeEventListener('resize', schedule);
  }, {once: true});
}

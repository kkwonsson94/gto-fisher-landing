import { getAgentAway } from './hero-agent-fade.js';

// The product film plays once; the website character remains an independent layer.
export function createHeroController({ onReplay }) {
  const hero = document.querySelector('#home');
  const overview = document.querySelector('#hero-overview');
  const film = document.querySelector('#hero-product-video');
  const progress = document.querySelector('.hero-film-progress');
  const status = document.querySelector('.overview-status');
  const actor = document.querySelector('#hero-loop');
  const card = document.querySelector('.hero-agent-card');
  const introduction = document.querySelector('#meet-fisher-title');
  const header = document.querySelector('.site-header');
  const pause = document.querySelector('.pause-film');
  const replayButton = document.querySelector('.replay-film');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let policy = { running: false, characters: true, stories: true };
  let actorAway = false, actorHidden = false, fadeReady = false;
  let scrollFrame = 0;
  let userPaused = false, completed = false, filmVisible = false;
  let failed = false, playPending = false, autoplayBlocked = false, allowReducedPlayback = false;

  function eligible() {
    return policy.running && policy.stories && filmVisible && !userPaused && !completed && !failed
      && !document.hidden && (!reduced.matches || allowReducedPlayback);
  }
  function render() {
    const playing = !film.paused && !film.ended && eligible();
    const duration = Number.isFinite(film.duration) && film.duration > 0 ? film.duration : 8;
    const staticPreview = failed || autoplayBlocked || (reduced.matches && !allowReducedPlayback);
    overview.dataset.completed = String(completed);
    overview.dataset.playing = String(playing);
    overview.dataset.static = String(staticPreview);
    progress.max = duration;
    progress.value = completed || staticPreview ? duration : Math.min(film.currentTime, duration);
    pause.hidden = completed;
    pause.disabled = replayButton.disabled = failed;
    pause.setAttribute('aria-label', playing ? 'Pause product overview' : 'Play product overview');
    pause.setAttribute('aria-pressed', String(!playing));
    pause.querySelector('span:first-child').textContent = playing ? 'Ⅱ' : '▷';
    pause.querySelector('.pause-film-label').textContent = playing ? 'Pause' : 'Play';
  }
  function sync() {
    if (!eligible()) film.pause();
    else if (film.paused && !playPending && !autoplayBlocked) {
      playPending = true;
      film.play().catch(error => {
        // A gate can pause an in-flight play request. That is not an autoplay failure.
        if (error.name !== 'AbortError' && eligible()) autoplayBlocked = true;
      }).finally(() => { playPending = false; render(); });
    }
    render();
  }
  function update(next) {
    policy = next;
    if (next.running && next.characters && !actorHidden && !reduced.matches) {
      if (actor.paused) actor.play()?.catch(() => {});
    } else actor.pause();
    sync();
  }
  function revealFilm() {
    const screen = overview.getBoundingClientRect();
    const safeTop = header.getBoundingClientRect().height + 24;
    if (screen.top < safeTop) {
      scrollBy({ top: screen.top - safeTop, behavior: reduced.matches ? 'instant' : 'smooth' });
    }
  }
  function requestPlay() {
    userPaused = false;
    autoplayBlocked = false;
    allowReducedPlayback = true;
    onReplay();
    sync();
  }
  pause.disabled = replayButton.disabled = false;
  replayButton.addEventListener('click', () => {
    completed = false;
    film.currentTime = 0;
    requestPlay();
    status.textContent = 'Product overview restarted.';
    revealFilm();
  });
  pause.addEventListener('click', () => {
    if (!film.paused && eligible()) {
      userPaused = true;
      sync();
      status.textContent = 'Product overview paused.';
    } else {
      requestPlay();
      status.textContent = 'Product overview playing.';
      revealFilm();
    }
  });
  film.muted = true;
  film.addEventListener('ended', () => {
    completed = true;
    render();
    status.textContent = 'Product overview finished. GTO Fisher brand frame remains on screen.';
  });
  film.addEventListener('error', () => {
    failed = true;
    render();
    status.textContent = 'Product video is unavailable. A still preview is shown.';
  });
  film.addEventListener('playing', () => { autoplayBlocked = false; render(); });
  ['timeupdate', 'loadedmetadata', 'pause', 'seeked'].forEach(type => film.addEventListener(type, render));
  const filmObserver = new IntersectionObserver(entries => {
    filmVisible = entries[0].isIntersecting;
    sync();
  }, { threshold: 0.08 });
  filmObserver.observe(overview);
  actor.addEventListener('playing', () => {
    actor.classList.add('is-decoded'); actor.parentElement.classList.add('has-motion');
  });
  actor.addEventListener('error', () => {
    actor.classList.remove('is-decoded'); actor.parentElement.classList.remove('has-motion');
  });
  card.addEventListener('transitionend', event => {
    if (event.target === card && event.propertyName === 'opacity' && actorAway) {
      actorHidden = true;
      update(policy);
    }
  });
  function checkScroll() {
    scrollFrame = 0;
    const introTop = introduction.getBoundingClientRect().top;
    const sectionTop = introduction.parentElement.getBoundingClientRect().top;
    const away = getAgentAway({
      introTop,
      viewportHeight: innerHeight,
      headerHeight: header.getBoundingClientRect().height,
      introRestTop: parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) + introTop - sectionTop,
    }, actorAway);
    if (away !== actorAway || !fadeReady) {
      actorAway = away;
      actorHidden = away && (!fadeReady || reduced.matches);
      hero.classList.toggle('agent-away', away);
      card.inert = away;
      card.setAttribute('aria-hidden', String(away));
      update(policy);
    }
  }
  function scheduleScroll() { if (!scrollFrame) scrollFrame = requestAnimationFrame(checkScroll); }
  addEventListener('scroll', scheduleScroll, { passive: true });
  addEventListener('resize', scheduleScroll, { passive: true });
  reduced.addEventListener('change', () => {
    allowReducedPlayback = false;
    if (reduced.matches) {
      actor.pause(); actor.classList.remove('is-decoded'); actor.parentElement.classList.remove('has-motion');
    }
    actorHidden = actorAway;
    update(policy);
  });
  render(); checkScroll();
  // Resolve restored-scroll state before enabling transitions, avoiding a load flash.
  getComputedStyle(card).opacity;
  hero.classList.add('agent-ready');
  fadeReady = true;
  return { update };
}

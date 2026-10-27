import {createRoot} from 'react-dom/client';
import {Player, type PlayerRef} from '@remotion/player';
import {staticFile} from 'remotion';
import {PolishedFisherFilm} from './FisherFilm';
import {getPokerPreviewFrame} from './poker-preview-clock';
import {mountLocalLandingLayout} from './landing-layout';

// Approved composition. The native video keeps the existing replay, visibility,
// reduced-motion and pause clock, and remains a fallback if live rendering fails.
async function start() {
  mountLocalLandingLayout();
  const surface = document.querySelector<HTMLDivElement>('#hero-overview');
  const clock = document.querySelector<HTMLVideoElement>('#hero-product-video');
  if (!surface || !clock) throw new Error('Hero surface is missing.');
  const mount = document.createElement('div');
  mount.id = 'hero-live-preview';
  mount.setAttribute('aria-label', 'GTO Fisher product overview');
  surface.dataset.previewComposition = 'GTO-Fisher-Hero-Polish';
  surface.append(mount);
  let player: PlayerRef | null = null;
  let raf = 0, lastFrame = -1, failed = false;
  let resolveReady: () => void = () => undefined;
  const ready = new Promise<void>((resolve) => { resolveReady = resolve; });
  const syncFrame = () => {
    const next = getPokerPreviewFrame(clock.currentTime, clock.ended, surface.dataset.static === 'true');
    if (next !== lastFrame && player && !failed) {
      player.seekTo(next); lastFrame = next;
      surface.dataset.previewFrame = String(next);
    }
  };
  const tick = () => { syncFrame(); raf = clock.paused || clock.ended || failed ? 0 : requestAnimationFrame(tick); };
  const onPlaying = () => { if (!raf && !failed) raf = requestAnimationFrame(tick); };
  const onStopped = () => { cancelAnimationFrame(raf); raf = 0; syncFrame(); };
  createRoot(mount).render(
    <Player component={PolishedFisherFilm} compositionWidth={1920} compositionHeight={1080}
      fps={30} durationInFrames={240} controls={false} autoPlay={false} loop={false}
      clickToPlay={false} doubleClickToFullscreen={false} spaceKeyToPlayOrPause={false}
      moveToBeginningWhenEnded={false} numberOfSharedAudioTags={0}
      style={{width: '100%', height: '100%'}}
      ref={(instance) => { if (instance) { player = instance; resolveReady(); } }}
      errorFallback={({error}) => {
        failed = true; player = null; resolveReady();
        surface.dataset.previewReady = 'false';
        console.error('Hero switched to native video fallback.', error);
        return null;
      }}/>,
  );
  await ready;
  const sources = ['hero-screens/solver-1920.webp', 'hero-screens/equity-1920.webp',
    'hero-screens/aggregate-1920.webp', 'hero-screens/library-1920.webp',
    'product-screens/assistant.png', 'brand/fisher-logo.svg'];
  await Promise.all(sources.map((source) => new Promise<void>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('A hero asset did not load.'));
    image.src = staticFile(source);
  })));
  if (failed) throw new Error('Hero player is unavailable.');
  clock.addEventListener('playing', onPlaying);
  ['pause', 'ended'].forEach((event) => clock.addEventListener(event, onStopped));
  ['seeked', 'timeupdate', 'loadedmetadata'].forEach((event) => clock.addEventListener(event, syncFrame));
  const observer = new MutationObserver(syncFrame);
  observer.observe(surface, {attributes: true, attributeFilter: ['data-static']});
  surface.dataset.previewReady = 'true';
  syncFrame();
  addEventListener('pagehide', () => { cancelAnimationFrame(raf); observer.disconnect(); }, {once: true});
}

void start().catch((error) => {
  const surface = document.querySelector<HTMLDivElement>('#hero-overview');
  if (surface) surface.dataset.previewReady = 'false';
  console.error('Hero switched to native video fallback.', error);
}).finally(async () => {
  // Always enable the page controls, even if the live animation could not load.
  await import(new URL('app.js', document.baseURI).href);
});

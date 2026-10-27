import { roles } from './media.js';
import { createHeroController } from './hero.js';
import { createDiscoveryController } from './discovery.js';

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const mobile = matchMedia('(max-width: 800px)');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const state = { active: 'coach', paused: reducedMotion.matches, modal: false, layers: { atmosphere: true, characters: true, stories: true } };
const visible = new Set();
const heroController = createHeroController({ onReplay: () => {
  state.paused = false; updateMotionButton(); updatePlayback();
} });
const dialog = $('#story-dialog');
const dialogVideo = $('#dialog-video');
const panelHost = $('#story-panels');
const desktopVideos = new Map();
const mobileVideos = new Map();
const expandIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/></svg>';
const discoveryController = createDiscoveryController({ openStory });

// Only the current, visible chapter plays. Other roles retain their decoded poster.
roles.forEach((role, index) => {
  const panel = document.createElement('div');
  panel.className = `story-panel${index === 0 ? ' is-active' : ''}`;
  panel.dataset.story = role.id;
  panel.setAttribute('aria-hidden', String(index !== 0));
  const video = document.createElement('video');
  video.muted = true; video.loop = true; video.playsInline = true; video.preload = 'none';
  video.poster = role.poster; video.dataset.src = role.story;
  video.setAttribute('aria-label', `${role.title} demo placeholder`);
  panel.append(video); panelHost.append(panel); desktopVideos.set(role.id, video);

  const slot = $(`#${role.id} .mobile-story-slot`);
  slot.innerHTML = `<div class="mobile-story-shell"><div class="mobile-story-top"><span>FISHER IN ACTION</span><span>Product story · Placeholder</span></div><video class="mobile-story-video" muted loop playsinline preload="none" poster="assets/stories/${role.id}-mobile.jpg" data-src="${role.mobileStory}" aria-label="${role.title} demo placeholder"></video><div class="hidden-story-label" aria-hidden="true"><span>PRODUCT STORY</span><p>Your next product story goes here.</p></div><div class="mobile-story-bottom"><span>${role.caption}</span><button class="expand-story" data-open-story="${role.id}" type="button" aria-label="Expand the ${role.title} demo">${expandIcon}</button></div></div><p class="mobile-story-footnote">${role.steps}</p>`;
  mobileVideos.set(role.id, $('video', slot));
});

function ensureSource(video) {
  if (video.dataset.src && !video.getAttribute('src')) { video.src = video.dataset.src; video.load(); }
}
function play(video) {
  ensureSource(video);
  if (video.paused) video.play()?.catch(() => { /* Static poster remains when autoplay is unavailable. */ });
}
function shouldAnimate() { return !state.paused && !document.hidden && !state.modal; }
function updatePlayback() {
  const running = shouldAnimate();
  discoveryController.update({ running });
  const heroVisible = visible.has($('#home'));
  $$('[data-ambient]').forEach(video => running && state.layers.atmosphere && heroVisible ? play(video) : video.pause());
  heroController.update({ running: running && heroVisible, characters: state.layers.characters, stories: state.layers.stories });
  $$('[data-character]').forEach(video => {
    const current = video.dataset.character === state.active;
    running && state.layers.characters && current && visible.has(video.closest('.role-chapter')) ? play(video) : video.pause();
  });
  for (const role of roles) {
    const chapterVisible = visible.has($(`#${role.id}`));
    const eligible = running && state.layers.stories && role.id === state.active && chapterVisible;
    const desktop = desktopVideos.get(role.id), handheld = mobileVideos.get(role.id);
    eligible && !mobile.matches ? play(desktop) : desktop.pause();
    eligible && mobile.matches ? play(handheld) : handheld.pause();
  }
}

function activate(id) {
  if (id === state.active) return;
  state.active = id;
  const role = roles.find(item => item.id === id);
  $$('.role-tab').forEach(tab => {
    const active = tab.hash === `#${id}`;
    tab.classList.toggle('is-active', active);
    if (active) tab.setAttribute('aria-current', 'location'); else tab.removeAttribute('aria-current');
  });
  $$('.role-chapter').forEach(chapter => chapter.classList.toggle('is-active', chapter.id === id));
  $$('.story-panel').forEach(panel => {
    const active = panel.dataset.story === id;
    panel.classList.toggle('is-active', active); panel.setAttribute('aria-hidden', String(!active));
  });
  $('#story-caption').textContent = role.caption;
  $('#story-step').textContent = role.steps;
  $('#story-number').textContent = String(roles.indexOf(role) + 1).padStart(2, '0');
  updatePlayback();
}

let scheduled = false;
function updateChapter() {
  scheduled = false;
  const guide = Math.min(innerHeight * .42, 350);
  let selected = roles[0].id;
  for (const role of roles) if ($(`#${role.id}`).getBoundingClientRect().top <= guide) selected = role.id;
  activate(selected);
}
function onScroll() {
  if (!scheduled) { scheduled = true; requestAnimationFrame(updateChapter); }
}
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll, { passive: true });
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
  updatePlayback();
}, { threshold: 0.08 });
observer.observe($('#home'));
$$('.role-chapter').forEach(chapter => observer.observe(chapter));
let resumeDialog = false;
document.addEventListener('visibilitychange', () => {
  if (document.hidden && state.modal) { resumeDialog = !dialogVideo.paused; dialogVideo.pause(); }
  else if (state.modal && resumeDialog && !state.paused) { play(dialogVideo); resumeDialog = false; }
  updatePlayback();
});
mobile.addEventListener('change', () => { updateChapter(); updatePlayback(); });
reducedMotion.addEventListener('change', () => { state.paused = reducedMotion.matches; if (state.paused) dialogVideo.pause(); updateMotionButton(); updatePlayback(); });

const previewToggle = $('.preview-toggle');
previewToggle.addEventListener('click', () => {
  const open = previewToggle.getAttribute('aria-expanded') !== 'true';
  previewToggle.setAttribute('aria-expanded', String(open)); $('#preview-panel').hidden = !open;
});
document.addEventListener('click', event => {
  if (!event.target.closest('.preview-tools')) { previewToggle.setAttribute('aria-expanded', 'false'); $('#preview-panel').hidden = true; }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !$('#preview-panel').hidden) { $('#preview-panel').hidden = true; previewToggle.setAttribute('aria-expanded', 'false'); previewToggle.focus(); }
});
$$('[data-layer]').forEach(input => input.addEventListener('change', () => {
  const key = input.dataset.layer;
  state.layers[key] = input.checked;
  document.body.classList.toggle(`no-${key}`, !input.checked);
  updatePlayback();
}));
function updateMotionButton() {
  $('#motion-toggle').innerHTML = `<span aria-hidden="true">${state.paused ? '▷' : 'Ⅱ'}</span> ${state.paused ? 'Play animations' : 'Pause animations'}`;
  $('#motion-toggle').setAttribute('aria-pressed', String(state.paused));
}
$('#motion-toggle').addEventListener('click', () => { state.paused = !state.paused; updateMotionButton(); updatePlayback(); });

function openStory(id, title) {
  const role = roles.find(item => item.id === id);
  $('#dialog-title').textContent = title || role.title;
  $('.dialog-note').textContent = `${role.placeholder}. A new edit tailored to this role will replace it.`;
  dialogVideo.src = mobile.matches ? role.mobileStory : role.story;
  dialogVideo.poster = mobile.matches ? `assets/stories/${role.id}-mobile.jpg` : role.poster;
  state.modal = true; updatePlayback();
  dialog.showModal(); document.body.style.overflow = 'hidden';
  if (!state.paused) play(dialogVideo);
}
$$('[data-open-story]').forEach(trigger => trigger.addEventListener('click', event => { event.preventDefault(); openStory(trigger.dataset.openStory); }));
$('.story-bottomline .expand-story').addEventListener('click', () => openStory(state.active));
$('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { dialogVideo.pause(); resumeDialog = false; state.modal = false; document.body.style.overflow = ''; updatePlayback(); });
updateMotionButton(); updateChapter();

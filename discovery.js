import {demoCases, pokerPrompts} from './discovery-content.js';
import {createPromptMotion, getCaseSpread, safeExternalHref} from './discovery-motion.js';

const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;',
})[character]);

export function createDiscoveryController({openStory} = {}) {
  const cases = document.querySelector('#case-track');
  const prompts = document.querySelector('#prompt-track');
  const caseSection = document.querySelector('#examples');
  const promptSection = document.querySelector('#prompts');
  const viewport = document.querySelector('#prompt-viewport');
  if (!cases || !prompts || !caseSection || !promptSection || !viewport) return {update() {}};

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 800px)');
  const status = document.querySelector('#prompt-status');
  const copyDialog = document.querySelector('#prompt-copy-dialog');
  const copyText = document.querySelector('#prompt-copy-text');
  const clock = createPromptMotion();
  let running = false;
  let visible = false;
  let localPaused = false;
  let hovering = false;
  let focusing = false;
  let touching = false;
  let copyOpen = false;
  let copyReturnTarget = null;
  let promptFrame = 0;
  let promptPosition = null;
  let cycleWidth = 0;
  let cycleOrigin = 0;
  let loopReady = false;
  let spreadFrame = 0;
  let copySequence = 0;
  const feedbackTimers = new Map();
  const canonicalPrompts = [];
  const duplicateGroups = [];

  for (const [index, item] of demoCases.entries()) {
    const li = document.createElement('li');
    li.className = 'case-item';
    li.style.setProperty('--i', index);
    li.style.setProperty('--angle', `${item.angle}deg`);
    const href = safeExternalHref(item.href);
    const card = document.createElement(href ? 'a' : 'button');
    card.className = 'case-card';
    card.style.setProperty('--case-color', item.color);
    if (href) {
      card.href = href;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.setAttribute('aria-label', `${item.title} Open demo in a new tab`);
    } else {
      card.type = 'button';
      card.setAttribute('aria-haspopup', 'dialog');
      card.setAttribute('aria-label', `${item.title} Watch demo`);
      card.addEventListener('click', () => openStory?.(item.role, item.title));
    }
    card.innerHTML = `
      <span class="case-topline"><span>${String(index + 1).padStart(2, '0')} / ${escapeHTML(item.category)}</span><span class="case-play" aria-hidden="true">↗</span></span>
      <span class="case-cover"><img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.imageAlt)}" width="960" height="720" loading="lazy" decoding="async"></span>
      <span class="case-copy"><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.description)}</p></span>
      <span class="case-footer">Watch demo <span aria-hidden="true">↗</span></span>`;
    li.append(card);
    cases.append(li);
  }

  const announce = message => { if (status) status.textContent = message; };

  async function copyPrompt(item, card, returnTarget = card) {
    const attempt = ++copySequence;
    const action = card.querySelector('.prompt-action');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(item.text);
      clearTimeout(feedbackTimers.get(card));
      action.textContent = 'Copied ✓';
      card.classList.add('is-copied');
      announce(`${item.category.toLowerCase()} prompt copied. Paste it into Fisher to start.`);
      feedbackTimers.set(card, setTimeout(() => {
        action.textContent = 'Copy prompt';
        card.classList.remove('is-copied');
        feedbackTimers.delete(card);
      }, 2200));
    } catch {
      if (attempt !== copySequence) return;
      if (copyDialog && copyText) {
        copyText.value = item.text;
        copyReturnTarget = returnTarget;
        copyOpen = true;
        syncPlayback();
        if (!copyDialog.open) copyDialog.showModal();
        copyText.focus();
        copyText.select();
        announce('Select and copy the prompt from the open dialog.');
      } else {
        announce(`Copy this prompt: ${item.text}`);
      }
    }
  }

  function appendPrompt(item, canonical = null) {
    const li = document.createElement('li');
    li.className = 'prompt-item';
    const duplicate = Boolean(canonical);
    const card = document.createElement(duplicate ? 'div' : 'button');
    const red = ['♥', '♦'].includes(item.suit);
    card.className = `prompt-card${red ? ' is-red' : ''}`;
    // Repeats retain the original tilt even when a cycle has an odd card count.
    card.style.setProperty('--card-angle', canonical
      ? canonical.card.style.getPropertyValue('--card-angle')
      : canonicalPrompts.length % 2 ? '2deg' : '-2deg');
    if (duplicate) {
      // Visual repeats can be clicked, but add no duplicate Tab stops or speech.
      li.setAttribute('aria-hidden', 'true');
      li.dataset.promptDuplicate = '';
      card.style.cursor = 'pointer';
    } else {
      card.type = 'button';
      card.setAttribute('aria-label', `Copy prompt: ${item.text}`);
    }
    card.innerHTML = `
      <span class="card-corner" aria-hidden="true"><span>${escapeHTML(item.rank)}</span><span>${escapeHTML(item.suit)}</span></span>
      <img class="prompt-watermark" src="assets/fisher-logo-blue.png" alt="" aria-hidden="true" width="84" height="84" decoding="async" draggable="false">
      <span class="prompt-category">${escapeHTML(item.category)}</span>
      <span class="prompt-text">${escapeHTML(item.text)}</span>
      <span class="prompt-action">Copy prompt</span>
      <span class="card-corner card-corner-bottom" aria-hidden="true"><span>${escapeHTML(item.rank)}</span><span>${escapeHTML(item.suit)}</span></span>`;
    card.addEventListener('click', () => copyPrompt(item, card, canonical?.card || card));
    li.append(card);
    prompts.append(li);
    return {li, card};
  }

  for (const item of pokerPrompts) canonicalPrompts.push(appendPrompt(item));
  function appendDuplicateGroup() {
    duplicateGroups.push(pokerPrompts.map((item, index) => appendPrompt(item, canonicalPrompts[index])));
  }
  if (canonicalPrompts.length) appendDuplicateGroup();

  function measureLoop() {
    const first = canonicalPrompts[0]?.li;
    const repeated = duplicateGroups[0]?.[0]?.li;
    if (!first || !repeated) return;
    const firstBounds = first.getBoundingClientRect();
    const nextWidth = repeated.getBoundingClientRect().left - firstBounds.left;
    const nextOrigin = firstBounds.left - viewport.getBoundingClientRect().left + viewport.scrollLeft;
    if (nextWidth <= 0) return;
    cycleWidth = nextWidth;
    cycleOrigin = nextOrigin;

    // Usually two sets suffice. Wide displays may expose more than one set.
    const requiredGroups = Math.max(2, Math.ceil(viewport.clientWidth / cycleWidth) + 1);
    while (duplicateGroups.length + 1 < requiredGroups) appendDuplicateGroup();
    if (!loopReady) {
      // Start at the first card, not in the track padding: both seams match.
      viewport.scrollLeft = cycleOrigin;
      loopReady = true;
    }
    promptPosition = null;
    clock.resetClock();
  }

  const canMove = () => running && visible && cycleWidth > 0 && !reduced.matches && !localPaused && !hovering && !focusing && !touching && !copyOpen;

  function drawPrompt(time) {
    promptFrame = 0;
    if (!canMove()) {
      clock.resetClock();
      promptPosition = null;
      return;
    }
    // Keep fractional progress even on engines that round the scroll offset.
    const next = clock.advance(time, {position:promptPosition ?? viewport.scrollLeft - cycleOrigin, cycleWidth, running:true});
    promptPosition = next.position;
    viewport.scrollLeft = cycleOrigin + next.position;
    promptFrame = requestAnimationFrame(drawPrompt);
  }

  function syncPlayback() {
    if (!canMove()) {
      if (promptFrame) cancelAnimationFrame(promptFrame);
      promptFrame = 0;
      clock.resetClock();
      promptPosition = null;
    } else if (!promptFrame) {
      clock.resetClock();
      promptFrame = requestAnimationFrame(drawPrompt);
    }
  }

  function moveByCard(direction) {
    localPaused = true;
    syncPlayback();
    const first = prompts.querySelector('.prompt-item');
    const gap = parseFloat(getComputedStyle(prompts).columnGap) || 0;
    const distance = (first?.getBoundingClientRect().width || viewport.clientWidth * 0.75) + gap;
    viewport.scrollBy({left:direction * distance, behavior:reduced.matches ? 'instant' : 'smooth'});
  }

  viewport.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'touch') hovering = true;
    syncPlayback();
  });
  viewport.addEventListener('pointerleave', event => {
    hovering = false;
    if (event.pointerType !== 'touch') touching = false;
    syncPlayback();
  });
  viewport.addEventListener('pointerdown', event => {
    touching = true;
    syncPlayback();
  });
  // A touch leaves the strip under user control until the section leaves view.
  viewport.addEventListener('pointerup', event => { if (event.pointerType !== 'touch') touching = false; syncPlayback(); });
  viewport.addEventListener('pointercancel', event => { if (event.pointerType !== 'touch') touching = false; syncPlayback(); });
  viewport.addEventListener('focusin', event => {
    focusing = true;
    syncPlayback();
    const card = event.target.closest('.prompt-card');
    if (!card) return;
    const frame = viewport.getBoundingClientRect();
    const bounds = card.getBoundingClientRect();
    // Only adjust this horizontal viewport; preserve the document's scroll Y.
    const left = bounds.left < frame.left + 16 ? bounds.left - frame.left - 16 : bounds.right > frame.right - 16 ? bounds.right - frame.right + 16 : 0;
    if (left) viewport.scrollBy({left, behavior:'instant'});
  });
  viewport.addEventListener('focusout', () => {
    queueMicrotask(() => {
      focusing = viewport.contains(document.activeElement);
      syncPlayback();
    });
  });
  viewport.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    localPaused = true;
    syncPlayback();
    const focusedCard = event.target.closest('.prompt-card');
    if (focusedCard) {
      const cards = canonicalPrompts.map(item => item.card);
      const currentIndex = cards.indexOf(focusedCard);
      const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? cards.length - 1 : Math.max(0, Math.min(cards.length - 1, currentIndex + (event.key === 'ArrowLeft' ? -1 : 1)));
      // focusin reveals the target horizontally without moving the page.
      cards[nextIndex]?.focus({preventScroll:true});
      return;
    }
    if (event.key === 'Home' || event.key === 'End') {
      viewport.scrollTo({left:event.key === 'Home' ? 0 : viewport.scrollWidth, behavior:reduced.matches ? 'instant' : 'smooth'});
    } else {
      moveByCard(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  viewport.addEventListener('wheel', event => {
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      localPaused = true;
      syncPlayback();
    }
  }, {passive:true});

  copyDialog?.querySelector('[data-close-prompt]')?.addEventListener('click', () => copyDialog.close());
  copyDialog?.addEventListener('close', () => {
    copyOpen = false;
    const returnTarget = copyReturnTarget;
    copyReturnTarget = null;
    returnTarget?.focus({preventScroll:true});
    syncPlayback();
  });

  function drawSpread() {
    spreadFrame = 0;
    const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height || 80;
    const spread = getCaseSpread({
      top:caseSection.getBoundingClientRect().top,
      viewportHeight:innerHeight,
      headerHeight,
      compact:compact.matches,
      reducedMotion:reduced.matches,
    });
    caseSection.style.setProperty('--spread', spread.toFixed(4));
  }
  function scheduleSpread() {
    if (!spreadFrame) spreadFrame = requestAnimationFrame(drawSpread);
  }
  window.addEventListener('scroll', scheduleSpread, {passive:true});
  window.addEventListener('resize', () => { measureLoop(); scheduleSpread(); syncPlayback(); }, {passive:true});
  compact.addEventListener('change', scheduleSpread);
  reduced.addEventListener('change', () => { scheduleSpread(); syncPlayback(); });
  const visibility = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
    if (!visible) {
      localPaused = false;
      hovering = false;
      touching = false;
    }
    syncPlayback();
  }, {threshold:0.08});
  visibility.observe(promptSection);
  const sizeObserver = new ResizeObserver(() => { measureLoop(); syncPlayback(); });
  sizeObserver.observe(viewport);
  sizeObserver.observe(prompts);
  measureLoop();
  drawSpread();
  syncPlayback();

  return {
    update({running:nextRunning}) {
      running = Boolean(nextRunning);
      syncPlayback();
    },
  };
}

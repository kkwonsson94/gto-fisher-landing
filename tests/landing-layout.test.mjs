import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {getAgentAnchor, getIntroductionSpacing} from '../production/hero-remotion/src/landing-layout.ts';
import {getAgentAway} from '../hero-agent-fade.js';

const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('the official page retains the approved deletions, introduction and four roles', () => {
  const result = source;
  assert.doesNotMatch(result, /hero-heading-description|abilities-intro|A little help\.|ONE FISHER\. FOUR WAYS FORWARD\./);
  assert.match(result, /id="abilities-title" class="visually-hidden">What Fisher can do/);
  assert.match(result, /id="abilities" aria-labelledby="abilities-title"/);
  assert.match(result, /id="meet-fisher-title"><span>Meet Fisher\.<\/span>/);
  assert.match(result, /href="#meet-fisher">Meet Fisher/);
  assert.equal((result.match(/class="role-tab(?: is-active)?"/g) || []).length, 4);
  const originalFilm = source.match(/<figure class="hero-film[\s\S]*?<\/figure>/)?.[0];
  assert.ok(originalFilm);
  assert.ok(result.includes(originalFilm));
  const originalFisher = source.match(/<aside class="hero-agent-card[\s\S]*?<\/aside>/)?.[0];
  assert.ok(result.includes(originalFisher));
  assert.doesNotMatch(source, /poker-local-note|__poker/);
});

test('the local introduction uses measured breathing room without changing public spacing', async () => {
  const original = await readFile(new URL('../hero.css', import.meta.url), 'utf8');
  const local = await readFile(new URL('../production/hero-remotion/landing-layout.css', import.meta.url), 'utf8');
  assert.match(original, /\.hero-introduction \{[^}]*padding-block: 100px clamp\(120px, 11\.25vw, 180px\)/);
  assert.match(original, /\.hero-introduction \{ padding-block: 84px 96px; \}/);
  assert.match(local, /padding-block: var\(--intro-gap-top\) var\(--intro-gap-bottom\)/);
  assert.match(local, /width: min\(31%, calc\(\(100svh - var\(--header\) - 48px\) \* \.78\)\)/);
});

test('the introduction is paired with Fisher and has room before the next section at his exit', () => {
  for (const metrics of [
    {viewportHeight: 1252, headerHeight: 76, cardHeight: 572, titleHeight: 225, scrollPaddingTop: 170, mobile: false},
    {viewportHeight: 900, headerHeight: 76, cardHeight: 534, titleHeight: 225, scrollPaddingTop: 170, mobile: false},
    {viewportHeight: 764, headerHeight: 76, cardHeight: 534, titleHeight: 225, scrollPaddingTop: 170, mobile: false},
    {viewportHeight: 650, headerHeight: 76, cardHeight: 526, titleHeight: 225, scrollPaddingTop: 170, mobile: false},
    {viewportHeight: 844, headerHeight: 66, cardHeight: 125, titleHeight: 100, scrollPaddingTop: 170, mobile: true},
  ]) {
    const spacing = getIntroductionSpacing(metrics);
    const restTop = metrics.scrollPaddingTop + spacing.paddingTop;
    assert.ok(spacing.paddingTop >= (metrics.mobile ? 96 : 180));
    assert.ok(spacing.paddingBottom >= metrics.viewportHeight * 0.4);
    assert.ok(spacing.stickyTop + metrics.cardHeight <= metrics.viewportHeight - 24 + 0.001);
    const navigationTop = spacing.fadeStart + metrics.titleHeight + spacing.paddingBottom;
    assert.ok(navigationTop >= spacing.stickyTop + metrics.cardHeight + (metrics.mobile ? 40 : 64) - 0.001);
    assert.ok(navigationTop >= metrics.viewportHeight * (metrics.mobile ? 1.04 : 0.9) - 0.001);
    const layout = {viewportHeight: metrics.viewportHeight, headerHeight: metrics.headerHeight, introRestTop: restTop};
    assert.equal(getAgentAway({...layout, introTop: restTop}), false);
    assert.equal(getAgentAway({...layout, introTop: spacing.fadeStart + 1}), false);
    assert.equal(getAgentAway({...layout, introTop: spacing.fadeStart}), true);
  }
});

test('desktop introduction text sits beside the centre of the sticky Fisher card', () => {
  const metrics = {viewportHeight: 1252, headerHeight: 76, cardHeight: 572, titleHeight: 225, scrollPaddingTop: 170, mobile: false};
  const spacing = getIntroductionSpacing(metrics);
  const titleCentre = metrics.scrollPaddingTop + spacing.paddingTop + metrics.titleHeight / 2;
  const cardCentre = spacing.stickyTop + metrics.cardHeight / 2;
  assert.ok(Math.abs(titleCentre - cardCentre - metrics.viewportHeight * 0.04) < 0.001);
  assert.ok(spacing.paddingTop > 100);
  assert.ok(spacing.paddingBottom > 180);
  const invalid = getIntroductionSpacing({...metrics, viewportHeight: Number.NaN, cardHeight: Infinity});
  assert.ok(Object.values(invalid).every(Number.isFinite));
});

test('Fisher follows film geometry after heading removal, font wrapping and resize', () => {
  assert.equal(getAgentAnchor(379, 76, 1440), 335);
  assert.equal(getAgentAnchor(325, 76, 1440), 281);
  assert.equal(getAgentAnchor(287, 66, 350), 233);
  assert.equal(getAgentAnchor(355, 66, 350), 301);
  for (const width of [350, 560, 720, 1000, 1344, 1440]) {
    // Scrolling changes both DOM rects equally, never the in-section anchor.
    assert.equal(getAgentAnchor(400, 76, width), getAgentAnchor(-300, -624, width));
  }
  assert.equal(getAgentAnchor(Number.NaN, 0, 350), 0);
});

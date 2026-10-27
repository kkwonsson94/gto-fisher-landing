import test from 'node:test';
import assert from 'node:assert/strict';

import * as fade from '../hero-agent-fade.js';

const desktop = { viewportHeight: 764, headerHeight: 76, introRestTop: 270 };
const away = (introTop, wasAway = false, layout = desktop) => {
  assert.equal(typeof fade.getAgentAway, 'function');
  return fade.getAgentAway({ ...layout, introTop }, wasAway);
};

test('the complete introduction and character share the screen before fading', () => {
  for (const top of [950, 550, 400, 300, 270, 250]) assert.equal(away(top), false);
});

test('fading starts only after scrolling beyond the Meet Fisher resting position', () => {
  assert.equal(away(245), true);
});

test('fast and slow scrolling request the same fade rather than controlling opacity', () => {
  for (const top of [245, 220, 100, -500]) assert.equal(away(top), true);
});

test('small scroll reversals around the trigger do not restart the animation', () => {
  assert.equal(away(245), true);
  assert.equal(away(250, true), true);
  assert.equal(away(260, true), true);
  assert.equal(away(267, true), false);
  assert.equal(away(250, false), false);
});

test('mobile and tall viewports preserve the complete anchored introduction', () => {
  for (const layout of [
    { viewportHeight: 844, headerHeight: 66, introRestTop: 226 },
    { viewportHeight: 1020, headerHeight: 76, introRestTop: 270 },
    { viewportHeight: 1400, headerHeight: 76, introRestTop: 270 },
  ]) {
    const top = layout.introRestTop;
    assert.equal(away(top, false, layout), false);
    assert.equal(away(top - 16, false, layout), false);
    assert.equal(away(top - 80, false, layout), true);
    assert.equal(away(top, true, layout), false);
  }
});

test('returning to the shared introduction restores the character', () => {
  assert.equal(away(100), true);
  assert.equal(away(270, true), false);
  assert.equal(away(950, true), false);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import {getAmbientPolish, getSurfacePolish} from '../production/hero-remotion/src/light-polish.ts';

test('the spread gets staggered light and inactive cards feather only after opening', () => {
  const lead = getSurfacePolish(1.1, 0, false);
  const delayed = getSurfacePolish(1.1, 0.28, false);
  assert.ok(lead.edgeOpacity > delayed.edgeOpacity);
  assert.equal(getSurfacePolish(2.2, 0, true).retreat, 0);
  assert.ok(getSurfacePolish(2.9, 0, true).retreat > 0);
  assert.equal(getSurfacePolish(3.6, 0, true).retreat, 1);
  assert.equal(getSurfacePolish(3.6, 0, false).retreat, 0);
});

test('expansion light stays with the selected faces, not the retreating strip', () => {
  assert.ok(getSurfacePolish(4.2, 0, false).sheenOpacity > 0);
  assert.equal(getSurfacePolish(4.2, 0, true).sheenOpacity, 0);
  assert.ok(getAmbientPolish(4.2).expansionOpacity > 0);
});

test('all new lighting is bounded and disappears before the unchanged final hold', () => {
  for (let frame = 0; frame < 240; frame++) {
    for (const delay of [0, 0.08, 0.16, 0.24, 0.28]) {
      for (const retreat of [false, true]) {
        const state = getSurfacePolish(frame / 30, delay, retreat);
        for (const value of Object.values(state)) assert.ok(Number.isFinite(value) && value >= 0 && value <= 1);
      }
    }
  }
  for (const time of [6.55, 7, 7.9667, 8]) {
    const ambient = getAmbientPolish(time);
    assert.equal(ambient.spreadOpacity, 0);
    assert.equal(ambient.expansionOpacity, 0);
    for (const delay of [0, 0.08, 0.16, 0.24, 0.28]) {
      assert.equal(getSurfacePolish(time, delay, false).edgeOpacity, 0);
      assert.equal(getSurfacePolish(time, delay, false).sheenOpacity, 0);
    }
  }
});

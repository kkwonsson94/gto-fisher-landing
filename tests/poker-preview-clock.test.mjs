import assert from 'node:assert/strict';
import test from 'node:test';
import {getPokerPreviewFrame} from '../production/hero-remotion/src/poker-preview-clock.ts';

test('live landing preview follows the existing playback clock and replays from zero', () => {
  assert.equal(getPokerPreviewFrame(0, false, false), 0);
  assert.equal(getPokerPreviewFrame(1.5, false, false), 45);
  assert.equal(getPokerPreviewFrame(2.75, false, false), 82);
  assert.equal(getPokerPreviewFrame(8, true, false), 239);
  assert.equal(getPokerPreviewFrame(0, false, false), 0);
});

test('static/reduced-motion and invalid clock states remain bounded', () => {
  assert.equal(getPokerPreviewFrame(0, false, true), 239);
  assert.equal(getPokerPreviewFrame(3, true, false), 239);
  assert.equal(getPokerPreviewFrame(-1, false, false), 0);
  assert.equal(getPokerPreviewFrame(20, false, false), 239);
  assert.equal(getPokerPreviewFrame(NaN, false, false), 0);
});

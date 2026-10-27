import assert from 'node:assert/strict';
import test from 'node:test';
import {getMatrixRowState, getPokerCardState, POKER_FINAL_WORKSPACE, POKER_HOLD_START} from '../production/hero-remotion/src/poker-motion.ts';

test('poker preview deals five cards in order into an unobstructed arc', () => {
  const beforeDeal = Array.from({length: 5}, (_, index) => getPokerCardState(0, index));
  const spread = Array.from({length: 5}, (_, index) => getPokerCardState(2, index));
  assert.equal(beforeDeal[0].opacity, 1);
  assert.ok(beforeDeal[4].left > beforeDeal[0].left);
  assert.ok(getPokerCardState(0.65, 0).left < getPokerCardState(0.65, 4).left);
  spread.forEach((card, index) => {
    assert.equal(card.width, 240);
    assert.equal(card.opacity, 1);
    assert.ok(card.left + card.width < 1380);
    if (index) assert.ok(card.left > spread[index - 1].left + spread[index - 1].width);
  });
});

test('picking Solver and AI retreats the remaining hand without a cut', () => {
  for (const index of [0, 4]) {
    const selected = getPokerCardState(3.2, index);
    assert.equal(selected.opacity, 1);
    assert.equal(selected.rotate, 0);
    assert.equal(selected.blur, 0);
    assert.ok(selected.top < 300);
  }
  for (const index of [1, 2, 3]) assert.equal(getPokerCardState(3.2, index).opacity, 0);
  for (const time of [2.15, 3.05, 3.65, 4.95]) {
    for (let index = 0; index < 5; index++) {
      const left = getPokerCardState(time - 0.00001, index);
      const right = getPokerCardState(time + 0.00001, index);
      for (const key of ['left', 'top', 'width', 'height', 'opacity', 'rotate', 'scale']) {
        assert.ok(Math.abs(left[key] - right[key]) < 0.02, `Jump at ${time}s: ${index}/${key}`);
      }
    }
  }
});

test('matrix reveal uses thirteen staggered rows and clears before the hold', () => {
  assert.ok(getMatrixRowState(4.85, 0).shade < getMatrixRowState(4.85, 12).shade);
  for (let row = 0; row < 13; row++) {
    assert.equal(getMatrixRowState(0, row).shade, 0);
    assert.equal(getMatrixRowState(5.6, row).shade, 0);
    assert.deepEqual(getMatrixRowState(POKER_HOLD_START, row), getMatrixRowState(8, row));
  }
});

test('all card states stay bounded and the complete final workspace is frozen', () => {
  for (let frame = 0; frame < 240; frame++) {
    for (let index = 0; index < 5; index++) {
      const state = getPokerCardState(frame / 30, index);
      for (const value of Object.values(state)) assert.ok(Number.isFinite(value));
      assert.ok(state.opacity >= 0 && state.opacity <= 1);
      assert.ok(state.width > 0 && state.height > 0);
    }
  }
  const tail = getPokerCardState(POKER_HOLD_START, 0);
  for (const [key, value] of Object.entries(POKER_FINAL_WORKSPACE)) assert.equal(tail[key], value);
  assert.ok((tail.left + tail.width) * 0.96 / 1920 < 0.69);
  assert.equal(tail.imageScale, 1);
  assert.equal(tail.footerHeight, 0);
  for (let index = 0; index < 5; index++) {
    assert.deepEqual(getPokerCardState(POKER_HOLD_START, index), getPokerCardState(8, index));
  }
});

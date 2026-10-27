import test from 'node:test';
import assert from 'node:assert/strict';

const module = await import('../hero-timeline.js').catch(error => {
  if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error;
  return {};
});

function timeline(options) {
  assert.equal(typeof module.createOverviewTimeline, 'function', 'interactive overview timeline is available');
  return module.createOverviewTimeline(options);
}

test('automatic tour reaches each screen and holds its final screen', () => {
  const tour = timeline();
  tour.advance(2000, true); assert.equal(tour.snapshot().index, 1);
  tour.advance(1900, true); assert.equal(tour.snapshot().index, 2);
  tour.advance(1800, true); assert.equal(tour.snapshot().index, 3);
  tour.advance(1650, true); assert.equal(tour.snapshot().index, 4);
  tour.advance(3650, true); assert.equal(tour.snapshot().completed, true);
  tour.advance(20000, true); assert.equal(tour.snapshot().elapsed, 11000);
});

test('manual selection stays on the chosen screen until play is requested', () => {
  const tour = timeline();
  tour.select(2); tour.advance(15000, true);
  assert.equal(tour.snapshot().index, 2);
  assert.equal(tour.snapshot().paused, true);
  tour.play(); tour.advance(1800, true);
  assert.equal(tour.snapshot().index, 3);
});

test('visibility and global pause gates preserve elapsed time', () => {
  const tour = timeline();
  tour.advance(1250, true); tour.advance(30000, false);
  assert.equal(tour.snapshot().elapsed, 1250);
  tour.pause(); tour.advance(10000, true);
  assert.equal(tour.snapshot().elapsed, 1250);
  tour.play(); tour.advance(750, true);
  assert.equal(tour.snapshot().index, 1);
});

test('replay resets an ended or manually selected overview', () => {
  const tour = timeline();
  tour.advance(11000, true); tour.select(1); tour.replay();
  assert.deepEqual(tour.snapshot(), {index:0,elapsed:0,progress:0,paused:false,completed:false});
});

test('reduced-motion starts on the final screen and still permits selection', () => {
  const tour = timeline({reducedMotion:true});
  assert.equal(tour.snapshot().index, 4);
  assert.equal(tour.snapshot().completed, true);
  tour.select(0); tour.advance(20000, true);
  assert.equal(tour.snapshot().index, 0);
  assert.equal(tour.snapshot().paused, true);
});

test('invalid navigation and negative clock deltas do not corrupt playback', () => {
  const tour = timeline();
  tour.select(-1); tour.select(99); tour.select(NaN);
  tour.advance(-200, true); tour.advance(NaN, true);
  assert.equal(tour.snapshot().index, 0);
  assert.equal(tour.snapshot().elapsed, 0);
});

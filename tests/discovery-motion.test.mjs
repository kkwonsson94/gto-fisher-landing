import test from 'node:test';
import assert from 'node:assert/strict';

const module = await import('../discovery-motion.js').catch(error => {
  if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error;
  return {};
});

function motion(options) {
  assert.equal(typeof module.createPromptMotion, 'function', 'prompt motion is available');
  return module.createPromptMotion(options);
}

function spread(options) {
  assert.equal(typeof module.getCaseSpread, 'function', 'case spread is available');
  return module.getCaseSpread(options);
}

test('prompt motion starts without jumping and travels at its advertised speed', () => {
  const player = motion();
  assert.equal(player.advance(1000, {position:200,cycleWidth:1000,running:true}).position, 200);
  assert.equal(player.advance(1050, {position:200,cycleWidth:1000,running:true}).position, 201.1);
});

test('pausing and restarting never accumulate time spent offscreen', () => {
  const player = motion();
  player.advance(0, {position:200,cycleWidth:1000,running:true});
  assert.equal(player.advance(10000, {position:200,cycleWidth:1000,running:false}).position, 200);
  assert.equal(player.advance(60000, {position:200,cycleWidth:1000,running:true}).position, 200);
  assert.equal(player.advance(60050, {position:200,cycleWidth:1000,running:true}).position, 201.1);
});

test('the last card continues into the first at the same speed without reversing', () => {
  const player = motion();
  player.advance(0, {position:999.5,cycleWidth:1000,running:true});
  const wrapped = player.advance(50, {position:999.5,cycleWidth:1000,running:true});
  assert.ok(Math.abs(wrapped.position - 0.6) < 1e-9);
  const next = player.advance(100, {position:wrapped.position,cycleWidth:1000,running:true});
  assert.ok(Math.abs(next.position - 1.7) < 1e-9);
});

test('speed remains uniform near the start and end of a cycle', () => {
  const player = motion();
  player.advance(0, {position:990,cycleWidth:1000,running:true});
  const endStep = player.advance(50, {position:990,cycleWidth:1000,running:true}).position - 990;
  const startStep = player.advance(100, {position:0,cycleWidth:1000,running:true}).position;
  assert.ok(Math.abs(endStep - 1.1) < 1e-9);
  assert.equal(startStep, 1.1);
});

test('resize, empty strips, and long or invalid clock deltas remain bounded', () => {
  const player = motion();
  player.advance(0, {position:200,cycleWidth:1000,running:true});
  assert.ok(player.advance(100000, {position:200,cycleWidth:1000,running:true}).position <= 201.5);
  assert.equal(player.advance(NaN, {position:200,cycleWidth:1000,running:true}).position, 200);
  assert.equal(player.advance(100050, {position:500,cycleWidth:300,running:false}).position, 200);
  assert.deepEqual(player.advance(100100, {position:500,cycleWidth:0,running:true}), {position:0});
});

test('manual positions in duplicate cycles normalize to the same visible cards', () => {
  const player = motion();
  assert.equal(player.advance(0, {position:2415,cycleWidth:1200,running:true}).position, 15);
  player.resetClock();
  assert.equal(player.advance(500, {position:-10,cycleWidth:1200,running:true}).position, 1190);
  assert.equal(player.advance(550, {position:1190,cycleWidth:1200,running:true}).position, 1191.1);
});

test('explicit clock reset preserves position after a long interaction', () => {
  const player = motion();
  player.advance(0, {position:300,cycleWidth:1200,running:true});
  player.resetClock();
  assert.equal(player.advance(60000, {position:300,cycleWidth:1200,running:true}).position, 300);
  assert.equal(player.advance(60050, {position:300,cycleWidth:1200,running:true}).position, 301.1);
});

test('case fan spreads over the measured viewport interval and clamps outside it', () => {
  const dimensions = {viewportHeight:800,headerHeight:80};
  assert.equal(spread({...dimensions,top:600}), 0);
  assert.equal(spread({...dimensions,top:480}), 0);
  assert.equal(spread({...dimensions,top:292}), 0.5);
  assert.equal(spread({...dimensions,top:104}), 1);
  assert.equal(spread({...dimensions,top:-400}), 1);
});

test('compact and reduced motion layouts always show the whole case fan', () => {
  assert.equal(spread({top:900,viewportHeight:800,compact:true}), 1);
  assert.equal(spread({top:900,viewportHeight:800,reducedMotion:true}), 1);
  assert.ok(Number.isFinite(spread({top:0,viewportHeight:80,headerHeight:80})));
});

test('case links accept only deliberate absolute web URLs', () => {
  assert.equal(typeof module.safeExternalHref, 'function');
  assert.equal(module.safeExternalHref(' https://example.com/demo '), 'https://example.com/demo');
  assert.equal(module.safeExternalHref('http://localhost:3000/demo'), 'http://localhost:3000/demo');
  for (const value of ['', '/demo', '//example.com', 'javascript:alert(1)', 'data:text/html,hello', 'file:///C:/secret', null]) {
    assert.equal(module.safeExternalHref(value), '');
  }
});

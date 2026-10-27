import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {BLOOM_STOPS, LIGHT_CANVAS_MASK, getSoftBloomBackground, getBloomEdgeAlpha, getCanvasLightAlpha} from '../production/hero-remotion/src/lighting-feather.ts';

test('every soft bloom becomes fully transparent before all four rectangle edges', () => {
  for (const [width, height] of [[1800, 1160], [1760, 620], [1140, 1080], [1340, 780], [1040, 1000]]) {
    for (let step = 0; step <= 100; step++) {
      const x = width * step / 100, y = height * step / 100;
      for (const point of [[x, 0], [x, height], [0, y], [width, y]]) {
        assert.equal(getBloomEdgeAlpha(...point, width, height), 0);
      }
    }
    assert.equal(getBloomEdgeAlpha(width / 2, height / 2, width, height), 1);
    assert.equal(getBloomEdgeAlpha(width * 0.98, height / 2, width, height), 0);
    assert.equal(getBloomEdgeAlpha(width / 2, height * 0.98, width, height), 0);
  }
  assert.deepEqual(BLOOM_STOPS.slice(-2), [[0.92, 0], [1, 0]]);
});

test('travelling background lights cannot leave a seam at any canvas edge', () => {
  for (let step = 0; step <= 100; step++) {
    const x = 1920 * step / 100, y = 1080 * step / 100;
    for (const point of [[x, 0], [x, 1080], [0, y], [1920, y]]) assert.equal(getCanvasLightAlpha(...point), 0);
  }
  assert.equal(getCanvasLightAlpha(720, 500), 1);
  assert.ok(getCanvasLightAlpha(20, 500) < getCanvasLightAlpha(80, 500));
  assert.ok(getCanvasLightAlpha(80, 500) < getCanvasLightAlpha(240, 500));
  for (let x = 0; x <= 1920; x += 24) for (let y = 0; y <= 1080; y += 24) {
    const alpha = getCanvasLightAlpha(x, y);
    assert.ok(Number.isFinite(alpha) && alpha >= 0 && alpha <= 1);
  }
  assert.match(LIGHT_CANVAS_MASK, /linear-gradient\(90deg/);
  assert.match(LIGHT_CANVAS_MASK, /linear-gradient\(180deg/);
});

test('CSS uses the same safe elliptical alpha profile and never transparent black', () => {
  const gradient = getSoftBloomBackground('#8be0ff', 0.11);
  assert.match(gradient, /^radial-gradient\(ellipse 50% 50% at 50% 50%/);
  assert.match(gradient, /rgba\(139, 224, 255, 0\.00000\) 92%/);
  assert.match(gradient, /rgba\(139, 224, 255, 0\.00000\) 100%/);
  assert.doesNotMatch(gradient, /transparent|rgba\(0, 0, 0/);
  assert.throws(() => getSoftBloomBackground('red', 0.1), /hex/);
});

test('feathering is opt-in and scoped to light, never to the complete product or logo', async () => {
  const film = await readFile(new URL('../production/hero-remotion/src/FisherFilm.tsx', import.meta.url), 'utf8');
  const studio = await readFile(new URL('../production/hero-remotion/src/StudioLighting.tsx', import.meta.url), 'utf8');
  const page = await readFile(new URL('../production/hero-remotion/src/ProductPage.tsx', import.meta.url), 'utf8');
  const environment = film.match(/\{polish \? <div data-background-lighting[\s\S]*?<\/div> : <StudioLighting\/>\}/)?.[0];
  assert.ok(environment);
  assert.match(environment, /maskComposite: 'intersect'/);
  assert.match(environment, /<StudioLighting softEdges\/>/);
  assert.doesNotMatch(environment, /ProductTile|ProductPage|CanvasImage/);
  assert.match(film, /polish = false/);
  assert.match(studio, /softEdges = false/);
  assert.match(page, /softLighting = false/);
  assert.match(page, /data-brand-fade[^]*?top: 724/);
  assert.match(film, /showWorkspace=\{false\} softLighting=\{polish\}/);
});

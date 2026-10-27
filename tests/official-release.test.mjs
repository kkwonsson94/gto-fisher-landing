import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, stat} from 'node:fs/promises';

const root = new URL('../', import.meta.url);
test('the official page loads its own compiled animation without a loopback proxy', async () => {
  const [html, bundle, entry, runtime] = await Promise.all([
    'index.html', 'hero-motion.js', 'production/hero-remotion/src/hero-entry.ts',
    'production/hero-remotion/src/landing.tsx',
  ].map((file) => readFile(new URL(file, root), 'utf8')));
  assert.match(html, /src="hero-motion.js"/);
  assert.match(html, /href="hero-motion.css"/);
  assert.match(html, /hero-product-compact/);
  assert.doesNotMatch(html, /hero-heading-description|abilities-intro|poker-local-note|__poker/);
  assert.doesNotMatch(bundle, /localhost:430\d|127\.0\.0\.1:430\d|__poker\/|data-ending-reveal|blue-white arrival bloom/);
  assert.match(bundle, /data-background-lighting/);
  assert.match(bundle, /Feathered floor reflection/);
  assert.match(entry, /remotion_staticBase = new URL\('assets\/hero-motion', document.baseURI\)/);
  assert.match(runtime, /<Player component=\{PolishedFisherFilm\}/);
  assert.doesNotMatch(runtime, /PokerFilm|searchParams|localhost/);
  assert.match(runtime, /\.finally\(async \(\) =>/);
  for (const file of ['hero-screens/solver-1920.webp', 'hero-screens/equity-1920.webp',
    'hero-screens/aggregate-1920.webp', 'hero-screens/library-1920.webp',
    'product-screens/assistant.png', 'brand/fisher-logo.svg', 'inter.woff2']) {
    assert.ok((await stat(new URL(`assets/hero-motion/${file}`, root))).size > 0);
  }
});

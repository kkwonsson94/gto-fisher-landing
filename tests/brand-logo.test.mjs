import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

test('brand logo is a transparent, self-contained two-path SVG', async () => {
  const svg = await readFile(new URL('assets/fisher-logo.svg', root), 'utf8');
  assert.match(svg, /<svg\b[^>]*viewBox="548\.2936 2026\.0781 162\.7804 114\.7731"/);
  assert.equal((svg.match(/<path\b/g) || []).length, 2);
  assert.match(svg, /fill="#e50012"/);
  assert.match(svg, /fill="#4cc0ff"/);
  assert.doesNotMatch(svg, /<(?:image|script|foreignObject|rect)\b|data:|\bhref\s*=/i);
});

test('page and video source use the shared vector logo', async () => {
  const html = await readFile(new URL('index.html', root), 'utf8');
  const content = await readFile(new URL('production/hero-remotion/src/content.ts', root), 'utf8');
  const preparation = await readFile(new URL('production/hero-remotion/scripts/prepare-assets.mjs', root), 'utf8');
  assert.equal((html.match(/assets\/fisher-logo\.svg/g) || []).length, 4);
  assert.doesNotMatch(html, /assets\/fisher-logo\.png/);
  assert.match(content, /logo: 'brand\/fisher-logo\.svg'/);
  assert.match(preparation, /path\.join\(repository, 'assets', 'fisher-logo\.svg'\)/);
});

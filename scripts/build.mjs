import {copyFile, mkdir, readFile, writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const project = path.join(root, 'production/hero-remotion');
const require = createRequire(path.join(project, 'package.json'));
const {build} = require('esbuild');
const prepared = spawnSync(process.execPath, [path.join(project, 'scripts/prepare-assets.mjs')], {stdio: 'inherit'});
if (prepared.status !== 0) process.exit(prepared.status || 1);
await build({entryPoints: [path.join(project, 'src/hero-entry.ts')], bundle: true,
  outfile: path.join(root, 'hero-motion.js'), format: 'esm', platform: 'browser',
  target: 'es2022', jsx: 'automatic', minify: true, legalComments: 'eof',
  define: {'process.env.NODE_ENV': '"production"'}});
// Retain dependency license notices while normalizing their trailing whitespace.
const bundlePath = path.join(root, 'hero-motion.js');
await writeFile(bundlePath, (await readFile(bundlePath, 'utf8')).replace(/[\t ]+$/gm, ''));
const css = await Promise.all(['landing-layout.css', 'landing-runtime.css'].map((file) => readFile(path.join(project, file), 'utf8')));
await writeFile(path.join(root, 'hero-motion.css'), css.join('\n'));
for (const file of ['hero-screens/solver-1920.webp', 'hero-screens/equity-1920.webp',
  'hero-screens/aggregate-1920.webp', 'hero-screens/library-1920.webp',
  'product-screens/assistant.png', 'brand/fisher-logo.svg', 'inter.woff2']) {
  const destination = path.join(root, 'assets/hero-motion', file);
  await mkdir(path.dirname(destination), {recursive: true});
  await copyFile(path.join(project, 'public', file), destination);
}
console.log('Built the approved landing animation; no video was rendered or exported.');

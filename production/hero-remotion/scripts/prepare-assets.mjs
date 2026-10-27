import {copyFile, mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repository = path.resolve(project, '../..');
const assets = [
  'hero-screens/solver-1920.webp',
  'hero-screens/equity-1920.webp',
  'hero-screens/aggregate-1920.webp',
  'hero-screens/library-1920.webp',
  'inter.woff2',
];

for (const asset of assets) {
  const destination = path.join(project, 'public', asset);
  await mkdir(path.dirname(destination), {recursive: true});
  await copyFile(path.join(repository, 'assets', asset), destination);
}
const assistant = path.join(project, 'public', 'product-screens', 'assistant.png');
await mkdir(path.dirname(assistant), {recursive: true});
await copyFile(path.join(repository, 'production/hero/sources/assistant.png'), assistant);
const brandLogo = path.join(project, 'public', 'brand', 'fisher-logo.svg');
await mkdir(path.dirname(brandLogo), {recursive: true});
await copyFile(path.join(repository, 'assets', 'fisher-logo.svg'), brandLogo);
console.log(`Prepared ${assets.length + 2} Fisher product and brand assets.`);

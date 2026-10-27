import {bundle} from '@remotion/bundler';
import {getCompositions, openBrowser, renderStill} from '@remotion/renderer';
import {mkdir, readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(project, 'keyframes');
await mkdir(output, {recursive: true});
const browser = await openBrowser('chrome');
try {
  const serveUrl = await bundle({entryPoint: path.join(project, 'src/index.ts'), publicDir: path.join(project, 'public')});
  const compositions = await getCompositions(serveUrl, {puppeteerInstance: browser});
  const ids = ['KF01-Solver', 'KF02-Product-Strip', 'KF03-Selection', 'KF04-Page-Assembly',
    'KF05-Brand-Reveal', 'KF06-Final-Hold', 'Keyframes-Board'];
  for (const id of ids) {
    const composition = compositions.find((item) => item.id === id);
    if (!composition) throw new Error(`Missing composition: ${id}`);
    await renderStill({serveUrl, composition, puppeteerInstance: browser,
      output: path.join(output, `${id}.png`), imageFormat: 'png',
      onBrowserLog: (log) => {if (log.type === 'error') console.error(log.text);},
    });
    console.log(`Rendered ${id}.png`);
  }
  const film = compositions.find((item) => item.id === 'GTO-Fisher-Hero');
  if (!film) throw new Error('Main hero composition is missing.');
  const holdStart = await renderStill({serveUrl, composition: film, puppeteerInstance: browser,
    frame: 216, imageFormat: 'png'});
  const holdEnd = await renderStill({serveUrl, composition: film, puppeteerInstance: browser,
    frame: 239, imageFormat: 'png'});
  const hash = (buffer) => createHash('sha256').update(buffer).digest('hex');
  const frozen = await readFile(path.join(output, 'KF06-Final-Hold.png'));
  if (!holdStart.buffer || !holdEnd.buffer || hash(holdStart.buffer) !== hash(holdEnd.buffer)
      || hash(holdEnd.buffer) !== hash(frozen)) {
    throw new Error('Final hold changed or the keyframe differs from the actual film.');
  }
  console.log('Verified: frames 216–239 are static; final keyframe matches the actual film.');
} finally {
  await browser.close({silent: true});
}

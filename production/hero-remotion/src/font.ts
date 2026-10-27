import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

loadFont({
  family: 'Fisher Inter',
  url: staticFile('inter.woff2'),
  weight: '100 900',
}).catch((error) => {
  console.error('Fisher font could not load', error);
});

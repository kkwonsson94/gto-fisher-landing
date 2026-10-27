// Configure the installed Remotion staticFile base before font/component imports.
// Relative document URLs also allow hosting this page under a path prefix.
const remotionWindow = window as Window & {remotion_staticBase: string};
remotionWindow.remotion_staticBase = new URL('assets/hero-motion', document.baseURI).href.replace(/\/$/, '');
void import('./landing').catch(async (error) => {
  console.error('Hero animation could not initialize; using native video.', error);
  await import(new URL('app.js', document.baseURI).href);
});

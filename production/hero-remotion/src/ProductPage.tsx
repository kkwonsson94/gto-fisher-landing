import type {CSSProperties} from 'react';
import {CanvasImage, Easing, Interactive, interpolate, staticFile, useCurrentFrame,
  useVideoConfig, type InteractivitySchema} from 'remotion';
import {assets} from './content';
import './font';

type Props = {title: string; tagline: string; showWorkspace?: boolean; softLighting?: boolean; style?: CSSProperties};

const ProductPageInner: React.FC<Props> = ({title, tagline, showWorkspace = true, softLighting = false, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <Interactive.Div style={{position: 'absolute', width: 1728, height: 1080,
      overflow: 'hidden', fontFamily: 'Fisher Inter, sans-serif',
      color: '#f2f7ff', ...style}}>
      {showWorkspace ? <Interactive.Div name="Real Solver workspace" premountFor={fps} style={{
        position: 'absolute', left: 0, top: 64, width: 1344, height: 660,
        borderRadius: 16, overflow: 'hidden', border: '1px solid #9cdbf54a',
        boxShadow: '0 22px 44px #000b1a55',
        translate: interpolate(frame, [0, 1.3 * fps], ['0px 70px', '0px 0px'], {
          easing: Easing.bezier(0.16, 1, 0.3, 1), extrapolateRight: 'clamp'}),
      }}>
        <CanvasImage src={staticFile(assets.solver)} premountFor={fps}
          style={{width: '100%', height: '100%', objectFit: 'contain'}}/>
      </Interactive.Div> : null}

      <Interactive.Div name="Professional blue-white rim light" premountFor={fps} style={{
        position: 'absolute', left: 0, top: 64, width: 1344, height: 660,
        borderRadius: 16, pointerEvents: 'none',
        boxShadow: softLighting
          ? 'inset 0 1px 0 #dff6ff8a, inset 0 -1px 0 #74b5d93d'
          : 'inset 0 1px 0 #dff6ff8a, inset 0 -1px 0 #74b5d93d, 0 -12px 42px #55c8fa12',
        opacity: interpolate(frame, [1.25 * fps, 1.55 * fps, 2.05 * fps, 2.65 * fps], [0, 0.8, 0.6, 0.35], {
          easing: Easing.bezier(0.42, 0, 0.58, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
      }}/>

      <Interactive.Div name="Soft interface light sweep" premountFor={fps} style={{
        position: 'absolute', left: 0, top: 64, width: 1344, height: 660,
        borderRadius: 16, overflow: 'hidden', pointerEvents: 'none',
      }}>
        <div style={{position: 'absolute', width: 500, height: 1200, top: -160,
          background: 'linear-gradient(90deg, transparent 0%, #7ed6ff0c 30%, #f2fcff28 50%, #7ed6ff12 68%, transparent 100%)',
          rotate: '18deg', mixBlendMode: 'screen',
          translate: interpolate(frame, [1.45 * fps, 2.65 * fps], ['-650px 0px', '2100px 0px'], {
            easing: Easing.bezier(0.4, 0, 0.2, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          opacity: interpolate(frame, [1.45 * fps, 1.8 * fps, 2.3 * fps, 2.65 * fps], [0, 0.75, 0.75, 0], {
            easing: Easing.bezier(0.42, 0, 0.58, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        }}/>
      </Interactive.Div>

      {/* Fade begins below the whole workspace, never over any product controls. */}
      <div data-brand-fade style={{position: 'absolute', left: 0, right: 0, top: 724, bottom: 0,
        background: softLighting
          ? 'linear-gradient(180deg, #06142600, #06142612 12%, #06142647 28%, #061426ae 46%, #061426f2 64%, #061426 82%)'
          : 'linear-gradient(180deg, #06142600, #061426f5 30%, #061426 48%)',
        maskImage: softLighting ? 'linear-gradient(90deg, transparent, #000 8%, #000 80%, transparent)' : undefined,
      }}/>

      <Interactive.Div name="GTO Fisher brand lockup" premountFor={fps} style={{
        position: 'absolute', left: 0, top: 752, whiteSpace: 'nowrap',
        display: 'flex', alignItems: 'center', gap: 26, height: 181,
        fontSize: 172, fontWeight: 550, lineHeight: 1.05, letterSpacing: '-0.06em',
        textShadow: '0 2px 26px #061426b3',
        opacity: interpolate(frame, [0.65 * fps, 1.35 * fps], [0, 1], {
          easing: Easing.bezier(0.42, 0, 0.58, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        translate: interpolate(frame, [0.65 * fps, 1.6 * fps], ['0px 46px', '0px 0px'], {
          easing: Easing.bezier(0.22, 1, 0.36, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
      }}>
        {/* Original brand curves in a tight, transparent SVG; no bitmap crop. */}
        <div style={{position: 'relative', width: 176, height: 124, flexShrink: 0}}>
          <CanvasImage src={staticFile(assets.logo)} premountFor={fps} style={{
            position: 'absolute', width: 176, height: 124, left: 0, top: 0,
            objectFit: 'contain',
            scale: interpolate(frame, [0.65 * fps, 1.45 * fps], [0.86, 1], {
              easing: Easing.bezier(0.16, 1, 0.3, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            rotate: interpolate(frame, [0.65 * fps, 1.45 * fps], ['-6deg', '0deg'], {
              easing: Easing.bezier(0.16, 1, 0.3, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          }}/>
        </div>
        <span style={{
          clipPath: `inset(0 ${interpolate(frame, [0.75 * fps, 1.55 * fps], [100, 0], {
            easing: Easing.bezier(0.22, 1, 0.36, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}% 0 0)`,
        }}>{title}</span>
      </Interactive.Div>

      <Interactive.Div name="Brand tagline" premountFor={fps} style={{
        position: 'absolute', left: 202, bottom: 106, fontSize: 30, color: '#b8d2e7',
        opacity: interpolate(frame, [1.15 * fps, 1.75 * fps], [0, 1], {
          easing: Easing.bezier(0.42, 0, 0.58, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        translate: interpolate(frame, [1.1 * fps, 1.75 * fps], ['0px 14px', '0px 0px'], {
          easing: Easing.bezier(0.22, 1, 0.36, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
      }}>{tagline}</Interactive.Div>
    </Interactive.Div>
  );
};

export const ProductPage = Interactive.withSchema({
  Component: ProductPageInner, componentName: '<ProductPage>', wrapInSequence: true,
  schema: {
    title: {type: 'text-content', default: 'GTO Fisher', description: 'Product name'},
    tagline: {type: 'text-content', default: 'Talk strategy. Play smarter.', description: 'Tagline'},
    showWorkspace: {type: 'boolean', default: true, description: 'Show workspace in standalone preview'},
    softLighting: {type: 'boolean', default: false, description: 'Feather background transitions without masking the product'},
  } as const satisfies InteractivitySchema,
});

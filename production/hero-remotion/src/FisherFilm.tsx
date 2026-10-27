import {AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ProductTile} from './ProductTile';
import {ProductPage} from './ProductPage';
import {StudioLighting} from './StudioLighting';
import {SelectionGesture} from './SelectionGesture';
import {TransitionLighting} from './TransitionLighting';
import {LIGHT_CANVAS_MASK} from './lighting-feather';
import './font';

// One continuous Solver layer: opening card → strip → selected pair → final workspace.
// No wall-clock animation, source-image swap, or scene cut is used in that handoff.
export const FisherFilm: React.FC<{polish?: boolean}> = ({polish = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: '#061426', overflow: 'hidden', fontFamily: 'Fisher Inter, sans-serif'}}>
      {/* Final workspace fits just before the website's Fisher card at x=69%. */}
      <div data-content-safe-area data-overlap-stage style={{position: 'absolute', inset: 0, overflow: 'hidden',
        maskImage: 'linear-gradient(90deg, #000 0%, #000 68.5%, #000000f5 69%, #00000080 75%, #00000030 81%, #0000000a 87%, transparent 94%, transparent 100%)',
      }}>
        <div style={{position: 'absolute', left: 0, top: 20, width: 1920, height: 1080,
          scale: 0.96, transformOrigin: 'top left'}}>
          {polish ? <div data-background-lighting style={{position: 'absolute', inset: 0, pointerEvents: 'none',
            overflow: 'hidden', maskImage: LIGHT_CANVAS_MASK, maskComposite: 'intersect'}}>
            <StudioLighting softEdges/>
            <TransitionLighting/>
          </div> : <StudioLighting/>}

          <ProductTile name="Equity · unfold and recede" src="hero-screens/equity-1920.webp" label="Equity" suit="♢" premountFor={fps}
            polish={polish} softRetreat lightDelay={0.08} style={{
            left: 407, top: 420,
            width: interpolate(frame, [0.5 * fps, 1.7 * fps], [480, 300], {
              easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            height: interpolate(frame, [0.5 * fps, 1.7 * fps], [294, 210], {
              easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            opacity: interpolate(frame, [0, 1.5 * fps, 2.2 * fps, 2.75 * fps, 3.6 * fps], [0.65, 1, 1, 0.35, 0], {
              easing: Easing.bezier(0.42, 0, 0.58, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            translate: interpolate(frame, [0.5 * fps, 1.7 * fps, 2.3 * fps, 3.6 * fps], ['69px -46px', '0px 0px', '0px 0px', '-24px 64px'], {
              easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            rotate: interpolate(frame, [0.5 * fps, 1.7 * fps, 2.3 * fps, 3.6 * fps], ['2.5deg', '0deg', '0deg', '-2deg'], {
              easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            filter: `blur(${interpolate(frame, [2.2 * fps, 2.85 * fps], [0, 3], {
              easing: Easing.bezier(0.42, 0, 0.58, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}px)`,
            scale: interpolate(frame, [0.7 * fps, 1.7 * fps, 2.3 * fps, 3.5 * fps], [0.95, 1, 1, 0.96], {
              easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          }}/>
          <ProductTile name="Reports · unfold and recede" src="hero-screens/aggregate-1920.webp" label="Reports" suit="♣" premountFor={fps}
            polish={polish} softRetreat lightDelay={0.16} style={{
            left: 734, top: 420,
            width: interpolate(frame, [0.63 * fps, 1.77 * fps], [480, 300], {
              easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            height: interpolate(frame, [0.63 * fps, 1.77 * fps], [294, 210], {
              easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            opacity: interpolate(frame, [0, 1.63 * fps, 2.2 * fps, 2.75 * fps, 3.6 * fps], [0.4, 1, 1, 0.35, 0], {
              easing: Easing.bezier(0.42, 0, 0.58, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            translate: interpolate(frame, [0.63 * fps, 1.77 * fps, 2.3 * fps, 3.6 * fps], ['-222px -31px', '0px 0px', '0px 0px', '20px 72px'], {
              easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            rotate: interpolate(frame, [0.63 * fps, 1.77 * fps, 2.3 * fps, 3.6 * fps], ['5deg', '0deg', '0deg', '2deg'], {
              easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            filter: `blur(${interpolate(frame, [2.2 * fps, 2.85 * fps], [0, 3], {
              easing: Easing.bezier(0.42, 0, 0.58, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}px)`,
            scale: interpolate(frame, [0.83 * fps, 1.77 * fps, 2.3 * fps, 3.5 * fps], [0.95, 1, 1, 0.96], {
              easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          }}/>
          <ProductTile name="Solutions · unfold and recede" src="hero-screens/library-1920.webp" label="Solutions" suit="♡" premountFor={fps}
            polish={polish} softRetreat lightDelay={0.24} style={{
            left: 1061, top: 420, width: 300, height: 210,
            opacity: interpolate(frame, [0.96 * fps, 1.76 * fps, 2.3 * fps, 3.5 * fps], [0, 1, 1, 0], {
              easing: Easing.bezier(0.42, 0, 0.58, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            translate: interpolate(frame, [0.96 * fps, 1.84 * fps, 2.3 * fps, 3.5 * fps], ['-500px 44px', '0px 0px', '0px 0px', '48px 80px'], {
              easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            rotate: interpolate(frame, [0.96 * fps, 1.84 * fps, 2.3 * fps, 3.5 * fps], ['4deg', '0deg', '0deg', '3deg'], {
              easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            filter: `blur(${interpolate(frame, [2.2 * fps, 2.85 * fps], [0, 3], {
              easing: Easing.bezier(0.42, 0, 0.58, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}px)`,
            scale: interpolate(frame, [0.96 * fps, 1.84 * fps, 2.3 * fps, 3.5 * fps], [0.95, 1, 1, 0.96], {
              easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          }}/>
          <ProductTile name="Fisher AI · join Solver" src="product-screens/assistant.png" objectPosition="center 60%" label="Fisher AI" suit="✦" premountFor={fps}
            polish={polish} lightDelay={0.28} style={{
            zIndex: 1,
            left: interpolate(frame, [1.09 * fps, 1.9 * fps, 2.3 * fps, 3.2 * fps, 3.65 * fps, 4.5 * fps], [560, 1388, 1388, 896, 896, 1090], {
              easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            top: interpolate(frame, [2.3 * fps, 3.2 * fps, 3.65 * fps, 4.5 * fps], [420, 290, 290, 325], {
              easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            width: interpolate(frame, [2.3 * fps, 3.2 * fps, 3.65 * fps, 4.5 * fps], [300, 716, 716, 620], {
              easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            height: interpolate(frame, [2.3 * fps, 3.2 * fps, 3.65 * fps, 4.5 * fps], [210, 400, 400, 340], {
              easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            opacity: interpolate(frame, [1.09 * fps, 1.82 * fps, 3.7 * fps, 4.5 * fps], [0, 1, 1, 0], {
              easing: Easing.bezier(0.42, 0, 0.58, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            rotate: interpolate(frame, [1.09 * fps, 1.9 * fps, 2.3 * fps, 3.2 * fps, 3.65 * fps, 4.5 * fps], ['5deg', '0deg', '0deg', '0deg', '0deg', '2deg'], {
              easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          }}/>

          <ProductTile name="Solver · continuous hero image" src="hero-screens/solver-1920.webp" label="Solver" suit="♠" premountFor={fps}
            containImage polish={polish}
            imageScale={interpolate(frame, [0, 0.5 * fps, 2.3 * fps, 3.2 * fps, 3.65 * fps, 4.95 * fps, 5.35 * fps], [1.08, 1, 1, 1.025, 1.025, 1.015, 1], {
              easing: Easing.bezier(0.42, 0, 0.58, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
            footerHeight={interpolate(frame, [3.65 * fps, 4.95 * fps], [46, 0], {
              easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
            footerOpacity={interpolate(frame, [3.65 * fps, 4.25 * fps], [1, 0], {
              easing: Easing.bezier(0.42, 0, 0.58, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
            style={{
              zIndex: 2,
              left: interpolate(frame, [0.5 * fps, 1.7 * fps, 2.3 * fps, 3.2 * fps, 3.65 * fps, 4.95 * fps], [440, 80, 80, 156, 156, 24], {
                easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
              top: interpolate(frame, [0.5 * fps, 1.7 * fps, 2.3 * fps, 3.2 * fps, 3.65 * fps, 4.95 * fps], [359, 420, 420, 290, 290, 64], {
                easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
              width: interpolate(frame, [0.5 * fps, 1.7 * fps, 2.3 * fps, 3.2 * fps, 3.65 * fps, 4.95 * fps], [480, 300, 300, 716, 716, 1344], {
                easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
              height: interpolate(frame, [0.5 * fps, 1.7 * fps, 2.3 * fps, 3.2 * fps, 3.65 * fps, 4.95 * fps], [294, 210, 210, 400, 400, 660], {
                easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
              borderRadius: interpolate(frame, [3.65 * fps, 4.95 * fps], [14, 16], {
                easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
              boxShadow: '0 24px 64px #000b1a66, 0 0 0 1px #9cdbf52e, 0 -8px 44px #61cfff10',
              opacity: 1,
              rotate: interpolate(frame, [0, 0.5 * fps, 1.7 * fps], ['-1.5deg', '0deg', '0deg'], {
                easing: Easing.bezier(0.42, 0, 0.58, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            }}/>

          <Interactive.Div name="Selection frame · follows expansion" premountFor={fps} style={{
            zIndex: 3, position: 'absolute', boxSizing: 'border-box', border: '2px solid #9cdbf5',
            borderRadius: 4, pointerEvents: 'none',
            left: interpolate(frame, [0.5 * fps, 1.7 * fps, 2.3 * fps, 3.2 * fps, 3.65 * fps, 4.95 * fps], [430, 70, 70, 144, 144, 12], {
              easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            top: interpolate(frame, [0.5 * fps, 1.7 * fps, 2.3 * fps, 3.2 * fps, 3.65 * fps, 4.95 * fps], [349, 410, 410, 278, 278, 52], {
              easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            width: interpolate(frame, [0.5 * fps, 1.7 * fps, 2.3 * fps, 3.2 * fps, 3.65 * fps, 4.95 * fps], [500, 320, 320, 1480, 1480, 1368], {
              easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            height: interpolate(frame, [0.5 * fps, 1.7 * fps, 2.3 * fps, 3.2 * fps, 3.65 * fps, 4.95 * fps], [314, 230, 230, 424, 424, 684], {
              easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            opacity: interpolate(frame, [0.08 * fps, 0.45 * fps, 3.9 * fps, 4.65 * fps], [0, 1, 1, 0], {
              easing: Easing.bezier(0.42, 0, 0.58, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            boxShadow: '0 0 24px #75caff18',
          }}>
            <div style={{position: 'absolute', top: -37, left: -2, height: 35,
              backgroundColor: '#9cdbf5', color: '#061426', fontSize: 17,
              fontWeight: 600, padding: '6px 13px', boxSizing: 'border-box', borderRadius: '5px 5px 0 0',
              opacity: interpolate(frame, [3.65 * fps, 4.3 * fps], [1, 0], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.42, 0, 0.58, 1)}),
            }}>
              <span style={{marginRight: 7}}>♠</span><span>Study</span>
              <span style={{opacity: interpolate(frame, [2.45 * fps, 3.05 * fps], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.42, 0, 0.58, 1)})}}> + Fisher AI</span>
            </div>
            <div style={{position: 'absolute', left: -5, top: -5, width: 8, height: 8, backgroundColor: '#e6f7ff'}}/>
            <div style={{position: 'absolute', right: -5, top: -5, width: 8, height: 8, backgroundColor: '#e6f7ff'}}/>
            <div style={{position: 'absolute', left: -5, bottom: -5, width: 8, height: 8, backgroundColor: '#e6f7ff'}}/>
            <div style={{position: 'absolute', right: -5, bottom: -5, width: 8, height: 8, backgroundColor: '#e6f7ff'}}/>
          </Interactive.Div>

          <SelectionGesture/>

          <ProductPage name="Brand finish · Logo and GTO Fisher" from={3.9 * fps} premountFor={fps}
            title="GTO Fisher" tagline="Talk strategy. Play smarter." showWorkspace={false} softLighting={polish} style={{
              zIndex: 4, left: 24, top: 0,
              opacity: interpolate(frame, [3.9 * fps, 4.45 * fps], [0, 1], {
                easing: Easing.bezier(0.42, 0, 0.58, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            }}/>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const PolishedFisherFilm: React.FC = () => <FisherFilm polish/>;

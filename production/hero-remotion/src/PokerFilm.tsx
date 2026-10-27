import {AbsoluteFill, Easing, Freeze, Interactive, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {PokerProductCard} from './PokerProductCard';
import {ProductPage} from './ProductPage';
import {StudioLighting} from './StudioLighting';
import './font';

// Review-only alternative. The existing Hero composition and exported MP4 stay unchanged.
export const PokerFilm: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: '#061426', overflow: 'hidden', fontFamily: 'Fisher Inter, sans-serif'}}>
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden',
        maskImage: 'linear-gradient(90deg, #000 0%, #000 68.5%, #000000f5 69%, #00000080 75%, #00000030 81%, #0000000a 87%, transparent 94%, transparent 100%)'}}>
        <div style={{position: 'absolute', left: 0, top: 20, width: 1920, height: 1080,
          scale: 0.96, transformOrigin: 'top left'}}>
          <StudioLighting/>
          <Interactive.Div name="Faint table rail · only during the deal" premountFor={fps} style={{
            position: 'absolute', left: 60, top: 365, width: 1320, height: 330,
            border: '1px solid #74b5d92b', borderRadius: '50%',
            background: 'radial-gradient(ellipse at 50% 50%, #1e55731a, transparent 72%)',
            opacity: interpolate(frame, [0, 0.6 * fps, 2.2 * fps, 3.5 * fps], [0, 0.75, 0.75, 0], {
              easing: Easing.bezier(0.42, 0, 0.58, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            scale: interpolate(frame, [0, 1.8 * fps], [0.88, 1], {
              easing: Easing.bezier(0.16, 1, 0.3, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          }}/>
          <PokerProductCard name="Solver ♠ · deal, pick up, spread matrix" premountFor={fps}
            index={0} src="hero-screens/solver-1920.webp" label="Solver" suit="♠"/>
          <PokerProductCard name="Equity ♦ · second dealt card" premountFor={fps}
            index={1} src="hero-screens/equity-1920.webp" label="Equity" suit="♦"/>
          <PokerProductCard name="Reports ♣ · third dealt card" premountFor={fps}
            index={2} src="hero-screens/aggregate-1920.webp" label="Reports" suit="♣"/>
          <PokerProductCard name="Solutions ♥ · fourth dealt card" premountFor={fps}
            index={3} src="hero-screens/library-1920.webp" label="Solutions" suit="♥"/>
          <PokerProductCard name="Fisher AI ✦ · join the selected hand" premountFor={fps}
            index={4} src="product-screens/assistant.png" label="Fisher AI" suit="✦"/>
          <ProductPage name="Original vector brand finish · unchanged final framing" from={3.9 * fps} premountFor={fps}
            title="GTO Fisher" tagline="Talk strategy. Play smarter." showWorkspace={false} style={{
              zIndex: 20, left: 24, top: 0,
              opacity: interpolate(frame, [3.9 * fps, 4.45 * fps], [0, 1], {
                easing: Easing.bezier(0.42, 0, 0.58, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            }}/>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const FrozenPokerFrame: React.FC<{at: number}> = ({at}) => (
  <Freeze frame={at}><PokerFilm/></Freeze>
);

import {Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {getSoftBloomBackground} from './lighting-feather';

// Blue-white studio lighting: broad, quiet, and stationary during the brand hold.
export const StudioLighting: React.FC<{softEdges?: boolean}> = ({softEdges = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // Local polish only: centred ellipses fade before all four element boundaries.
  // Keep the legacy branch below unchanged for the original and archived films.
  if (softEdges) return <>
    <Interactive.Div name="Feathered blue-white studio key light" premountFor={fps} style={{
      position: 'absolute', left: -180, top: -140, width: 1800, height: 1160, pointerEvents: 'none',
      background: getSoftBloomBackground('#4188b5', 0.17),
      translate: interpolate(frame, [0, 1.7 * fps, 3.2 * fps, 4.95 * fps], ['-230px 50px', '-130px 10px', '-50px 0px', '-130px 0px'], {
        easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
      opacity: interpolate(frame, [0, 1.2 * fps, 3.65 * fps, 4.95 * fps, 6.55 * fps], [0.15, 0.5, 0.5, 0.9, 0.65], {
        easing: Easing.bezier(0.42, 0, 0.58, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    }}/>
    <Interactive.Div name="Feathered floor reflection" premountFor={fps} style={{
      position: 'absolute', left: -180, top: 490, width: 1760, height: 620, pointerEvents: 'none',
      background: getSoftBloomBackground('#58b4d9', 0.075),
      opacity: interpolate(frame, [3.5 * fps, 4.95 * fps, 6.55 * fps], [0, 0.8, 0.5], {
        easing: Easing.bezier(0.42, 0, 0.58, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    }}/>
    <Interactive.Div name="Feathered Fisher-side ambient falloff" premountFor={fps} style={{
      position: 'absolute', left: 780, top: -20, width: 1140, height: 1080, pointerEvents: 'none',
      background: getSoftBloomBackground('#459bc4', 0.07),
      opacity: interpolate(frame, [3.65 * fps, 5.15 * fps, 6.55 * fps], [0, 0.75, 0.45], {
        easing: Easing.bezier(0.42, 0, 0.58, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    }}/>
  </>;
  return (
    <>
      <Interactive.Div name="Blue-white studio key light" premountFor={fps} style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 48% 43% at 43% 41%, #327c9f35, #17415f16 55%, transparent 82%)',
        translate: interpolate(frame, [0, 1.7 * fps, 3.2 * fps, 4.95 * fps], ['-230px 50px', '-130px 10px', '-50px 0px', '-130px 0px'], {
          easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        opacity: interpolate(frame, [0, 1.2 * fps, 3.65 * fps, 4.95 * fps, 6.55 * fps], [0.15, 0.5, 0.5, 0.9, 0.65], {
          easing: Easing.bezier(0.42, 0, 0.58, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
      }}/>
      <Interactive.Div name="Soft floor reflection" premountFor={fps} style={{
        position: 'absolute', left: 24, top: 650, width: 1344, height: 260, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 56% 80% at 54% 8%, #65c9eb20, #23618c0c 48%, transparent 76%)',
        opacity: interpolate(frame, [3.5 * fps, 4.95 * fps, 6.55 * fps], [0, 0.8, 0.5], {
          easing: Easing.bezier(0.42, 0, 0.58, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
      }}/>
      <Interactive.Div name="Fisher-side ambient falloff" premountFor={fps} style={{
        position: 'absolute', left: 1110, top: 85, width: 720, height: 890, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 20% 48%, #42a8ce1e, #183d5d0a 48%, transparent 74%)',
        opacity: interpolate(frame, [3.65 * fps, 5.15 * fps, 6.55 * fps], [0, 0.75, 0.45], {
          easing: Easing.bezier(0.42, 0, 0.58, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
      }}/>
    </>
  );
};

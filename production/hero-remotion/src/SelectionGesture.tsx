import {Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

// A brief selection/drag gesture echoes the reference's editing interaction.
// It vanishes before the brand reveal, rather than becoming a permanent HUD.
export const SelectionGesture: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Interactive.Div name="Selection click ripple" premountFor={fps} style={{
        position: 'absolute', zIndex: 5, left: 354, top: 590, width: 72, height: 72,
        borderRadius: '50%', border: '2px solid #b9eaff', boxSizing: 'border-box',
        boxShadow: '0 0 22px #6fcbff26', pointerEvents: 'none',
        opacity: interpolate(frame, [2.12 * fps, 2.2 * fps, 2.58 * fps], [0, 0.8, 0], {
          easing: Easing.bezier(0.42, 0, 0.58, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        scale: interpolate(frame, [2.12 * fps, 2.58 * fps], [0.3, 1.6], {
          easing: Easing.bezier(0.16, 1, 0.3, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
      }}/>
      <Interactive.Div name="Product selection and drag pointer" premountFor={fps} style={{
        position: 'absolute', zIndex: 6, left: 0, top: 0, width: 44, height: 54,
        pointerEvents: 'none', filter: 'drop-shadow(0 4px 6px #000a)',
        translate: interpolate(frame, [1.58 * fps, 2.08 * fps, 2.3 * fps, 3.2 * fps, 3.65 * fps, 4.35 * fps],
          ['980px 750px', '390px 626px', '390px 626px', '1638px 715px', '1638px 715px', '1770px 910px'], {
            easing: Easing.bezier(0.65, 0, 0.35, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        opacity: interpolate(frame, [1.58 * fps, 1.78 * fps, 3.8 * fps, 4.35 * fps], [0, 1, 1, 0], {
          easing: Easing.bezier(0.42, 0, 0.58, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        scale: interpolate(frame, [2.12 * fps, 2.22 * fps, 2.34 * fps], [1, 0.82, 1], {
          easing: Easing.bezier(0.42, 0, 0.58, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
      }}>
        <svg width="44" height="54" viewBox="0 0 44 54" fill="none">
          <path d="M4 3L35 29L21 31L28 46L20 50L13 35L4 44V3Z" fill="#edf9ff" stroke="#143e5b" strokeWidth="2" strokeLinejoin="round"/>
        </svg>
      </Interactive.Div>
    </>
  );
};

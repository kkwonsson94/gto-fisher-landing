import {useCurrentFrame, useVideoConfig} from 'remotion';
import {getMatrixRowState} from './poker-motion';

// The overlay only reveals the original screenshot. No hand frequencies are invented.
export const MatrixSpreadReveal: React.FC<{footerHeight: number; imageScale: number}> = ({footerHeight, imageScale}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <svg data-matrix-spread viewBox="0 0 1920 943" preserveAspectRatio="xMidYMin meet"
      style={{position: 'absolute', top: 0, left: 0, width: '100%',
        height: `calc(100% - ${footerHeight}px)`, scale: imageScale,
        transformOrigin: 'center 46%', pointerEvents: 'none'}}>
      {Array.from({length: 13}, (_, row) => {
        const state = getMatrixRowState(frame / fps, row);
        return <g key={row}>
          <rect x="266" y={123 + row * 54.77} width="1056" height="54.8" fill="#061426" opacity={state.shade}/>
          <rect x="266" y={123 + row * 54.77} width="1056" height="2" fill="#d8f5ff" opacity={state.light}/>
        </g>;
      })}
    </svg>
  );
};

import {useCurrentFrame, useVideoConfig} from 'remotion';
import {getSurfacePolish} from './light-polish';

export const SurfacePolish: React.FC<{width: number; height: number; radius: number;
  delay: number; softRetreat: boolean}> = ({width, height, radius, delay, softRetreat}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const light = getSurfacePolish(frame / fps, delay, softRetreat);
  return (
    <div data-surface-polish style={{position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 'inherit', overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: '30%', height: '180%', top: '-40%',
        background: 'linear-gradient(90deg, transparent, #80d9ff0a 22%, #effbff45 48%, #80d9ff18 65%, transparent)',
        rotate: '16deg', mixBlendMode: 'screen',
        translate: `${(-0.6 + light.travel * 2.2) * width}px 0px`, opacity: light.sheenOpacity}}/>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" width="100%" height="100%"
        style={{position: 'absolute', inset: 0, opacity: light.edgeOpacity}}>
        <rect x="1.5" y="1.5" width={Math.max(1, width - 3)} height={Math.max(1, height - 3)}
          rx={radius} fill="none" stroke="#bcecff" strokeWidth="1.6" pathLength="100"
          strokeDasharray="15 85" strokeDashoffset={-light.travel * 100} strokeLinecap="round"/>
        <rect x="1.5" y="1.5" width={Math.max(1, width - 3)} height={Math.max(1, height - 3)}
          rx={radius} fill="none" stroke="#74caff" strokeWidth="5" pathLength="100"
          strokeDasharray="6 94" strokeDashoffset={-light.travel * 100 - 4} opacity="0.14"/>
      </svg>
    </div>
  );
};

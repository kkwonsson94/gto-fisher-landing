import {Interactive, useCurrentFrame, useVideoConfig} from 'remotion';
import {getAmbientPolish} from './light-polish';
import {getSoftBloomBackground} from './lighting-feather';

export const TransitionLighting: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const light = getAmbientPolish(frame / fps);
  return <>
    <Interactive.Div name="Unfold · moving soft cyan backdrop" premountFor={fps} style={{
      position: 'absolute', left: -140, top: 100, width: 1340, height: 780,
      background: getSoftBloomBackground('#8be0ff', 0.11),
      translate: `${light.spreadX}px 0px`, opacity: light.spreadOpacity, pointerEvents: 'none',
    }}/>
    <Interactive.Div name="Expansion · soft blue-white bounce" premountFor={fps} style={{
      position: 'absolute', left: -180, top: -120, width: 1040, height: 1000,
      background: getSoftBloomBackground('#b5e6ff', 0.1),
      translate: `${light.expansionX}px 0px`, opacity: light.expansionOpacity, pointerEvents: 'none',
    }}/>
  </>;
};

import type {CSSProperties} from 'react';
import {Interactive, useCurrentFrame, useVideoConfig, type InteractivitySchema} from 'remotion';
import {ProductTile} from './ProductTile';
import {getPokerCardState} from './poker-motion';

type Props = {index: number; src: string; label: string; suit: string; style?: CSSProperties};

const PokerProductCardInner: React.FC<Props> = ({index, src, label, suit, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const state = getPokerCardState(frame / fps, index);
  return (
    <Interactive.Div style={{position: 'absolute', left: state.left, top: state.top,
      width: state.width, height: state.height, rotate: `${state.rotate}deg`,
      scale: state.scale, opacity: state.opacity, zIndex: state.zIndex,
      filter: `blur(${state.blur}px)`, transformOrigin: '50% 80%', ...style}}>
      <ProductTile name="Real product face · dealt card" src={src} label={label} suit={suit}
        premountFor={fps} containImage={index === 0} matrixSpread={index === 0}
        objectPosition={index === 4 ? 'center 60%' : 'center top'}
        footerHeight={state.footerHeight} footerOpacity={state.footerOpacity} imageScale={state.imageScale}
        style={{inset: 0, width: '100%', height: '100%', borderColor: state.glow > 0 ? '#b2e7ff' : '#3b5c7b',
          boxShadow: `0 ${24 + state.glow * 14}px ${64 + state.glow * 20}px #000b1a70, 0 0 ${state.glow * 26}px #65caff38`}}/>
      <div style={{position: 'absolute', inset: 5, borderRadius: 10,
        border: '1px solid #d9f2ff21', pointerEvents: 'none', opacity: state.footerOpacity * 0.7}}/>
    </Interactive.Div>
  );
};

export const PokerProductCard = Interactive.withSchema({
  Component: PokerProductCardInner, componentName: '<PokerProductCard>', wrapInSequence: true,
  schema: {
    index: {type: 'number', default: 0, min: 0, max: 4, integer: true, hiddenFromList: false, description: 'Deal order (Solver first, AI last)'},
    src: {type: 'asset', assetType: 'image', default: '', description: 'Real product face'},
    label: {type: 'text-content', default: 'Solver', description: 'Product caption'},
    suit: {type: 'text-content', default: '♠', description: 'Poker suit'},
  } as const satisfies InteractivitySchema,
});

import type {CSSProperties} from 'react';
import {CanvasImage, Interactive, staticFile, useVideoConfig, type InteractivitySchema} from 'remotion';
import './font';
import {MatrixSpreadReveal} from './MatrixSpreadReveal';
import {SurfacePolish} from './SurfacePolish';
import {getSurfacePolish} from './light-polish';
import {useCurrentFrame} from 'remotion';

type Props = {
  src: string;
  label: string;
  suit: string;
  objectPosition?: string;
  footerHeight?: number;
  footerOpacity?: number;
  imageScale?: number;
  containImage?: boolean;
  matrixSpread?: boolean;
  polish?: boolean;
  softRetreat?: boolean;
  lightDelay?: number;
  style?: CSSProperties;
};

const ProductTileInner: React.FC<Props> = ({src, label, suit, objectPosition = 'center top', footerHeight = 46, footerOpacity = 1, imageScale = 1, containImage = false, matrixSpread = false, polish = false, softRetreat = false, lightDelay = 0, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const retreat = polish ? getSurfacePolish(frame / fps, lightDelay, softRetreat).retreat : 0;
  return (
    <Interactive.Div data-product-screen={label} style={{
      position: 'absolute', backgroundColor: '#0c2037',
      border: '1px solid #3b5c7b', borderRadius: 14,
      overflow: 'hidden', fontFamily: 'Fisher Inter, sans-serif',
      boxShadow: '0 24px 64px #000b1a55',
      maskImage: retreat > 0 ? `linear-gradient(90deg, #000 0%, #000 ${100 - retreat * 82}%, transparent 100%)` : undefined,
      ...style,
    }}>
      <CanvasImage src={staticFile(src)} premountFor={fps} style={{
        position: 'absolute', top: 0, left: 0, width: '100%',
        height: `calc(100% - ${footerHeight}px)`, objectFit: containImage ? 'contain' : 'cover', objectPosition,
        scale: imageScale, transformOrigin: 'center 46%',
      }}/>
      {matrixSpread ? <MatrixSpreadReveal footerHeight={footerHeight} imageScale={imageScale}/> : null}
      {polish ? <SurfacePolish width={typeof style?.width === 'number' ? style.width : 480}
        height={typeof style?.height === 'number' ? style.height : 294}
        radius={typeof style?.borderRadius === 'number' ? style.borderRadius : 14}
        delay={lightDelay} softRetreat={softRetreat}/> : null}
      <div style={{position: 'absolute', bottom: 0, width: '100%', height: 46,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: footerOpacity,
        padding: '0 18px', boxSizing: 'border-box', color: '#d7eafa', fontSize: 19}}>
        <span>{label}</span><span style={{color: '#9cdbf5', fontSize: 26}}>{suit}</span>
      </div>
    </Interactive.Div>
  );
};

const schema = {
  src: {type: 'asset', assetType: 'image', default: '', description: 'Product screenshot'},
  label: {type: 'text-content', default: 'Solver', description: 'Product name'},
  suit: {type: 'text-content', default: '♠', description: 'Poker suit'},
  footerHeight: {type: 'number', default: 46, min: 0, max: 46, hiddenFromList: false, description: 'Caption strip height'},
  footerOpacity: {type: 'number', default: 1, min: 0, max: 1, hiddenFromList: false, description: 'Caption visibility'},
  imageScale: {type: 'number', default: 1, min: 1, max: 1.2, hiddenFromList: false, description: 'Interface camera scale'},
  containImage: {type: 'boolean', default: false, description: 'Show the whole interface without cropping'},
  matrixSpread: {type: 'boolean', default: false, description: 'Preview-only row-by-row matrix reveal'},
  polish: {type: 'boolean', default: false, description: 'Subtle moving edge and surface light'},
  softRetreat: {type: 'boolean', default: false, description: 'Feather the inactive card after unfolding'},
  lightDelay: {type: 'number', default: 0, min: 0, max: 1, hiddenFromList: false, description: 'Light stagger in seconds'},
} as const satisfies InteractivitySchema;

export const ProductTile = Interactive.withSchema({
  Component: ProductTileInner, componentName: '<ProductTile>', schema, wrapInSequence: true,
});

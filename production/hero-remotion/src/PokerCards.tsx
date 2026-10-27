import type {CSSProperties} from 'react';
import {Interactive, type InteractivitySchema} from 'remotion';

type Props = {suit: string; color: string; style?: CSSProperties};

const AceInner: React.FC<Props> = ({suit, color, style}) => (
  <Interactive.Div style={{position: 'absolute', width: 152, height: 208,
    backgroundColor: '#f2f7ff', border: '1px solid #d7eafa', borderRadius: 13,
    color, boxShadow: '0 12px 38px #000b1a40', fontFamily: 'Georgia, serif', ...style}}>
    <div style={{position: 'absolute', top: 13, left: 13, textAlign: 'center', fontSize: 27, lineHeight: 1}}>
      A<div style={{fontSize: 25, marginTop: 5}}>{suit}</div>
    </div>
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: 92, paddingTop: 10}}>{suit}</div>
    <div style={{position: 'absolute', bottom: 13, right: 13, textAlign: 'center',
      fontSize: 27, lineHeight: 1, rotate: '180deg'}}>
      A<div style={{fontSize: 25, marginTop: 5}}>{suit}</div>
    </div>
  </Interactive.Div>
);

export const Ace = Interactive.withSchema({
  Component: AceInner, componentName: '<Ace>', wrapInSequence: true,
  schema: {
    suit: {type: 'text-content', default: '♠', description: 'Card suit'},
    color: {type: 'color', default: '#123b5b', description: 'Suit color'},
  } as const satisfies InteractivitySchema,
});

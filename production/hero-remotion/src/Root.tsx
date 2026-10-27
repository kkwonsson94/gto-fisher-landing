import {Composition, Folder} from 'remotion';
import {FisherFilm, PolishedFisherFilm} from './FisherFilm';
import {FrozenFrame, KeyframeBoard} from './KeyframeBoard';
import {ProductPage} from './ProductPage';
import {FrozenPokerFrame, PokerFilm} from './PokerFilm';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="GTO-Fisher-Hero-Polish" component={PolishedFisherFilm} width={1920} height={1080} fps={30} durationInFrames={240}/>
      <Composition id="GTO-Fisher-Hero" component={FisherFilm} width={1920} height={1080} fps={30} durationInFrames={240}/>
      <Composition id="GTO-Fisher-Poker-Motion" component={PokerFilm} width={1920} height={1080} fps={30} durationInFrames={240}/>
      <Composition id="Keyframes-Board" component={KeyframeBoard} width={2048} height={2160} fps={30} durationInFrames={240}/>
      <Folder name="Poker-Motion-Review">
        <Composition id="Poker-01-Deal" component={FrozenPokerFrame} width={1920} height={1080} fps={30} durationInFrames={240} defaultProps={{at: 39}}/>
        <Composition id="Poker-02-Pick" component={FrozenPokerFrame} width={1920} height={1080} fps={30} durationInFrames={240} defaultProps={{at: 81}}/>
        <Composition id="Poker-03-Matrix" component={FrozenPokerFrame} width={1920} height={1080} fps={30} durationInFrames={240} defaultProps={{at: 150}}/>
        <Composition id="Poker-04-Hold" component={FrozenPokerFrame} width={1920} height={1080} fps={30} durationInFrames={240} defaultProps={{at: 234}}/>
      </Folder>
      <Folder name="Keyframes">
        <Composition id="KF01-Solver" component={FrozenFrame} width={1920} height={1080} fps={30} durationInFrames={240} defaultProps={{at: 18}}/>
        <Composition id="KF02-Product-Strip" component={FrozenFrame} width={1920} height={1080} fps={30} durationInFrames={240} defaultProps={{at: 54}}/>
        <Composition id="KF03-Selection" component={FrozenFrame} width={1920} height={1080} fps={30} durationInFrames={240} defaultProps={{at: 99}}/>
        <Composition id="KF04-Page-Assembly" component={FrozenFrame} width={1920} height={1080} fps={30} durationInFrames={240} defaultProps={{at: 138}}/>
        <Composition id="KF05-Brand-Reveal" component={FrozenFrame} width={1920} height={1080} fps={30} durationInFrames={240} defaultProps={{at: 174}}/>
        <Composition id="KF06-Final-Hold" component={FrozenFrame} width={1920} height={1080} fps={30} durationInFrames={240} defaultProps={{at: 234}}/>
      </Folder>
      <Folder name="Components">
        <Composition id="GTO-Fisher-Product-Page" component={ProductPage} width={1728} height={1080} fps={30} durationInFrames={123}
          defaultProps={{title: 'GTO Fisher', tagline: 'Talk strategy. Play smarter.'}}/>
      </Folder>
    </>
  );
};

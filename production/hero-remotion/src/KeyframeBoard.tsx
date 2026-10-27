import {AbsoluteFill, Freeze} from 'remotion';
import {FisherFilm} from './FisherFilm';
import {keyframes} from './content';
import './font';

export const FrozenFrame: React.FC<{at: number}> = ({at}) => (
  <Freeze frame={at}><FisherFilm/></Freeze>
);

export const KeyframeBoard: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#07111f', fontFamily: 'Fisher Inter, Microsoft YaHei, sans-serif', color: '#f2f7ff'}}>
    <div style={{position: 'absolute', left: 64, top: 44, color: '#9cdbf5', fontSize: 18, letterSpacing: '0.18em'}}>
      GTO FISHER / HERO MOTION / EDITORIAL MOTION 06
    </div>
    <div style={{position: 'absolute', left: 60, top: 80, fontSize: 58, letterSpacing: '-0.045em', fontWeight: 500}}>
      左侧起手，选择与展开更有层次。
    </div>
    <div style={{position: 'absolute', right: 66, top: 111, color: '#8da8c1', fontSize: 20}}>8 SEC · 30 FPS · 16:9</div>
    {keyframes.map((keyframe, index) => (
      <div key={keyframe.frame} style={{position: 'absolute', left: 64 + index % 2 * 976,
        top: 180 + Math.floor(index / 2) * 640, width: 944, height: 615}}>
        <div style={{position: 'relative', width: 944, height: 531, overflow: 'hidden',
          borderRadius: 14, outline: '1px solid #23394e'}}>
          <div style={{position: 'absolute', width: 1920, height: 1080, transformOrigin: 'top left', scale: 944 / 1920}}>
            <Freeze frame={keyframe.frame}><FisherFilm/></Freeze>
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 19}}>
          <span style={{fontSize: 25, fontWeight: 500}}>{String(index + 1).padStart(2, '0')} / {keyframe.title}</span>
          <span style={{fontSize: 19, color: '#9cdbf5', fontVariantNumeric: 'tabular-nums'}}>{keyframe.time}</span>
        </div>
        <div style={{fontSize: 18, color: '#8da8c1', marginTop: 9}}>{keyframe.detail}</div>
      </div>
    ))}
    <div style={{position: 'absolute', left: 64, bottom: 24, right: 64, display: 'flex', justifyContent: 'space-between',
      fontSize: 17, color: '#7490aa', borderTop: '1px solid #23394e', paddingTop: 16}}>
      <span>叠卡展开 · 选择拖拽 · 退焦推近 · 角色下方渐隐</span>
      <span>同一 Remotion 时间轴 / 最后约 1.5 秒完全定格</span>
    </div>
  </AbsoluteFill>
);

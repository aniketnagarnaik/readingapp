import speedyImg from '../assets/speedy.png';

export default function RaceTrack({ progress, total, carImg, label }) {
  var pct = (progress / total) * 100;
  var imgSrc = carImg || speedyImg;

  var markers = [];
  for (var i = 0; i <= total; i++) {
    markers.push(
      <div
        key={i}
        className={'track-marker' + (i < progress ? ' track-marker-done' : '')}
        style={{ left: (i / total) * 100 + '%' }}
      />
    );
  }

  return (
    <div className="race-track-container">
      {label && <div className="track-label">{label}</div>}
      <div className="race-track">
        <div className="track-road">
          <div className="track-dashes" />
          {markers}
          <div className="track-car-wrapper" style={{ left: pct + '%' }}>
            <img src={imgSrc} alt="Car" className="track-car-img" />
          </div>
          <div className="track-finish">🏁</div>
        </div>
      </div>
    </div>
  );
}

export function DualRaceTrack({ p1Progress, p2Progress, total, p1CarImg, p2CarImg, p1Name, p2Name, activePlayer }) {
  return (
    <div className="dual-track-container">
      <div className={'dual-track-row' + (activePlayer === 1 ? ' dual-track-active' : '')}>
        <RaceTrack progress={p1Progress} total={total} carImg={p1CarImg} label={p1Name || 'Player 1'} />
      </div>
      <div className={'dual-track-row' + (activePlayer === 2 ? ' dual-track-active' : '')}>
        <RaceTrack progress={p2Progress} total={total} carImg={p2CarImg} label={p2Name || 'Player 2'} />
      </div>
    </div>
  );
}

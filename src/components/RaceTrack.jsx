import speedyImg from '../assets/speedy.png';

export default function RaceTrack({ progress, total }) {
  var pct = (progress / total) * 100;

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
      <div className="race-track">
        <div className="track-road">
          <div className="track-dashes" />
          {markers}
          <div className="track-car-wrapper" style={{ left: pct + '%' }}>
            <img src={speedyImg} alt="Speedy" className="track-car-img" />
          </div>
          <div className="track-finish">🏁</div>
        </div>
      </div>
    </div>
  );
}

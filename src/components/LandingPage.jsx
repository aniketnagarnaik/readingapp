import speedyImg from '../assets/speedy.png';

export default function LandingPage({ onChooseReading, onChooseMath, onChooseCompare }) {
  return (
    <div className="screen landing-screen">
      <div className="landing-content">
        <h1 className="landing-title">Learning Games</h1>
        <p className="landing-subtitle">What do you want to play today?</p>

        <div className="landing-buttons">
          <div
            role="button"
            tabIndex={0}
            className="landing-btn landing-btn-reading"
            onClick={onChooseReading}
            style={{ cursor: 'pointer' }}
          >
            <span className="landing-btn-icon">📚</span>
            <span className="landing-btn-label">Reading Adventure</span>
            <span className="landing-btn-desc">Learn to read with stories</span>
          </div>

          <div
            role="button"
            tabIndex={0}
            className="landing-btn landing-btn-math"
            onClick={onChooseMath}
            style={{ cursor: 'pointer' }}
          >
            <img src={speedyImg} alt="Speedy" className="landing-btn-car" />
            <span className="landing-btn-label">Math Racing</span>
            <span className="landing-btn-desc">Race with Speedy &amp; friends!</span>
          </div>

          <div
            role="button"
            tabIndex={0}
            className="landing-btn landing-btn-compare"
            onClick={onChooseCompare}
            style={{ cursor: 'pointer' }}
          >
            <span className="landing-btn-icon">⚖️</span>
            <span className="landing-btn-label">Number Compare</span>
            <span className="landing-btn-desc">Which number is bigger?</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';

export default function PatternHome({ onStartRace, onBack }) {
  var playerState = useState(1);
  var playerCount = playerState[0];
  var setPlayerCount = playerState[1];

  return (
    <div className="screen math-home-screen pattern-home-screen">
      <button className="back-btn" onClick={onBack}>
        ← Back
      </button>

      <div className="math-home-content">
        <div className="math-home-header">
          <span className="pattern-home-icon">🧩</span>
          <h1 className="math-home-title">Pattern Power</h1>
        </div>

        <p className="pattern-home-subtitle">Complete the pattern!</p>

        <div className="pattern-home-preview">
          <span className="pattern-preview-item" style={{ background: '#e74c3c' }} />
          <span className="pattern-preview-item" style={{ background: '#3498db' }} />
          <span className="pattern-preview-item" style={{ background: '#e74c3c' }} />
          <span className="pattern-preview-item" style={{ background: '#3498db' }} />
          <span className="pattern-preview-question">?</span>
        </div>

        <div className="math-section">
          <h3 className="math-section-title">Players</h3>
          <div className="player-toggle">
            <button
              className={'player-toggle-btn' + (playerCount === 1 ? ' player-toggle-active' : '')}
              onClick={function () { setPlayerCount(1); }}
            >
              👤 1 Player
            </button>
            <button
              className={'player-toggle-btn' + (playerCount === 2 ? ' player-toggle-active' : '')}
              onClick={function () { setPlayerCount(2); }}
            >
              👥 2 Players
            </button>
          </div>
        </div>

        <div className="compare-start-area">
          <div
            role="button"
            tabIndex={0}
            className="math-activity-btn math-race-btn compare-start-btn"
            onClick={function () { onStartRace(playerCount); }}
            style={{ cursor: 'pointer' }}
          >
            <span className="activity-btn-icon">🏁</span>
            <span className="activity-btn-label">Start Race!</span>
            <span className="activity-btn-desc">
              {playerCount === 1 ? 'Solo race!' : 'Head to head!'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

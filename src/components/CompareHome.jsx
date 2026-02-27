import { useState } from 'react';

var TRACKS = [
  { id: 'easy', name: 'Radiator Springs', desc: 'Single digit (1-9)', emoji: '🏁' },
  { id: 'medium', name: 'Piston Cup', desc: 'Double digit (10-99)', emoji: '🏆' },
  { id: 'hard', name: 'World Grand Prix', desc: 'Triple digit (100-999)', emoji: '🌍' },
];

export default function CompareHome({ onStartRace, onBack }) {
  var diffState = useState('easy');
  var difficulty = diffState[0];
  var setDifficulty = diffState[1];

  var playerState = useState(1);
  var playerCount = playerState[0];
  var setPlayerCount = playerState[1];

  return (
    <div className="screen math-home-screen compare-home-screen">
      <button className="back-btn" onClick={onBack}>
        ← Back
      </button>

      <div className="math-home-content">
        <div className="math-home-header">
          <span className="compare-home-icon">⚖️</span>
          <h1 className="math-home-title">Number Compare</h1>
        </div>

        <p className="compare-home-subtitle">Which number is bigger?</p>

        <div className="math-section">
          <h3 className="math-section-title">Choose Your Track</h3>
          <div className="track-cards">
            {TRACKS.map(function (track) {
              return (
                <div
                  key={track.id}
                  role="button"
                  tabIndex={0}
                  className={'track-card' + (difficulty === track.id ? ' track-active' : '')}
                  onClick={function () { setDifficulty(track.id); }}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="track-emoji">{track.emoji}</span>
                  <span className="track-name">{track.name}</span>
                  <span className="track-desc">{track.desc}</span>
                </div>
              );
            })}
          </div>
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
            onClick={function () { onStartRace(difficulty, playerCount); }}
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

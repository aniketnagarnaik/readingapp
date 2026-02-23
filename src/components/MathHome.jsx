import { useState } from 'react';
import speedyImg from '../assets/speedy.png';
import rustyImg from '../assets/rusty.png';

var TRACKS = [
  { id: 'easy', name: 'Radiator Springs', desc: 'Single digit (1-9)', emoji: '🏁' },
  { id: 'medium', name: 'Piston Cup', desc: 'Double digit (10-99)', emoji: '🏆' },
  { id: 'hard', name: 'World Grand Prix', desc: 'Triple digit (100-999)', emoji: '🌍' },
];

var OPERATIONS = [
  { id: 'addition', label: '+ Addition', color: '#27ae60' },
  { id: 'subtraction', label: '- Subtraction', color: '#2980b9' },
  { id: 'mixed', label: '+/- Mixed', color: '#8e44ad' },
];

export default function MathHome({ onStartRace, onStartLearn, onBack }) {
  var diffState = useState('easy');
  var difficulty = diffState[0];
  var setDifficulty = diffState[1];

  var opState = useState('addition');
  var operation = opState[0];
  var setOperation = opState[1];

  var playerState = useState(1);
  var playerCount = playerState[0];
  var setPlayerCount = playerState[1];

  return (
    <div className="screen math-home-screen">
      <button className="back-btn" onClick={onBack}>
        ← Back
      </button>

      <div className="math-home-content">
        <div className="math-home-header">
          <img src={speedyImg} alt="Speedy" className="math-home-car" />
          <h1 className="math-home-title">Math Racing</h1>
        </div>

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
          <h3 className="math-section-title">Choose Operation</h3>
          <div className="operation-buttons">
            {OPERATIONS.map(function (op) {
              return (
                <button
                  key={op.id}
                  className={'operation-btn' + (operation === op.id ? ' operation-active' : '')}
                  onClick={function () { setOperation(op.id); }}
                  style={operation === op.id ? { background: op.color, borderColor: op.color } : {}}
                >
                  {op.label}
                </button>
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

        <div className="math-activity-buttons">
          <div
            role="button"
            tabIndex={0}
            className="math-activity-btn math-learn-btn"
            onClick={function () { onStartLearn(difficulty, operation); }}
            style={{ cursor: 'pointer' }}
          >
            <img src={rustyImg} alt="Rusty" className="activity-btn-car" />
            <span className="activity-btn-label">Speedy's Garage</span>
            <span className="activity-btn-desc">Learn how it works!</span>
          </div>

          <div
            role="button"
            tabIndex={0}
            className="math-activity-btn math-race-btn"
            onClick={function () { onStartRace(difficulty, operation, playerCount); }}
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

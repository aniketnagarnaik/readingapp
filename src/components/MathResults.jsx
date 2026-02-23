import { useEffect, useRef } from 'react';
import speedyImg from '../assets/speedy.png';

export default function MathResults({ totalWrong, onRaceAgain, onHome }) {
  var speakRef = useRef(false);

  var stars = 3;
  if (totalWrong >= 1 && totalWrong <= 2) stars = 2;
  if (totalWrong >= 3) stars = 1;

  useEffect(function () {
    if (!speakRef.current) {
      speakRef.current = true;
      var text = stars === 3
        ? 'You won the race! Perfect score! Amazing!'
        : stars === 2
        ? 'You won the race! Great job!'
        : 'You finished the race! Keep practicing!';

      var utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
    return function () {
      window.speechSynthesis.cancel();
    };
  }, [stars]);

  var starDisplay = '';
  for (var i = 0; i < 3; i++) {
    starDisplay += i < stars ? '⭐' : '☆';
  }

  return (
    <div className="screen results-screen">
      <div className="results-confetti" />

      <div className="results-content">
        <img src={speedyImg} alt="Speedy" className="results-car" />

        <h1 className="results-title">
          {stars === 3 ? 'Perfect Race!' : stars === 2 ? 'Great Race!' : 'Race Complete!'}
        </h1>

        <div className="results-stars">{starDisplay}</div>

        <p className="results-summary">
          You solved 5 problems!
          {totalWrong === 0 && ' No mistakes!'}
          {totalWrong > 0 && ' ' + totalWrong + ' mistake' + (totalWrong > 1 ? 's' : '') + '.'}
        </p>

        <div className="results-trophy">🏆</div>

        <div className="results-buttons">
          <button className="results-btn results-btn-again" onClick={onRaceAgain}>
            🏁 Race Again
          </button>
          <button className="results-btn results-btn-home" onClick={onHome}>
            🏠 Home
          </button>
        </div>
      </div>
    </div>
  );
}

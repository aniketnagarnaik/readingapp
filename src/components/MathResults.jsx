import { useEffect, useRef } from 'react';
import { getCarById } from '../utils/carCharacters';
import speedyImg from '../assets/speedy.png';

export default function MathResults({ totalWrong, p1Score, p2Score, p1CarId, p2CarId, playerCount, onRaceAgain, onHome }) {
  var speakRef = useRef(false);
  var isTwoPlayer = playerCount === 2;

  var stars = 3;
  if (!isTwoPlayer) {
    if (totalWrong >= 1 && totalWrong <= 2) stars = 2;
    if (totalWrong >= 3) stars = 1;
  }

  var winner = null;
  var p1Car = isTwoPlayer ? getCarById(p1CarId) : null;
  var p2Car = isTwoPlayer ? getCarById(p2CarId) : null;
  var soloCarImg = !isTwoPlayer && p1CarId ? getCarById(p1CarId).img : speedyImg;

  if (isTwoPlayer) {
    if (p1Score > p2Score) winner = 1;
    else if (p2Score > p1Score) winner = 2;
    else winner = 0;
  }

  useEffect(function () {
    if (!speakRef.current) {
      speakRef.current = true;
      var text;
      if (isTwoPlayer) {
        if (winner === 1) text = 'Player 1 wins with ' + p1Car.name + '! Congratulations!';
        else if (winner === 2) text = 'Player 2 wins with ' + p2Car.name + '! Congratulations!';
        else text = "It's a draw! Great race!";
      } else {
        text = stars === 3
          ? 'You won the race! Perfect score! Amazing!'
          : stars === 2
          ? 'You won the race! Great job!'
          : 'You finished the race! Keep practicing!';
      }
      var utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
    return function () { window.speechSynthesis.cancel(); };
  }, []);

  if (isTwoPlayer) {
    return (
      <div className="screen results-screen">
        <div className="results-confetti" />
        <div className="results-content">
          {winner === 0 ? (
            <>
              <h1 className="results-title results-draw">It's a Draw!</h1>
              <div className="results-two-cars">
                <div className="results-player-card">
                  <img src={p1Car.img} alt={p1Car.name} className="results-car" />
                  <span className="results-player-name">{p1Car.name}</span>
                  <span className="results-player-score">{p1Score}/5</span>
                </div>
                <span className="results-vs">🤝</span>
                <div className="results-player-card">
                  <img src={p2Car.img} alt={p2Car.name} className="results-car" />
                  <span className="results-player-name">{p2Car.name}</span>
                  <span className="results-player-score">{p2Score}/5</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className="results-title">
                {winner === 1 ? p1Car.name : p2Car.name} Wins!
              </h1>
              <div className="results-two-cars">
                <div className={'results-player-card' + (winner === 1 ? ' results-winner' : ' results-loser')}>
                  <img src={p1Car.img} alt={p1Car.name} className="results-car" />
                  <span className="results-player-name">{p1Car.name}</span>
                  <span className="results-player-score">{p1Score}/5</span>
                  {winner === 1 && <span className="results-crown">👑</span>}
                </div>
                <span className="results-vs">VS</span>
                <div className={'results-player-card' + (winner === 2 ? ' results-winner' : ' results-loser')}>
                  <img src={p2Car.img} alt={p2Car.name} className="results-car" />
                  <span className="results-player-name">{p2Car.name}</span>
                  <span className="results-player-score">{p2Score}/5</span>
                  {winner === 2 && <span className="results-crown">👑</span>}
                </div>
              </div>
            </>
          )}

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

  var starDisplay = '';
  for (var i = 0; i < 3; i++) {
    starDisplay += i < stars ? '⭐' : '☆';
  }

  return (
    <div className="screen results-screen">
      <div className="results-confetti" />
      <div className="results-content">
        <img src={soloCarImg} alt="Car" className="results-car" />
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

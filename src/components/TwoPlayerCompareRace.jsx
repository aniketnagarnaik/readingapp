import { useState, useCallback, useEffect, useRef } from 'react';
import { DualRaceTrack } from './RaceTrack';
import { generateCompareProblemsSet } from '../utils/compareProblems';
import { getCarById } from '../utils/carCharacters';

var TOTAL_PROBLEMS = 5;

export default function TwoPlayerCompareRace({ difficulty, p1CarId, p2CarId, onFinish, onBack }) {
  var p1Car = getCarById(p1CarId);
  var p2Car = getCarById(p2CarId);

  var problemsState = useState(function () {
    return generateCompareProblemsSet(TOTAL_PROBLEMS * 2, difficulty);
  });
  var problems = problemsState[0];

  var turnState = useState(1);
  var currentPlayer = turnState[0];
  var setCurrentPlayer = turnState[1];

  var indexState = useState(0);
  var questionIndex = indexState[0];
  var setQuestionIndex = indexState[1];

  var p1ScoreState = useState(0);
  var p1Score = p1ScoreState[0];
  var setP1Score = p1ScoreState[1];

  var p2ScoreState = useState(0);
  var p2Score = p2ScoreState[0];
  var setP2Score = p2ScoreState[1];

  var p1QState = useState(0);
  var p1Questions = p1QState[0];
  var setP1Questions = p1QState[1];

  var p2QState = useState(0);
  var p2Questions = p2QState[0];
  var setP2Questions = p2QState[1];

  var feedbackState = useState(null);
  var feedback = feedbackState[0];
  var setFeedback = feedbackState[1];

  var correctAnswerState = useState(null);
  var correctAnswer = correctAnswerState[0];
  var setCorrectAnswer = correctAnswerState[1];

  var showTurnState = useState(true);
  var showTurnBanner = showTurnState[0];
  var setShowTurnBanner = showTurnState[1];

  var speakingRef = useRef(false);

  var current = problems[questionIndex];

  var speakText = useCallback(function (text) {
    if (speakingRef.current) window.speechSynthesis.cancel();
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    speakingRef.current = true;
    utterance.onend = function () { speakingRef.current = false; };
    utterance.onerror = function () { speakingRef.current = false; };
    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(function () {
    if (showTurnBanner) {
      var name = currentPlayer === 1 ? p1Car.name : p2Car.name;
      speakText('Player ' + currentPlayer + '! ' + name + ', your turn!');
      var timer = setTimeout(function () {
        setShowTurnBanner(false);
      }, 2000);
      return function () { clearTimeout(timer); };
    }
  }, [showTurnBanner, currentPlayer, p1Car, p2Car, speakText]);

  var advanceTurn = useCallback(function () {
    var p1Done = currentPlayer === 1 ? p1Questions + 1 >= TOTAL_PROBLEMS : p1Questions >= TOTAL_PROBLEMS;
    var p2Done = currentPlayer === 2 ? p2Questions + 1 >= TOTAL_PROBLEMS : p2Questions >= TOTAL_PROBLEMS;

    if (p1Done && p2Done) return;

    var nextPlayer;
    if (currentPlayer === 1) {
      nextPlayer = p2Done ? 1 : 2;
    } else {
      nextPlayer = p1Done ? 2 : 1;
    }

    setCurrentPlayer(nextPlayer);
    setQuestionIndex(function (i) { return i + 1; });
    setFeedback(null);
    setCorrectAnswer(null);
    setShowTurnBanner(true);
  }, [currentPlayer, p1Questions, p2Questions]);

  var handleAnswer = useCallback(function (choice) {
    if (feedback) return;

    var isCorrect = choice === current.answer;
    setCorrectAnswer(current.answer);

    if (isCorrect) {
      setFeedback('correct');
      if (currentPlayer === 1) {
        setP1Score(function (s) { return s + 1; });
        setP1Questions(function (q) { return q + 1; });
      } else {
        setP2Score(function (s) { return s + 1; });
        setP2Questions(function (q) { return q + 1; });
      }
      speakText('Correct! Vroom vroom!');

      setTimeout(function () {
        var newP1Q = currentPlayer === 1 ? p1Questions + 1 : p1Questions;
        var newP2Q = currentPlayer === 2 ? p2Questions + 1 : p2Questions;
        if (newP1Q >= TOTAL_PROBLEMS && newP2Q >= TOTAL_PROBLEMS) {
          var newP1S = currentPlayer === 1 ? p1Score + 1 : p1Score;
          var newP2S = currentPlayer === 2 ? p2Score + 1 : p2Score;
          onFinish(newP1S, newP2S);
        } else {
          advanceTurn();
        }
      }, 1200);
    } else {
      setFeedback('wrong');
      if (currentPlayer === 1) {
        setP1Questions(function (q) { return q + 1; });
      } else {
        setP2Questions(function (q) { return q + 1; });
      }
      speakText('Wrong! Turn passes!');

      setTimeout(function () {
        var newP1Q = currentPlayer === 1 ? p1Questions + 1 : p1Questions;
        var newP2Q = currentPlayer === 2 ? p2Questions + 1 : p2Questions;
        if (newP1Q >= TOTAL_PROBLEMS && newP2Q >= TOTAL_PROBLEMS) {
          onFinish(p1Score, p2Score);
        } else {
          advanceTurn();
        }
      }, 1200);
    }
  }, [current, currentPlayer, feedback, p1Score, p2Score, p1Questions, p2Questions, onFinish, advanceTurn, speakText]);

  useEffect(function () {
    return function () { window.speechSynthesis.cancel(); };
  }, []);

  var activeCar = currentPlayer === 1 ? p1Car : p2Car;

  var leftHighlight = '';
  var rightHighlight = '';
  if (feedback && correctAnswer) {
    if (correctAnswer === 'left') leftHighlight = feedback === 'correct' ? ' compare-num-correct' : ' compare-num-highlight';
    if (correctAnswer === 'right') rightHighlight = feedback === 'correct' ? ' compare-num-correct' : ' compare-num-highlight';
    if (correctAnswer === 'equal') {
      leftHighlight = feedback === 'correct' ? ' compare-num-correct' : ' compare-num-highlight';
      rightHighlight = feedback === 'correct' ? ' compare-num-correct' : ' compare-num-highlight';
    }
  }

  return (
    <div className="screen math-race-screen compare-race-screen two-player-race">
      <div className="race-top-bar">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <span className="race-problem-count">
          P1: {p1Questions}/{TOTAL_PROBLEMS} | P2: {p2Questions}/{TOTAL_PROBLEMS}
        </span>
      </div>

      <DualRaceTrack
        p1Progress={p1Score}
        p2Progress={p2Score}
        total={TOTAL_PROBLEMS}
        p1CarImg={p1Car.img}
        p2CarImg={p2Car.img}
        p1Name={p1Car.name}
        p2Name={p2Car.name}
        activePlayer={currentPlayer}
      />

      {showTurnBanner && (
        <div className="turn-banner" style={{ background: activeCar.color }}>
          <img src={activeCar.img} alt={activeCar.name} className="turn-banner-car" />
          <span className="turn-banner-text">Player {currentPlayer}'s Turn!</span>
        </div>
      )}

      {!showTurnBanner && (
        <>
          <div className="compare-numbers">
            <div className={'compare-num-card' + leftHighlight}>
              <span className="compare-num">{current.num1}</span>
            </div>
            <div className="compare-vs">
              <span className="compare-question-mark">?</span>
            </div>
            <div className={'compare-num-card' + rightHighlight}>
              <span className="compare-num">{current.num2}</span>
            </div>
          </div>

          <div className="compare-buttons">
            <button
              className={'compare-btn compare-btn-left' + (feedback && correctAnswer === 'left' ? ' compare-btn-correct' : '')}
              onClick={function () { handleAnswer('left'); }}
              disabled={feedback !== null}
            >
              <span className="compare-btn-arrow">⬅</span>
              <span className="compare-btn-text">Bigger</span>
            </button>
            <button
              className={'compare-btn compare-btn-equal' + (feedback && correctAnswer === 'equal' ? ' compare-btn-correct' : '')}
              onClick={function () { handleAnswer('equal'); }}
              disabled={feedback !== null}
            >
              <span className="compare-btn-arrow">=</span>
              <span className="compare-btn-text">Same</span>
            </button>
            <button
              className={'compare-btn compare-btn-right' + (feedback && correctAnswer === 'right' ? ' compare-btn-correct' : '')}
              onClick={function () { handleAnswer('right'); }}
              disabled={feedback !== null}
            >
              <span className="compare-btn-arrow">➡</span>
              <span className="compare-btn-text">Bigger</span>
            </button>
          </div>

          {feedback === 'wrong' && (
            <div className="wrong-turn-msg">
              Wrong! The answer was shown. Turn passes!
            </div>
          )}
        </>
      )}
    </div>
  );
}

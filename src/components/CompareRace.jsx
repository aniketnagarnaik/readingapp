import { useState, useCallback, useEffect, useRef } from 'react';
import RaceTrack from './RaceTrack';
import { generateCompareProblemsSet } from '../utils/compareProblems';
import { getCarById } from '../utils/carCharacters';

var TOTAL_PROBLEMS = 5;

var ENCOURAGEMENTS = [
  'Vroom vroom!', 'Zooom!', 'Great job!', 'Amazing!', 'Super fast!',
  'You are a star!', 'Awesome!', 'Fantastic!', 'Way to go!', 'Brilliant!',
];

export default function CompareRace({ difficulty, carId, onFinish, onBack }) {
  var selectedCar = getCarById(carId);

  var problemsState = useState(function () {
    return generateCompareProblemsSet(TOTAL_PROBLEMS, difficulty);
  });
  var problems = problemsState[0];

  var indexState = useState(0);
  var currentIndex = indexState[0];
  var setCurrentIndex = indexState[1];

  var wrongState = useState(0);
  var totalWrong = wrongState[0];
  var setTotalWrong = wrongState[1];

  var feedbackState = useState(null);
  var feedback = feedbackState[0];
  var setFeedback = feedbackState[1];

  var correctAnswerState = useState(null);
  var correctAnswer = correctAnswerState[0];
  var setCorrectAnswer = correctAnswerState[1];

  var speakingRef = useRef(false);

  var current = problems[currentIndex];
  var isFinished = currentIndex >= TOTAL_PROBLEMS;

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
    if (!isFinished && current) {
      var timer = setTimeout(function () {
        speakText(current.speakText);
      }, 400);
      return function () { clearTimeout(timer); };
    }
  }, [currentIndex, isFinished]);

  useEffect(function () {
    return function () { window.speechSynthesis.cancel(); };
  }, []);

  var handleAnswer = useCallback(function (choice) {
    if (feedback) return;

    if (choice === current.answer) {
      setFeedback('correct');
      setCorrectAnswer(current.answer);
      var enc = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
      if (current.answer === 'equal') {
        speakText('Yes! They are the same! ' + enc);
      } else {
        var bigger = current.answer === 'left' ? current.num1 : current.num2;
        speakText(bigger + ' is bigger! ' + enc);
      }

      setTimeout(function () {
        setFeedback(null);
        setCorrectAnswer(null);
        if (currentIndex + 1 >= TOTAL_PROBLEMS) {
          onFinish(totalWrong);
        } else {
          setCurrentIndex(function (i) { return i + 1; });
        }
      }, 1200);
    } else {
      setFeedback('wrong');
      setCorrectAnswer(current.answer);
      setTotalWrong(function (w) { return w + 1; });

      if (current.answer === 'equal') {
        speakText('Not quite! They are the same!');
      } else {
        var biggerNum = current.answer === 'left' ? current.num1 : current.num2;
        speakText('Not quite! ' + biggerNum + ' is bigger!');
      }

      setTimeout(function () {
        setFeedback(null);
        setCorrectAnswer(null);
        if (currentIndex + 1 >= TOTAL_PROBLEMS) {
          onFinish(totalWrong + 1);
        } else {
          setCurrentIndex(function (i) { return i + 1; });
        }
      }, 1800);
    }
  }, [current, currentIndex, feedback, totalWrong, onFinish, speakText]);

  var speakProblem = useCallback(function () {
    if (current) speakText(current.speakText);
  }, [current, speakText]);

  if (isFinished) return null;

  var leftHighlight = '';
  var rightHighlight = '';
  if (feedback === 'correct') {
    if (correctAnswer === 'left') leftHighlight = ' compare-num-correct';
    if (correctAnswer === 'right') rightHighlight = ' compare-num-correct';
    if (correctAnswer === 'equal') {
      leftHighlight = ' compare-num-correct';
      rightHighlight = ' compare-num-correct';
    }
  } else if (feedback === 'wrong') {
    if (correctAnswer === 'left') leftHighlight = ' compare-num-highlight';
    if (correctAnswer === 'right') rightHighlight = ' compare-num-highlight';
    if (correctAnswer === 'equal') {
      leftHighlight = ' compare-num-highlight';
      rightHighlight = ' compare-num-highlight';
    }
  }

  return (
    <div className="screen math-race-screen compare-race-screen">
      <div className="race-top-bar">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <span className="race-problem-count">
          {currentIndex + 1} of {TOTAL_PROBLEMS}
        </span>
      </div>

      <RaceTrack progress={currentIndex} total={TOTAL_PROBLEMS} carImg={selectedCar.img} />

      <div className="compare-numbers">
        <div className={'compare-num-card' + leftHighlight}>
          <span className="compare-num">{current.num1}</span>
        </div>
        <div className="compare-vs">
          <span className="compare-question-mark">?</span>
          <button className="compare-speak-btn" onClick={speakProblem}>🔊</button>
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
          <span className="compare-btn-symbol">&gt;</span>
        </button>
        <button
          className={'compare-btn compare-btn-equal' + (feedback && correctAnswer === 'equal' ? ' compare-btn-correct' : '')}
          onClick={function () { handleAnswer('equal'); }}
          disabled={feedback !== null}
        >
          <span className="compare-btn-symbol">=</span>
        </button>
        <button
          className={'compare-btn compare-btn-right' + (feedback && correctAnswer === 'right' ? ' compare-btn-correct' : '')}
          onClick={function () { handleAnswer('right'); }}
          disabled={feedback !== null}
        >
          <span className="compare-btn-symbol">&lt;</span>
        </button>
      </div>
    </div>
  );
}

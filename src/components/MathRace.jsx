import { useState, useCallback, useEffect, useRef } from 'react';
import RaceTrack from './RaceTrack';
import CarCounting from './CarCounting';
import ColumnMethod from './ColumnMethod';
import { generateProblemsSet, numberToWords, generateSolutionSteps } from '../utils/mathProblems';
import { getCarById } from '../utils/carCharacters';
import rustyImg from '../assets/rusty.png';

var ENCOURAGEMENTS = [
  'Vroom vroom!', 'Zooom!', 'Great job!', 'Amazing!', 'Super fast!',
  'You are a star!', 'Awesome!', 'Fantastic!', 'Way to go!', 'Brilliant!',
];

var TOTAL_PROBLEMS = 5;

export default function MathRace({ difficulty, operation, carId, onFinish, onBack }) {
  var selectedCar = getCarById(carId);
  var problemsState = useState(function () {
    return generateProblemsSet(TOTAL_PROBLEMS, difficulty, operation);
  });
  var problems = problemsState[0];

  var indexState = useState(0);
  var currentIndex = indexState[0];
  var setCurrentIndex = indexState[1];

  var wrongState = useState(0);
  var totalWrong = wrongState[0];
  var setTotalWrong = wrongState[1];

  var disabledState = useState([]);
  var disabledChoices = disabledState[0];
  var setDisabledChoices = disabledState[1];

  var feedbackState = useState(null);
  var feedback = feedbackState[0];
  var setFeedback = feedbackState[1];

  var hintState = useState(false);
  var showHint = hintState[0];
  var setShowHint = hintState[1];

  var speakingRef = useRef(false);

  var current = problems[currentIndex];

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

  var handleAnswer = useCallback(function (choice) {
    if (feedback) return;

    if (choice === current.answer) {
      setFeedback('correct');
      var phrase = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
      speakText(phrase);

      setTimeout(function () {
        if (currentIndex < TOTAL_PROBLEMS - 1) {
          setCurrentIndex(function (i) { return i + 1; });
          setDisabledChoices([]);
          setFeedback(null);
          setShowHint(false);
        } else {
          onFinish(totalWrong);
        }
      }, 1500);
    } else {
      setFeedback('wrong-' + choice);
      setTotalWrong(function (w) { return w + 1; });
      setDisabledChoices(function (prev) { return prev.concat([choice]); });
      speakText('Try again!');

      setTimeout(function () {
        setFeedback(null);
      }, 800);
    }
  }, [current, currentIndex, feedback, totalWrong, onFinish, speakText]);

  var speakProblem = useCallback(function () {
    var opWord = current.operation === 'addition' ? 'plus' : 'minus';
    var text = 'What is ' + numberToWords(current.num1) + ' ' + opWord + ' ' + numberToWords(current.num2) + '?';
    speakText(text);
  }, [current, speakText]);

  var hintSteps = showHint ? generateSolutionSteps(current.num1, current.num2, current.operation, difficulty) : null;

  useEffect(function () {
    return function () {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="screen math-race-screen">
      <div className="race-top-bar">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <span className="race-problem-count">
          Problem {currentIndex + 1} of {TOTAL_PROBLEMS}
        </span>
      </div>

      <RaceTrack progress={currentIndex} total={TOTAL_PROBLEMS} carImg={selectedCar.img} />

      <div className="race-problem">
        <div className="race-problem-text">
          <span className="race-num">{current.num1}</span>
          <span className="race-symbol">{current.symbol}</span>
          <span className="race-num">{current.num2}</span>
          <span className="race-equals">=</span>
          <span className="race-question">?</span>
        </div>
        <button className="race-speak-btn" onClick={speakProblem}>
          🔊
        </button>
      </div>

      <div className="race-choices">
        {current.choices.map(function (choice, i) {
          var isDisabled = disabledChoices.indexOf(choice) !== -1;
          var isCorrectFeedback = feedback === 'correct' && choice === current.answer;
          var isWrongFeedback = feedback === 'wrong-' + choice;

          var cls = 'race-choice-btn';
          if (isCorrectFeedback) cls += ' race-choice-correct';
          if (isWrongFeedback) cls += ' race-choice-wrong';
          if (isDisabled) cls += ' race-choice-disabled';

          return (
            <button
              key={i}
              className={cls}
              onClick={function () { handleAnswer(choice); }}
              disabled={isDisabled || feedback === 'correct'}
            >
              {choice}
            </button>
          );
        })}
      </div>

      <button
        className="rusty-hint-btn"
        onClick={function () { setShowHint(!showHint); }}
      >
        <img src={rustyImg} alt="Rusty" className="rusty-hint-img" />
        <span>{showHint ? 'Hide Hint' : 'Ask Rusty!'}</span>
      </button>

      {showHint && hintSteps && (
        <div className="race-hint-panel">
          {difficulty === 'easy' ? (
            <CarCounting step={hintSteps[1]} />
          ) : (
            <ColumnMethod step={hintSteps[hintSteps.length - 1]} />
          )}
        </div>
      )}
    </div>
  );
}

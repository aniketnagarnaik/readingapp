import { useState, useCallback, useEffect, useRef } from 'react';
import RaceTrack from './RaceTrack';
import PatternItem from './PatternItem';
import { generatePatternSet } from '../utils/patternProblems';
import { getCarById } from '../utils/carCharacters';

var TOTAL_PROBLEMS = 5;

var ENCOURAGEMENTS = [
  'Vroom vroom!', 'Zooom!', 'Great job!', 'Amazing!', 'Super fast!',
  'You are a star!', 'Awesome!', 'Fantastic!', 'Way to go!', 'Brilliant!',
];

export default function PatternRace({ carId, onFinish, onBack }) {
  var selectedCar = getCarById(carId);

  var problemsState = useState(function () {
    return generatePatternSet(TOTAL_PROBLEMS);
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

  var revealedState = useState(false);
  var revealed = revealedState[0];
  var setRevealed = revealedState[1];

  var speakingRef = useRef(false);

  var current = problems[currentIndex];
  var isFinished = currentIndex >= TOTAL_PROBLEMS;

  var speakText = useCallback(function (text) {
    if (speakingRef.current) window.speechSynthesis.cancel();
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
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
      }, 500);
      return function () { clearTimeout(timer); };
    }
  }, [currentIndex, isFinished]);

  useEffect(function () {
    return function () { window.speechSynthesis.cancel(); };
  }, []);

  var handleAnswer = useCallback(function (choiceItem) {
    if (feedback) return;

    if (choiceItem.id === current.answer.id) {
      setFeedback('correct');
      setRevealed(true);
      var enc = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
      speakText('Correct! ' + enc);

      setTimeout(function () {
        setFeedback(null);
        setRevealed(false);
        if (currentIndex + 1 >= TOTAL_PROBLEMS) {
          onFinish(totalWrong);
        } else {
          setCurrentIndex(function (i) { return i + 1; });
        }
      }, 1300);
    } else {
      setFeedback('wrong');
      setRevealed(true);
      setTotalWrong(function (w) { return w + 1; });
      speakText('Not quite! Look at the pattern!');

      setTimeout(function () {
        setFeedback(null);
        setRevealed(false);
        if (currentIndex + 1 >= TOTAL_PROBLEMS) {
          onFinish(totalWrong + 1);
        } else {
          setCurrentIndex(function (i) { return i + 1; });
        }
      }, 2000);
    }
  }, [current, currentIndex, feedback, totalWrong, onFinish, speakText]);

  var speakProblem = useCallback(function () {
    if (current) speakText(current.speakText);
  }, [current, speakText]);

  if (isFinished) return null;

  return (
    <div className="screen math-race-screen pattern-race-screen">
      <div className="race-top-bar">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <span className="race-problem-count">
          {currentIndex + 1} of {TOTAL_PROBLEMS}
        </span>
      </div>

      <RaceTrack progress={currentIndex} total={TOTAL_PROBLEMS} carImg={selectedCar.img} />

      <div className="pattern-sequence">
        {current.sequence.map(function (item, i) {
          return (
            <div key={i} className="pattern-seq-cell">
              <PatternItem item={item} size="medium" />
            </div>
          );
        })}
        <div className={'pattern-seq-cell pattern-seq-question' + (revealed ? ' pattern-seq-revealed' : '')}>
          {revealed ? (
            <PatternItem item={current.answer} size="medium" />
          ) : (
            <span className="pattern-question-mark">?</span>
          )}
        </div>
        <button className="pattern-speak-btn" onClick={speakProblem}>🔊</button>
      </div>

      <div className="pattern-choices">
        {current.choices.map(function (choice, i) {
          var isCorrect = feedback && choice.id === current.answer.id;
          var cls = 'pattern-choice-btn';
          if (isCorrect && feedback === 'correct') cls += ' pattern-choice-correct';
          if (isCorrect && feedback === 'wrong') cls += ' pattern-choice-highlight';

          return (
            <button
              key={i}
              className={cls}
              onClick={function () { handleAnswer(choice); }}
              disabled={feedback !== null}
            >
              <PatternItem item={choice} size="medium" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

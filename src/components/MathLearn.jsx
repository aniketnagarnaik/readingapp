import { useState, useCallback, useEffect, useRef } from 'react';
import CarCounting from './CarCounting';
import ColumnMethod from './ColumnMethod';
import { generateProblem, generateSolutionSteps, numberToWords } from '../utils/mathProblems';
import rustyImg from '../assets/rusty.png';

export default function MathLearn({ difficulty, operation, onBack }) {
  var modeState = useState('watch');
  var mode = modeState[0];
  var setMode = modeState[1];

  var problemState = useState(function () {
    return generateProblem(difficulty, operation);
  });
  var problem = problemState[0];
  var setProblem = problemState[1];

  var stepsState = useState(function () {
    var p = generateProblem(difficulty, operation);
    return generateSolutionSteps(p.num1, p.num2, p.operation, difficulty);
  });
  var steps = stepsState[0];
  var setSteps = stepsState[1];

  var stepIndexState = useState(0);
  var stepIndex = stepIndexState[0];
  var setStepIndex = stepIndexState[1];

  var tryAnswerState = useState(null);
  var tryAnswer = tryAnswerState[0];
  var setTryAnswer = tryAnswerState[1];

  var tryFeedbackState = useState(null);
  var tryFeedback = tryFeedbackState[0];
  var setTryFeedback = tryFeedbackState[1];

  var speakingRef = useRef(false);

  useEffect(function () {
    var p = generateProblem(difficulty, operation);
    setProblem(p);
    var s = generateSolutionSteps(p.num1, p.num2, p.operation, difficulty);
    setSteps(s);
    setStepIndex(0);
    setTryAnswer(null);
    setTryFeedback(null);
  }, [difficulty, operation]);

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

  var currentStep = steps[stepIndex];

  var handleNextStep = useCallback(function () {
    if (stepIndex < steps.length - 1) {
      var nextIdx = stepIndex + 1;
      setStepIndex(nextIdx);
      if (steps[nextIdx] && steps[nextIdx].ttsText) {
        speakText(steps[nextIdx].ttsText);
      }
    }
  }, [stepIndex, steps, speakText]);

  var handlePrevStep = useCallback(function () {
    if (stepIndex > 0) {
      setStepIndex(function (i) { return i - 1; });
    }
  }, [stepIndex]);

  var handleNewProblem = useCallback(function () {
    var p = generateProblem(difficulty, operation);
    setProblem(p);
    var s = generateSolutionSteps(p.num1, p.num2, p.operation, difficulty);
    setSteps(s);
    setStepIndex(0);
    setTryAnswer(null);
    setTryFeedback(null);
  }, [difficulty, operation]);

  var handleSpeakStep = useCallback(function () {
    if (currentStep && currentStep.ttsText) {
      speakText(currentStep.ttsText);
    }
  }, [currentStep, speakText]);

  var handleTryAnswer = useCallback(function (choice) {
    if (choice === problem.answer) {
      setTryAnswer(choice);
      setTryFeedback('correct');
      speakText('You got it! Vroom vroom!');
    } else {
      setTryFeedback('wrong-' + choice);
      speakText("Almost! Let's count together!");
      setTimeout(function () {
        setTryFeedback(null);
      }, 1000);
    }
  }, [problem, speakText]);

  var handleSwitchMode = useCallback(function (newMode) {
    setMode(newMode);
    handleNewProblem();
  }, [handleNewProblem]);

  useEffect(function () {
    return function () {
      window.speechSynthesis.cancel();
    };
  }, []);

  var isLastStep = stepIndex === steps.length - 1;

  return (
    <div className="screen math-learn-screen">
      <button className="back-btn" onClick={onBack}>← Back</button>

      <div className="learn-header">
        <img src={rustyImg} alt="Rusty" className="learn-rusty" />
        <h2 className="learn-title">Speedy's Garage</h2>
      </div>

      <div className="learn-mode-toggle">
        <button
          className={'learn-mode-btn' + (mode === 'watch' ? ' learn-mode-active' : '')}
          onClick={function () { handleSwitchMode('watch'); }}
        >
          👀 Watch Me
        </button>
        <button
          className={'learn-mode-btn' + (mode === 'try' ? ' learn-mode-active' : '')}
          onClick={function () { handleSwitchMode('try'); }}
        >
          ✋ Your Turn
        </button>
      </div>

      {mode === 'watch' && (
        <div className="learn-watch">
          <div className="learn-problem-display">
            <span className="learn-problem-text">
              {problem.num1} {problem.symbol} {problem.num2} = ?
            </span>
          </div>

          {currentStep && (
            <div className="learn-step-area">
              <p className="learn-step-desc">{currentStep.description}</p>

              <button className="learn-speak-btn" onClick={handleSpeakStep}>
                🔊 Listen
              </button>

              {(currentStep.type === 'show_group1' || currentStep.type === 'show_group2' ||
                currentStep.type === 'merge' || currentStep.type === 'count_all' ||
                currentStep.type === 'remove' || currentStep.type === 'count_remaining') && (
                <CarCounting step={currentStep} />
              )}

              {(currentStep.type === 'column_intro' || currentStep.type === 'column_step' ||
                currentStep.type === 'column_borrow' || currentStep.type === 'column_answer') && (
                <ColumnMethod step={currentStep} />
              )}

              {currentStep.type === 'answer' || currentStep.type === 'column_answer' ? (
                <div className="learn-answer-reveal">
                  <span className="learn-answer-big">
                    {problem.num1} {problem.symbol} {problem.num2} = {currentStep.answer}
                  </span>
                </div>
              ) : null}
            </div>
          )}

          <div className="learn-nav-buttons">
            <button
              className="learn-nav-btn"
              onClick={handlePrevStep}
              disabled={stepIndex === 0}
            >
              ← Previous
            </button>
            <span className="learn-step-indicator">
              Step {stepIndex + 1} of {steps.length}
            </span>
            {isLastStep ? (
              <button className="learn-nav-btn learn-new-btn" onClick={handleNewProblem}>
                New Problem ✨
              </button>
            ) : (
              <button className="learn-nav-btn" onClick={handleNextStep}>
                Next Step →
              </button>
            )}
          </div>
        </div>
      )}

      {mode === 'try' && (
        <div className="learn-try">
          <div className="learn-problem-display">
            <span className="learn-problem-text">
              {problem.num1} {problem.symbol} {problem.num2} = ?
            </span>
          </div>

          {difficulty === 'easy' && (
            <CarCounting step={{
              type: 'show_group1',
              count: problem.num1,
              color: 'red',
            }} />
          )}
          {difficulty === 'easy' && (
            <CarCounting step={{
              type: 'show_group2',
              count: problem.num2,
              color: 'blue',
            }} />
          )}

          {difficulty !== 'easy' && (
            <ColumnMethod step={{
              num1: problem.num1,
              num2: problem.num2,
              symbol: problem.symbol,
              answerDigits: tryAnswer != null ? String(problem.answer).split('').map(Number).reverse() : [],
              carries: [],
              borrows: [],
              currentColumn: -1,
            }} />
          )}

          {tryFeedback !== 'correct' ? (
            <div className="try-choices">
              <p className="try-prompt">Pick the answer:</p>
              <div className="try-choices-grid">
                {problem.choices.map(function (choice, i) {
                  var isWrong = tryFeedback === 'wrong-' + choice;
                  var cls = 'try-choice-btn';
                  if (isWrong) cls += ' try-choice-wrong';
                  return (
                    <button
                      key={i}
                      className={cls}
                      onClick={function () { handleTryAnswer(choice); }}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="try-correct-display">
              <span className="try-correct-text">
                {problem.num1} {problem.symbol} {problem.num2} = {problem.answer}
              </span>
              <span className="try-correct-emoji">🎉</span>
              <button className="learn-nav-btn learn-new-btn" onClick={handleNewProblem}>
                Next Problem ✨
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

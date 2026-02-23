import { useState, useCallback } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './components/LandingPage';
import HomeScreen from './components/HomeScreen';
import PhotoUpload from './components/PhotoUpload';
import TextInput from './components/TextInput';
import SampleStories from './components/SampleStories';
import ReaderView from './components/ReaderView';
import MathHome from './components/MathHome';
import MathLearn from './components/MathLearn';
import MathCountdown from './components/MathCountdown';
import MathRace from './components/MathRace';
import MathResults from './components/MathResults';
import { parseTextIntoPages } from './utils/textParser';

export default function App() {
  var screenState = useState('landing');
  var currentScreen = screenState[0];
  var setScreen = screenState[1];

  var pagesState = useState([]);
  var pages = pagesState[0];
  var setPages = pagesState[1];

  var mathDiffState = useState('easy');
  var mathDifficulty = mathDiffState[0];
  var setMathDifficulty = mathDiffState[1];

  var mathOpState = useState('addition');
  var mathOperation = mathOpState[0];
  var setMathOperation = mathOpState[1];

  var mathWrongState = useState(0);
  var mathTotalWrong = mathWrongState[0];
  var setMathTotalWrong = mathWrongState[1];

  var handleTextReady = useCallback(function (text) {
    var parsed = parseTextIntoPages(text);
    if (parsed.length > 0) {
      setPages(parsed);
      setScreen('reader');
    }
  }, []);

  var handleBackToLanding = useCallback(function () {
    setScreen('landing');
    setPages([]);
  }, []);

  var handleBackToReadingHome = useCallback(function () {
    setScreen('home');
    setPages([]);
  }, []);

  var handleStartRace = useCallback(function (difficulty, operation) {
    setMathDifficulty(difficulty);
    setMathOperation(operation);
    setScreen('mathCountdown');
  }, []);

  var handleStartLearn = useCallback(function (difficulty, operation) {
    setMathDifficulty(difficulty);
    setMathOperation(operation);
    setScreen('mathLearn');
  }, []);

  var handleRaceFinish = useCallback(function (totalWrong) {
    setMathTotalWrong(totalWrong);
    setScreen('mathResults');
  }, []);

  return (
    <ErrorBoundary>
      <div className="app">
        {currentScreen === 'landing' && (
          <LandingPage
            onChooseReading={function () { setScreen('home'); }}
            onChooseMath={function () { setScreen('mathHome'); }}
          />
        )}
        {currentScreen === 'home' && (
          <HomeScreen
            onChoosePhoto={function () { setScreen('photo'); }}
            onChooseText={function () { setScreen('text'); }}
            onChooseSamples={function () { setScreen('samples'); }}
            onBack={handleBackToLanding}
          />
        )}
        {currentScreen === 'photo' && (
          <PhotoUpload
            onTextReady={handleTextReady}
            onBack={function () { setScreen('home'); }}
          />
        )}
        {currentScreen === 'text' && (
          <TextInput
            onTextReady={handleTextReady}
            onBack={function () { setScreen('home'); }}
          />
        )}
        {currentScreen === 'samples' && (
          <SampleStories
            onTextReady={handleTextReady}
            onBack={function () { setScreen('home'); }}
          />
        )}
        {currentScreen === 'reader' && (
          <ErrorBoundary>
            <ReaderView
              pages={pages}
              onBack={handleBackToReadingHome}
            />
          </ErrorBoundary>
        )}
        {currentScreen === 'mathHome' && (
          <MathHome
            onStartRace={handleStartRace}
            onStartLearn={handleStartLearn}
            onBack={handleBackToLanding}
          />
        )}
        {currentScreen === 'mathLearn' && (
          <ErrorBoundary>
            <MathLearn
              difficulty={mathDifficulty}
              operation={mathOperation}
              onBack={function () { setScreen('mathHome'); }}
            />
          </ErrorBoundary>
        )}
        {currentScreen === 'mathCountdown' && (
          <MathCountdown
            onDone={function () { setScreen('mathRace'); }}
          />
        )}
        {currentScreen === 'mathRace' && (
          <ErrorBoundary>
            <MathRace
              difficulty={mathDifficulty}
              operation={mathOperation}
              onFinish={handleRaceFinish}
              onBack={function () { setScreen('mathHome'); }}
            />
          </ErrorBoundary>
        )}
        {currentScreen === 'mathResults' && (
          <MathResults
            totalWrong={mathTotalWrong}
            onRaceAgain={function () { setScreen('mathHome'); }}
            onHome={handleBackToLanding}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

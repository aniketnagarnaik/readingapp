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
import CharacterSelect from './components/CharacterSelect';
import MathCountdown from './components/MathCountdown';
import MathRace from './components/MathRace';
import TwoPlayerRace from './components/TwoPlayerRace';
import MathResults from './components/MathResults';
import { getCarById } from './utils/carCharacters';
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

  var playerCountState = useState(1);
  var playerCount = playerCountState[0];
  var setPlayerCount = playerCountState[1];

  var p1CarState = useState('speedy');
  var p1CarId = p1CarState[0];
  var setP1CarId = p1CarState[1];

  var p2CarState = useState('turbo');
  var p2CarId = p2CarState[0];
  var setP2CarId = p2CarState[1];

  var p1ScoreState = useState(0);
  var p1Score = p1ScoreState[0];
  var setP1Score = p1ScoreState[1];

  var p2ScoreState = useState(0);
  var p2Score = p2ScoreState[0];
  var setP2Score = p2ScoreState[1];

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

  var handleStartRace = useCallback(function (difficulty, operation, pCount) {
    setMathDifficulty(difficulty);
    setMathOperation(operation);
    setPlayerCount(pCount || 1);
    setScreen('charSelect');
  }, []);

  var handleStartLearn = useCallback(function (difficulty, operation) {
    setMathDifficulty(difficulty);
    setMathOperation(operation);
    setScreen('mathLearn');
  }, []);

  var handleCharactersDone = useCallback(function (car1, car2) {
    setP1CarId(car1);
    if (car2) setP2CarId(car2);
    setScreen('mathCountdown');
  }, []);

  var handleCountdownDone = useCallback(function () {
    if (playerCount === 2) {
      setScreen('mathRace2P');
    } else {
      setScreen('mathRace');
    }
  }, [playerCount]);

  var handleRaceFinish = useCallback(function (totalWrong) {
    setMathTotalWrong(totalWrong);
    setP1Score(0);
    setP2Score(0);
    setScreen('mathResults');
  }, []);

  var handleTwoPlayerFinish = useCallback(function (score1, score2) {
    setP1Score(score1);
    setP2Score(score2);
    setScreen('mathResults');
  }, []);

  var p1CarImg = getCarById(p1CarId).img;
  var p2CarImg = getCarById(p2CarId).img;

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
        {currentScreen === 'charSelect' && (
          <CharacterSelect
            playerCount={playerCount}
            onDone={handleCharactersDone}
            onBack={function () { setScreen('mathHome'); }}
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
            onDone={handleCountdownDone}
            carImg={p1CarImg}
            carImg2={playerCount === 2 ? p2CarImg : undefined}
          />
        )}
        {currentScreen === 'mathRace' && (
          <ErrorBoundary>
            <MathRace
              difficulty={mathDifficulty}
              operation={mathOperation}
              carId={p1CarId}
              onFinish={handleRaceFinish}
              onBack={function () { setScreen('mathHome'); }}
            />
          </ErrorBoundary>
        )}
        {currentScreen === 'mathRace2P' && (
          <ErrorBoundary>
            <TwoPlayerRace
              difficulty={mathDifficulty}
              operation={mathOperation}
              p1CarId={p1CarId}
              p2CarId={p2CarId}
              onFinish={handleTwoPlayerFinish}
              onBack={function () { setScreen('mathHome'); }}
            />
          </ErrorBoundary>
        )}
        {currentScreen === 'mathResults' && (
          <MathResults
            totalWrong={mathTotalWrong}
            p1Score={p1Score}
            p2Score={p2Score}
            p1CarId={p1CarId}
            p2CarId={p2CarId}
            playerCount={playerCount}
            onRaceAgain={function () { setScreen('mathHome'); }}
            onHome={handleBackToLanding}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

import { useState, useCallback } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import HomeScreen from './components/HomeScreen';
import PhotoUpload from './components/PhotoUpload';
import TextInput from './components/TextInput';
import SampleStories from './components/SampleStories';
import ReaderView from './components/ReaderView';
import { parseTextIntoPages } from './utils/textParser';

export default function App() {
  var screen = useState('home');
  var currentScreen = screen[0];
  var setScreen = screen[1];

  var pagesState = useState([]);
  var pages = pagesState[0];
  var setPages = pagesState[1];

  var handleTextReady = useCallback(function (text) {
    var parsed = parseTextIntoPages(text);
    if (parsed.length > 0) {
      setPages(parsed);
      setScreen('reader');
    }
  }, []);

  var handleBack = useCallback(function () {
    setScreen('home');
    setPages([]);
  }, []);

  return (
    <ErrorBoundary>
      <div className="app">
        {currentScreen === 'home' && (
          <HomeScreen
            onChoosePhoto={function () { setScreen('photo'); }}
            onChooseText={function () { setScreen('text'); }}
            onChooseSamples={function () { setScreen('samples'); }}
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
              onBack={handleBack}
            />
          </ErrorBoundary>
        )}
      </div>
    </ErrorBoundary>
  );
}

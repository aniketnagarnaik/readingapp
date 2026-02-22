import { useState, useCallback } from 'react';
import HomeScreen from './components/HomeScreen';
import PhotoUpload from './components/PhotoUpload';
import TextInput from './components/TextInput';
import SampleStories from './components/SampleStories';
import ReaderView from './components/ReaderView';
import { parseTextIntoPages } from './utils/textParser';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [pages, setPages] = useState([]);

  const handleTextReady = useCallback((text) => {
    const parsed = parseTextIntoPages(text);
    if (parsed.length > 0) {
      setPages(parsed);
      setScreen('reader');
    }
  }, []);

  const handleBack = useCallback(() => {
    setScreen('home');
    setPages([]);
  }, []);

  return (
    <div className="app">
      {screen === 'home' && (
        <HomeScreen
          onChoosePhoto={() => setScreen('photo')}
          onChooseText={() => setScreen('text')}
          onChooseSamples={() => setScreen('samples')}
        />
      )}
      {screen === 'photo' && (
        <PhotoUpload
          onTextReady={handleTextReady}
          onBack={() => setScreen('home')}
        />
      )}
      {screen === 'text' && (
        <TextInput
          onTextReady={handleTextReady}
          onBack={() => setScreen('home')}
        />
      )}
      {screen === 'samples' && (
        <SampleStories
          onTextReady={handleTextReady}
          onBack={() => setScreen('home')}
        />
      )}
      {screen === 'reader' && (
        <ReaderView
          pages={pages}
          onBack={handleBack}
        />
      )}
    </div>
  );
}

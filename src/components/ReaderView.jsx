import { useState, useCallback, useEffect } from 'react';
import WordDisplay from './WordDisplay';
import PlayButton from './PlayButton';
import PageNavigation from './PageNavigation';
import { useTTS } from '../hooks/useTTS';
import { splitSentenceIntoWords } from '../utils/textParser';

const PAUSE_STEPS = [3000, 2500, 2000, 1500, 1000, 700, 400, 200, 100, 50, 0];
const PAUSE_LABELS = ['Slowest', 'Very Slow', 'Slower', 'Slow', 'Medium', 'Normal', 'Fast', 'Faster', 'Quick', 'Rapid', 'No Gap'];
const DEFAULT_PAUSE_INDEX = 3;

export default function ReaderView({ pages, onBack }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const [pauseIndex, setPauseIndex] = useState(DEFAULT_PAUSE_INDEX);
  const [selectedVoiceName, setSelectedVoiceName] = useState('');
  const [showVoices, setShowVoices] = useState(false);
  const [mode, setMode] = useState('word');
  const { speakWordByWord, speakNatural, stop, isPlaying, voices, setPause, setVoice, currentVoice } = useTTS();

  const currentSentence = pages[currentPage] || '';
  const words = splitSentenceIntoWords(currentSentence);

  useEffect(() => {
    setPause(PAUSE_STEPS[pauseIndex]);
  }, [pauseIndex, setPause]);

  useEffect(() => {
    if (currentVoice.current && !selectedVoiceName) {
      setSelectedVoiceName(currentVoice.current.name);
    }
  }, [voices, currentVoice, selectedVoiceName]);

  const handleSlower = () => {
    setPauseIndex((i) => Math.max(0, i - 1));
  };

  const handleFaster = () => {
    setPauseIndex((i) => Math.min(PAUSE_STEPS.length - 1, i + 1));
  };

  const handleVoiceChange = (voice) => {
    setVoice(voice);
    setSelectedVoiceName(voice.name);
    setShowVoices(false);
  };

  const handlePlay = useCallback(() => {
    const onWord = (wordIdx) => setActiveWordIndex(wordIdx);
    const onDone = () => setActiveWordIndex(-1);

    if (mode === 'natural') {
      speakNatural(currentSentence, onWord, onDone);
    } else {
      speakWordByWord(currentSentence, onWord, onDone);
    }
  }, [mode, speakWordByWord, speakNatural, currentSentence]);

  const handleStop = useCallback(() => {
    stop();
    setActiveWordIndex(-1);
  }, [stop]);

  const handlePrevWord = () => {
    if (isPlaying) return;
    setActiveWordIndex((prev) => {
      if (prev <= 0) return 0;
      return prev - 1;
    });
  };

  const handleNextWord = () => {
    if (isPlaying) return;
    setActiveWordIndex((prev) => {
      if (prev >= words.length - 1) return words.length - 1;
      if (prev < 0) return 0;
      return prev + 1;
    });
  };

  const handlePrevPage = () => {
    handleStop();
    setCurrentPage((p) => Math.max(0, p - 1));
    setActiveWordIndex(-1);
  };

  const handleNextPage = () => {
    handleStop();
    setCurrentPage((p) => Math.min(pages.length - 1, p + 1));
    setActiveWordIndex(-1);
  };

  const handleToggleMode = () => {
    if (isPlaying) handleStop();
    setMode((m) => (m === 'word' ? 'natural' : 'word'));
  };

  return (
    <div className="screen reader-screen">
      <div className="reader-top-bar">
        <button className="back-btn home-back-btn" onClick={onBack}>
          ← Home
        </button>

        <div className="top-controls">
          {mode === 'word' && (
            <div className="speed-control">
              <button
                className="speed-btn"
                onClick={handleSlower}
                disabled={pauseIndex <= 0}
              >
                −
              </button>
              <span className="speed-label">{PAUSE_LABELS[pauseIndex]}</span>
              <button
                className="speed-btn"
                onClick={handleFaster}
                disabled={pauseIndex >= PAUSE_STEPS.length - 1}
              >
                +
              </button>
            </div>
          )}

          <button
            className={`mode-toggle-btn ${mode === 'natural' ? 'mode-active' : ''}`}
            onClick={handleToggleMode}
          >
            {mode === 'word' ? '🐢 Word' : '🌊 Natural'}
          </button>

          <button
            className="voice-toggle-btn"
            onClick={() => setShowVoices(!showVoices)}
          >
            🎤 Voice
          </button>
        </div>
      </div>

      {showVoices && (
        <div className="voice-picker">
          {voices.map((voice) => (
            <button
              key={voice.name}
              className={`voice-option ${voice.name === selectedVoiceName ? 'voice-active' : ''}`}
              onClick={() => handleVoiceChange(voice)}
            >
              {voice.name}
            </button>
          ))}
        </div>
      )}

      <div className="reader-content">
        <WordDisplay
          sentence={currentSentence}
          activeWordIndex={activeWordIndex}
        />

        <div className="word-controls">
          <button
            className="word-nav-btn"
            onClick={handlePrevWord}
            disabled={isPlaying || activeWordIndex <= 0}
          >
            ◀
          </button>

          <PlayButton
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onStop={handleStop}
          />

          <button
            className="word-nav-btn"
            onClick={handleNextWord}
            disabled={isPlaying || activeWordIndex >= words.length - 1}
          >
            ▶
          </button>
        </div>
      </div>

      <PageNavigation
        currentPage={currentPage}
        totalPages={pages.length}
        onPrev={handlePrevPage}
        onNext={handleNextPage}
      />
    </div>
  );
}

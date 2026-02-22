import { useState, useCallback, useEffect } from 'react';
import WordDisplay from './WordDisplay';
import PageNavigation from './PageNavigation';
import TapButton from './TapButton';
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
  const { speakWordByWord, speakNatural, speakOneWord, stop, isPlaying, voices, setPause, setVoice, currentVoice } = useTTS();

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

  const handleSlower = useCallback(() => setPauseIndex((i) => Math.max(0, i - 1)), []);
  const handleFaster = useCallback(() => setPauseIndex((i) => Math.min(PAUSE_STEPS.length - 1, i + 1)), []);

  const handleVoiceChange = useCallback((voice) => {
    setVoice(voice);
    setSelectedVoiceName(voice.name);
    setShowVoices(false);
  }, [setVoice]);

  const handlePlaySentence = useCallback(() => {
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

  const handleSpeakWord = useCallback(() => {
    if (isPlaying) return;
    const idx = activeWordIndex >= 0 ? activeWordIndex : 0;
    if (idx < words.length) {
      setActiveWordIndex(idx);
      speakOneWord(words[idx]);
    }
  }, [isPlaying, activeWordIndex, words, speakOneWord]);

  const handlePrevWord = useCallback(() => {
    if (isPlaying) return;
    setActiveWordIndex((prev) => (prev <= 0 ? 0 : prev - 1));
  }, [isPlaying]);

  const handleNextWord = useCallback(() => {
    if (isPlaying) return;
    setActiveWordIndex((prev) => {
      if (prev >= words.length - 1) return words.length - 1;
      if (prev < 0) return 0;
      return prev + 1;
    });
  }, [isPlaying, words.length]);

  const handlePrevPage = useCallback(() => {
    handleStop();
    setCurrentPage((p) => Math.max(0, p - 1));
    setActiveWordIndex(-1);
  }, [handleStop]);

  const handleNextPage = useCallback(() => {
    handleStop();
    setCurrentPage((p) => Math.min(pages.length - 1, p + 1));
    setActiveWordIndex(-1);
  }, [handleStop, pages.length]);

  const handleToggleMode = useCallback(() => {
    if (isPlaying) handleStop();
    setMode((m) => (m === 'word' ? 'natural' : 'word'));
  }, [isPlaying, handleStop]);

  const toggleVoices = useCallback(() => setShowVoices((v) => !v), []);

  return (
    <div className="screen reader-screen">
      <div className="reader-top-bar">
        <TapButton className="back-btn home-back-btn" onClick={onBack}>
          ← Home
        </TapButton>

        <div className="top-controls">
          {mode === 'word' && (
            <div className="speed-control">
              <TapButton className="speed-btn" onClick={handleSlower} disabled={pauseIndex <= 0}>−</TapButton>
              <span className="speed-label">{PAUSE_LABELS[pauseIndex]}</span>
              <TapButton className="speed-btn" onClick={handleFaster} disabled={pauseIndex >= PAUSE_STEPS.length - 1}>+</TapButton>
            </div>
          )}

          <TapButton className={`mode-toggle-btn ${mode === 'natural' ? 'mode-active' : ''}`} onClick={handleToggleMode}>
            {mode === 'word' ? '🐢 Word' : '🌊 Natural'}
          </TapButton>

          <TapButton className="voice-toggle-btn" onClick={toggleVoices}>
            🎤 Voice
          </TapButton>
        </div>
      </div>

      {showVoices && (
        <div className="voice-picker">
          {voices.map((voice) => (
            <TapButton
              key={voice.name}
              className={`voice-option ${voice.name === selectedVoiceName ? 'voice-active' : ''}`}
              onClick={() => handleVoiceChange(voice)}
            >
              {voice.name}
            </TapButton>
          ))}
        </div>
      )}

      <div className="reader-content">
        <WordDisplay sentence={currentSentence} activeWordIndex={activeWordIndex} />

        <div className="word-controls">
          <TapButton className="word-nav-btn" onClick={handlePrevWord} disabled={isPlaying || activeWordIndex <= 0}>◀</TapButton>
          <TapButton className="speak-word-btn" onClick={handleSpeakWord} disabled={isPlaying}>🔊 Word</TapButton>
          <TapButton className="word-nav-btn" onClick={handleNextWord} disabled={isPlaying || activeWordIndex >= words.length - 1}>▶</TapButton>
        </div>

        <TapButton
          className={`play-btn ${isPlaying ? 'playing' : ''}`}
          onClick={isPlaying ? handleStop : handlePlaySentence}
        >
          <span className="play-btn-icon">{isPlaying ? '⏹' : '▶️'}</span>
          <span className="play-btn-label">{isPlaying ? 'Stop' : 'Listen'}</span>
        </TapButton>
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

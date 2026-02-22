import { useState, useCallback, useEffect } from 'react';
import WordDisplay from './WordDisplay';
import PageNavigation from './PageNavigation';
import TapButton from './TapButton';
import { useTTS } from '../hooks/useTTS';
import { splitSentenceIntoWords } from '../utils/textParser';

var PAUSE_STEPS = [3000, 2500, 2000, 1500, 1000, 700, 400, 200, 100, 50, 0];
var PAUSE_LABELS = ['Slowest', 'Very Slow', 'Slower', 'Slow', 'Medium', 'Normal', 'Fast', 'Faster', 'Quick', 'Rapid', 'No Gap'];

export default function ReaderView(props) {
  var pages = props.pages;
  var onBack = props.onBack;

  var pageState = useState(0);
  var currentPage = pageState[0];
  var setCurrentPage = pageState[1];

  var wordState = useState(-1);
  var activeWordIndex = wordState[0];
  var setActiveWordIndex = wordState[1];

  var pauseState = useState(3);
  var pauseIndex = pauseState[0];
  var setPauseIndex = pauseState[1];

  var voiceNameState = useState('');
  var selectedVoiceName = voiceNameState[0];
  var setSelectedVoiceName = voiceNameState[1];

  var voicesVisState = useState(false);
  var showVoices = voicesVisState[0];
  var setShowVoices = voicesVisState[1];

  var modeState = useState('word');
  var mode = modeState[0];
  var setMode = modeState[1];

  var tts = useTTS();

  var currentSentence = pages[currentPage] || '';
  var words = splitSentenceIntoWords(currentSentence);

  useEffect(function () {
    tts.setPause(PAUSE_STEPS[pauseIndex]);
  }, [pauseIndex]);

  useEffect(function () {
    if (tts.currentVoice.current && !selectedVoiceName) {
      setSelectedVoiceName(tts.currentVoice.current.name);
    }
  }, [tts.voices]);

  function handleSlower() {
    setPauseIndex(function (i) { return Math.max(0, i - 1); });
  }

  function handleFaster() {
    setPauseIndex(function (i) { return Math.min(PAUSE_STEPS.length - 1, i + 1); });
  }

  function handleVoiceChange(voice) {
    tts.setVoice(voice);
    setSelectedVoiceName(voice.name);
    setShowVoices(false);
  }

  function handlePlaySentence() {
    function onWord(wordIdx) { setActiveWordIndex(wordIdx); }
    function onDone() { setActiveWordIndex(-1); }
    if (mode === 'natural') {
      tts.speakNatural(currentSentence, onWord, onDone);
    } else {
      tts.speakWordByWord(currentSentence, onWord, onDone);
    }
  }

  function handleStop() {
    tts.stop();
    setActiveWordIndex(-1);
  }

  function handleSpeakWord() {
    if (tts.isPlaying) return;
    var idx = activeWordIndex >= 0 ? activeWordIndex : 0;
    if (idx < words.length) {
      setActiveWordIndex(idx);
      tts.speakOneWord(words[idx]);
    }
  }

  function handlePrevWord() {
    if (tts.isPlaying) return;
    setActiveWordIndex(function (prev) { return prev <= 0 ? 0 : prev - 1; });
  }

  function handleNextWord() {
    if (tts.isPlaying) return;
    setActiveWordIndex(function (prev) {
      if (prev >= words.length - 1) return words.length - 1;
      if (prev < 0) return 0;
      return prev + 1;
    });
  }

  function handlePrevPage() {
    handleStop();
    setCurrentPage(function (p) { return Math.max(0, p - 1); });
    setActiveWordIndex(-1);
  }

  function handleNextPage() {
    handleStop();
    setCurrentPage(function (p) { return Math.min(pages.length - 1, p + 1); });
    setActiveWordIndex(-1);
  }

  function handleToggleMode() {
    if (tts.isPlaying) handleStop();
    setMode(function (m) { return m === 'word' ? 'natural' : 'word'; });
  }

  function toggleVoices() {
    setShowVoices(function (v) { return !v; });
  }

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

          <TapButton className={'mode-toggle-btn' + (mode === 'natural' ? ' mode-active' : '')} onClick={handleToggleMode}>
            {mode === 'word' ? '🐢 Word' : '🌊 Natural'}
          </TapButton>

          <TapButton className="voice-toggle-btn" onClick={toggleVoices}>
            🎤 Voice
          </TapButton>
        </div>
      </div>

      {showVoices && (
        <div className="voice-picker">
          {tts.voices.map(function (voice) {
            return (
              <TapButton
                key={voice.name}
                className={'voice-option' + (voice.name === selectedVoiceName ? ' voice-active' : '')}
                onClick={function () { handleVoiceChange(voice); }}
              >
                {voice.name}
              </TapButton>
            );
          })}
        </div>
      )}

      <div className="reader-content">
        <WordDisplay sentence={currentSentence} activeWordIndex={activeWordIndex} />

        <div className="word-controls">
          <TapButton className="word-nav-btn" onClick={handlePrevWord} disabled={tts.isPlaying || activeWordIndex <= 0}>◀</TapButton>
          <TapButton className="speak-word-btn" onClick={handleSpeakWord} disabled={tts.isPlaying}>🔊 Word</TapButton>
          <TapButton className="word-nav-btn" onClick={handleNextWord} disabled={tts.isPlaying || activeWordIndex >= words.length - 1}>▶</TapButton>
        </div>

        <TapButton
          className={'play-btn' + (tts.isPlaying ? ' playing' : '')}
          onClick={tts.isPlaying ? handleStop : handlePlaySentence}
        >
          <span className="play-btn-icon">{tts.isPlaying ? '⏹' : '▶️'}</span>
          <span className="play-btn-label">{tts.isPlaying ? 'Stop' : 'Listen'}</span>
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

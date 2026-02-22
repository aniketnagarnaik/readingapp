import { useState, useCallback, useRef, useEffect } from 'react';

export function useTTS() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState([]);
  const pauseRef = useRef(1500);
  const voiceRef = useRef(null);
  const cancelledRef = useRef(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      const englishVoices = allVoices.filter((v) => v.lang.startsWith('en'));
      setVoices(englishVoices);

      if (!voiceRef.current && englishVoices.length > 0) {
        const aaron = englishVoices.find((v) => v.name.includes('Aaron'));
        const samantha = englishVoices.find((v) => v.name.includes('Samantha'));
        voiceRef.current = aaron || samantha || englishVoices[1] || englishVoices[0];
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis.cancel();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const setPause = useCallback((ms) => {
    pauseRef.current = ms;
  }, []);

  const setVoice = useCallback((voice) => {
    voiceRef.current = voice;
  }, []);

  const prepareWord = useCallback((word) => {
    if (word.length === 1 && /[a-zA-Z]/.test(word)) {
      return word + '.';
    }
    return word;
  }, []);

  const speakWord = useCallback(
    (word) =>
      new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(prepareWord(word));
        utterance.rate = 0.85;
        utterance.pitch = 1.0;
        if (voiceRef.current) utterance.voice = voiceRef.current;
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        window.speechSynthesis.speak(utterance);
      }),
    [prepareWord]
  );

  const speakWordByWord = useCallback(
    (text, onWordChange, onDone) => {
      window.speechSynthesis.cancel();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      cancelledRef.current = false;

      const words = text.split(/\s+/).filter((w) => w.length > 0);
      if (words.length === 0) return;

      setIsPlaying(true);

      const playWord = async (index) => {
        if (cancelledRef.current || index >= words.length) {
          setIsPlaying(false);
          if (onDone && !cancelledRef.current) onDone();
          return;
        }

        if (onWordChange) onWordChange(index);
        await speakWord(words[index]);

        if (cancelledRef.current) {
          setIsPlaying(false);
          return;
        }

        if (index < words.length - 1) {
          timeoutRef.current = setTimeout(() => {
            playWord(index + 1);
          }, pauseRef.current);
        } else {
          timeoutRef.current = setTimeout(() => {
            setIsPlaying(false);
            if (onDone) onDone();
          }, 300);
        }
      };

      playWord(0);
    },
    [speakWord]
  );

  const buildWordMap = useCallback((text) => {
    const words = [];
    const regex = /\S+/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      words.push({ start: match.index, end: match.index + match[0].length });
    }
    return words;
  }, []);

  const speakNatural = useCallback(
    (text, onWordChange, onDone) => {
      window.speechSynthesis.cancel();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      cancelledRef.current = false;

      const wordMap = buildWordMap(text);
      if (wordMap.length === 0) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      if (voiceRef.current) utterance.voice = voiceRef.current;

      if (onWordChange) onWordChange(0);

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          for (let i = 0; i < wordMap.length; i++) {
            if (event.charIndex >= wordMap[i].start && event.charIndex < wordMap[i].end) {
              if (onWordChange) onWordChange(i);
              break;
            }
          }
        }
      };

      utterance.onend = () => {
        setIsPlaying(false);
        if (onDone && !cancelledRef.current) onDone();
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    },
    [buildWordMap]
  );

  const stop = useCallback(() => {
    cancelledRef.current = true;
    window.speechSynthesis.cancel();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsPlaying(false);
  }, []);

  const speakOneWord = useCallback((word) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(prepareWord(word));
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    if (voiceRef.current) utterance.voice = voiceRef.current;
    window.speechSynthesis.speak(utterance);
  }, [prepareWord]);

  return {
    speakWordByWord,
    speakNatural,
    speakOneWord,
    stop,
    isPlaying,
    voices,
    setPause,
    setVoice,
    currentVoice: voiceRef,
  };
}

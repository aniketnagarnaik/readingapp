import { splitSentenceIntoWords } from '../utils/textParser';

export default function WordDisplay({ sentence, activeWordIndex }) {
  const words = splitSentenceIntoWords(sentence);

  return (
    <div className="word-display">
      {words.map((word, index) => {
        const isActive = index === activeWordIndex;
        const hasActive = activeWordIndex >= 0;

        return (
          <span
            key={index}
            className={`word ${isActive ? 'word-active' : ''} ${
              hasActive && !isActive ? 'word-inactive' : ''
            }`}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
}

import { useCallback } from 'react';
import { SAMPLE_STORIES } from '../utils/sampleStories';
import TapButton from './TapButton';

export default function SampleStories({ onTextReady, onBack }) {
  const handlePick = useCallback((story, e) => {
    e.preventDefault();
    onTextReady(story.text);
  }, [onTextReady]);

  return (
    <div className="screen samples-screen">
      <TapButton className="back-btn" onClick={onBack}>
        ← Back
      </TapButton>

      <h2>Pick a Story</h2>
      <p>Tap a story to start reading!</p>

      <div className="stories-grid">
        {SAMPLE_STORIES.map((story, i) => (
          <a
            key={i}
            href="#"
            className="story-card"
            onClick={(e) => handlePick(story, e)}
          >
            <span className="story-number">{i + 1}</span>
            <span className="story-title">{story.title}</span>
            <span className="story-preview">
              {story.text.slice(0, 60)}...
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

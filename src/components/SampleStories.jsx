import { useCallback } from 'react';
import { SAMPLE_STORIES } from '../utils/sampleStories';

export default function SampleStories({ onTextReady, onBack }) {
  const handlePick = useCallback((story) => {
    onTextReady(story.text);
  }, [onTextReady]);

  return (
    <div className="screen samples-screen" onClick={() => {}}>
      <button className="back-btn" onClick={onBack}>
        ← Back
      </button>

      <h2>Pick a Story</h2>
      <p>Choose a story to start reading!</p>

      <div className="stories-grid">
        {SAMPLE_STORIES.map((story, i) => (
          <button
            key={i}
            className="story-card"
            onClick={() => handlePick(story)}
          >
            <span className="story-number">{i + 1}</span>
            <span className="story-title">{story.title}</span>
            <span className="story-preview">
              {story.text.slice(0, 60)}...
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

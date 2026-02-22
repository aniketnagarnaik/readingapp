import { useState } from 'react';

export default function TextInput({ onTextReady, onBack }) {
  const [text, setText] = useState('');

  const handleStartReading = () => {
    if (text.trim()) {
      onTextReady(text);
    }
  };

  return (
    <div className="screen text-input-screen">
      <button className="back-btn" onClick={onBack}>
        ← Back
      </button>

      <h2>Paste a Story</h2>
      <p>Copy and paste any story or text below</p>

      <textarea
        className="story-textarea"
        placeholder="Paste your story here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
      />

      <button
        className="primary-btn"
        onClick={handleStartReading}
        disabled={!text.trim()}
      >
        Start Reading!
      </button>
    </div>
  );
}

export default function PlayButton({ isPlaying, onPlay, onStop }) {
  const handler = isPlaying ? onStop : onPlay;
  return (
    <button
      className={`play-btn ${isPlaying ? 'playing' : ''}`}
      onClick={handler}
      onTouchEnd={(e) => { e.preventDefault(); handler(); }}
      aria-label={isPlaying ? 'Stop reading' : 'Play sentence'}
    >
      <span className="play-btn-icon">{isPlaying ? '⏹' : '▶️'}</span>
      <span className="play-btn-label">{isPlaying ? 'Stop' : 'Listen'}</span>
    </button>
  );
}

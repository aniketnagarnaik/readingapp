export default function PlayButton({ isPlaying, onPlay, onStop }) {
  return (
    <button
      className={`play-btn ${isPlaying ? 'playing' : ''}`}
      onClick={isPlaying ? onStop : onPlay}
      aria-label={isPlaying ? 'Stop reading' : 'Play sentence'}
    >
      <span className="play-btn-icon">{isPlaying ? '⏹' : '▶️'}</span>
      <span className="play-btn-label">{isPlaying ? 'Stop' : 'Listen'}</span>
    </button>
  );
}

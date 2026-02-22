export default function HomeScreen({ onChoosePhoto, onChooseText, onChooseSamples }) {
  const tap = (handler) => (e) => {
    e.preventDefault();
    handler();
  };

  return (
    <div className="screen home-screen">
      <div className="home-content">
        <h1 className="app-title">Reading Adventure</h1>
        <p className="app-subtitle">Let's learn to read together!</p>

        <div className="home-buttons">
          <button className="home-btn home-btn-samples" onClick={onChooseSamples} onTouchEnd={tap(onChooseSamples)}>
            <span className="home-btn-icon">📚</span>
            <span className="home-btn-label">Sample Stories</span>
            <span className="home-btn-desc">50 fun stories ready to read</span>
          </button>

          <button className="home-btn home-btn-text" onClick={onChooseText} onTouchEnd={tap(onChooseText)}>
            <span className="home-btn-icon">📖</span>
            <span className="home-btn-label">Paste a Story</span>
            <span className="home-btn-desc">Copy and paste text from anywhere</span>
          </button>

          <button className="home-btn home-btn-photo" onClick={onChoosePhoto} onTouchEnd={tap(onChoosePhoto)}>
            <span className="home-btn-icon">📷</span>
            <span className="home-btn-label">Upload a Photo</span>
            <span className="home-btn-desc">Take a picture of a book page</span>
          </button>
        </div>
      </div>
    </div>
  );
}

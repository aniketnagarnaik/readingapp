export default function HomeScreen({ onChoosePhoto, onChooseText, onChooseSamples, onBack }) {
  return (
    <div className="screen home-screen">
      {onBack && (
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
      )}
      <div className="home-content">
        <h1 className="app-title">Reading Adventure</h1>
        <p className="app-subtitle">Let's learn to read together!</p>

        <div className="home-buttons">
          <div role="button" tabIndex={0} className="home-btn home-btn-samples" onClick={onChooseSamples} style={{ cursor: 'pointer' }}>
            <span className="home-btn-icon">📚</span>
            <span className="home-btn-label">Sample Stories</span>
            <span className="home-btn-desc">50 fun stories ready to read</span>
          </div>

          <div role="button" tabIndex={0} className="home-btn home-btn-text" onClick={onChooseText} style={{ cursor: 'pointer' }}>
            <span className="home-btn-icon">📖</span>
            <span className="home-btn-label">Paste a Story</span>
            <span className="home-btn-desc">Copy and paste text from anywhere</span>
          </div>

          <div role="button" tabIndex={0} className="home-btn home-btn-photo" onClick={onChoosePhoto} style={{ cursor: 'pointer' }}>
            <span className="home-btn-icon">📷</span>
            <span className="home-btn-label">Upload a Photo</span>
            <span className="home-btn-desc">Take a picture of a book page</span>
          </div>
        </div>
      </div>
    </div>
  );
}

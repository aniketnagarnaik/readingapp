import TapButton from './TapButton';

export default function HomeScreen({ onChoosePhoto, onChooseText, onChooseSamples }) {
  return (
    <div className="screen home-screen">
      <div className="home-content">
        <h1 className="app-title">Reading Adventure</h1>
        <p className="app-subtitle">Let's learn to read together!</p>

        <div className="home-buttons">
          <TapButton className="home-btn home-btn-samples" onClick={onChooseSamples}>
            <span className="home-btn-icon">📚</span>
            <span className="home-btn-label">Sample Stories</span>
            <span className="home-btn-desc">50 fun stories ready to read</span>
          </TapButton>

          <TapButton className="home-btn home-btn-text" onClick={onChooseText}>
            <span className="home-btn-icon">📖</span>
            <span className="home-btn-label">Paste a Story</span>
            <span className="home-btn-desc">Copy and paste text from anywhere</span>
          </TapButton>

          <TapButton className="home-btn home-btn-photo" onClick={onChoosePhoto}>
            <span className="home-btn-icon">📷</span>
            <span className="home-btn-label">Upload a Photo</span>
            <span className="home-btn-desc">Take a picture of a book page</span>
          </TapButton>
        </div>
      </div>
    </div>
  );
}

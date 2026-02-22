import { useState, useRef } from 'react';
import { useOCR } from '../hooks/useOCR';

export default function PhotoUpload({ onTextReady, onBack }) {
  const [images, setImages] = useState([]);
  const [extractedText, setExtractedText] = useState('');
  const [step, setStep] = useState('upload');
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const fileInputRef = useRef(null);
  const { extractText, isProcessing, progress, error } = useOCR();

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const previews = [];
    for (const file of files) {
      const dataUrl = await readFileAsDataUrl(file);
      previews.push({ file, dataUrl });
    }

    setImages(previews);
    setTotalImages(previews.length);
    setStep('processing');

    let combinedText = '';

    for (let i = 0; i < previews.length; i++) {
      setCurrentImageIdx(i);
      try {
        const text = await extractText(previews[i].dataUrl);
        combinedText += (combinedText ? '\n' : '') + text.trim();
      } catch {
        // skip failed images, continue with the rest
      }
    }

    if (combinedText.trim()) {
      setExtractedText(combinedText);
      setStep('review');
    } else {
      setStep('upload');
    }
  };

  const handleStartReading = () => {
    if (extractedText.trim()) {
      onTextReady(extractedText);
    }
  };

  const handleAddMore = () => {
    fileInputRef.current?.click();
  };

  const handleAddMoreFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setStep('processing');

    let combinedText = extractedText;
    const newPreviews = [];

    for (const file of files) {
      const dataUrl = await readFileAsDataUrl(file);
      newPreviews.push({ file, dataUrl });
    }

    setTotalImages(newPreviews.length);

    for (let i = 0; i < newPreviews.length; i++) {
      setCurrentImageIdx(i);
      try {
        const text = await extractText(newPreviews[i].dataUrl);
        combinedText += '\n' + text.trim();
      } catch {
        // skip failed
      }
    }

    setImages((prev) => [...prev, ...newPreviews]);
    setExtractedText(combinedText);
    setStep('review');
  };

  return (
    <div className="screen photo-screen">
      <button className="back-btn" onClick={onBack}>
        ← Back
      </button>

      {step === 'upload' && (
        <div className="upload-area">
          <h2>Upload Book Pages</h2>
          <p>Select one or more photos of book pages</p>

          <button
            className="upload-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="upload-icon">📷</span>
            <span>Choose Photos</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {error && <p className="error-text">{error}</p>}
        </div>
      )}

      {step === 'processing' && (
        <div className="processing-area">
          <div className="processing-thumbnails">
            {images.map((img, i) => (
              <img
                key={i}
                src={img.dataUrl}
                alt={`Page ${i + 1}`}
                className={`thumb ${i === currentImageIdx ? 'thumb-active' : ''} ${i < currentImageIdx ? 'thumb-done' : ''}`}
              />
            ))}
          </div>
          <div className="progress-section">
            <h2>
              Reading page {currentImageIdx + 1} of {totalImages}...
            </h2>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p>{progress}% complete</p>
          </div>
        </div>
      )}

      {step === 'review' && (
        <div className="review-area">
          <div className="review-thumbnails">
            {images.map((img, i) => (
              <img
                key={i}
                src={img.dataUrl}
                alt={`Page ${i + 1}`}
                className="thumb thumb-done"
              />
            ))}
          </div>
          <h2>
            Text from {images.length} page{images.length !== 1 ? 's' : ''}:
          </h2>
          <textarea
            className="review-text"
            value={extractedText}
            onChange={(e) => setExtractedText(e.target.value)}
            rows={10}
          />
          <p className="review-hint">You can edit the text above if needed</p>

          <div className="review-actions">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleAddMoreFiles}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            <button className="secondary-btn" onClick={handleAddMore}>
              + Add More Pages
            </button>
            <button className="primary-btn" onClick={handleStartReading}>
              Start Reading!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

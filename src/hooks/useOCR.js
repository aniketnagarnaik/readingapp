import { useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';

export function useOCR() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const extractText = useCallback(async (imageSource) => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      const result = await Tesseract.recognize(imageSource, 'eng', {
        logger: (info) => {
          if (info.status === 'recognizing text') {
            setProgress(Math.round(info.progress * 100));
          }
        },
      });

      setIsProcessing(false);
      setProgress(100);
      return result.data.text;
    } catch (err) {
      setError(err.message || 'Failed to extract text from image');
      setIsProcessing(false);
      throw err;
    }
  }, []);

  return { extractText, isProcessing, progress, error };
}

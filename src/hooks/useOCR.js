import { useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';

function preprocessImage(imageSource) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const scale = Math.min(2, 3000 / Math.max(img.width, img.height));
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

        let adjusted = ((gray - 128) * 1.8) + 128;
        adjusted = adjusted < 140 ? 0 : 255;

        data[i] = adjusted;
        data[i + 1] = adjusted;
        data[i + 2] = adjusted;
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = imageSource;
  });
}

export function useOCR() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const extractText = useCallback(async (imageSource) => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      setProgress(5);
      const processedImage = await preprocessImage(imageSource);
      setProgress(10);

      const result = await Tesseract.recognize(processedImage, 'eng', {
        logger: (info) => {
          if (info.status === 'recognizing text') {
            setProgress(10 + Math.round(info.progress * 90));
          }
        },
        tessedit_pageseg_mode: '6',
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?\'"- ',
      });

      setIsProcessing(false);
      setProgress(100);

      const cleaned = result.data.text
        .replace(/[^a-zA-Z0-9.,!?'";\-\s]/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim();

      return cleaned;
    } catch (err) {
      setError(err.message || 'Failed to extract text from image');
      setIsProcessing(false);
      throw err;
    }
  }, []);

  return { extractText, isProcessing, progress, error };
}

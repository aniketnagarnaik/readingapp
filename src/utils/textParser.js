export function parseTextIntoPages(text) {
  const cleaned = text
    .replace(/\r\n/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return [];

  const sentences = [];
  let current = '';

  for (let i = 0; i < cleaned.length; i++) {
    current += cleaned[i];
    if ((cleaned[i] === '.' || cleaned[i] === '!' || cleaned[i] === '?') &&
        (i === cleaned.length - 1 || cleaned[i + 1] === ' ')) {
      sentences.push(current.trim());
      current = '';
    }
  }

  if (current.trim()) {
    sentences.push(current.trim());
  }

  return sentences.filter(s => s.length > 0);
}

export function splitSentenceIntoWords(sentence) {
  return sentence.split(/\s+/).filter(w => w.length > 0);
}

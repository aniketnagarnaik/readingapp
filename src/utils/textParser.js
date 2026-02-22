export function parseTextIntoPages(text) {
  const cleaned = text
    .replace(/\r\n/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .replace(/\s+/g, ' ')
    .trim();

  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  if (sentences.length === 0 && cleaned.length > 0) {
    return [cleaned];
  }

  return sentences;
}

export function splitSentenceIntoWords(sentence) {
  return sentence.split(/\s+/).filter(w => w.length > 0);
}

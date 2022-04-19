import { NON_WORD_CHAR_REGEX } from './constants';

export const acronymGenerator = (text: string): string => {
  if (!text) {
    return '';
  }

  const words = text
    .split(/\s|-|_/)
    .map((t) => t.replaceAll(NON_WORD_CHAR_REGEX, ''))
    .filter((t) => t);

  if (words.length === 1) {
    return words[0].slice(0, 4).toUpperCase();
  }

  if (words.length === 2) {
    const acr = words.map((word) => word.slice(0, 2));
    return acr.join('').toUpperCase();
  }

  return words
    .reduce((accumulator, word) => {
      return accumulator + word.charAt(0);
    }, '')
    .slice(0, 4)
    .toUpperCase();
};

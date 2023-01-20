import { generateSlug } from 'random-word-slugs';

export const handleRandomizer = (): string => {
  const slug = generateSlug(2, {
    format: 'title',
    categories: {
      noun: [
        'media',
        'science',
        'sports',
        'technology',
        'thing',
        'time',
        'transportation',
        'animals'
      ],
      adjective: [
        'appearance',
        'color',
        'quantity',
        'shapes',
        'size',
        'sounds',
        'taste',
        'touch'
      ]
    }
  });
  return slug;
};

import { CATEGORIES } from './categories.js';

// Every public page, as a slug shared by both languages. The sitemap is built from this.
export const SLUGS = ['', 'numbers', 'help', 'links', 'about', ...CATEGORIES.map((c) => `places/${c.id}`)];

// Arabic lives at the root, English under /en/.
export const langPaths = () => [
  { params: { lang: undefined }, props: { lang: 'ar' } },
  { params: { lang: 'en' }, props: { lang: 'en' } },
];

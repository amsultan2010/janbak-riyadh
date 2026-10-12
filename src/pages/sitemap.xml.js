import { SLUGS } from '../routes.js';
import { path } from '../i18n.js';

// One entry per page per language, each naming its translation.
export function GET({ site }) {
  const abs = (lang, slug) => new URL(path(lang, slug), site).href;
  const urls = SLUGS.flatMap((slug) =>
    ['ar', 'en'].map(
      (lang) =>
        `<url><loc>${abs(lang, slug)}</loc>` +
        ['ar', 'en'].map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${abs(l, slug)}"/>`).join('') +
        `</url>`,
    ),
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}

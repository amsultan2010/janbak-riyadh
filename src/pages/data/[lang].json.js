import places from '../../data/places.json';
import { KINDS } from '../../categories.js';
import { translator, pick, otherLang, LANGS } from '../../i18n.js';

// Every place for one language, as compact rows the explorer reads:
// [id, kind index, name, address, district, lat, lng, phone, hours, usual, phone2, website, source, tags, other-language search text, note, district id]
export const getStaticPaths = () => LANGS.map((lang) => ({ params: { lang } }));

export function GET({ params }) {
  const { lang } = params;
  const other = otherLang(lang);
  const t = translator(lang);
  const sortKey = (p) => (p.country ? pick(p.country, lang) : pick(p.name, lang));
  const order = (p) => KINDS.findIndex((k) => k.id === p.kind);
  const rows = [...places]
    .sort((a, b) => order(a) - order(b) || sortKey(a).localeCompare(sortKey(b), lang))
    .map((p) => [
      p.id,
      order(p),
      pick(p.name, lang),
      pick(p.addr, lang) ?? 0,
      pick(p.district, lang) ?? 0,
      p.lat ?? 0,
      p.lng ?? 0,
      p.phone ?? 0,
      p.hours ?? 0,
      p.usual ? 1 : 0,
      p.phone2 ?? 0,
      p.website ?? 0,
      p.source && p.source !== p.website ? p.source : 0,
      [p.own && t(`own.${p.own}`), ...(p.flags ?? []).filter((f) => ['pediatric_er', 'trauma_center', 'burns'].includes(f)).map((f) => t(`flag.${f}`))].filter(Boolean),
      [p.name[other], p.district[other], p.country?.[other]].filter(Boolean).join(' '),
      p.note?.[lang] ?? 0,
      p.area ?? 0,
    ]);
  return new Response(JSON.stringify(rows), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}

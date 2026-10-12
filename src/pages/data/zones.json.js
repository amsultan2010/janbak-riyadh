import data from '../../../research/zones.json';

// Marked zones drawn on the map: each has an outline and a name in both languages.
export function GET() {
  return new Response(JSON.stringify(data.zones), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}

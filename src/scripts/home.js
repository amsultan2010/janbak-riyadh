// The visitor's chosen location. It lives in this browser only.
const KEY = 'home';

export function getHome() {
  try {
    const home = JSON.parse(localStorage.getItem(KEY));
    return home && Number.isFinite(home.lat) && Number.isFinite(home.lng) ? home : null;
  } catch {
    return null;
  }
}

export function setHome(home) {
  try {
    if (home) localStorage.setItem(KEY, JSON.stringify(home));
    else localStorage.removeItem(KEY);
  } catch {
    // private mode: the location still works for this page view
  }
  document.dispatchEvent(new CustomEvent('homechange', { detail: home }));
}

export const strings = JSON.parse(document.getElementById('strings').textContent);
export const lang = document.documentElement.lang;
export const say = (key, vars = {}) => strings[key].replace(/\{(\w+)\}/g, (_, name) => vars[name]);

// so that a search matches whatever spelling of alef, hamza or ta marbuta was typed
export const fold = (s) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670\u0640\u0300-\u036f]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');

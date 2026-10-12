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

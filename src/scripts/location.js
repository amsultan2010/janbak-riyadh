import { getHome, setHome, lang, say } from './home.js';
import { openSheet } from './sheet.js';

const sheet = document.querySelector('[data-loc]');
const opener = document.querySelector('[data-loc-open]');
if (sheet && opener) {
  const label = opener.querySelector('[data-loc-label]');
  const text = sheet.querySelector('[data-loc-text]');
  const remove = sheet.querySelector('[data-loc-remove]');
  const gps = sheet.querySelector('[data-loc-gps]');
  const pick = sheet.querySelector('[data-loc-pick]');
  const select = sheet.querySelector('[data-loc-district]');
  const msg = sheet.querySelector('[data-loc-msg]');
  let current = getHome();

  function render() {
    text.textContent = current ? (current[lang] ?? say(current.picked ? 'loc.picked' : 'loc.current')) : say('loc.none');
    label.textContent = current ? (current[lang] ?? say('loc.mine')) : say('loc.set');
    remove.hidden = !current;
  }

  opener.addEventListener('click', () => {
    msg.textContent = say('loc.privacy');
    openSheet(sheet);
  });
  remove.addEventListener('click', () => {
    select.value = '';
    setHome(null);
  });

  select.addEventListener('change', () => {
    const option = select.selectedOptions[0];
    if (!option.value) return;
    const [lat, lng] = option.value.split(',').map(Number);
    setHome({ lat, lng, ar: option.dataset.ar, en: option.dataset.en });
  });

  gps.addEventListener('click', () => {
    if (!navigator.geolocation) {
      msg.textContent = say('loc.denied');
      return;
    }
    gps.disabled = true;
    msg.textContent = say('loc.finding');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        gps.disabled = false;
        select.value = '';
        setHome({ lat: +pos.coords.latitude.toFixed(5), lng: +pos.coords.longitude.toFixed(5) });
      },
      () => {
        gps.disabled = false;
        msg.textContent = say('loc.denied');
      },
      { timeout: 15000, maximumAge: 300000 },
    );
  });

  // the explorer turns this on once its map is ready, and answers "pickstart"
  document.addEventListener('mapready', () => (pick.hidden = false));
  pick.addEventListener('click', () => {
    sheet.close();
    document.dispatchEvent(new CustomEvent('pickstart'));
  });

  // a location that was just set closes the sheet; removing one leaves it open to choose again
  document.addEventListener('homechange', (e) => {
    current = e.detail;
    render();
    if (current && sheet.open) sheet.close();
  });

  opener.hidden = false;
  render();
}

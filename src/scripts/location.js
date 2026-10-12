import { getHome, setHome, lang, say } from './home.js';

const box = document.querySelector('[data-loc]');
if (box) {
  const text = box.querySelector('[data-loc-text]');
  const form = box.querySelector('[data-loc-form]');
  const change = box.querySelector('[data-loc-change]');
  const remove = box.querySelector('[data-loc-remove]');
  const gps = box.querySelector('[data-loc-gps]');
  const pick = box.querySelector('[data-loc-pick]');
  const select = box.querySelector('[data-loc-district]');
  const msg = box.querySelector('[data-loc-msg]');
  let current = getHome();

  function render(open = !current) {
    text.textContent = current ? (current[lang] ?? say(current.picked ? 'loc.picked' : 'loc.current')) : say('loc.none');
    change.hidden = !current || open;
    remove.hidden = !current;
    form.hidden = !open;
  }

  change.addEventListener('click', () => render(true));
  remove.addEventListener('click', () => {
    select.value = '';
    setHome(null);
    render(true);
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
    msg.textContent = say('loc.pickHint');
    document.dispatchEvent(new CustomEvent('pickstart'));
  });

  document.addEventListener('homechange', (e) => {
    current = e.detail;
    msg.textContent = say('loc.privacy');
    render(!current);
  });

  box.hidden = false;
  render();
}

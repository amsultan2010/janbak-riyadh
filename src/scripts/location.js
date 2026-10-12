import { getHome, setHome, lang, say } from './home.js';

const box = document.querySelector('[data-loc]');
if (box) {
  const text = box.querySelector('[data-loc-text]');
  const form = box.querySelector('[data-loc-form]');
  const change = box.querySelector('[data-loc-change]');
  const remove = box.querySelector('[data-loc-remove]');
  const gps = box.querySelector('[data-loc-gps]');
  const select = box.querySelector('[data-loc-district]');
  const msg = box.querySelector('[data-loc-msg]');
  let current = getHome();

  function render(open = !current) {
    text.textContent = current ? (current[lang] ?? say('loc.current')) : say('loc.none');
    change.hidden = !current || open;
    remove.hidden = !current;
    form.hidden = !open;
  }

  function save(home) {
    current = home;
    setHome(home);
    msg.textContent = say('loc.privacy');
    render(false);
  }

  change.addEventListener('click', () => render(true));
  remove.addEventListener('click', () => {
    select.value = '';
    save(null);
    render(true);
  });

  select.addEventListener('change', () => {
    const option = select.selectedOptions[0];
    if (!option.value) return;
    const [lat, lng] = option.value.split(',').map(Number);
    save({ lat, lng, ar: option.dataset.ar, en: option.dataset.en });
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
        save({ lat: +pos.coords.latitude.toFixed(5), lng: +pos.coords.longitude.toFixed(5) });
      },
      () => {
        gps.disabled = false;
        msg.textContent = say('loc.denied');
      },
      { timeout: 15000, maximumAge: 300000 },
    );
  });

  box.hidden = false;
  render();
}

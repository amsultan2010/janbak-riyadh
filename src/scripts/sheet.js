// Sheets: panels that open under the header and leave the emergency numbers in reach.
// They are not modal, so the numbers and the tabs above keep working.
// On a phone the header's rows are separate boxes; on a wide screen the header is one.
const bars = [...document.querySelectorAll('header, .topbar, .subbar')];
let open = null;

const place = () => open?.style.setProperty('--sheet-top', `${Math.max(0, ...bars.map((b) => b.getBoundingClientRect().bottom))}px`);

export function openSheet(sheet) {
  if (open && open !== sheet) open.close();
  open = sheet;
  place();
  if (!sheet.open) sheet.show();
  sheet.scrollTop = 0;
  sheet.addEventListener('close', () => open === sheet && (open = null), { once: true });
}

document.addEventListener('click', (e) => e.target.closest('[data-close]')?.closest('dialog').close());
document.addEventListener('keydown', (e) => e.key === 'Escape' && open?.close());
addEventListener('scroll', place, { passive: true });
addEventListener('resize', place);

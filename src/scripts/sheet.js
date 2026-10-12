// Sheets: panels that open under the emergency numbers and leave them in reach.
// They are not modal, so the tabs and the numbers above keep working.
const em = document.querySelector('.em');
let open = null;

const place = () => open?.style.setProperty('--sheet-top', `${Math.max(0, em.getBoundingClientRect().bottom)}px`);

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

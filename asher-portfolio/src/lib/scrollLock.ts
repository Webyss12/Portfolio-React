// Several layers (menu, case study) can ask for a scroll lock. We count them so
// the page only unlocks when the last one lets go.
let locks = 0;

export function lockScroll() {
  if (locks++ === 0) {
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
  }
}

export function unlockScroll() {
  if (locks > 0 && --locks === 0) {
    document.documentElement.style.overflow = '';
    document.body.style.paddingRight = '';
  }
}

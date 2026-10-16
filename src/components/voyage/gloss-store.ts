// Charon's glosses: shown by default, hidden via `no-gloss` on <html>.
// The choice is remembered in localStorage and applied before paint by
// GLOSS_INIT_SCRIPT, so a hidden preference never flashes on reload.

export const GLOSS_KEY = "odyssee-gloss";
const CLASS = "no-gloss";
const EVENT = "odyssee:gloss";

export const GLOSS_INIT_SCRIPT = `try{if(localStorage.getItem("${GLOSS_KEY}")==="0")document.documentElement.classList.add("${CLASS}")}catch(e){}`;

export function subscribeGloss(onChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key !== GLOSS_KEY) return;
    document.documentElement.classList.toggle(CLASS, e.newValue === "0");
    onChange();
  };
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

export const glossShown = () =>
  !document.documentElement.classList.contains(CLASS);

export function setGlossShown(on: boolean) {
  document.documentElement.classList.toggle(CLASS, !on);
  try {
    localStorage.setItem(GLOSS_KEY, on ? "1" : "0");
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

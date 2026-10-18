// Boarding (the loader, DESIGN §6.2): shown on the first visit of the
// session only, and only with JS. BOARDING_INIT_SCRIPT runs before first
// paint and sets data-boarding="on" on <html>; CSS shows the server-rendered
// loader only then. Without JS, or on later visits, it never appears.

const KEY = "odyssee-boarded";
const ATTR = "data-boarding";
const EVENT = "odyssee:boarded";

export const BOARDING_INIT_SCRIPT = `try{if(!sessionStorage.getItem("${KEY}")){sessionStorage.setItem("${KEY}","1");document.documentElement.setAttribute("${ATTR}","on")}}catch(e){}`;

export const isBoarding = () =>
  document.documentElement.getAttribute(ATTR) === "on";

/** Runs `fn` once the loader has left (now, if there is none). */
export function whenBoarded(fn: () => void): () => void {
  if (!isBoarding()) {
    fn();
    return () => {};
  }
  window.addEventListener(EVENT, fn, { once: true });
  return () => window.removeEventListener(EVENT, fn);
}

/** Starts the loader's fade-out, then removes it once faded. */
export function finishBoarding(fadeMs: number) {
  const root = document.documentElement;
  root.setAttribute(ATTR, "done");
  window.dispatchEvent(new Event(EVENT));
  window.setTimeout(() => root.removeAttribute(ATTR), fadeMs);
}

/**
 * Only Chromium builds need PDF.js — their embedded native PDF view is often a blank panel.
 * Safari/WebKit (vendor Apple) and Firefox use the native viewer reliably.
 */
export function shouldUsePdfJsCanvas() {
  if (typeof navigator === 'undefined') return false;
  if (/Apple/i.test(navigator.vendor)) return false;

  const ua = navigator.userAgent;
  return /Chrome\/|Chromium\/|Edg\//.test(ua) && !/EdgiOS|CriOS/i.test(ua);
}

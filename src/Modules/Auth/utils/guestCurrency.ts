import { useSyncExternalStore } from 'react';

const key = 'saferent.displayCurrency';
const eventName = 'saferent:currency';
let memoryCurrency: string | undefined;

function snapshot() {
  if (memoryCurrency) return memoryCurrency;
  try { return localStorage.getItem(key) || 'CRC'; } catch { return 'CRC'; }
}
function subscribe(callback: () => void) {
  const onStorage = () => { memoryCurrency = undefined; callback(); };
  window.addEventListener('storage', onStorage);
  window.addEventListener(eventName, callback);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(eventName, callback);
  };
}
export function setGuestCurrency(currency: string) {
  memoryCurrency = currency;
  try { localStorage.setItem(key, currency); } catch { /* Retain the preference for this tab. */ }
  window.dispatchEvent(new Event(eventName));
}
export function useGuestCurrency() {
  return useSyncExternalStore(subscribe, snapshot, () => 'CRC');
}

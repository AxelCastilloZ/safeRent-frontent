import { useSyncExternalStore } from 'react';

const sessionEvent = 'saferent-session-change';

export function setSessionToken(token: string | null) {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
  window.dispatchEvent(new Event(sessionEvent));
}

function subscribe(callback: () => void) {
  window.addEventListener(sessionEvent, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(sessionEvent, callback);
    window.removeEventListener('storage', callback);
  };
}

export function useSessionToken() {
  return useSyncExternalStore(subscribe, () => localStorage.getItem('token'), () => null);
}

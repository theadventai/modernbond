export type CookieConsent = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
};

const STORAGE_KEY = 'mb_cookie_consent';
export const COOKIE_CONSENT_EVENT = 'mb-cookie-consent-changed';
export const REOPEN_COOKIE_CONSENT_EVENT = 'mb-cookie-consent-reopen';

export function reopenCookieConsent() {
  window.dispatchEvent(new Event(REOPEN_COOKIE_CONSENT_EVENT));
}

export function getCookieConsent(): CookieConsent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCookieConsent(consent: Omit<CookieConsent, 'essential'>) {
  const full: CookieConsent = { essential: true, ...consent };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
  } catch { /* private mode */ }
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: full }));
  return full;
}

export function clearCookieConsent() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* private mode */ }
}

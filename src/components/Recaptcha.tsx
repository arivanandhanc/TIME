'use client';

import Script from 'next/script';
import { useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { RECAPTCHA_SITE_KEY } from '@/lib/recaptcha';

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

/**
 * Site-wide Google reCAPTCHA v3. Loads the invisible library on every page and,
 * on each navigation, runs a `page_view` assessment whose token is POSTed to
 * /api/recaptcha/verify. This lets the backend score traffic across the whole
 * site without showing the user anything. Renders nothing if no site key.
 */
export default function Recaptcha() {
  const pathname = usePathname();

  // Execute a v3 assessment for the current path whenever the route changes.
  const assess = useCallback((path: string) => {
    const grecaptcha = window.grecaptcha;
    if (!grecaptcha || !RECAPTCHA_SITE_KEY) return;
    grecaptcha.ready(() => {
      grecaptcha
        .execute(RECAPTCHA_SITE_KEY, { action: 'page_view' })
        .then((token) =>
          fetch('/api/recaptcha/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, action: 'page_view', path }),
            keepalive: true,
          }).catch(() => {}),
        )
        .catch(() => {});
    });
  }, []);

  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) return;
    assess(pathname);
  }, [pathname, assess]);

  if (!RECAPTCHA_SITE_KEY) return null;

  return (
    <Script
      id="recaptcha-v3"
      strategy="afterInteractive"
      src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
      onLoad={() => assess(window.location.pathname)}
    />
  );
}

/**
 * Imperatively run a reCAPTCHA v3 assessment for a custom action (e.g. a form
 * submit) and return the token. Resolves to null if reCAPTCHA isn't ready.
 * Pair with verifyRecaptchaToken on the server before trusting the request.
 */
export function executeRecaptcha(action: string): Promise<string | null> {
  return new Promise((resolve) => {
    const grecaptcha = typeof window !== 'undefined' ? window.grecaptcha : undefined;
    if (!grecaptcha || !RECAPTCHA_SITE_KEY) return resolve(null);
    grecaptcha.ready(() => {
      grecaptcha
        .execute(RECAPTCHA_SITE_KEY, { action })
        .then(resolve)
        .catch(() => resolve(null));
    });
  });
}

/**
 * Google reCAPTCHA v3 configuration.
 *
 * v3 is invisible and score-based — it runs on every page and returns a 0.0–1.0
 * score (1.0 = very likely human). There is no checkbox; nothing is shown to the
 * user. The site key is public and safe to ship to the browser; the secret key
 * (SECRET_RECAPTCHA) stays server-side and is only read by the verify route.
 */

/** Public site key. Overridable via env; falls back to the project key. */
export const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LcofjstAAAAAHtOPh5mFiSqHAOVxbaxDHM_1JOr';

/** Server-side secret. Empty when unset — verification is skipped gracefully. */
export const RECAPTCHA_SECRET = process.env.SECRET_RECAPTCHA || '';

/** Scores at or above this are treated as human. Tune to taste (Google default 0.5). */
export const RECAPTCHA_THRESHOLD = 0.5;

export interface RecaptchaVerifyResult {
  success: boolean;
  score?: number;
  action?: string;
  hostname?: string;
  challenge_ts?: string;
  'error-codes'?: string[];
}

/**
 * Verifies a v3 token against Google's siteverify endpoint.
 * Returns the raw Google response plus a derived `success` flag that also
 * factors in the score threshold. No-ops (success:true) when no secret is set.
 */
export async function verifyRecaptchaToken(
  token: string,
  remoteIp?: string,
): Promise<RecaptchaVerifyResult> {
  if (!RECAPTCHA_SECRET) {
    // Not configured — don't block traffic in dev / unconfigured envs.
    return { success: true, score: 1 };
  }
  if (!token) return { success: false, 'error-codes': ['missing-input-response'] };

  const body = new URLSearchParams({ secret: RECAPTCHA_SECRET, response: token });
  if (remoteIp) body.set('remoteip', remoteIp);

  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store',
  });

  const data = (await res.json()) as RecaptchaVerifyResult;
  const passedScore = typeof data.score === 'number' ? data.score >= RECAPTCHA_THRESHOLD : true;
  return { ...data, success: Boolean(data.success) && passedScore };
}

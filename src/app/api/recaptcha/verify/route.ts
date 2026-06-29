import { NextRequest, NextResponse } from 'next/server';
import { verifyRecaptchaToken } from '@/lib/recaptcha';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Verifies a reCAPTCHA v3 token with Google using the server-side secret
 * (SECRET_RECAPTCHA). Returns whether the request looks human plus the score.
 * Other routes/forms can reuse verifyRecaptchaToken directly instead of HTTP.
 */
export async function POST(req: NextRequest) {
  let token = '';
  let action: string | undefined;
  try {
    const body = await req.json();
    token = typeof body?.token === 'string' ? body.token : '';
    action = typeof body?.action === 'string' ? body.action : undefined;
  } catch {
    return NextResponse.json({ success: false, error: 'invalid-body' }, { status: 400 });
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    undefined;

  const result = await verifyRecaptchaToken(token, ip);

  // Optional action sanity check: Google echoes the action that produced the token.
  if (action && result.action && result.action !== action) {
    return NextResponse.json(
      { success: false, score: result.score, error: 'action-mismatch' },
      { status: 200 },
    );
  }

  return NextResponse.json(
    { success: result.success, score: result.score },
    { status: result.success ? 200 : 403 },
  );
}

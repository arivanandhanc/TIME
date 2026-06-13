import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/site';

export const runtime = 'edge';

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get('title') || SITE.tagline).slice(0, 90);

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'radial-gradient(1000px 500px at 15% -10%, rgba(251,191,36,0.18), transparent), #0a0a0a',
          padding: '70px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 32, color: '#fbbf24', fontWeight: 700 }}>
          🕒 &nbsp;{SITE.name}
        </div>
        <div style={{ display: 'flex', fontSize: 64, fontWeight: 800, color: '#f4f4f4', lineHeight: 1.15, maxWidth: '950px' }}>
          {title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 28, color: '#b0b0b0' }}>
          <div style={{ display: 'flex', width: 40, height: 6, background: '#fbbf24', borderRadius: 3, marginRight: 18 }} />
          {SITE.tagline}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

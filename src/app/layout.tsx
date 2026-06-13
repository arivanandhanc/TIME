import type { Metadata, Viewport } from 'next';
import { Syne, DM_Sans, Space_Mono } from 'next/font/google';
import './globals.css';
import { SITE } from '@/lib/site';

const dmSans = DM_Sans({ subsets: ['latin'], display: 'swap', variable: '--font-body' });
const syne = Syne({ subsets: ['latin'], display: 'swap', weight: ['600', '700', '800'], variable: '--font-display' });
const spaceMono = Space_Mono({ subsets: ['latin'], display: 'swap', weight: ['400', '700'], variable: '--font-mono' });
import { websiteSchema } from '@/lib/seo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import Analytics from '@/components/Analytics';
import AdSenseScript from '@/components/AdSenseScript';
import ServiceWorker from '@/components/ServiceWorker';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.author }],
  creator: SITE.author,
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: SITE.shortName },
  formatDetection: { telephone: false },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
};

// Runs before paint to prevent a flash of the wrong theme.
// Dark-first: only opt out of dark when the visitor explicitly chose light.
const themeScript = `
(function(){try{var t=localStorage.getItem('theme');if(t!=='light'){document.documentElement.classList.add('dark');}}catch(e){document.documentElement.classList.add('dark');}})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${syne.variable} ${spaceMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <JsonLd data={websiteSchema()} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="min-h-[70vh]">
          {children}
        </main>
        <Footer />
        <CookieConsent />
        <Analytics />
        <AdSenseScript />
        <ServiceWorker />
      </body>
    </html>
  );
}

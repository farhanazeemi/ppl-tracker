import { safeJsonLd } from '@/lib/safeJsonLd';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Providers } from '../components/Providers';
import { GoogleAnalytics } from '../components/GoogleAnalytics';
import { ServiceWorkerRegistration } from '../components/ServiceWorkerRegistration';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { getRootWebSiteSchema } from '../lib/schema';

const geistSans = localFont({
  src: './fonts/Geist-Variable.woff2',
  variable: '--font-geist-sans',
  display: 'swap',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMono-Variable.woff2',
  variable: '--font-geist-mono',
  display: 'swap',
  weight: '100 900',
});

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'PPL Tracker | Evidence-Based Workout & Hypertrophy App',
    template: '%s | PPL Tracker',
  },
  description:
    'Free 6-day Push-Pull-Legs progressive overload hypertrophy app with automatic rest timers, Olympic plate math, 3D muscle anatomy, and cloud workout tracking.',
  keywords: [
    'PPL workout tracker',
    'push pull legs split',
    'hypertrophy tracker',
    'progressive overload app',
    'double progression system',
    'gym workout log',
    'plate calculator barbell',
    'bodybuilding routine app',
    'minimalist workout app',
  ],
  authors: [{ name: 'PPL Sports Science & Engineering Team', url: 'https://ppltracker.web.id/author' }],
  creator: 'PPL Hypertrophy Tracker',
  publisher: 'PPL Hypertrophy Tracker',
  applicationName: 'PPL Hypertrophy Tracker',
  generator: 'Next.js',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'PPL Tracker | Evidence-Based Workout & Hypertrophy App',
    description:
      'Free 6-day Push-Pull-Legs progressive overload hypertrophy app with automatic rest timers, Olympic plate math, 3D muscle anatomy, and cloud workout tracking.',
    url: baseUrl,
    siteName: 'PPL Hypertrophy Tracker',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'PPL Hypertrophy Tracker Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PPL Tracker | Evidence-Based Workout & Hypertrophy App',
    description:
      'Free 6-day Push-Pull-Legs progressive overload hypertrophy app with automatic rest timers, Olympic plate math, and double progression tracking.',
    images: ['/icon.svg'],
    creator: '@ppltracker',
  },
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PPL Tracker',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#090B0F',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteSchema = getRootWebSiteSchema();

  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Blocking pre-paint theme execution script to eliminate FOUC */}
        <script
          id="theme-prepaint"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('ppl_theme');
                  var isLight = saved === 'light';
                  var d = document.documentElement;
                  if (isLight) {
                    d.classList.remove('dark');
                    d.classList.add('light');
                    d.style.colorScheme = 'light';
                  } else {
                    d.classList.remove('light');
                    d.classList.add('dark');
                    d.style.colorScheme = 'dark';
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteSchema) }}
        />
        {/* Agentic Browsing & LLMs.txt Alternate Links (3/3 Standard) */}
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="LLMs.txt" />
        <link rel="help" href="/llms.txt" />
        {/* Google Analytics & GTM loaded on idle, excludes internal Sanity Studio routes */}
        <GoogleAnalytics />
      </head>
      <body
        className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] antialiased selection:bg-[#B7FF4A] selection:text-[#090B0F] transition-colors duration-200 pb-16 md:pb-0"
        suppressHydrationWarning
      >
        {/* WCAG 2.4.1 Accessible Skip Landmark Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#B7FF4A] focus:text-[#090B0F] focus:font-mono focus:font-bold focus:text-sm focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#090B0F]"
        >
          Skip to main content
        </a>
        <Providers>
          {children}
          <MobileBottomNav />
        </Providers>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}

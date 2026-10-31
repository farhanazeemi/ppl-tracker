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
    default: 'PPL Hypertrophy Tracker | Minimalist Workout App',
    template: '%s | PPL Hypertrophy Tracker',
  },
  description:
    'Minimalist 6-day Push-Pull-Legs progressive overload hypertrophy app with automatic rest timers, barbell plate math, biomechanics visualizer, user profiles, and double progression tracking.',
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
  authors: [{ name: 'Farhan Azeemi', url: 'https://github.com/farhanazeemi' }],
  creator: 'Farhan Azeemi',
  publisher: 'Farhan Azeemi',
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
    title: 'PPL Hypertrophy Tracker | Minimalist Workout App',
    description:
      'Minimalist 6-day Push-Pull-Legs progressive overload hypertrophy app with automatic rest timers, barbell plate math, biomechanics visualizer, user profiles, and double progression tracking.',
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
    title: 'PPL Hypertrophy Tracker | Minimalist Workout App',
    description:
      'Science-backed 6-day Push-Pull-Legs progressive overload hypertrophy app with automatic rest timers, plate math, and double progression tracking.',
    images: ['/icon.svg'],
    creator: '@farhanazeemi',
  },
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: [
      {
        url: '/icon.svg',
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* Google Analytics & GTM loaded on idle, excludes internal Sanity Studio routes */}
        <GoogleAnalytics />
      </head>
      <body
        className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] antialiased selection:bg-[#B7FF4A] selection:text-[#090B0F] transition-colors duration-200 pb-16 md:pb-0"
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <MobileBottomNav />
        </Providers>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}

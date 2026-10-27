import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { Providers } from '../components/Providers';
import { getRootWebSiteSchema } from '../lib/schema';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'PPL Hypertrophy Tracker | Minimalist Workout App',
    template: '%s | PPL Hypertrophy Tracker',
  },
  description:
    'Minimalist 6-day Push-Pull-Legs progressive overload hypertrophy app with automatic rest timers, barbell plate math, 3D visualizer, user profiles, and double progression tracking.',
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
      'Minimalist 6-day Push-Pull-Legs progressive overload hypertrophy app with automatic rest timers, barbell plate math, 3D visualizer, user profiles, and double progression tracking.',
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
  themeColor: '#fafafa',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteSchema = getRootWebSiteSchema();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* Google tag (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-HTGL7X5C4X"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-HTGL7X5C4X', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#fafafa] text-zinc-900 antialiased selection:bg-amber-500 selection:text-white transition-colors duration-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

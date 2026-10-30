import type { Metadata, Viewport } from 'next';
import { Barlow, Barlow_Condensed, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '../components/Providers';
import { GoogleAnalytics } from '../components/GoogleAnalytics';
import { ServiceWorkerRegistration } from '../components/ServiceWorkerRegistration';
import { getRootWebSiteSchema } from '../lib/schema';

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-barlow',
  display: 'swap',
});

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-barlow-condensed',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
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
    statusBarStyle: 'default',
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
  themeColor: '#fafafa',
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
      className={`${barlow.variable} ${barlowCondensed.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* Google Analytics & GTM loaded on idle, excludes internal Sanity Studio routes */}
        <GoogleAnalytics />
      </head>
      <body className="min-h-screen bg-[#fafafa] text-zinc-900 antialiased selection:bg-amber-500 selection:text-white transition-colors duration-200">
        <Providers>{children}</Providers>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}

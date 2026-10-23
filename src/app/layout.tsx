import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '../components/Providers';

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

const jsonLdData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': `${baseUrl}/#webapp`,
      url: baseUrl,
      name: 'PPL Hypertrophy Tracker',
      description:
        'Minimalist 6-day Push-Pull-Legs progressive overload hypertrophy app with automatic rest timers, barbell plate math, 3D visualizer, user profiles, and double progression tracking.',
      applicationCategory: 'HealthAndFitnessApplication',
      operatingSystem: 'All (iOS, Android, Windows, macOS, Linux)',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      softwareVersion: '2.0.0',
      inLanguage: 'en-US',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
      featureList: [
        '6-Day Push-Pull-Legs periodized hypertrophy routine',
        'Double progression rep-range overload engine',
        'Automated rest interval timers with audio chimes',
        'Olympic barbell plate calculator (45lb / 20kg bar math)',
        'Interactive 3D muscle anatomy visualizer',
        'Supabase cloud profile persistence and workout history sync',
      ],
      author: {
        '@type': 'Person',
        name: 'Farhan Azeemi',
        url: 'https://github.com/farhanazeemi',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: baseUrl,
      name: 'PPL Hypertrophy Tracker',
      description: 'Science-backed progressive overload hypertrophy app and workout logger.',
      publisher: {
        '@type': 'Person',
        name: 'Farhan Azeemi',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body className="min-h-screen bg-[#fafafa] text-zinc-900 antialiased selection:bg-amber-500 selection:text-white transition-colors duration-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

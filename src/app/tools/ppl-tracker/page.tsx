import { safeJsonLd } from '@/lib/safeJsonLd';
import type { Metadata } from 'next';
import { PplTrackerApp } from '../../../components/PplTrackerApp';
import { getPplTrackerToolSchema } from '../../../lib/schema';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: 'PPL Workout Tracker & Overload Engine',
  description:
    'Free 6-day Push-Pull-Legs workout app with automated rest timers, Olympic plate math, double progression ceilings, and local-first cloud synchronization.',
  alternates: {
    canonical: '/tools/ppl-tracker',
  },
  openGraph: {
    title: 'PPL Workout Tracker & Overload Engine | PPL Tracker',
    description:
      'Free 6-day Push-Pull-Legs workout app with automated rest timers, Olympic plate math, double progression ceilings, and local-first cloud synchronization.',
    url: `${baseUrl}/tools/ppl-tracker`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PPL Hypertrophy Tracker App & Progressive Overload Engine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PPL Workout Tracker & Overload Engine | PPL Tracker',
    description:
      'Free 6-day Push-Pull-Legs workout app with automated rest timers, Olympic plate math, and double progression ceilings.',
    images: ['/og-image.png'],
  },
};

export default function PplTrackerPage() {
  const schema = getPplTrackerToolSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
      />
      <PplTrackerApp initialView="app" />
    </>
  );
}

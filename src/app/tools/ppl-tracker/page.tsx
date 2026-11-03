import { safeJsonLd } from '@/lib/safeJsonLd';
import type { Metadata } from 'next';
import { PplTrackerApp } from '../../../components/PplTrackerApp';
import { getWebApplicationSchema } from '../../../lib/schema';

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
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'PPL Hypertrophy Tracker App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PPL Workout Tracker & Overload Engine | PPL Tracker',
    description:
      'Free 6-day Push-Pull-Legs workout app with automated rest timers, Olympic plate math, and double progression ceilings.',
    images: ['/icon.svg'],
  },
};

export default function PplTrackerPage() {
  const webAppSchema = getWebApplicationSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(webAppSchema) }}
      />
      <PplTrackerApp initialView="app" />
    </>
  );
}

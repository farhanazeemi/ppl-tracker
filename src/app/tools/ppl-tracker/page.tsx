import type { Metadata } from 'next';
import { PplTrackerApp } from '../../../components/PplTrackerApp';
import { getWebApplicationSchema } from '../../../lib/schema';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: 'PPL Workout Tracker | 6-Day Push Pull Legs Progressive Overload Engine',
  description:
    'Science-backed 6-day Push-Pull-Legs progressive overload workout app. Automated rest interval timers, barbell plate math, double progression ceilings, and local-first cloud sync.',
  alternates: {
    canonical: '/tools/ppl-tracker',
  },
  openGraph: {
    title: 'PPL Workout Tracker | 6-Day Push Pull Legs Progressive Overload Engine',
    description:
      'Science-backed 6-day Push-Pull-Legs progressive overload workout app. Automated rest interval timers, barbell plate math, double progression ceilings, and local-first cloud sync.',
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
    title: 'PPL Workout Tracker | Progressive Overload Engine',
    description:
      'Science-backed 6-day Push-Pull-Legs progressive overload hypertrophy app with automatic rest timers, plate math, and double progression tracking.',
    images: ['/icon.svg'],
  },
};

export default function PplTrackerPage() {
  const webAppSchema = getWebApplicationSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <PplTrackerApp initialView="app" />
    </>
  );
}

import type { Metadata } from 'next';
import { PplTrackerApp } from '../components/PplTrackerApp';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: 'PPL Hypertrophy Tracker | Minimalist Workout App & Progressive Overload Engine',
  description:
    'Minimalist 6-day Push-Pull-Legs progressive overload hypertrophy app with automatic rest timers, barbell plate math, 3D visualizer, user profiles, and double progression tracking.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'PPL Hypertrophy Tracker | Minimalist Workout App & Progressive Overload Engine',
    description:
      'Minimalist 6-day Push-Pull-Legs progressive overload hypertrophy app with automatic rest timers, barbell plate math, 3D visualizer, user profiles, and double progression tracking.',
    url: baseUrl,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'PPL Hypertrophy Tracker Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PPL Hypertrophy Tracker | Minimalist Workout App & Progressive Overload Engine',
    description:
      'Science-backed 6-day Push-Pull-Legs progressive overload hypertrophy app with automatic rest timers, plate math, and double progression tracking.',
    images: ['/icon.svg'],
  },
};

export default function HomePage() {
  return <PplTrackerApp />;
}

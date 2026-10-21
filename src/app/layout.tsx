import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '../components/Providers';

export const metadata: Metadata = {
  title: 'PPL Hypertrophy Tracker | Minimalist Workout App',
  description:
    'Minimalist 6-day Push-Pull-Legs progressive overload hypertrophy app with automatic rest timers, barbell plate math, 3D visualizer, user profiles, and double progression tracking.',
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
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fafafa] text-zinc-900 antialiased selection:bg-amber-500 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

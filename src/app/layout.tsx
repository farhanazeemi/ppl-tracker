import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '../components/Providers';

export const metadata: Metadata = {
  title: 'PPL Hypertrophy Tracker | Progressive Overload & Smart Split Engine',
  description:
    'Science-backed progressive overload hypertrophy app with custom training splits, lagging muscle prioritization, automatic rest timers, barbell plate math, 3D visualizer, and fitness insights.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#090a0f',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#f8fafc] dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 antialiased selection:bg-amber-500 selection:text-white transition-colors duration-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

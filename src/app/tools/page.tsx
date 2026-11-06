import { safeJsonLd } from '@/lib/safeJsonLd';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  LayoutGrid,
  ChevronRight,
} from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { FITNESS_TOOLS, UPCOMING_TOOLS } from '../../config/tools';
import { getToolsIndexSchema } from '../../lib/schema';
import { ToolsDirectoryList } from './ToolsDirectoryList';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: 'Free Fitness Tools & Calculators',
  description:
    'Free workout tools: 6-day PPL progressive overload tracker, BMI calculator, exercise substitution finder, and Olympic barbell plate math for lifters.',
  alternates: {
    canonical: '/tools',
  },
  openGraph: {
    title: 'Free Fitness Tools & Calculators | PPL Tracker',
    description:
      'Free workout tools: 6-day PPL progressive overload tracker, BMI calculator, exercise substitution finder, and Olympic barbell plate math for lifters.',
    url: `${baseUrl}/tools`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PPL Tracker Free Fitness Tools Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Fitness Tools & Calculators | PPL Tracker',
    description:
      'Free workout tools: 6-day PPL workout tracker, BMI calculator, and plate math.',
    images: ['/og-image.png'],
  },
};

export default function ToolsDirectoryPage() {
  const directorySchema = getToolsIndexSchema(FITNESS_TOOLS);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(directorySchema) }}
      />

      <Navbar />

      <main id="main-content" tabIndex={-1} className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-12 outline-none">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--accent-primary)] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] opacity-60" />
          <span className="text-[var(--text-primary)] font-bold">Tools Directory</span>
        </nav>

        {/* Directory Editorial Hero */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-mono font-bold tracking-wider uppercase">
            <LayoutGrid className="w-3.5 h-3.5" /> Evidence-Based Athlete Utilities
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[var(--text-primary)] leading-tight">
            Fitness Tools & Calculators
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-sans leading-relaxed">
            Eliminate guesswork from your resistance training and body composition management. Every tool in our suite is free to use, privacy-conscious, local-first, and engineered for high-performance lifters.
          </p>
        </div>

        {/* Interactive Tools Directory with Filter Tabs & Tool Cards */}
        <ToolsDirectoryList tools={FITNESS_TOOLS} upcoming={UPCOMING_TOOLS} />
      </main>

      <Footer />
    </div>
  );
}

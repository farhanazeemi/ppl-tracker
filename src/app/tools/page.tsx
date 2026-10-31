import type { Metadata } from 'next';
import Link from 'next/link';
import {
  LayoutGrid,
  ChevronRight,
} from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { FITNESS_TOOLS, UPCOMING_TOOLS } from '../../config/tools';
import { ToolsDirectoryList } from './ToolsDirectoryList';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: 'Free Fitness Tools & Workout Calculators | PPL Tracker Platform',
  description:
    'Explore free, evidence-based fitness utilities: 6-day PPL progressive overload workout tracker, BMI screening calculator with metric/imperial units, barbell plate math, and more.',
  alternates: {
    canonical: '/tools',
  },
  openGraph: {
    title: 'Free Fitness Tools & Workout Calculators | PPL Tracker Platform',
    description:
      'Explore free, evidence-based fitness utilities: 6-day PPL progressive overload workout tracker, BMI screening calculator with metric/imperial units, and more.',
    url: `${baseUrl}/tools`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'PPL Tracker Tools Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Fitness Tools & Calculators | PPL Tracker',
    description:
      'Explore free, evidence-based fitness utilities: 6-day PPL workout tracker, BMI calculator, and more.',
    images: ['/icon.svg'],
  },
};

export default function ToolsDirectoryPage() {
  const directorySchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'PPL Tracker Fitness Tools Directory',
    url: `${baseUrl}/tools`,
    description:
      'A collection of free, evidence-based workout tracking applications and body composition calculators.',
    hasPart: FITNESS_TOOLS.map((tool) => ({
      '@type': 'WebApplication',
      name: tool.name,
      url: `${baseUrl}${tool.href}`,
      description: tool.shortDescription,
    })),
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(directorySchema) }}
      />

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-12">
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

import { safeJsonLd } from '@/lib/safeJsonLd';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Dumbbell } from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { PlateLoaderCalculator } from '../../../components/tools/PlateLoaderCalculator';
import { FaqAccordion, FaqItem } from '../../../components/FaqAccordion';
import { getCalculatorToolPageSchema } from '../../../lib/schema';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: 'Barbell Plate Calculator (Olympic KG & LBS Sleeve Loader)',
  description:
    'Visual barbell plate loader calculator showing exact plates needed per side for 20kg/45lb Olympic bars, women’s bars, EZ-curl bars, and trap bars.',
  alternates: {
    canonical: '/tools/plate-calculator',
  },
  openGraph: {
    title: 'Barbell Plate Loader Calculator | PPL Tracker',
    description:
      'Visual breakdown of exact plates needed per side of a standard barbell for any target weight in kilograms or pounds.',
    url: `${baseUrl}/tools/plate-calculator`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PPL Tracker Barbell Plate Calculator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Barbell Plate Loader Calculator | PPL Tracker',
    description:
      'Visual breakdown of exact plates needed per side of a standard barbell in KG and LBS.',
    images: ['/og-image.png'],
  },
};

const PLATE_FAQS: FaqItem[] = [
  {
    question: 'How much does a standard Olympic barbell weigh?',
    answer:
      'A standard men’s Olympic weightlifting or powerlifting barbell weighs 20 kilograms (44.09 lbs, universally rounded to 45 lbs in commercial Imperial gyms). A standard women’s Olympic barbell weighs 15 kilograms (33.07 lbs, or 35 lbs in Imperial gyms) with a slightly narrower 25mm grip shaft.',
  },
  {
    question: 'How do you calculate barbell weight per side?',
    answer:
      'Subtract the empty barbell weight (e.g., 20 kg or 45 lbs) and any competition collar weight from your target total load, then divide the remaining number by 2. For example, to load 100 kg on a 20 kg Olympic barbell: (100 − 20) ÷ 2 = 40 kg per side, which equals two 20 kg blue plates on each sleeve.',
  },
  {
    question: 'Do barbell collars count toward total lifted weight?',
    answer:
      'Standard plastic spring clips or nylon lock-jaw collars weigh less than 0.25 kg per pair and are ignored in training logs. However, calibrated IPF/IWF competition metal collars weigh exactly 2.5 kg each (5 kg / 11 lbs per pair) and must be included in your total barbell calculation.',
  },
];

export default function PlateCalculatorPage() {
  const schema = getCalculatorToolPageSchema({
    name: 'Barbell Plate Loader Calculator',
    slug: 'plate-calculator',
    description:
      'Visual breakdown of exact plates needed per side of a standard barbell for any target weight in kilograms or pounds.',
    faqItems: PLATE_FAQS,
  });

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
      />
      <Navbar />

      <main id="main-content" tabIndex={-1} className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-14 outline-none">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--accent-primary)] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
          <Link href="/tools" className="hover:text-[var(--accent-primary)] transition-colors">Tools</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
          <span className="text-[var(--text-primary)] font-bold">Barbell Plate Calculator</span>
        </nav>

        <header className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-mono font-bold uppercase tracking-wider">
            <Dumbbell className="w-3.5 h-3.5" aria-hidden="true" /> Olympic Sleeve Loading & Warmup Ladder
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-[var(--text-primary)] leading-tight">
            Barbell Plate Loader Calculator
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-sans leading-relaxed">
            <strong>Direct Answer:</strong> To calculate the exact plates needed per side of a barbell, subtract the bar weight (<strong>20 kg / 45 lbs</strong> for a standard Olympic bar) from your target total load and divide by <strong>2</strong>. Load the largest available plates nearest the inner collar first and finish with fractional micro-plates on the outer sleeve.
          </p>
        </header>

        <PlateLoaderCalculator />

        <FaqAccordion items={PLATE_FAQS} title="Barbell & Olympic Plate Loading FAQ" />
      </main>

      <Footer />
    </div>
  );
}

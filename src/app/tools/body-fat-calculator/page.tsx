import { safeJsonLd } from '@/lib/safeJsonLd';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Scale, Activity } from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { BodyFatCalculator } from '../../../components/tools/BodyFatCalculator';
import { getCalculatorToolPageSchema } from '../../../lib/schema';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: 'US Navy Body Fat Calculator (Circumference Method & Lean Mass)',
  description:
    'Calculate your body fat percentage, lean body mass, and fat mass using the validated US Navy circumference method from openGym and clinical sports science.',
  alternates: {
    canonical: '/tools/body-fat-calculator',
  },
  openGraph: {
    title: 'US Navy Body Fat Calculator | PPL Tracker',
    description:
      'Estimate body fat % and lean mass using neck, waist, hip, and height measurements with the US Navy method.',
    url: `${baseUrl}/tools/body-fat-calculator`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PPL Tracker Body Fat Calculator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'US Navy Body Fat Calculator | PPL Tracker',
    description:
      'Calculate body fat % and lean mass using the validated US Navy formula.',
    images: ['/og-image.png'],
  },
};

const BODYFAT_FAQS = [
  {
    question: 'How accurate is the US Navy Body Fat equation compared to DEXA?',
    answer:
      'The US Navy circumference equation (Hodgdon & Beckett, 1984) correlates within 3–4% of dual-energy X-ray absorptiometry (DEXA) scans. Unlike standard BMI, which penalizes muscular athletes by counting muscle as fat, the Navy method accounts for waist circumference relative to neck and height, isolating visceral and subcutaneous adiposity accurately.',
  },
  {
    question: 'How should I measure my neck, waist, and hips for accurate results?',
    answer:
      'Measure in the morning before eating. Measure neck circumference just below the larynx (Adam’s apple) keeping shoulders relaxed. Measure waist horizontally at the narrowest point or at the navel level (do not suck in your stomach). Females should measure hips at the widest point around the buttocks.',
  },
  {
    question: 'What is the optimal body fat percentage for muscle hypertrophy?',
    answer:
      'For males, 10% to 15% body fat provides optimal insulin sensitivity, testosterone production, and nutrient partitioning. For females, 18% to 23% is optimal. Pushing below 8% (males) or 14% (females) suppresses natural hormone production and impairs strength progression.',
  },
];

export default function BodyFatCalculatorPage() {
  const schema = getCalculatorToolPageSchema({
    name: 'US Navy Body Fat Calculator',
    slug: 'body-fat-calculator',
    description:
      'Calculate body fat percentage and lean body mass using the validated US Navy circumference method.',
    faqItems: BODYFAT_FAQS,
  });

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
      />
      <Navbar />

      <main id="main-content" tabIndex={-1} className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 outline-none">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--accent-primary)] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/tools" className="hover:text-[var(--accent-primary)] transition-colors">Tools</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[var(--text-primary)] font-semibold">Body Fat Calculator</span>
        </nav>

        <header className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#36D6B0]/10 text-[#36D6B0] border border-[#36D6B0]/25">
            <Activity className="w-3.5 h-3.5" />
            <span>Body Composition Science</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
            US Navy Body Fat Calculator
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            Calculate your estimated body fat percentage, lean body mass, and adipose fat mass using the validated US Navy circumference equations (Hodgdon & Beckett, 1984) adapted from openGym.
          </p>
        </header>

        <BodyFatCalculator />
      </main>

      <Footer />
    </div>
  );
}

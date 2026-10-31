import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { BmiCalculator } from '../../../components/BmiCalculator';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: 'Free BMI Calculator | Body Mass Index Metric & Imperial | PPL Tracker',
  description:
    'Calculate your Body Mass Index (BMI) instantly with metric (cm/kg) and imperial (ft/in/lbs) units. Interactive visual scale, healthy weight targets, and muscle vs. fat guidance for lifters.',
  alternates: {
    canonical: '/tools/bmi-calculator',
  },
  openGraph: {
    title: 'Free BMI Calculator | Body Mass Index Metric & Imperial | PPL Tracker',
    description:
      'Calculate your Body Mass Index (BMI) instantly with metric and imperial units. Interactive visual scale, healthy weight targets, and muscle vs fat guidance for resistance athletes.',
    url: `${baseUrl}/tools/bmi-calculator`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'PPL Tracker BMI Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free BMI Calculator | PPL Tracker',
    description:
      'Instant Body Mass Index calculator with metric & imperial units and muscle-to-fat guidance for lifters.',
    images: ['/icon.svg'],
  },
};

export default function BmiCalculatorPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'PPL Tracker BMI Calculator',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'All',
    url: `${baseUrl}/tools/bmi-calculator`,
    description:
      'Instant Body Mass Index calculator with dual metric and imperial unit conversion, visual spectrum gauge, and resistance athlete context.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--accent-primary)] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] opacity-60" />
          <Link href="/tools" className="hover:text-[var(--accent-primary)] transition-colors">
            Tools
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] opacity-60" />
          <span className="text-[var(--text-primary)] font-bold">BMI Calculator</span>
        </nav>

        {/* Page Editorial Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Free Body Composition & Screening Utility
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[var(--text-primary)] leading-tight">
            Body Mass Index (BMI) Calculator
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-sans leading-relaxed">
            Screen your weight-to-height ratio against World Health Organization criteria. Supports instant switching between metric and imperial systems, calculates healthy weight targets, and highlights key considerations for muscular physique athletes.
          </p>
        </div>

        {/* The BMI Calculator Engine */}
        <BmiCalculator />

        {/* Educational FAQ / Science Foundation */}
        <section className="space-y-6 pt-8 border-t border-[var(--border-subtle)]">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent-primary)] font-bold">
              {"// Scientific Methodology"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[var(--text-primary)]">
              Understanding Body Mass Index & Its Mechanics
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-bento p-6 space-y-3">
              <h3 className="text-base font-bold uppercase text-[var(--text-primary)]">
                How is BMI Mathematically Calculated?
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                In the metric system, BMI is computed as weight in kilograms divided by height in meters squared:
              </p>
              <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--accent-primary)] font-bold">
                BMI = weight (kg) / [height (m)]²
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                In the imperial system, weight in pounds is divided by height in inches squared, then multiplied by a conversion factor of 703:
              </p>
              <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--accent-primary)] font-bold">
                BMI = 703 × weight (lbs) / [height (in)]²
              </div>
            </div>

            <div className="card-bento p-6 space-y-3">
              <h3 className="text-base font-bold uppercase text-[var(--text-primary)]">
                Why does BMI often misclassify bodybuilders?
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                BMI is blind to tissue density. Skeletal muscle is approximately 18% denser than adipose fat tissue. An individual engaging in disciplined progressive resistance training builds significant muscle mass across their legs, back, and chest.
              </p>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                As a result, a 180 cm lifter weighing 88 kg with 11% body fat has a BMI of 27.2 (&quot;Overweight&quot;), despite possessing low visceral fat and optimal biomarkers. Always interpret BMI in tandem with body composition measurements.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

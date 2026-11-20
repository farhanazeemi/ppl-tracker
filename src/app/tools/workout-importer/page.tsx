import { safeJsonLd } from '@/lib/safeJsonLd';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Upload, Database } from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { WorkoutImporter } from '../../../components/tools/WorkoutImporter';
import { getCalculatorToolPageSchema } from '../../../lib/schema';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: 'Workout History CSV Importer (Migrate from Strong, Hevy, FitNotes, openGym)',
  description:
    'Free workout history migration tool. Import your logged routines, workouts, sets, weights, and reps from Strong, Hevy, FitNotes, openGym, or CSV into PPL Tracker.',
  alternates: {
    canonical: '/tools/workout-importer',
  },
  openGraph: {
    title: 'Workout History CSV Importer | PPL Tracker',
    description:
      'Seamlessly import workouts from Strong, Hevy, FitNotes, and openGym into PPL Tracker with zero data lock-in.',
    url: `${baseUrl}/tools/workout-importer`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PPL Tracker Workout Importer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Workout History CSV Importer | PPL Tracker',
    description:
      'Migrate workout logs from Strong, Hevy, FitNotes, and openGym with auto-format detection.',
    images: ['/og-image.png'],
  },
};

const IMPORTER_FAQS = [
  {
    question: 'How do I export my workout data from Hevy?',
    answer:
      'Open the Hevy app, navigate to Profile → Settings (gear icon) → Export Data → CSV. You will receive an email with your workout history CSV file containing all sets, weights, reps, and RPE.',
  },
  {
    question: 'How do I export my workouts from the Strong app?',
    answer:
      'In Strong, tap Profile → Settings → Export Workouts → Export as CSV. The exported file includes your workout dates, exercise names, set order, weights, and completed reps.',
  },
  {
    question: 'Will importing overwrite my existing PPL Tracker history?',
    answer:
      'No. The importer merges incoming sessions into your current history log without overwriting existing entries. Duplicate sessions are automatically detected and omitted.',
  },
  {
    question: 'Is my workout data kept private and local?',
    answer:
      'Yes. All CSV processing runs 100% locally in your web browser. No workout files or personal fitness logs are uploaded to third-party tracking servers.',
  },
];

export default function WorkoutImporterPage() {
  const schema = getCalculatorToolPageSchema({
    name: 'Workout History CSV Importer',
    slug: 'workout-importer',
    description:
      'Import logged workouts from Strong, Hevy, FitNotes, openGym, or custom CSV into PPL Tracker.',
    faqItems: IMPORTER_FAQS,
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
          <span className="text-[var(--text-primary)] font-semibold">Workout Importer</span>
        </nav>

        <header className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#B7FF4A]/10 text-[#B7FF4A] border border-[#B7FF4A]/25">
            <Database className="w-3.5 h-3.5" />
            <span>Data Portability & Migration</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
            Workout History CSV Importer
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            Never lose your training history. Drag and drop CSV or JSON export files from <strong>Hevy</strong>, <strong>Strong</strong>, <strong>FitNotes</strong>, or <strong>openGym</strong> to seamlessly import your completed workouts, weights, and reps directly into PPL Tracker.
          </p>
        </header>

        <WorkoutImporter />
      </main>

      <Footer />
    </div>
  );
}

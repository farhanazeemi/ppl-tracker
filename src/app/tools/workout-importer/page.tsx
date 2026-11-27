import { safeJsonLd } from '@/lib/safeJsonLd';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Database } from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { WorkoutImporter } from '../../../components/tools/WorkoutImporter';
import { ToolCrossLinksSection } from '../../../components/tools/ToolCrossLinksSection';
import { IMPORTER_FAQS } from '../../../components/tools/toolFaqs';
import { FaqAccordion } from '../../../components/FaqAccordion';
import { getCalculatorToolPageSchema } from '../../../lib/schema';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: 'Workout CSV Importer — Strong, Hevy & FitNotes',
  description:
    'Migrate completed workouts, sets, weights, and reps from Strong, Hevy, FitNotes, or openGym CSV exports into PPL Tracker—100% private in your browser.',
  alternates: {
    canonical: '/tools/workout-importer',
  },
  openGraph: {
    title: 'Workout CSV Importer — Strong, Hevy & FitNotes | PPL Tracker',
    description:
      'Seamlessly import workouts from Strong, Hevy, FitNotes, and openGym into PPL Tracker with zero data lock-in.',
    url: `${baseUrl}/tools/workout-importer`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PPL Tracker Workout Importer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Workout CSV Importer — Strong, Hevy & FitNotes | PPL Tracker',
    description:
      'Migrate workout logs from Strong, Hevy, FitNotes, and openGym with auto-format detection.',
    images: ['/og-image.png'],
  },
};

export default function WorkoutImporterPage() {
  const schema = getCalculatorToolPageSchema({
    name: 'Workout History CSV Importer',
    pageName: 'Workout CSV Importer — Strong, Hevy & FitNotes | PPL Tracker',
    breadcrumbName: 'Workout Importer',
    slug: 'workout-importer',
    description:
      'Migrate logged workouts from Strong, Hevy, FitNotes, openGym, or custom CSV into PPL Tracker with 100% browser-local parsing.',
    faqItems: IMPORTER_FAQS,
    featureList: [
      'Auto-detects Strong, Hevy, FitNotes, openGym, and standard CSV headers',
      'Supports comma and European semicolon delimiters plus duplicate session filtering',
      '100% browser-local parsing with zero third-party log uploads',
    ],
    reviewedBy: {
      name: 'Dr. Marcus Vance, Ph.D.',
      slug: 'dr-marcus-vance',
      jobTitle: 'Lead Biomechanics Researcher & Exercise Physiologist',
    },
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
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          <Link href="/tools" className="hover:text-[var(--accent-primary)] transition-colors">Tools</Link>
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="text-[var(--text-primary)] font-semibold">Workout Importer</span>
        </nav>

        <header className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/25">
            <Database className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Data Portability &amp; Migration</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
            Workout CSV Importer — Strong, Hevy &amp; FitNotes
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            <strong>Direct Answer:</strong> Export your training history as a CSV file from <strong>Strong</strong>, <strong>Hevy</strong>, <strong>FitNotes</strong>, or <strong>openGym</strong> (using English headers and keeping raw ISO dates untouched by Excel), then drop it below to merge sessions, exercises, weights, and reps locally into{' '}
            <Link href="/tools/ppl-tracker" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
              PPL Tracker
            </Link>{' '}
            without overwriting existing PRs.
          </p>
        </header>

        <WorkoutImporter />

        {/* Supported CSV Format & Quirks Table */}
        <section className="space-y-6 pt-8 border-t border-[var(--border-subtle)]">
          <div className="space-y-2 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
              Supported Workout App CSV Formats &amp; Export Formatting Guide
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              The importer inspects your header row automatically to map exercise titles, sets, loads, and timestamps. Follow these export tips to prevent formatting issues—especially if you inspect files in spreadsheet software before uploading.
            </p>
          </div>

          <div
            className="table-responsive-region rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]"
            tabIndex={0}
            role="region"
            aria-label="Supported CSV workout formats and header rules"
          >
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <caption className="visually-hidden">Supported Workout App CSV Columns and Export Quirks</caption>
              <thead className="bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] text-[11px] font-mono uppercase text-[var(--text-secondary)]">
                <tr>
                  <th scope="col" className="py-3 px-4 font-bold text-[var(--accent-primary)]">Source App</th>
                  <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Detected Headers</th>
                  <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Delimiter &amp; Locale Notes</th>
                  <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Common Pitfalls to Avoid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-secondary)]">
                <tr>
                  <th scope="row" className="py-3 px-4 font-bold text-[var(--text-primary)]">Strong App</th>
                  <td className="py-3 px-4 font-mono text-xs">Exercise Name, Set Order, Workout Name</td>
                  <td className="py-3 px-4">Auto-supports comma (<code>,</code>) and EU semicolon (<code>;</code>)</td>
                  <td className="py-3 px-4">Export with English headers; avoid re-saving in Excel (alters dates)</td>
                </tr>
                <tr>
                  <th scope="row" className="py-3 px-4 font-bold text-[var(--text-primary)]">Hevy App</th>
                  <td className="py-3 px-4 font-mono text-xs">Exercise Title, Set Index, Start Time</td>
                  <td className="py-3 px-4">Standard UTF-8 RFC 4180 comma CSV</td>
                  <td className="py-3 px-4">Check email export link directly without altering ISO timestamps</td>
                </tr>
                <tr>
                  <th scope="row" className="py-3 px-4 font-bold text-[var(--text-primary)]">FitNotes</th>
                  <td className="py-3 px-4 font-mono text-xs">Exercise, Category, Weight Unit</td>
                  <td className="py-3 px-4">Preserves kg/lbs unit column automatically</td>
                  <td className="py-3 px-4">Keep original YYYY-MM-DD date column intact</td>
                </tr>
                <tr>
                  <th scope="row" className="py-3 px-4 font-bold text-[var(--text-primary)]">openGym / PPL JSON</th>
                  <td className="py-3 px-4 font-mono text-xs">Exercise ID / JSON Session Array</td>
                  <td className="py-3 px-4">Direct canonical exercise ID matching</td>
                  <td className="py-3 px-4">Do not truncate JSON closing brackets when exporting backups</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <ToolCrossLinksSection
          heading="Related Training Trackers & Habit Consistency Guides"
          subheading="Once your historical volume is imported, benchmark your current strength, lean mass, and habit architecture."
          reviewer={{
            name: 'Dr. Marcus Vance, Ph.D.',
            role: 'Lead Biomechanics Researcher & Exercise Physiologist',
            href: '/author/dr-marcus-vance',
            note: 'Reviewed CSV schema mapping, RFC 4180 delimiter handling, and client-side privacy guarantees.',
          }}
          tools={[
            {
              href: '/tools/ppl-tracker',
              title: 'PPL Workout Tracker',
              badge: 'View History',
              description: 'Review your newly merged workout sessions, PR volume, and progressive overload cues.',
              anchorText: 'Open your imported history in PPL Tracker',
            },
            {
              href: '/tools/one-rep-max-calculator',
              title: '1RM & Percentage Calculator',
              badge: 'Benchmark PRs',
              description: 'Convert your best imported sets into estimated 1RMs and 60%–95% training percentages.',
              anchorText: 'Convert imported sets into 1RM targets',
            },
            {
              href: '/tools/ffmi-calculator',
              title: 'FFMI Calculator',
              badge: 'Physique Baseline',
              description: 'Benchmark your lean mass progress alongside your multi-month training logs.',
              anchorText: 'Benchmark lean mass in the FFMI Calculator',
            },
          ]}
          articles={[
            {
              href: '/blog/behavioral-psychology-unbreakable-gym-habits',
              title: 'Behavioral Psychology Tricks for Unbreakable Gym Habits',
              category: 'Gym Mindset',
              description: 'Why tracking completed workout logs builds visual momentum and long-term adherence.',
              anchorText: 'Read behavioral psychology tricks for unbreakable gym habits',
            },
            {
              href: '/blog/never-miss-twice-identity-fitness-habits',
              title: 'The Never Miss Twice Rule: Identity-Based Fitness Habits',
              category: 'Gym Mindset',
              description: 'Maintain multi-year workout streaks after travel, illness, or schedule disruptions.',
              anchorText: 'Explore the Never Miss Twice identity habit framework',
            },
            {
              href: '/blog/12-week-zone-2-training-pacing-schedule',
              title: '12-Week Zone 2 Aerobic Base Training & Pacing Schedule',
              category: 'Endurance & Cardio',
              description: 'Integrate structured aerobic base sessions alongside resistance logs without recovery interference.',
              anchorText: 'View the 12-week Zone 2 aerobic pacing schedule',
            },
            {
              href: '/blog/test-track-vo2-max-without-lab-guide',
              title: 'How to Test & Track VO2 Max Without an Expensive Lab',
              category: 'Longevity & Health',
              description: 'Field-test cardiorespiratory fitness and track multi-month conditioning gains.',
              anchorText: 'Learn how to test and track VO2 max without a lab',
            },
          ]}
        />

        <FaqAccordion items={IMPORTER_FAQS} title="Workout Import & Data Migration FAQ" />
      </main>

      <Footer />
    </div>
  );
}

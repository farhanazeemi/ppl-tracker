import { safeJsonLd } from '@/lib/safeJsonLd';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Flame } from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { WarmupCalculator } from '../../../components/tools/WarmupCalculator';
import { getCalculatorToolPageSchema } from '../../../lib/schema';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: 'Barbell Warm-Up Calculator (Neural Potentiation Ramp Sets)',
  description:
    'Generate optimal barbell warm-up set progressions and plate loadings that prime the nervous system and lubricate joints without accumulating muscular fatigue.',
  alternates: {
    canonical: '/tools/warmup-calculator',
  },
  openGraph: {
    title: 'Barbell Warm-Up Set Calculator & Plate Math | PPL Tracker',
    description:
      'Generate evidence-based warm-up ramp sets with exact plate loading per side based on openGym ramping algorithms.',
    url: `${baseUrl}/tools/warmup-calculator`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PPL Tracker Warm-Up Calculator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Barbell Warm-Up Set Calculator | PPL Tracker',
    description:
      'Generate neural warm-up ladders and plate breakdowns for compound and isolation lifts.',
    images: ['/og-image.png'],
  },
};

const WARMUP_FAQS = [
  {
    question: 'Why not just jump straight into heavy working sets?',
    answer:
      'Lifting heavy loads without progressive ramping increases injury risk to tendons, ligaments, and spinal erectors. Synovial joint fluid requires progressive hydrostatic pressure to decrease viscosity. Furthermore, progressive ramp sets excite high-threshold motor units (post-activation potentiation) without exhausting the ATP-PCr phosphagen system.',
  },
  {
    question: 'Do warm-up sets count towards weekly hypertrophy volume (MEV/MAV)?',
    answer:
      'No. True hypertrophy stimulus requires sets taken close to muscular failure (0 to 3 RIR / RPE 7 to 10). Warm-up sets terminate far from failure (typically 4 to 8 RIR) and serve strictly for neural excitation and joint lubrication rather than mechanical tension.',
  },
  {
    question: 'Why do the warm-up reps decrease as the weight increases?',
    answer:
      'This follows the inverse rep-ramp principle used by elite strength athletes and coaches (and codified in openGym). The early bar-only sets use higher reps (10 reps) to promote blood flow. Later sets at 80% to 90% load only use 1 to 2 reps so you groove the neural bar path without producing muscle-fatiguing lactic acid.',
  },
];

export default function WarmupCalculatorPage() {
  const schema = getCalculatorToolPageSchema({
    name: 'Barbell Warm-Up Set Calculator',
    slug: 'warmup-calculator',
    description:
      'Generate optimal barbell warm-up set progressions and plate loadings that prime the nervous system without fatigue.',
    faqItems: WARMUP_FAQS,
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
          <span className="text-[var(--text-primary)] font-semibold">Warm-Up Calculator</span>
        </nav>

        <header className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-orange-500/10 text-orange-400 border border-orange-500/25">
            <Flame className="w-3.5 h-3.5" />
            <span>Neural Ramping Protocol</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
            Barbell Warm-Up Set Calculator
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            Eliminate guesswork before heavy working sets. Enter your target weight and reps to generate an optimal neurological warm-up progression ladder with exact barbell sleeve plate loading snapped to gym increments.
          </p>
        </header>

        <WarmupCalculator />
      </main>

      <Footer />
    </div>
  );
}

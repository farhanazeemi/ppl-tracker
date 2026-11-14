import { safeJsonLd } from '@/lib/safeJsonLd';
import type { Metadata } from 'next';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ModernSaaSLanding } from '../components/ModernSaaSLanding';
import { FITNESS_TOOLS } from '../config/tools';
import { getAllBlogPosts } from '../sanity/getPosts';
import { getWebApplicationSchema } from '../lib/schema';
import { CANONICAL_EXERCISE_DATABASE } from '../lib/workout-substitution/exerciseRepository';

const baseUrl = 'https://ppltracker.web.id';

export const revalidate = 60;

export const metadata: Metadata = {
  title: {
    absolute: 'PPL Tracker | Evidence-Based Workout & Hypertrophy App',
  },
  description:
    'Free workout tracker and hypertrophy engine: 4 training splits, double progression overload, rest timers, plate math, and exercise biomechanics journal.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'PPL Tracker | Evidence-Based Workout & Hypertrophy App',
    description:
      'Free workout tracker and hypertrophy engine: 4 training splits, double progression overload, rest timers, plate math, and exercise biomechanics journal.',
    url: baseUrl,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PPL Tracker — Evidence-Based Workout & Hypertrophy App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PPL Tracker | Evidence-Based Workout & Hypertrophy App',
    description:
      'Free workout tracker and hypertrophy engine: 4 training splits, double progression overload, rest timers, plate math, and exercise biomechanics journal.',
    images: ['/og-image.png'],
  },
};

export default async function HomePage() {
  const webAppSchema = getWebApplicationSchema();
  const allPosts = await getAllBlogPosts();
  const canonicalExerciseNames = CANONICAL_EXERCISE_DATABASE.slice(0, 24).map(
    (ex) => ({
      name: ex.name,
      primaryMuscle: ex.primaryMuscles[0] || 'Compound',
      equipment: ex.equipment[0] || 'Barbell',
    })
  );

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(webAppSchema) }}
      />

      {/* Global Navigation Bar */}
      <Navbar />

      <main id="main-content" tabIndex={-1} className="outline-none">
        <ModernSaaSLanding
          latestPosts={allPosts.slice(0, 18)}
          totalArticlesCount={allPosts.length}
          totalExercisesCount={CANONICAL_EXERCISE_DATABASE.length}
          tools={FITNESS_TOOLS}
          canonicalExerciseNames={canonicalExerciseNames}
        />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, ArrowRight, BookOpen, Layers, Activity } from 'lucide-react';
import { getAllBlogPosts } from '../../sanity/getPosts';
import { getBlogCollectionSchema } from '../../lib/schema';
import { BlogInteractiveList } from '../../components/BlogInteractiveList';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

const baseUrl = 'https://ppltracker.web.id';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Hypertrophy Science Journal | Evidence-Based Resistance Training',
  description:
    'Peer-reviewed biomechanics studies, muscle hypertrophy mechanisms, exercise selection kinematics, and progressive overload protocols from the PPL Tracker team.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Hypertrophy Science Journal | Evidence-Based Resistance Training',
    description:
      'Peer-reviewed biomechanics studies, muscle hypertrophy mechanisms, exercise selection kinematics, and progressive overload protocols.',
    url: `${baseUrl}/blog`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'PPL Hypertrophy Journal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hypertrophy Science Journal | Evidence-Based Resistance Training',
    description:
      'Peer-reviewed biomechanics studies, muscle hypertrophy mechanisms, exercise selection kinematics, and progressive overload protocols.',
    images: ['/icon.svg'],
  },
};

export default async function BlogIndexPage() {
  const posts = await getAllBlogPosts();
  const blogJsonLd = getBlogCollectionSchema(posts.length);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      {/* Top Universal Navbar */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* Editorial Hero Bento */}
        <section className="relative overflow-hidden rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-8 sm:p-12 shadow-sm card-bento">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-primary)]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Evidence-Based Resistance Training & Biomechanics
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-[var(--text-primary)] leading-tight">
              The Hypertrophy Science Journal
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-sans max-w-2xl">
              Peer-reviewed programming insights, exercise kinematics, muscle protein synthesis schedules, and progressive overload protocols directly integrated into the PPL Tracker engine.
            </p>

            {/* Quick Editorial Metrics Ticker */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs font-mono tabular-nums text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[var(--accent-primary)]" />
                <span>
                  <strong className="text-[var(--text-primary)] font-bold">{posts.length}</strong> Peer-Reviewed Guides
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--accent-secondary)]" />
                <span>
                  <strong className="text-[var(--text-primary)] font-bold">10</strong> Biomechanical Clusters
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[var(--accent-primary)]" />
                <span>
                  <strong className="text-[var(--text-primary)] font-bold">100%</strong> Open-Access Data
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Client Interactive Filter & Pre-rendered Article Grid */}
        <BlogInteractiveList initialPosts={posts} />

        {/* Bottom CTA Banner */}
        <section className="rounded-3xl bg-[var(--bg-card)] border border-[var(--accent-primary)]/30 p-8 sm:p-12 text-[var(--text-primary)] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl card-bento relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[var(--accent-primary)]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-2 max-w-xl text-center md:text-left relative z-10">
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
              Ready to Put Hypertrophy Science into Practice?
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              PPL Tracker automatically applies double progression ceilings, optimal rest intervals, and lagging muscle priorities to your workout routine.
            </p>
          </div>
          <Link
            href="/tools/ppl-tracker"
            className="px-6 py-3.5 bg-[var(--accent-primary)] hover:opacity-95 text-black font-display font-bold uppercase tracking-wider text-xs rounded-xl transition-all btn-tactile shadow-lg shadow-[var(--accent-primary)]/20 whitespace-nowrap flex items-center gap-2 relative z-10"
          >
            Launch Free Workout Tracker <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>

      {/* Structured Minimalist Footer */}
      <Footer />
    </div>
  );
}

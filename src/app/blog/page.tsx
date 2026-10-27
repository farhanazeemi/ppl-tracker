import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { getAllBlogPosts } from '../../sanity/getPosts';
import { getBlogCollectionSchema } from '../../lib/schema';
import { ThemeToggle } from '../../components/ThemeToggle';
import { BlogInteractiveList } from '../../components/BlogInteractiveList';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

const baseUrl = 'https://ppltracker.web.id';

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
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      {/* Top Universal Navbar */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* Editorial Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-100 via-white to-zinc-100 dark:from-zinc-900 dark:via-[#12141c] dark:to-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 sm:p-12">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Evidence-Based Resistance Training & Biomechanics
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-zinc-900 dark:text-white leading-none">
              The Hypertrophy Science Journal
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans max-w-2xl">
              Peer-reviewed programming insights, exercise kinematics, muscle protein synthesis schedules, and progressive overload protocols directly integrated into the PPL Tracker engine.
            </p>
          </div>
        </section>

        {/* Client Interactive Filter & Pre-rendered Article Grid */}
        <BlogInteractiveList initialPosts={posts} />

        {/* Bottom CTA Banner */}
        <section className="rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 p-8 sm:p-12 text-black flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight">
              Ready to Put Hypertrophy Science into Practice?
            </h2>
            <p className="text-sm font-medium text-black/80">
              PPL Tracker automatically applies double progression ceilings, optimal rest intervals, and lagging muscle priorities to your routine.
            </p>
          </div>
          <Link
            href="/"
            className="px-6 py-3.5 bg-black hover:bg-zinc-900 text-white font-display font-black uppercase tracking-wider text-xs rounded-xl transition-all btn-tactile shadow-lg whitespace-nowrap flex items-center gap-2"
          >
            Launch Free Workout Tracker <ArrowRight className="w-4 h-4 text-amber-500" />
          </Link>
        </section>
      </main>

      {/* Structured Minimalist Footer */}
      <Footer />
    </div>
  );
}

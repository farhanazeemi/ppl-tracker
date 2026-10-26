import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { getAllBlogPosts } from '../../sanity/getPosts';
import { ThemeToggle } from '../../components/ThemeToggle';
import { BlogInteractiveList } from '../../components/BlogInteractiveList';

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

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${baseUrl}/blog#collection`,
    url: `${baseUrl}/blog`,
    name: 'The Hypertrophy Science Journal',
    description:
      'Peer-reviewed resistance training insights, muscle hypertrophy mechanisms, exercise kinematics, and progressive overload protocols.',
    publisher: {
      '@type': 'Organization',
      name: 'PPL Hypertrophy Tracker',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icon.svg`,
      },
    },
    hasPart: posts.map((p) => ({
      '@type': 'Article',
      headline: p.title,
      url: `${baseUrl}/blog/${p.slug}`,
      datePublished: p.publishedAt,
    })),
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-[#090a0f]/80 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-black font-black font-display text-lg tracking-wider shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                PPL
              </div>
              <div>
                <span className="font-display font-black text-lg tracking-tight uppercase block leading-none text-zinc-900 dark:text-white">
                  HYPERTROPHY<span className="text-amber-500">.</span>
                </span>
                <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-600 dark:text-zinc-400 block">
                  Science Journal
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-xs font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              <Link href="/" className="hover:text-amber-500 transition-colors">
                Workout Tracker
              </Link>
              <Link href="/blog" className="text-amber-500 font-bold">
                Articles & Science
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-display font-bold uppercase tracking-wider rounded-xl transition shadow-md shadow-amber-500/15 flex items-center gap-1.5"
            >
              Open Tracker <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

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
            className="px-6 py-3.5 bg-black hover:bg-zinc-900 text-white font-display font-bold uppercase tracking-wider text-xs rounded-xl transition-transform active:scale-95 shadow-lg whitespace-nowrap flex items-center gap-2"
          >
            Launch Free Workout Tracker <ArrowRight className="w-4 h-4 text-amber-500" />
          </Link>
        </section>
      </main>
    </div>
  );
}

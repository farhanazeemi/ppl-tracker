import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  Dumbbell,
  Sparkles,
  ArrowRight,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { getBlogPostBySlug, getRecentPosts, getAllBlogPosts } from '../../../sanity/getPosts';
import { ThemeToggle } from '../../../components/ThemeToggle';
import { ShareButton } from '../../../components/ShareButton';
import { formatPostDate } from '../../../data/mockBlogPosts';

const baseUrl = 'https://ppltracker.web.id';

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found',
      robots: { index: false, follow: false },
    };
  }

  const postUrl = `${baseUrl}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: (post.categories || []).map((c) => c.title),
      siteName: 'PPL Hypertrophy Tracker',
      images: [
        {
          url: post.mainImage || '/icon.svg',
          width: 1200,
          height: 630,
          alt: post.imageAlt || post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.mainImage || '/icon.svg'],
      creator: '@farhanazeemi',
    },
  };
}

export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const recent = await getRecentPosts(post.slug);
  const postUrl = `${baseUrl}/blog/${post.slug}`;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${postUrl}#article`,
    headline: post.title,
    description: post.excerpt,
    image: post.mainImage ? [post.mainImage] : [`${baseUrl}/icon.svg`],
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'PPL Hypertrophy Tracker',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icon.svg`,
      },
    },
    keywords: [
      post.splitCategory,
      ...(post.categories || []).map((c) => c.title),
      'hypertrophy',
      'progressive overload',
      'biomechanics',
    ].join(', '),
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-[#090a0f]/80 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase text-zinc-600 dark:text-zinc-400 hover:text-amber-500 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> All Articles
          </Link>

          <div className="flex items-center gap-3">
            <ShareButton />
            <ThemeToggle />
            <Link
              href="/"
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-black text-xs font-display font-bold uppercase rounded-xl transition shadow-md shadow-amber-500/15"
            >
              Open Tracker
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Article Header */}
        <article className="space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-mono font-bold">
              {post.splitCategory}
            </span>
            {(post.categories || []).map((c, idx) => (
              <span
                key={c?.slug || c?.title || idx}
                className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-mono font-medium"
              >
                {c?.title}
              </span>
            ))}
            <span className="flex items-center gap-1 text-xs font-mono text-zinc-600 dark:text-zinc-400 ml-auto">
              <Clock className="w-3.5 h-3.5" /> {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-zinc-900 dark:text-white leading-tight">
            {post.title}
          </h1>

          {/* Author info card with Post Date */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              {post.author.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-11 h-11 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-display font-bold text-amber-500 text-base">
                  {post.author.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {post.author.name}
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                  {post.author.role}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>Published {formatPostDate(post.publishedAt)}</span>
            </div>
          </div>

          {/* Featured Cover Image */}
          {post.mainImage && (
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl bg-zinc-100 dark:bg-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.mainImage}
                alt={post.imageAlt || post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Lead Excerpt */}
          <div className="p-6 bg-zinc-100 dark:bg-zinc-900/60 border-l-4 border-amber-500 rounded-r-2xl">
            <p className="text-base sm:text-lg text-zinc-800 dark:text-zinc-200 font-sans leading-relaxed italic">
              &quot;{post.excerpt}&quot;
            </p>
          </div>

          {/* Article Body Sections with Related Section Images */}
          <div className="space-y-8 text-zinc-800 dark:text-zinc-300 font-sans leading-relaxed text-sm sm:text-base">
            <p className="text-base leading-relaxed">{post.content.introduction}</p>

            {post.content.sections.map((section, idx) => (
              <div key={idx} className="space-y-3 pt-4">
                <h2 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-tight text-zinc-900 dark:text-white">
                  {section.heading}
                </h2>
                <p className="leading-relaxed whitespace-pre-line">{section.body}</p>

                {/* Related Section Image */}
                {section.image && (
                  <figure className="my-6 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={section.image}
                      alt={section.imageCaption || section.heading}
                      className="w-full max-h-[420px] object-cover"
                    />
                    {section.imageCaption && (
                      <figcaption className="p-3.5 text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-white dark:bg-[#12141c] border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                        <span className="text-amber-500 font-bold uppercase tracking-wider">Fig {idx + 1}</span>
                        <span>—</span>
                        <span>{section.imageCaption}</span>
                      </figcaption>
                    )}
                  </figure>
                )}

                {section.keyTakeaway && (
                  <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-zinc-900 dark:text-zinc-100 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-amber-500">
                      <Sparkles className="w-4 h-4 text-amber-500" /> Key Biomechanical Takeaway
                    </div>
                    <p className="text-xs sm:text-sm font-semibold">{section.keyTakeaway}</p>
                  </div>
                )}
              </div>
            ))}

            {post.content.conclusion && (
              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <h3 className="text-lg font-display font-bold uppercase text-zinc-900 dark:text-white mb-2">
                  Clinical Summary
                </h3>
                <p className="leading-relaxed">{post.content.conclusion}</p>
              </div>
            )}
          </div>
        </article>

        {/* Action Callout for Workout Tracker */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-zinc-900 to-[#12141c] border border-amber-500/30 text-white space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-500 uppercase">
            <Dumbbell className="w-4 h-4" /> Integrated Overload Technology
          </div>
          <h3 className="text-2xl font-display font-bold uppercase tracking-tight">
            Apply These Principles Today in Your Scheduled Workout
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl">
            PPL Tracker automatically implements 15°–30° incline angles, sets target rep ceilings, provides automatic rest timers with audio countdowns, and prioritizes your chosen weak points.
          </p>
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-display font-bold uppercase tracking-wider text-xs rounded-xl transition shadow-lg shadow-amber-500/20 active:scale-95"
            >
              Start Tracking This Session <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Related Articles with Featured Image & Post Date */}
        {recent.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <h3 className="text-xl font-display font-bold uppercase tracking-tight text-zinc-900 dark:text-white">
              Related Scientific Studies
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {recent.map((rec) => (
                <Link
                  key={rec._id}
                  href={`/blog/${rec.slug}`}
                  className="rounded-2xl overflow-hidden bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/40 transition flex flex-col justify-between group shadow-sm hover:shadow-md"
                >
                  {/* Related Article Thumbnail */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    {rec.mainImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={rec.mainImage}
                        alt={rec.imageAlt || rec.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-200 dark:bg-zinc-800">
                        <Dumbbell className="w-8 h-8 text-zinc-400" />
                      </div>
                    )}
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-amber-400 text-[10px] font-mono font-bold">
                      {rec.splitCategory}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
                        <span className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300">
                          <Calendar className="w-3 h-3 text-amber-500" />
                          {formatPostDate(rec.publishedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {rec.readTime}
                        </span>
                      </div>

                      <h4 className="text-sm font-display font-bold uppercase text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-2">
                        {rec.title}
                      </h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">{rec.excerpt}</p>
                    </div>

                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                      <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium truncate max-w-[120px]">
                        {rec.author.name}
                      </span>
                      <span className="font-mono font-bold text-amber-500 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                        Study <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

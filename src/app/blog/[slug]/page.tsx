import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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
import { getArticleSchema } from '../../../lib/schema';
import { ShareButton } from '../../../components/ShareButton';
import { formatPostDate } from '../../../data/mockBlogPosts';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { TableOfContents } from '../../../components/TableOfContents';
import { FaqAccordion } from '../../../components/FaqAccordion';
import { ArticlePortableText } from '../../../components/ArticlePortableText';
import { processArticleBody } from '../../../utils/articleContent';

const baseUrl = 'https://ppltracker.web.id';

export const revalidate = 60;
export const dynamicParams = true;

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
  const modifiedDate = post.modifiedAt || post.publishedAt;

  return {
    title: `${post.title} | PPL Hypertrophy Tracker`,
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
      modifiedTime: modifiedDate,
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
  const { toc, faqs, mainBlocks } = processArticleBody(post.rawBody, post.title);

  const articleJsonLd = getArticleSchema({
    ...post,
    faqItems: faqs,
    modifiedAt: post.modifiedAt,
  });

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Top Global Navigation Bar */}
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        {/* Sub-header Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> All Articles
          </Link>
          <ShareButton />
        </div>

        {/* Article Header */}
        <article className="space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 text-xs font-mono font-bold">
              {post.splitCategory}
            </span>
            {(post.categories || []).map((c, idx) => (
              <span
                key={c?.slug || c?.title || idx}
                className="px-3 py-1 rounded-full bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)] text-xs font-mono font-medium"
              >
                {c?.title}
              </span>
            ))}
            <span className="flex items-center gap-1.5 text-xs font-mono tabular-nums text-[var(--text-muted)] ml-auto">
              <Clock className="w-3.5 h-3.5" /> {post.readTime}
            </span>
          </div>

          {/* Strict Single H1 rule per AGENTS.md */}
          <h1 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-[var(--text-primary)] leading-tight">
            {post.title}
          </h1>

          {/* Author info card with Post Date and Modification Date */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[var(--border-subtle)]">
            <div className="flex items-center gap-3">
              {post.author.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-11 h-11 rounded-full object-cover border border-[var(--border-subtle)]"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/30 flex items-center justify-center font-display font-bold text-[var(--accent-primary)] text-base">
                  {post.author.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="text-sm font-bold text-[var(--text-primary)]">
                  {post.author.name}
                </div>
                <div className="text-xs text-[var(--text-muted)] font-medium">
                  {post.author.role}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono tabular-nums text-[var(--text-secondary)] bg-[var(--bg-card)] px-3 py-1.5 rounded-xl border border-[var(--border-subtle)]">
              <Calendar className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>Published {formatPostDate(post.publishedAt)}</span>
            </div>
          </div>

          {/* Featured Cover Image - LCP Optimized with priority */}
          {post.mainImage && (
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-3xl border border-[var(--border-subtle)] shadow-xl bg-[var(--bg-elevated)]">
              <Image
                src={post.mainImage}
                alt={post.imageAlt || post.title}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          )}

          {/* Lead Excerpt / Key Takeaway */}
          <div className="p-6 bg-[var(--bg-card)] border-l-4 border-[var(--accent-primary)] rounded-r-2xl border-y border-r border-[var(--border-subtle)]">
            <p className="text-base sm:text-lg text-[var(--text-primary)] font-sans leading-relaxed italic">
              &quot;{post.excerpt}&quot;
            </p>
          </div>

          {/* Dynamic Table of Contents for Long Articles */}
          {toc.length >= 3 && <TableOfContents items={toc} />}

          {/* Article Body Content */}
          <div className="space-y-6 text-[var(--text-secondary)] font-sans leading-relaxed text-sm sm:text-base">
            {mainBlocks && mainBlocks.length > 0 ? (
              <ArticlePortableText value={mainBlocks} />
            ) : (
              // Fallback for mock or string content
              <>
                <p className="text-base leading-relaxed text-[var(--text-primary)]">{post.content.introduction}</p>
                {post.content.sections.map((section, idx) => (
                  <div key={idx} className="space-y-3 pt-4">
                    <h2 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-tight text-[var(--text-primary)]">
                      {section.heading}
                    </h2>
                    <p className="leading-relaxed whitespace-pre-line text-[var(--text-secondary)]">{section.body}</p>

                    {section.keyTakeaway && (
                      <div className="mt-4 p-4 rounded-2xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 text-[var(--text-primary)] space-y-1">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[var(--accent-primary)]">
                          <Sparkles className="w-4 h-4" /> Key Biomechanical Takeaway
                        </div>
                        <p className="text-xs sm:text-sm font-semibold">{section.keyTakeaway}</p>
                      </div>
                    )}
                  </div>
                ))}
                {post.content.conclusion && (
                  <div className="pt-6 border-t border-[var(--border-subtle)]">
                    <h3 className="text-lg font-display font-bold uppercase text-[var(--text-primary)] mb-2">
                      Clinical Summary
                    </h3>
                    <p className="leading-relaxed text-[var(--text-secondary)]">{post.content.conclusion}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Interactive Accessible FAQ Accordion */}
          {faqs.length > 0 && <FaqAccordion items={faqs} />}
        </article>

        {/* Action Callout for Workout Tracker per AGENTS.md Mandatory Internal Linking */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--accent-primary)]/35 text-[var(--text-primary)] space-y-4 shadow-xl card-bento relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--accent-primary)]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--accent-primary)] uppercase relative z-10">
            <Dumbbell className="w-4 h-4" /> Integrated Overload Technology
          </div>
          <h3 className="text-2xl font-display font-bold uppercase tracking-tight relative z-10">
            Apply These Principles Today in Your Scheduled Workout
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl relative z-10">
            Once you&apos;ve chosen your exercises and target weekly set landmarks, use the{' '}
            <Link
              href="/tools/ppl-tracker"
              className="text-[var(--accent-primary)] underline font-semibold hover:opacity-90 transition-opacity"
            >
              PPL Tracker workout tool
            </Link>{' '}
            to record your sets, reps, audio rest countdowns, and progressive overload history.
          </p>
          <div className="relative z-10">
            <Link
              href="/tools/ppl-tracker"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-primary)] hover:opacity-95 text-black font-display font-bold uppercase tracking-wider text-xs rounded-xl transition-all btn-tactile shadow-lg shadow-[var(--accent-primary)]/20 active:scale-95"
            >
              Launch Free Workout Tracker <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Related Articles with Featured Image & Post Date */}
        {recent.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-[var(--border-subtle)]">
            <h3 className="text-xl font-display font-bold uppercase tracking-tight text-[var(--text-primary)]">
              Related Scientific Studies
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {recent.map((rec) => (
                <Link
                  key={rec._id}
                  href={`/blog/${rec.slug}`}
                  className="rounded-3xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md card-bento"
                >
                  {/* Related Article Thumbnail */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--bg-elevated)]">
                    {rec.mainImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={rec.mainImage}
                        alt={rec.imageAlt || rec.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[var(--bg-elevated)]">
                        <Dumbbell className="w-8 h-8 text-[var(--text-muted)]" />
                      </div>
                    )}
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 text-[10px] font-mono font-bold">
                      {rec.splitCategory}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-[var(--text-muted)]">
                        <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                          <Calendar className="w-3 h-3 text-[var(--accent-primary)]" />
                          {formatPostDate(rec.publishedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {rec.readTime}
                        </span>
                      </div>

                      <h4 className="text-sm font-display font-bold uppercase text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors line-clamp-2">
                        {rec.title}
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{rec.excerpt}</p>
                    </div>

                    <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                      <span className="text-xs text-[var(--text-muted)] font-medium truncate max-w-[120px]">
                        {rec.author.name}
                      </span>
                      <span className="font-mono font-bold text-[var(--accent-primary)] flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
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

      {/* Structured Minimalist Footer */}
      <Footer />
    </div>
  );
}

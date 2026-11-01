import { safeJsonLd } from '@/lib/safeJsonLd';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Dumbbell,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { getAuthorBySlug, getAllAuthors, getPostsByAuthor } from '@/sanity/getPosts';
import { getAuthorProfileSchema } from '@/lib/schema';
import { formatPostDate } from '@/data/mockBlogPosts';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const baseUrl = 'https://ppltracker.web.id';

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const authors = await getAllAuthors();
  return authors.map((author) => ({
    slug: author.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    return {
      title: 'Author Not Found | PPL Hypertrophy Tracker',
      robots: { index: false, follow: false },
    };
  }

  const authorUrl = `${baseUrl}/author/${author.slug}`;

  return {
    title: `${author.name} — Sports Science Author & Biomechanics Researcher | PPL Tracker`,
    description: author.bio,
    alternates: {
      canonical: `/author/${author.slug}`,
    },
    openGraph: {
      title: `${author.name} — Author Profile & Research`,
      description: author.bio,
      url: authorUrl,
      type: 'profile',
      images: [
        {
          url: author.avatar || '/icon.svg',
          width: 600,
          height: 600,
          alt: author.name,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: author.name,
      description: author.bio,
      images: [author.avatar || '/icon.svg'],
    },
  };
}

export default async function AuthorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const posts = await getPostsByAuthor(author.slug);
  const authorSchema = getAuthorProfileSchema(author);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(authorSchema) }}
      />

      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-[var(--text-secondary)]">
          <Link
            href="/blog"
            className="hover:text-[var(--accent-primary)] transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Journal
          </Link>
          <span className="text-[var(--border-subtle)]">/</span>
          <Link href="/author" className="hover:text-[var(--accent-primary)] transition-colors">
            Authors
          </Link>
          <span className="text-[var(--border-subtle)]">/</span>
          <span className="text-[var(--accent-primary)] font-bold">{author.name}</span>
        </div>

        {/* Author Bio Bento Header */}
        <section className="relative overflow-hidden rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 sm:p-10 shadow-sm card-bento space-y-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--accent-primary)]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
            {author.avatar ? (
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-[var(--accent-primary)]/40 shadow-xl shrink-0 bg-[var(--bg-elevated)]">
                <Image
                  src={author.avatar}
                  alt={author.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[var(--accent-primary)]/15 border-2 border-[var(--accent-primary)]/40 flex items-center justify-center font-display font-black text-[var(--accent-primary)] text-3xl sm:text-4xl shadow-xl shrink-0">
                {author.name.charAt(0)}
              </div>
            )}

            <div className="space-y-2 flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-mono font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Science Contributor
              </div>
              <h1 className="text-2xl sm:text-4xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
                {author.name}
              </h1>
              <p className="text-xs sm:text-sm font-mono text-[var(--text-secondary)] font-semibold">
                {author.role}
              </p>
            </div>
          </div>

          {/* Bio paragraph */}
          <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)] relative z-10">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)] font-bold">
              About the Researcher
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-sans">
              {author.bio}
            </p>
          </div>

          {/* Credentials & Education Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 relative z-10">
            {author.credentials && author.credentials.length > 0 && (
              <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--accent-primary)] uppercase">
                  <Award className="w-4 h-4" /> Board Certifications & Accreditations
                </div>
                <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                  {author.credentials.map((cred, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" />
                      <span>{cred}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {author.education && author.education.length > 0 && (
              <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--accent-secondary)] uppercase">
                  <GraduationCap className="w-4 h-4" /> Academic Background
                </div>
                <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                  {author.education.map((edu, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-secondary)] shrink-0" />
                      <span>{edu}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Editorial Guidelines Statement for Google E-E-A-T */}
          <div className="p-4 rounded-2xl bg-[var(--bg-main)]/80 border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] space-y-1.5 relative z-10">
            <div className="flex items-center gap-1.5 font-mono font-bold text-[var(--text-primary)] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" /> Editorial Standards & Peer Review
            </div>
            <p className="leading-relaxed">
              Every article published by {author.name} is grounded in peer-reviewed exercise physiology (e.g. Journal of Strength and Conditioning Research, Sports Medicine, ACSM). Practical workout protocols are cross-verified against EMG kinematics, mechanical tension thresholds, and progressive overload data.
            </p>
          </div>
        </section>

        {/* Published Articles by Author */}
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[var(--accent-primary)]">
                <BookOpen className="w-4 h-4" /> Authored Research Publications
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-tight text-[var(--text-primary)]">
                Articles by {author.name} ({posts.length})
              </h2>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-muted)]">
              No articles currently indexed for this researcher.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="rounded-3xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md card-bento"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--bg-elevated)]">
                    {post.mainImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.mainImage}
                        alt={post.imageAlt || post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[var(--bg-elevated)]">
                        <Dumbbell className="w-8 h-8 text-[var(--text-muted)]" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 text-xs font-mono font-bold">
                      {post.splitCategory}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono tabular-nums text-[var(--text-muted)]">
                        <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                          <Calendar className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                          {formatPostDate(post.publishedAt)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime}
                        </span>
                      </div>

                      <h3 className="text-base font-display font-bold uppercase text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                      <span className="font-mono text-[var(--text-muted)] text-[11px]">
                        Peer-Reviewed Study
                      </span>
                      <span className="font-mono font-bold text-[var(--accent-primary)] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read Investigation <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Internal Link to Workout Tracker */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--accent-primary)]/30 text-[var(--text-primary)] space-y-3 card-bento">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--accent-primary)] uppercase">
            <Dumbbell className="w-4 h-4" /> Practical Hypertrophy Implementation
          </div>
          <h3 className="text-xl font-display font-bold uppercase tracking-tight">
            Put This Research to Work in the Gym
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
            All progressive overload ceilings and biomechanics cues published by our research team are pre-programmed into the free{' '}
            <Link href="/tools/ppl-tracker" className="text-[var(--accent-primary)] underline font-semibold">
              PPL Tracker application
            </Link>.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

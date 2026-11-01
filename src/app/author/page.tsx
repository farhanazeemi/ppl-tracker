import { safeJsonLd } from '@/lib/safeJsonLd';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Award,
  BookOpen,
  ArrowRight,
  ChevronRight,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { getAllAuthors, getAllBlogPosts } from '@/sanity/getPosts';
import { getAuthorsIndexSchema } from '@/lib/schema';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const baseUrl = 'https://ppltracker.web.id';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Scientific Editorial Board & Verified Authors | PPL Hypertrophy Tracker',
  description:
    'Meet the biomechanics researchers, strength coaches, and sports science contributors behind PPL Hypertrophy Tracker. Evidence-based peer review guidelines.',
  alternates: {
    canonical: '/author',
  },
  openGraph: {
    title: 'Scientific Authors & Editorial Board | PPL Hypertrophy Tracker',
    description:
      'Meet the biomechanics researchers, strength coaches, and sports science contributors behind PPL Hypertrophy Tracker.',
    url: `${baseUrl}/author`,
    type: 'website',
  },
};

export default async function AuthorsIndexPage() {
  const [authors, allPosts] = await Promise.all([getAllAuthors(), getAllBlogPosts()]);
  const schema = getAuthorsIndexSchema(authors.length);

  // Map author post counts
  const postCountsByAuthor: Record<string, number> = {};
  allPosts.forEach((p) => {
    const aSlug = p.author?.slug || 'dr-marcus-vance';
    postCountsByAuthor[aSlug] = (postCountsByAuthor[aSlug] || 0) + 1;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
      />

      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-8 sm:p-12 shadow-sm card-bento space-y-4">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--accent-primary)]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-mono font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> E-E-A-T Editorial Board & Standards
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-[var(--text-primary)] leading-tight">
              Our Sports Science & Research Team
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-sans">
              All guides and biomechanical breakdowns published on PPL Tracker are produced by exercise physiologists, certified strength and conditioning coaches, and natural physique athletes.
            </p>
          </div>
        </section>

        {/* Authors Grid */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {authors.map((author) => {
              const count = postCountsByAuthor[author.slug] || 0;
              return (
                <div
                  key={author.slug}
                  className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40 transition-all flex flex-col justify-between space-y-5 shadow-sm card-bento"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      {author.avatar ? (
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shrink-0">
                          <Image
                            src={author.avatar}
                            alt={author.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/30 text-[var(--accent-primary)] font-display font-black text-2xl flex items-center justify-center shrink-0">
                          {author.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h2 className="text-base font-display font-bold uppercase text-[var(--text-primary)]">
                          {author.name}
                        </h2>
                        <p className="text-xs font-mono text-[var(--text-secondary)] line-clamp-1">
                          {author.role}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                      {author.bio}
                    </p>

                    {author.credentials && author.credentials.length > 0 && (
                      <div className="pt-2 border-t border-[var(--border-subtle)] space-y-1">
                        <div className="text-[10px] font-mono uppercase text-[var(--accent-primary)] font-bold flex items-center gap-1">
                          <Award className="w-3 h-3" /> Credentials
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)] line-clamp-2">
                          {author.credentials.join(' • ')}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                    <span className="text-xs font-mono tabular-nums text-[var(--text-muted)]">
                      {count > 0 ? `${count} Articles` : 'Researcher'}
                    </span>
                    <Link
                      href={`/author/${author.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[var(--accent-primary)] hover:underline"
                    >
                      View Profile <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Editorial Integrity & Anti-Bro-Science Standards */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[var(--accent-primary)]">
            <Sparkles className="w-4 h-4" /> Evidence & Peer-Review Policy
          </div>
          <h3 className="text-xl font-display font-bold uppercase text-[var(--text-primary)]">
            How We Evaluate Hypertrophy Research
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[var(--text-secondary)] leading-relaxed">
            <div className="space-y-1.5 p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
              <div className="font-bold text-[var(--text-primary)] uppercase font-mono">
                1. Primary Sources Only
              </div>
              <p>
                We cite peer-reviewed clinical studies (Schoenfeld, Helms, Morton, Phillips) rather than fitness influencer assertions.
              </p>
            </div>
            <div className="space-y-1.5 p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
              <div className="font-bold text-[var(--text-primary)] uppercase font-mono">
                2. Biomechanical Precision
              </div>
              <p>
                Every exercise cue matches anatomical fiber origin, bicipital grooves, and moment arm resistance profiles.
              </p>
            </div>
            <div className="space-y-1.5 p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
              <div className="font-bold text-[var(--text-primary)] uppercase font-mono">
                3. Real-World Application
              </div>
              <p>
                Scientific insights are codified directly into the PPL Tracker workout engine for real progressive overload tracking.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

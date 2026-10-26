'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  User,
  Share2,
  CheckCircle2,
  Dumbbell,
  Sparkles,
  ArrowRight,
  BookOpen,
  Calendar,
  Layers
} from 'lucide-react';
import { getBlogPostBySlug, getRecentPosts } from '../../../sanity/getPosts';
import { BlogPost } from '../../../data/mockBlogPosts';
import { ThemeToggle } from '../../../components/ThemeToggle';

export default function BlogPostDetail() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [recent, setRecent] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    async function loadPost() {
      setIsLoading(true);
      try {
        const data = await getBlogPostBySlug(slug);
        setPost(data);
        if (data) {
          const rec = await getRecentPosts(data.slug);
          setRecent(rec);
        }
      } catch (e) {
        console.error('Error fetching post:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadPost();
  }, [slug]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090a0f] flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono uppercase text-zinc-500">Loading Article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <BookOpen className="w-12 h-12 text-zinc-400 mx-auto" />
          <h1 className="text-2xl font-display font-bold uppercase">Article Not Found</h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            The requested scientific article does not exist or has been relocated.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-black text-xs font-bold uppercase rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Journal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
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
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copied ? 'Link Copied!' : 'Share'}
            </button>
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

          {/* Author info card */}
          <div className="flex items-center gap-4 py-4 border-y border-zinc-200 dark:border-zinc-800">
            <div className="w-11 h-11 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-display font-bold text-amber-500 text-base">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {post.author.name}
              </div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                {post.author.role}
              </div>
            </div>
            <div className="ml-auto text-xs font-mono text-zinc-600 dark:text-zinc-400 hidden sm:flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>

          {/* Lead Excerpt */}
          <div className="p-6 bg-zinc-100 dark:bg-zinc-900/60 border-l-4 border-amber-500 rounded-r-2xl">
            <p className="text-base sm:text-lg text-zinc-800 dark:text-zinc-200 font-sans leading-relaxed italic">
              &quot;{post.excerpt}&quot;
            </p>
          </div>

          {/* Article Body Sections */}
          <div className="space-y-8 text-zinc-800 dark:text-zinc-300 font-sans leading-relaxed text-sm sm:text-base">
            <p className="text-base leading-relaxed">{post.content.introduction}</p>

            {post.content.sections.map((section, idx) => (
              <div key={idx} className="space-y-3 pt-4">
                <h2 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-tight text-zinc-900 dark:text-white">
                  {section.heading}
                </h2>
                <p className="leading-relaxed whitespace-pre-line">{section.body}</p>

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

        {/* Related Articles */}
        {recent.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <h3 className="text-xl font-display font-bold uppercase tracking-tight text-zinc-900 dark:text-white">
              Related Scientific Studies
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recent.map((rec) => (
                <Link
                  key={rec._id}
                  href={`/blog/${rec.slug}`}
                  className="p-4 rounded-2xl bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/40 transition block space-y-2 group shadow-sm hover:shadow-md"
                >
                  <span className="text-[10px] font-mono text-amber-500 uppercase font-bold">
                    {rec.splitCategory}
                  </span>
                  <h4 className="text-sm font-display font-bold uppercase text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-2">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">{rec.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Clock,
  User,
  ArrowRight,
  Search,
  Filter,
  Sparkles,
  Dumbbell,
  ChevronRight,
  Bookmark,
  Share2
} from 'lucide-react';
import { getAllBlogPosts } from '../../sanity/getPosts';
import { BlogPost } from '../../data/mockBlogPosts';
import { ThemeToggle } from '../../components/ThemeToggle';

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllBlogPosts();
        setPosts(data);
      } catch (err) {
        console.error('Failed to load blog posts:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const categories = ['All', 'Biomechanics', 'Hypertrophy', 'Split Design', 'Progressive Overload'];

  const filteredPosts = posts.filter((p) => {
    const matchesCat =
      selectedCategory === 'All' ||
      p.categories.some((c) => c.title.toLowerCase() === selectedCategory.toLowerCase()) ||
      p.splitCategory.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesSearch;
  });

  const featuredPost = posts[0];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
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

        {/* Search & Category Filter */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                      : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono transition"
              />
            </div>
          </div>
        </section>

        {/* Featured Spotlight Card */}
        {featuredPost && selectedCategory === 'All' && !searchQuery && (
          <section>
            <div className="text-xs font-mono uppercase tracking-widest text-amber-500 font-semibold mb-3">
              ★ Featured Investigation
            </div>
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group block relative overflow-hidden rounded-3xl bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 hover:border-amber-500/50 transition-all shadow-xl hover:shadow-2xl hover:shadow-amber-500/5"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-mono font-bold">
                      {featuredPost.splitCategory}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                      <Clock className="w-3.5 h-3.5" /> {featuredPost.readTime}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors">
                    {featuredPost.title}
                  </h2>

                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans line-clamp-3">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-700 dark:text-zinc-300">
                        {featuredPost.author.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                          {featuredPost.author.name}
                        </div>
                        <div className="text-[11px] text-zinc-600 dark:text-zinc-400">
                          {featuredPost.author.role}
                        </div>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-amber-500 group-hover:translate-x-1 transition-transform">
                      Read Full Article <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent p-6 rounded-2xl border border-amber-500/20 text-left space-y-3">
                  <div className="text-xs font-mono uppercase text-amber-500 font-bold">
                    Key Study Insights
                  </div>
                  <ul className="text-xs text-zinc-600 dark:text-zinc-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">✓</span> 15°–30° bench angles maximize clavicular pec recruitment.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">✓</span> 45° angles shift tension excessively to anterior deltoids.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">✓</span> Humeral adduction drives contraction at peak.
                    </li>
                  </ul>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* All Articles Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-tight text-zinc-900 dark:text-white">
              {selectedCategory === 'All' ? 'All Published Articles' : `${selectedCategory} Articles`} ({filteredPosts.length})
            </h2>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#12141c]">
              <BookOpen className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                No articles found matching &quot;{searchQuery}&quot;.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col justify-between bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:border-amber-500/40 hover:-translate-y-1 transition-all shadow-sm hover:shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 font-medium">
                        {post.splitCategory}
                      </span>
                      <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {post.readTime}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-lg uppercase tracking-tight text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-[11px] text-zinc-700 dark:text-zinc-300">
                        {post.author.name.charAt(0)}
                      </div>
                      <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium truncate max-w-[120px]">
                        {post.author.name}
                      </span>
                    </div>

                    <span className="text-xs font-mono font-bold text-amber-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

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

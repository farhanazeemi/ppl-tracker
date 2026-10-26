'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Clock,
  Calendar,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { BlogPost, formatPostDate } from '../data/mockBlogPosts';
import { playClickSound, playTabSound } from '../utils/audio';

interface BlogInteractiveListProps {
  initialPosts: BlogPost[];
}

export function BlogInteractiveList({ initialPosts }: BlogInteractiveListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Biomechanics', 'Hypertrophy', 'Split Design', 'Progressive Overload'];

  const filteredPosts = initialPosts.filter((p) => {
    const postCategories = Array.isArray(p.categories) ? p.categories : [];
    const splitCat = (p.splitCategory || '').toLowerCase();
    const title = (p.title || '').toLowerCase();
    const excerpt = (p.excerpt || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesCat =
      selectedCategory === 'All' ||
      postCategories.some((c) => (c?.title || '').toLowerCase() === selectedCategory.toLowerCase()) ||
      splitCat.includes(selectedCategory.toLowerCase());

    const matchesSearch =
      query === '' ||
      title.includes(query) ||
      excerpt.includes(query);

    return matchesCat && matchesSearch;
  });

  const featuredPost = initialPosts[0];

  return (
    <>
      {/* Search & Category Filter */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Category tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  playTabSound(true);
                  setSelectedCategory(cat);
                }}
                type="button"
                className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all btn-tactile whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-black font-bold shadow-xs'
                    : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200/80 dark:border-zinc-800/80'
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
          <div className="text-xs font-mono uppercase tracking-widest text-amber-500 font-semibold mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Featured Investigation
          </div>
          <Link
            href={`/blog/${featuredPost.slug}`}
            onClick={() => playClickSound(true)}
            className="group block relative overflow-hidden rounded-3xl bg-white dark:bg-[#12141c] border border-zinc-200/80 dark:border-zinc-800/80 hover:border-amber-500/50 card-minimal transition-all shadow-sm hover:shadow-xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 items-stretch">
              {/* Featured Image */}
              <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                {featuredPost.mainImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featuredPost.mainImage}
                    alt={featuredPost.imageAlt || featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full min-h-[220px] flex items-center justify-center bg-gradient-to-br from-amber-500/20 to-orange-500/10">
                    <BookOpen className="w-12 h-12 text-amber-500/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-amber-400 border border-amber-500/30 text-xs font-mono font-bold">
                  {featuredPost.splitCategory}
                </span>
              </div>

              {/* Featured Content & Meta */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                    <span className="hidden lg:inline-flex px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold">
                      {featuredPost.splitCategory}
                    </span>
                    <span className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      {formatPostDate(featuredPost.publishedAt)}
                    </span>
                    <span className="text-zinc-400">•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" /> {featuredPost.readTime}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors">
                    {featuredPost.title}
                  </h2>

                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {featuredPost.author.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={featuredPost.author.avatar}
                        alt={featuredPost.author.name}
                        className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-700 dark:text-zinc-300">
                        {featuredPost.author.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
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
                onClick={() => playClickSound(true)}
                className="group flex flex-col justify-between overflow-hidden bg-white dark:bg-[#12141c] border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl hover:border-amber-500/40 card-minimal transition-all shadow-xs hover:shadow-lg"
              >
                {/* Featured Thumbnail */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  {post.mainImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.mainImage}
                      alt={post.imageAlt || post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800">
                      <BookOpen className="w-8 h-8 text-zinc-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-amber-400 border border-amber-500/30 text-[11px] font-mono font-bold">
                    {post.splitCategory}
                  </span>
                </div>

                {/* Content & Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    {/* Post Date & Read Time */}
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-600 dark:text-zinc-400">
                      <span className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        {formatPostDate(post.publishedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-lg uppercase tracking-tight text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Author & Read Action */}
                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {post.author.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-6 h-6 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-[10px] text-zinc-700 dark:text-zinc-300">
                          {post.author.name.charAt(0)}
                        </div>
                      )}
                      <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium truncate max-w-[130px]">
                        {post.author.name}
                      </span>
                    </div>

                    <span className="text-xs font-mono font-bold text-amber-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

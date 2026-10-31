'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Clock,
  Calendar,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Sparkles,
  X,
} from 'lucide-react';
import { BlogPost, formatPostDate } from '../data/mockBlogPosts';
import { playClickSound, playTabSound } from '../utils/audio';

interface BlogInteractiveListProps {
  initialPosts: BlogPost[];
}

export function BlogInteractiveList({ initialPosts }: BlogInteractiveListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    const catMap = new Map<string, number>();
    initialPosts.forEach((p) => {
      if (p.splitCategory && p.splitCategory !== 'General') {
        catMap.set(p.splitCategory, (catMap.get(p.splitCategory) || 0) + 1);
      }
      if (Array.isArray(p.categories)) {
        p.categories.forEach((c) => {
          if (c?.title) {
            catMap.set(c.title, (catMap.get(c.title) || 0) + 1);
          }
        });
      }
    });
    // Sort categories by frequency
    const sorted = Array.from(catMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);
    return ['All', ...sorted.slice(0, 10)];
  }, [initialPosts]);

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((p) => {
      const postCategories = Array.isArray(p.categories) ? p.categories : [];
      const splitCat = (p.splitCategory || '').toLowerCase();
      const title = (p.title || '').toLowerCase();
      const excerpt = (p.excerpt || '').toLowerCase();
      const query = searchQuery.toLowerCase().trim();

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
  }, [initialPosts, selectedCategory, searchQuery]);

  const featuredPost = initialPosts[0];

  return (
    <div className="space-y-8">
      {/* Category Pills & Search Bar */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    playTabSound(true);
                    setSelectedCategory(cat);
                  }}
                  type="button"
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all btn-tactile whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--accent-primary)] text-black font-bold shadow-sm'
                      : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Input with Clear Button */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scientific articles..."
              className="w-full pl-10 pr-9 py-2 bg-[var(--bg-card)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] rounded-xl text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] font-mono transition-all outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Featured Spotlight Card */}
      {featuredPost && selectedCategory === 'All' && !searchQuery && (
        <section className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent-primary)] font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Featured Sports-Science Investigation
          </div>
          <Link
            href={`/blog/${featuredPost.slug}`}
            onClick={() => playClickSound(true)}
            className="group block relative overflow-hidden rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 card-bento transition-all shadow-sm hover:shadow-xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 items-stretch">
              {/* Featured Image */}
              <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-[var(--bg-elevated)] min-h-[240px]">
                {featuredPost.mainImage ? (
                  <Image
                    src={featuredPost.mainImage}
                    alt={featuredPost.imageAlt || featuredPost.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full min-h-[220px] flex items-center justify-center bg-gradient-to-br from-[var(--accent-primary)]/15 to-[var(--accent-secondary)]/10">
                    <BookOpen className="w-12 h-12 text-[var(--accent-primary)]/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 text-xs font-mono font-bold">
                  {featuredPost.splitCategory}
                </span>
              </div>

              {/* Featured Content & Meta */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono tabular-nums text-[var(--text-muted)]">
                    <span className="hidden lg:inline-flex px-2.5 py-0.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 font-bold">
                      {featuredPost.splitCategory}
                    </span>
                    <span className="flex items-center gap-1.5 text-[var(--text-secondary)] font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                      {formatPostDate(featuredPost.publishedAt)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" /> {featuredPost.readTime}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                    {featuredPost.title}
                  </h2>

                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-sans line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {featuredPost.author.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={featuredPost.author.avatar}
                        alt={featuredPost.author.name}
                        className="w-10 h-10 rounded-full object-cover border border-[var(--border-subtle)]"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center font-bold text-xs text-[var(--text-primary)] border border-[var(--border-subtle)]">
                        {featuredPost.author.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-bold text-[var(--text-primary)]">
                        {featuredPost.author.name}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)]">
                        {featuredPost.author.role}
                      </div>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent-primary)] group-hover:translate-x-1 transition-transform">
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
          <h2 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-tight text-[var(--text-primary)]">
            {selectedCategory === 'All' ? 'All Published Articles' : `${selectedCategory} Articles`}{' '}
            <span className="font-mono text-sm text-[var(--text-muted)] font-normal tabular-nums">
              ({filteredPosts.length})
            </span>
          </h2>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-3">
            <BookOpen className="w-10 h-10 text-[var(--text-muted)] mx-auto" />
            <p className="text-sm font-semibold text-[var(--text-secondary)]">
              No scientific articles found matching &quot;{searchQuery}&quot;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                onClick={() => playClickSound(true)}
                className="group flex flex-col justify-between overflow-hidden bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl hover:border-[var(--accent-primary)]/40 card-bento transition-all shadow-xs hover:shadow-lg"
              >
                {/* Featured Thumbnail */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--bg-elevated)]">
                  {post.mainImage ? (
                    <Image
                      src={post.mainImage}
                      alt={post.imageAlt || post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-card)]">
                      <BookOpen className="w-8 h-8 text-[var(--text-muted)]" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 text-[11px] font-mono font-bold">
                    {post.splitCategory}
                  </span>
                </div>

                {/* Content & Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    {/* Post Date & Read Time */}
                    <div className="flex items-center justify-between text-xs font-mono tabular-nums text-[var(--text-muted)]">
                      <span className="flex items-center gap-1 text-[var(--text-secondary)] font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                        {formatPostDate(post.publishedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-lg uppercase tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Author & Read Action */}
                  <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {post.author.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-6 h-6 rounded-full object-cover border border-[var(--border-subtle)]"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center font-bold text-[10px] text-[var(--text-primary)] border border-[var(--border-subtle)]">
                          {post.author.name.charAt(0)}
                        </div>
                      )}
                      <span className="text-xs text-[var(--text-secondary)] font-medium truncate max-w-[130px]">
                        {post.author.name}
                      </span>
                    </div>

                    <span className="text-xs font-mono font-bold text-[var(--accent-primary)] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

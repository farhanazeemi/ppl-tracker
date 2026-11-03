'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Clock,
  Calendar,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Sparkles,
  X,
  Tag,
} from 'lucide-react';
import { BlogPost, formatPostDate } from '../data/mockBlogPosts';
import { playClickSound, playTabSound } from '../utils/audio';

interface BlogInteractiveListProps {
  initialPosts: BlogPost[];
}

function BlogInteractiveListInner({ initialPosts }: BlogInteractiveListProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get('category') || searchParams?.get('tag');

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

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

    const sorted = Array.from(catMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);

    const baseList = ['All', ...sorted.slice(0, 10)];

    // If an external category was selected via URL and is not in top 10, include it
    if (selectedCategory !== 'All' && !baseList.some((c) => c.toLowerCase() === selectedCategory.toLowerCase())) {
      baseList.push(selectedCategory);
    }

    return baseList;
  }, [initialPosts, selectedCategory]);

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((p) => {
      const postCategories = Array.isArray(p.categories) ? p.categories : [];
      const splitCat = (p.splitCategory || '').toLowerCase();
      const title = (p.title || '').toLowerCase();
      const excerpt = (p.excerpt || '').toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      const selectedCatLower = selectedCategory.toLowerCase();
      const matchesCat =
        selectedCategory === 'All' ||
        postCategories.some((c) => (c?.title || '').toLowerCase() === selectedCatLower || (c?.slug || '').toLowerCase() === selectedCatLower) ||
        splitCat === selectedCatLower ||
        splitCat.includes(selectedCatLower);

      const matchesSearch =
        query === '' ||
        title.includes(query) ||
        excerpt.includes(query) ||
        splitCat.includes(query) ||
        postCategories.some((c) => (c?.title || '').toLowerCase().includes(query));

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
              const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
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
          <div className="group block relative overflow-hidden rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 card-bento transition-all shadow-sm hover:shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 items-stretch">
              {/* Featured Image */}
              <Link
                href={`/blog/${featuredPost.slug}`}
                onClick={() => playClickSound(true)}
                className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-[var(--bg-elevated)] min-h-[240px] block"
              >
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
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedCategory(featuredPost.splitCategory);
                  }}
                  className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-black border border-[var(--accent-primary)]/30 text-xs font-mono font-bold transition-all z-10 cursor-pointer"
                >
                  {featuredPost.splitCategory}
                </button>
              </Link>

              {/* Featured Content & Meta */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono tabular-nums text-[var(--text-muted)]">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(featuredPost.splitCategory)}
                      className="hidden lg:inline-flex px-2.5 py-0.5 rounded-full bg-[var(--accent-primary)]/10 hover:bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 font-bold cursor-pointer transition-colors"
                    >
                      {featuredPost.splitCategory}
                    </button>
                    {(featuredPost.categories || []).map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedCategory(c.title)}
                        className="px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] hover:bg-[var(--accent-primary)]/10 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] border border-[var(--border-subtle)] text-[11px] cursor-pointer transition-colors"
                      >
                        #{c.title}
                      </button>
                    ))}
                    <span className="flex items-center gap-1.5 text-[var(--text-secondary)] font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                      {formatPostDate(featuredPost.publishedAt)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" /> {featuredPost.readTime}
                    </span>
                  </div>

                  <Link href={`/blog/${featuredPost.slug}`} onClick={() => playClickSound(true)}>
                    <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                      {featuredPost.title}
                    </h2>
                  </Link>

                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-sans line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4">
                  <Link
                    href={`/author/${featuredPost.author.slug || 'dr-marcus-vance'}`}
                    className="flex items-center gap-3 hover:opacity-85 transition-opacity"
                  >
                    {featuredPost.author.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={featuredPost.author.avatar}
                        alt={featuredPost.author.name}
                        width={40}
                        height={40}
                        loading="lazy"
                        className="w-10 h-10 rounded-full object-cover border border-[var(--border-subtle)]"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center font-bold text-xs text-[var(--text-primary)] border border-[var(--border-subtle)]">
                        {featuredPost.author.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-bold text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors">
                        {featuredPost.author.name}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] font-mono">
                        {featuredPost.author.role}
                      </div>
                    </div>
                  </Link>

                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[var(--accent-primary)] uppercase tracking-wider group-hover:translate-x-1 transition-transform"
                  >
                    Read Investigation <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Grid of Articles */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
          <span>
            Showing <strong className="text-[var(--text-primary)] font-bold">{filteredPosts.length}</strong> of{' '}
            {initialPosts.length} articles
            {selectedCategory !== 'All' && (
              <span className="ml-2 inline-flex items-center gap-1 text-[var(--accent-primary)] font-bold bg-[var(--accent-primary)]/10 px-2 py-0.5 rounded-full">
                in &ldquo;{selectedCategory}&rdquo;
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className="hover:opacity-75 cursor-pointer ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </span>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="py-16 text-center space-y-4 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
            <BookOpen className="w-10 h-10 text-[var(--text-muted)] mx-auto opacity-40" />
            <h3 className="text-base font-bold uppercase text-[var(--text-primary)] font-display">
              No matching studies found
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-mono max-w-sm mx-auto">
              Try adjusting your category filter or search terms.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              type="button"
              className="px-4 py-2 bg-[var(--accent-primary)] text-black font-display font-bold text-xs uppercase tracking-wider rounded-xl btn-tactile cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className="rounded-3xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md card-bento"
              >
                {/* Clickable Image Header */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--bg-elevated)]">
                  <Link href={`/blog/${post.slug}`} className="block w-full h-full">
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
                  </Link>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none" />
                  
                  {/* Clickable Split Category Badge */}
                  <button
                    type="button"
                    onClick={() => {
                      playTabSound(true);
                      setSelectedCategory(post.splitCategory);
                    }}
                    className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-black border border-[var(--accent-primary)]/30 text-[11px] font-mono font-bold transition-all z-10 cursor-pointer"
                  >
                    {post.splitCategory}
                  </button>
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

                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="font-display font-bold text-lg uppercase tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans line-clamp-2">
                      {post.excerpt}
                    </p>

                    {/* Clickable Category Tags on Card */}
                    {post.categories && post.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {post.categories.slice(0, 2).map((c, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              playTabSound(true);
                              setSelectedCategory(c.title);
                            }}
                            className="px-2 py-0.5 rounded-md bg-[var(--bg-elevated)] hover:bg-[var(--accent-primary)]/10 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] border border-[var(--border-subtle)] text-[10px] font-mono transition-colors cursor-pointer"
                          >
                            #{c.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Author & Read Action */}
                  <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                    <Link
                      href={`/author/${post.author.slug || 'dr-marcus-vance'}`}
                      className="flex items-center gap-2 group/author hover:opacity-85 transition-opacity"
                    >
                      {post.author.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          width={24}
                          height={24}
                          loading="lazy"
                          className="w-6 h-6 rounded-full object-cover border border-[var(--border-subtle)]"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[10px] font-bold text-[var(--accent-primary)]">
                          {post.author.name.charAt(0)}
                        </div>
                      )}
                      <span className="text-xs text-[var(--text-secondary)] group-hover/author:text-[var(--accent-primary)] transition-colors font-medium truncate max-w-[120px]">
                        {post.author.name}
                      </span>
                    </Link>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs font-mono font-bold text-[var(--accent-primary)] flex items-center gap-0.5 group-hover:translate-x-1 transition-transform"
                    >
                      Study <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export function BlogInteractiveList(props: BlogInteractiveListProps) {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)]">
          Loading scientific articles...
        </div>
      }
    >
      <BlogInteractiveListInner {...props} />
    </Suspense>
  );
}

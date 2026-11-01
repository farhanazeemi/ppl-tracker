'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Send, Heart, User, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { playClickSound, playPopSound } from '@/utils/audio';

export interface CommentItem {
  id: string;
  article_slug: string;
  author_name: string;
  author_email?: string | null;
  content: string;
  created_at: string;
  likes_count: number;
  user_id?: string | null;
  isOptimistic?: boolean;
}

interface ArticleCommentsProps {
  articleSlug: string;
  articleTitle: string;
}

function formatCommentDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return 'Just now';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  } catch {
    return 'Recently';
  }
}

export function ArticleComments({ articleSlug, articleTitle }: ArticleCommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot trap
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [likedCommentIds, setLikedCommentIds] = useState<Set<string>>(new Set());

  // Prefill author name if user is logged in
  useEffect(() => {
    if (user) {
      const name = user.name || (user.email ? user.email.split('@')[0] : '');
      if (name && !authorName) {
        setAuthorName(name);
      }
      if (user.email && !authorEmail) {
        setAuthorEmail(user.email);
      }
    }
  }, [user, authorName, authorEmail]);

  const loadLocalComments = useCallback(() => {
    try {
      const stored = localStorage.getItem(`comments_${articleSlug}`);
      if (stored) {
        setComments(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, [articleSlug]);

  const saveLocalComments = (updated: CommentItem[]) => {
    try {
      localStorage.setItem(`comments_${articleSlug}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Load comments from Supabase or localStorage fallback
  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('article_comments')
          .select('*')
          .eq('article_slug', articleSlug)
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Could not fetch comments from Supabase:', error.message);
          loadLocalComments();
        } else if (data) {
          setComments(data);
        }
      } else {
        loadLocalComments();
      }
    } catch (err) {
      console.warn('Error loading comments:', err);
      loadLocalComments();
    } finally {
      setIsLoading(false);
    }
  }, [articleSlug, loadLocalComments]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Handle comment submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // Silent discard bot

    const trimmedContent = content.trim();
    const trimmedName = authorName.trim() || 'Gym Lifter';

    if (!trimmedContent) {
      setStatusMessage({ type: 'error', text: 'Please enter your thoughts before submitting.' });
      return;
    }

    if (trimmedContent.length > 2500) {
      setStatusMessage({ type: 'error', text: 'Comments must be under 2,500 characters.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);
    playClickSound();

    const tempId = `temp-${Date.now()}`;
    const newCommentObj: CommentItem = {
      id: tempId,
      article_slug: articleSlug,
      author_name: trimmedName,
      author_email: authorEmail.trim() || null,
      content: trimmedContent,
      created_at: new Date().toISOString(),
      likes_count: 0,
      user_id: user?.id || null,
      isOptimistic: true,
    };

    // Optimistic UI update
    setComments((prev) => [newCommentObj, ...prev]);
    setContent('');

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('article_comments')
          .insert([
            {
              article_slug: articleSlug,
              author_name: trimmedName,
              author_email: authorEmail.trim() || null,
              content: trimmedContent,
              user_id: user?.id || null,
            },
          ])
          .select()
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setComments((prev) =>
            prev.map((c) => (c.id === tempId ? { ...data, isOptimistic: false } : c))
          );
        }
      } else {
        // Fallback to local storage
        const currentLocal = [newCommentObj, ...comments.filter((c) => c.id !== tempId)];
        saveLocalComments(currentLocal);
      }

      playPopSound();
      setStatusMessage({ type: 'success', text: 'Your comment has been published!' });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error('Comment insertion error:', err);
      setStatusMessage({
        type: 'error',
        text: 'Failed to post comment to cloud server. Saved locally.',
      });
      // Keep in local state
      saveLocalComments([newCommentObj, ...comments.filter((c) => c.id !== tempId)]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    if (likedCommentIds.has(commentId)) return;

    playClickSound();
    setLikedCommentIds((prev) => new Set(prev).add(commentId));

    // Optimistically update count
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likes_count: (c.likes_count || 0) + 1 } : c))
    );

    if (isSupabaseConfigured && !commentId.startsWith('temp-')) {
      try {
        const comment = comments.find((c) => c.id === commentId);
        const newCount = (comment?.likes_count || 0) + 1;
        await supabase
          .from('article_comments')
          .update({ likes_count: newCount })
          .eq('id', commentId);
      } catch (err) {
        console.warn('Could not update likes on server:', err);
      }
    }
  };

  return (
    <section id="discussion" className="space-y-6 pt-8 border-t border-[var(--border-subtle)]">
      {/* Discussion Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[var(--accent-primary)]">
            <MessageSquare className="w-4 h-4" /> Community Discussion
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-tight text-[var(--text-primary)]">
            Reader Perspectives & Scientific Debate
          </h3>
        </div>
        <div className="px-3.5 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-mono tabular-nums text-[var(--text-secondary)]">
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </div>
      </div>

      {/* Comment Input Card */}
      <form
        onSubmit={handleSubmit}
        className="p-5 sm:p-7 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-4 shadow-sm card-bento"
      >
        {/* Anti-bot honeypot */}
        <input
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[var(--text-muted)] mb-1.5">
              Your Name / Alias <span className="text-[var(--accent-primary)]">*</span>
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. NaturalLifter99 or Alex"
              required
              maxLength={60}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-[var(--text-muted)] mb-1.5">
              Email (Optional - Never Shared)
            </label>
            <input
              type="email"
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              placeholder="your@email.com"
              maxLength={100}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-mono uppercase text-[var(--text-muted)]">
              Your Analysis or Experience <span className="text-[var(--accent-primary)]">*</span>
            </label>
            <span className="text-[11px] font-mono tabular-nums text-[var(--text-muted)]">
              {content.length}/2500
            </span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            required
            maxLength={2500}
            placeholder={`Have you tested these biomechanics cues in your training? Share your results, exercise substitutions, or questions on "${articleTitle}"...`}
            className="w-full p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm leading-relaxed placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors resize-y"
          />
        </div>

        {statusMessage && (
          <div
            className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
            }`}
          >
            {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <p className="text-[11px] text-[var(--text-muted)] font-mono">
            Scientific, respectful discussion welcome. No spam or promotional links.
          </p>
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--accent-primary)] hover:opacity-95 text-black font-display font-bold uppercase tracking-wider text-xs rounded-xl transition-all btn-tactile shadow-md shadow-[var(--accent-primary)]/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              'Publishing...'
            ) : (
              <>
                <Send className="w-3.5 h-3.5" /> Post Comment
              </>
            )}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)]">
            Loading discussions...
          </div>
        ) : comments.length === 0 ? (
          <div className="p-8 sm:p-10 text-center rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold uppercase text-[var(--text-primary)]">
              No Comments Yet
            </h4>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
              Be the first to share your experience with this exercise setup or ask a question.
            </p>
          </div>
        ) : (
          comments.map((comment) => {
            const hasLiked = likedCommentIds.has(comment.id);
            return (
              <div
                key={comment.id}
                className={`p-5 sm:p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-3 transition-all ${
                  comment.isOptimistic ? 'opacity-80 ring-1 ring-[var(--accent-primary)]/30' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/30 text-[var(--accent-primary)] font-display font-bold text-xs flex items-center justify-center">
                      {comment.author_name ? comment.author_name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                        {comment.author_name}
                        {comment.isOptimistic && (
                          <span className="text-[10px] font-mono font-normal text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-2 py-0.5 rounded-full">
                            Posting...
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-muted)]">
                        <Clock className="w-3 h-3" />
                        <span>{formatCommentDate(comment.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleLike(comment.id)}
                    type="button"
                    disabled={hasLiked}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all btn-tactile cursor-pointer ${
                      hasLiked
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-rose-400 border border-[var(--border-subtle)]'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
                    <span className="tabular-nums">{comment.likes_count || 0}</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line pl-12">
                  {comment.content}
                </p>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

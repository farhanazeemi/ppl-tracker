import Link from 'next/link';
import { Dumbbell, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col items-center justify-center p-6 text-center transition-colors">
      <div className="max-w-md w-full p-8 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl space-y-6 shadow-2xl card-bento">
        <div className="w-14 h-14 rounded-2xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 flex items-center justify-center mx-auto">
          <Dumbbell className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
            404
          </h1>
          <h2 className="text-lg font-display font-bold uppercase text-[var(--text-secondary)]">
            Page Not Found
          </h2>
          <p className="text-xs text-[var(--text-muted)] font-mono leading-relaxed">
            The exercise or page you requested does not exist or has been moved.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--accent-primary)] hover:opacity-95 text-black text-xs font-display font-bold uppercase rounded-xl transition btn-tactile shadow-md shadow-[var(--accent-primary)]/15"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Tracker
          </Link>
          <Link
            href="/blog"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--bg-elevated)] hover:bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-display font-bold uppercase rounded-xl transition btn-tactile"
          >
            Scientific Articles
          </Link>
        </div>
      </div>
    </div>
  );
}

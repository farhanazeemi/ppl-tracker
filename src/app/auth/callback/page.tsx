'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let active = true;

    async function handleAuthCallback() {
      try {
        if (!supabase) {
          router.replace('/');
          return;
        }

        // Supabase OAuth code/hash processing
        const { error } = await supabase.auth.getSession();
        if (error) {
          if (active) setErrorMsg(error.message);
          return;
        }

        const timeout = setTimeout(() => {
          if (active) router.replace('/');
        }, 1000);

        return () => clearTimeout(timeout);
      } catch (err: any) {
        if (active) setErrorMsg(err.message || 'Authentication error.');
      }
    }

    handleAuthCallback();

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-sm p-8 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl text-center space-y-4 shadow-2xl card-bento">
        <div className="w-12 h-12 rounded-2xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 flex items-center justify-center mx-auto">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <h2 className="text-lg font-display font-bold uppercase tracking-tight text-[var(--text-primary)]">
          Authenticating Athlete
        </h2>
        <p className="text-xs text-[var(--text-muted)] font-mono">
          Finalizing secure session & loading your hypertrophy program...
        </p>
        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-rose-500 font-medium">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}

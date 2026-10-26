'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function handleAuthCallback() {
      try {
        // Detect if this is a password recovery link
        if (typeof window !== 'undefined') {
          const hash = window.location.hash || '';
          const search = window.location.search || '';
          if (hash.includes('type=recovery') || search.includes('type=recovery')) {
            router.replace('/?type=recovery');
            return;
          }
        }

        // Process session exchange
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          if (active) setErrorMsg(error.message);
          return;
        }

        if (data.session && active) {
          router.replace('/');
          return;
        }

        // Fallback timer to allow hash fragment parsing
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
    <div className="min-h-screen bg-[#090a0f] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm p-8 bg-[#12141c] border border-zinc-800 rounded-3xl text-center space-y-4 shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <h2 className="text-lg font-display font-bold uppercase tracking-tight">
          Authenticating Athlete
        </h2>
        <p className="text-xs text-zinc-400 font-mono">
          Finalizing secure session & loading your hypertrophy program...
        </p>
        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}

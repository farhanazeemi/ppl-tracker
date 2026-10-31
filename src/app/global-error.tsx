'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Critical global application error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
          <div className="space-y-2">
            <h1 className="text-xl font-bold uppercase tracking-tight text-white">
              Application Error
            </h1>
            <p className="text-sm text-zinc-400">
              A critical error occurred. Please try reloading the application.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold uppercase bg-[#B7FF4A] text-black hover:opacity-90 transition cursor-pointer"
            >
              Reload Application
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold uppercase bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700 transition"
            >
              Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}

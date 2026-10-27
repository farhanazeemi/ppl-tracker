import Link from 'next/link';
import { Dumbbell, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#090a0f] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 bg-[#12141c] border border-zinc-800 rounded-3xl space-y-6 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto">
          <Dumbbell className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-extrabold uppercase tracking-tight text-white">
            404
          </h1>
          <h2 className="text-lg font-display font-bold uppercase text-zinc-300">
            Page Not Found
          </h2>
          <p className="text-xs text-zinc-400 font-mono leading-relaxed">
            The exercise or page you requested does not exist or has been moved.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black text-xs font-display font-bold uppercase rounded-xl transition shadow-md shadow-amber-500/15"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Tracker
          </Link>
          <Link
            href="/blog"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-display font-bold uppercase rounded-xl transition"
          >
            Scientific Articles
          </Link>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Mail,
  MessageSquare,
  HelpCircle,
  Bug,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { getContactPageSchema } from '../../lib/schema';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: 'Contact & Athlete Support | PPL Hypertrophy Tracker',
  description:
    'Need help with your workout logs, progressive overload engine, or have a sports science inquiry? Contact the PPL Hypertrophy Tracker engineering team directly.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact & Athlete Support | PPL Hypertrophy Tracker',
    description:
      'Need help with your workout logs, progressive overload engine, or have a sports science inquiry? Contact the PPL Hypertrophy Tracker team directly.',
    url: `${baseUrl}/contact`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
  },
};

export default function ContactPage() {
  const schema = getContactPageSchema();

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Header */}
        <div className="space-y-4 border-b border-zinc-200 dark:border-zinc-800 pb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-mono font-semibold">
            <MessageSquare className="w-3.5 h-3.5" /> Athlete Support & Feedback Channel
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-zinc-900 dark:text-white">
            Contact & Support
          </h1>
          <p className="text-xs sm:text-sm font-sans text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Have a bug to report, a feature suggestion for the plate calculator, or a question about a peer-reviewed biomechanics study cited in our journal? We are here to help.
          </p>
        </div>

        {/* 3 Contact Pathways Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Direct Support Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-base font-display font-bold uppercase text-zinc-900 dark:text-white">
                Email Support
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Direct inbox for bug reports, account assistance, and data requests.
              </p>
            </div>
            <div>
              <a
                href="mailto:farhanazeemi.dev@gmail.com"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-500 hover:underline"
              >
                farhanazeemi.dev@gmail.com <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* GitHub Issues Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
                <Bug className="w-5 h-5" />
              </div>
              <h2 className="text-base font-display font-bold uppercase text-zinc-900 dark:text-white">
                GitHub Repository
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Track open issues, submit pull requests, or view technical roadmaps.
              </p>
            </div>
            <div>
              <a
                href="https://github.com/farhanazeemi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-500 hover:underline"
              >
                github.com/farhanazeemi <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Response Commitment Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="text-base font-display font-bold uppercase text-zinc-900 dark:text-white">
                Response Time
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                We review athlete inquiries and respond within <strong>24 to 48 business hours</strong>.
              </p>
            </div>
            <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Support Desk Active
            </div>
          </div>
        </div>

        {/* Quick Self-Serve FAQ Section */}
        <section className="space-y-6 pt-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-display font-black uppercase tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-amber-500" /> Frequently Answered Inquiries
            </h2>
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              Immediate answers to common questions before sending an email:
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 space-y-2">
              <h3 className="font-display font-bold text-sm uppercase text-zinc-900 dark:text-white">
                How does offline workout logging work in Guest Mode?
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Guest Mode utilizes HTML5 <code>localStorage</code> within your device&apos;s browser. Your sets, completed weights, workout duration, and personal records remain persistent across page refreshes even without an internet connection.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 space-y-2">
              <h3 className="font-display font-bold text-sm uppercase text-zinc-900 dark:text-white">
                How do I back up or transfer my workout history?
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Open the <strong>Workout History & PR Hall of Fame</strong> modal in the top navigation bar and click <strong>&quot;Export JSON Data&quot;</strong>. You can save your full training archive to your device and import it on any new phone or desktop browser.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 space-y-2">
              <h3 className="font-display font-bold text-sm uppercase text-zinc-900 dark:text-white">
                How do I request account deletion or data erasure?
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Simply email{' '}
                <a href="mailto:farhanazeemi.dev@gmail.com" className="text-amber-500 underline">
                  farhanazeemi.dev@gmail.com
                </a>{' '}
                with the subject line &quot;Data Erasure Request&quot; from your registered email address. We will permanently delete all associated Supabase cloud records within 48 hours in compliance with GDPR.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

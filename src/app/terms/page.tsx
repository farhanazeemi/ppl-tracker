import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle, FileText, CheckCircle2, ShieldAlert, Scale, HelpCircle } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { getLegalPageSchema } from '../../lib/schema';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: 'Terms of Service & Medical Disclaimer | PPL Hypertrophy Tracker',
  description:
    'Terms of Service and Resistance Training Medical Disclaimer for PPL Hypertrophy Tracker. Essential safety guidelines, liability limitations, and user agreements.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms of Service & Medical Disclaimer | PPL Hypertrophy Tracker',
    description:
      'Terms of Service and Resistance Training Medical Disclaimer for PPL Hypertrophy Tracker. Essential safety guidelines, liability limitations, and user agreements.',
    url: `${baseUrl}/terms`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
  },
};

export default function TermsOfServicePage() {
  const schema = getLegalPageSchema(
    'Terms of Service',
    '/terms',
    'Terms of Service and Resistance Training Medical Disclaimer governing the use of PPL Hypertrophy Tracker.'
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Header */}
        <div className="space-y-4 border-b border-zinc-200 dark:border-zinc-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-mono font-semibold">
            <FileText className="w-3.5 h-3.5" /> Legal Terms & Athlete Agreement
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-zinc-900 dark:text-white">
            Terms of Service
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500 dark:text-zinc-400">
            <span>Effective Date: October 27, 2026</span>
            <span>•</span>
            <span>Last Updated: October 27, 2026</span>
            <span>•</span>
            <span>Enforceability: Binding Athlete Agreement</span>
          </div>
        </div>

        {/* Highlighted Medical Disclaimer Banner */}
        <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-950 dark:text-amber-200 space-y-3">
          <div className="flex items-center gap-2.5 font-display font-bold uppercase text-amber-600 dark:text-amber-400 text-base">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            Crucial Physical Activity & Medical Disclaimer
          </div>
          <p className="text-xs sm:text-sm leading-relaxed font-sans text-zinc-700 dark:text-zinc-300">
            PPL Hypertrophy Tracker is an informational workout logging tool and biomechanical resistance education platform. <strong>It does not provide medical, physiotherapy, or healthcare diagnosis.</strong> Resistance training with heavy barbells, dumbbells, cables, and machines carries inherent risk of musculoskeletal injury, cardiovascular strain, and physical harm.
          </p>
          <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
            Always consult a qualified medical physician or certified strength coach prior to beginning any intense resistance program, particularly if you have pre-existing cardiovascular, spinal, joint, or metabolic conditions.
          </p>
        </div>

        {/* Content Body */}
        <article className="prose prose-zinc dark:prose-invert max-w-none space-y-10 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {/* Section 1: Acceptance */}
          <section className="space-y-3">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-500" /> 1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or utilizing <strong>PPL Hypertrophy Tracker</strong> (located at{' '}
              <Link href="/" className="text-amber-500 underline underline-offset-4">
                https://ppltracker.web.id
              </Link>
              ), you confirm that you have read, understood, and agreed to be bound by these Terms of Service. If you do not agree to all provisions contained herein, you must immediately discontinue use of the platform.
            </p>
          </section>

          {/* Section 2: Platform Usage & Account Security */}
          <section className="space-y-3">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" /> 2. Platform Usage & Account Responsibilities
            </h2>
            <p>
              PPL Tracker allows you to operate either in an offline &quot;Guest Mode&quot; or as an authenticated user via Supabase. You agree to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Provide truthful, accurate, and current profile information when registering an account.</li>
              <li>Maintain the confidentiality and security of your account credentials, login tokens, and Google OAuth access.</li>
              <li>Refrain from attempting to reverse-engineer, decompile, scrape, or disrupt the performance of our servers, APIs, or database integrity.</li>
              <li>Accept sole responsibility for all activities occurring under your authenticated profile.</li>
            </ul>
          </section>

          {/* Section 3: Assumption of Risk & Injury Release */}
          <section className="space-y-3">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> 3. Voluntary Assumption of Risk & Release
            </h2>
            <p>
              You voluntarily choose to participate in physical exercise and resistance training protocols suggested by or tracked within this application. You explicitly acknowledge and agree that:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Self-Regulation:</strong> You are responsible for inspecting your gym equipment, selecting appropriate working loads, executing safe warm-up sets, and adhering to strict lifting mechanics.
              </li>
              <li>
                <strong>Assumption of Harm:</strong> You voluntarily assume full responsibility for any risks, injuries, or damages, known or unknown, which you might incur as a result of engaging in resistance training routines tracked on this website.
              </li>
              <li>
                <strong>Release of Claims:</strong> To the maximum extent permitted by applicable law, you release PPL Hypertrophy Tracker, its founder (Farhan Azeemi), developers, and contributors from any and all liability, claims, or demands arising out of bodily injury, illness, or property damage.
              </li>
            </ul>
          </section>

          {/* Section 4: Intellectual Property */}
          <section className="space-y-3">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-500" /> 4. Intellectual Property Rights
            </h2>
            <p>
              All software, source code, interactive 3D rigs, visual designs, plate math algorithms, and authored hypertrophy articles displayed on PPL Hypertrophy Tracker are protected under international copyright, trademark, and intellectual property laws.
            </p>
            <p>
              You are granted a limited, personal, non-exclusive, non-transferable license to access and use the application for your individual physical training and education. You may not republish, sell, distribute, or commercially exploit any content without express prior written consent.
            </p>
          </section>

          {/* Section 5: Limitation of Liability */}
          <section className="space-y-3">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-zinc-900 dark:text-white">
              5. Limitation of Liability
            </h2>
            <p>
              PPL Hypertrophy Tracker is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied. In no event shall PPL Tracker or its developers be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Loss of training data or local storage corruption resulting from browser cache clearings.</li>
              <li>Service downtime, network interruptions, or serverless function latency.</li>
              <li>Musculoskeletal or physical injury resulting from excessive progressive overload or improper exercise execution.</li>
            </ul>
          </section>

          {/* Section 6: Modifications & Inquiries */}
          <section className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-500" /> 6. Changes to Terms & Contact Information
            </h2>
            <p>
              We reserve the right to revise or modify these Terms of Service at our sole discretion. Any updates will be published directly to this page with an updated &quot;Last Updated&quot; timestamp. Continued use of the platform constitutes acceptance of revised terms.
            </p>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 space-y-1 text-xs font-mono">
              <p><strong>Legal Contact:</strong> Farhan Azeemi (Developer & Maintainer)</p>
              <p>
                <strong>Email:</strong>{' '}
                <a href="mailto:farhanazeemi.dev@gmail.com" className="text-amber-500 hover:underline">
                  farhanazeemi.dev@gmail.com
                </a>
              </p>
              <p>
                <strong>Athlete Support Portal:</strong>{' '}
                <Link href="/contact" className="text-amber-500 hover:underline">
                  https://ppltracker.web.id/contact
                </Link>
              </p>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, Database, Cookie, Mail } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { getLegalPageSchema } from '../../lib/schema';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: 'Privacy Policy | PPL Hypertrophy Tracker',
  description:
    'Comprehensive Privacy Policy for PPL Hypertrophy Tracker. Transparent disclosure of client storage, Supabase authentication, cookie usage, Google AdSense advertising, and GDPR/CCPA data rights.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | PPL Hypertrophy Tracker',
    description:
      'Transparent disclosure of client storage, Supabase authentication, cookie usage, Google AdSense advertising, and GDPR/CCPA data rights.',
    url: `${baseUrl}/privacy`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
  },
};

export default function PrivacyPolicyPage() {
  const schema = getLegalPageSchema(
    'Privacy Policy',
    '/privacy',
    'Comprehensive Privacy Policy for PPL Hypertrophy Tracker detailing data collection, local storage, cookie usage, advertising disclosures, and user rights.'
  );

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Header */}
        <div className="space-y-4 border-b border-[var(--border-subtle)] pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-mono font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Data Protection & Privacy Governance
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[var(--text-primary)]">
            Privacy Policy
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--text-muted)]">
            <span>Effective Date: October 27, 2026</span>
            <span>•</span>
            <span>Last Updated: October 27, 2026</span>
            <span>•</span>
            <span>Jurisdiction: GDPR & CCPA Aligned</span>
          </div>
        </div>

        {/* Content Body */}
        <article className="max-w-none space-y-10 text-sm leading-relaxed text-[var(--text-secondary)]">
          {/* Section 1: Introduction */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold uppercase tracking-tight text-[var(--text-primary)] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[var(--accent-primary)]" /> 1. Introduction & Overview
            </h2>
            <p>
              Welcome to <strong className="text-[var(--text-primary)]">PPL Hypertrophy Tracker</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), accessible at{' '}
              <Link href="/" className="text-[var(--accent-primary)] underline underline-offset-4">
                https://ppltracker.web.id
              </Link>
              . We are committed to safeguarding the privacy and personal data of our users (&quot;athletes,&quot; &quot;you,&quot; or &quot;users&quot;).
            </p>
            <p>
              This Privacy Policy explains how we collect, store, process, and protect your information when you visit our website, utilize our progressive overload workout logger, interact with our 3D anatomy rigs, or read our evidence-based hypertrophy journal.
            </p>
          </section>

          {/* Section 2: Data Collection */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold uppercase tracking-tight text-[var(--text-primary)] flex items-center gap-2">
              <Database className="w-5 h-5 text-[var(--accent-primary)]" /> 2. Information We Collect
            </h2>
            <p>We operate on a <strong className="text-[var(--text-primary)]">minimal-data, local-first</strong> architectural standard. Depending on how you interact with PPL Tracker, we collect the following categories of information:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl card-bento space-y-2">
                <h3 className="font-mono font-bold text-sm uppercase text-[var(--accent-primary)]">A. Guest Mode (Offline)</h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  When using the app without signing in, all workout sets, weights, reps, rest intervals, and custom split selections are stored purely in your device&apos;s browser <code>localStorage</code>. No personal profile data is transmitted to our servers.
                </p>
              </div>
              <div className="p-5 rounded-2xl card-bento space-y-2">
                <h3 className="font-mono font-bold text-sm uppercase text-[var(--accent-primary)]">B. Registered Athletes</h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  When you sign up via Email or Google OAuth, our authentication provider (Supabase) securely retains your email address, unique user ID, and encrypted authentication tokens. If optionally configured, user biometrics (e.g., target goal, height, body weight) are synced to your private Supabase profile protected by Row-Level Security (RLS).
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Cookies & AdSense */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold uppercase tracking-tight text-[var(--text-primary)] flex items-center gap-2">
              <Cookie className="w-5 h-5 text-[var(--accent-primary)]" /> 3. Cookies, Web Beacons & Third-Party Advertising
            </h2>
            <p>
              PPL Hypertrophy Tracker utilizes standard browser cookies and local web storage to enhance user experience, preserve active workout timers, and maintain authenticated sessions.
            </p>
            <div className="p-5 rounded-2xl bg-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/20 space-y-3 text-xs leading-relaxed">
              <h4 className="font-mono font-bold uppercase text-[var(--accent-primary)] text-sm">
                Google AdSense & DoubleClick Cookie Notice
              </h4>
              <p className="text-[var(--text-secondary)]">
                We may partner with Google AdSense and third-party advertising vendors to display contextual and relevant advertisements across our website and science journal.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[var(--text-secondary)]">
                <li>
                  Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to our website or other websites on the internet.
                </li>
                <li>
                  Google&apos;s use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.
                </li>
                <li>
                  Users may opt out of personalized advertising by visiting{' '}
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent-primary)] underline"
                  >
                    Google Ads Settings
                  </a>
                  . Alternatively, you can opt out of third-party vendor use of cookies for personalized advertising by visiting{' '}
                  <a
                    href="https://www.aboutads.info"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent-primary)] underline"
                  >
                    aboutads.info
                  </a>
                  .
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4: Data Storage & Security */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold uppercase tracking-tight text-[var(--text-primary)] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[var(--accent-primary)]" /> 4. Data Security & Architecture
            </h2>
            <p>
              We enforce strict industry security protocols to protect your information:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[var(--text-secondary)]">
              <li>
                <strong className="text-[var(--text-primary)]">Transport Layer Security (TLS/HTTPS):</strong> All client-server communication is encrypted in transit using modern TLS 1.3 encryption.
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">Database Row-Level Security:</strong> Cloud workout records in Supabase are governed by strict Row-Level Security (RLS) policies ensuring only the authenticated account owner can read or write their personal logs.
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">Zero Password Storage:</strong> Passwords submitted during authentication are processed via cryptographically salted hashes handled directly by Supabase Auth; PPL Tracker never sees or stores plaintext passwords.
              </li>
            </ul>
          </section>

          {/* Section 5: GDPR & CCPA Rights */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold uppercase tracking-tight text-[var(--text-primary)] flex items-center gap-2">
              <Eye className="w-5 h-5 text-[var(--accent-primary)]" /> 5. Your Data Rights (GDPR & CCPA)
            </h2>
            <p>
              Depending on your physical location and legal residency, you possess rights regarding your personal data under the General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[var(--text-secondary)]">
              <li><strong className="text-[var(--text-primary)]">Right to Access:</strong> You may request a copy of the personal data we maintain about you.</li>
              <li><strong className="text-[var(--text-primary)]">Right to Rectification:</strong> You may correct inaccurate or incomplete biographical or workout records in your profile settings.</li>
              <li><strong className="text-[var(--text-primary)]">Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> You may request complete deletion of your account and cloud-synced workout history at any time.</li>
              <li><strong className="text-[var(--text-primary)]">Right to Data Portability:</strong> You can export your workout log history in standard JSON format via the Workout History & PR Hall of Fame modal.</li>
              <li><strong className="text-[var(--text-primary)]">Right to Non-Discrimination:</strong> We do not discriminate against users who exercise their privacy rights.</li>
            </ul>
          </section>

          {/* Section 6: Children's Privacy */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold uppercase tracking-tight text-[var(--text-primary)]">
              6. Children&apos;s Online Privacy Protection
            </h2>
            <p>
              PPL Hypertrophy Tracker is intended for individuals aged 16 and older. We do not knowingly collect or solicit personal information from children under the age of 13 (or under 16 in the European Union). If we learn that we have inadvertently collected personal information from a child under 13 without verified parental consent, we will delete that information immediately.
            </p>
          </section>

          {/* Section 7: Contact Data Controller */}
          <section className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
            <h2 className="text-xl font-bold uppercase tracking-tight text-[var(--text-primary)] flex items-center gap-2">
              <Mail className="w-5 h-5 text-[var(--accent-primary)]" /> 7. Contacting the Data Controller
            </h2>
            <p>
              If you have questions regarding this Privacy Policy, wish to exercise your data protection rights, or request account data erasure, please contact our Data Controller:
            </p>
            <div className="p-4 rounded-2xl card-bento space-y-1 text-xs font-mono">
              <p><strong className="text-[var(--text-primary)]">Entity:</strong> PPL Hypertrophy Tracker</p>
              <p><strong className="text-[var(--text-primary)]">Maintainer:</strong> Farhan Azeemi</p>
              <p>
                <strong className="text-[var(--text-primary)]">Email:</strong>{' '}
                <a href="mailto:farhanazeemi.dev@gmail.com" className="text-[var(--accent-primary)] hover:underline">
                  farhanazeemi.dev@gmail.com
                </a>
              </p>
              <p>
                <strong className="text-[var(--text-primary)]">Inquiry Form:</strong>{' '}
                <Link href="/contact" className="text-[var(--accent-primary)] hover:underline">
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

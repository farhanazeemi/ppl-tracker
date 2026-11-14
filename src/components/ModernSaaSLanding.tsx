'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';
import {
  ArrowRight,
  ArrowUpRight,
  Activity,
  Dumbbell,
  Scale,
  Timer,
  Flame,
  Sparkles,
  CheckCircle2,
  Calendar,
  BookOpen,
  Layers,
  ChevronRight,
  Compass,
  Sliders,
  Database,
} from 'lucide-react';
import { FitnessTool } from '../config/tools';
import { BlogPost, formatPostDate } from '../data/mockBlogPosts';
import { ALL_TRAINING_PROGRAMS } from '../data/workouts';
import { HomeInteractiveDemo } from './HomeInteractiveDemo';
import { useAuth } from '../context/AuthContext';
import { useSharedToolMetrics } from './tools/AthleteSyncBanner';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);
}

interface ModernSaaSLandingProps {
  latestPosts: BlogPost[];
  totalArticlesCount: number;
  totalExercisesCount: number;
  tools: FitnessTool[];
  canonicalExerciseNames: Array<{
    name: string;
    primaryMuscle: string;
    equipment: string;
  }>;
}

const CHAPTER_NAV = [
  { id: '#hero-top', label: 'Overview' },
  { id: '#bento-suite', label: 'Athlete Suite' },
  { id: '#live-engine', label: 'Live Tracker' },
  { id: '#split-programs', label: '4 Splits' },
  { id: '#science-scroll', label: 'Biomechanics' },
  { id: '#research-journal', label: 'Research' },
];

export const ModernSaaSLanding: React.FC<ModernSaaSLandingProps> = ({
  latestPosts,
  totalArticlesCount,
  totalExercisesCount,
  tools,
  canonicalExerciseNames,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { metrics } = useSharedToolMetrics();

  const [activeChapter, setActiveChapter] = useState<string>('#hero-top');
  const [expandedSplitIdx, setExpandedSplitIdx] = useState<number>(0);
  const [selectedJournalCategory, setSelectedJournalCategory] =
    useState<string>('ALL');

  // Smooth GSAP ScrollToPlugin handler
  const scrollToSection = (targetSelector: string) => {
    setActiveChapter(targetSelector);
    if (typeof window === 'undefined') return;
    gsap.to(window, {
      duration: 1.15,
      scrollTo: { y: targetSelector, offsetY: 84 },
      ease: 'power3.inOut',
    });
  };

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      if (prefersReducedMotion) return;

      // 1. Hero kinetic staggered entrance
      gsap.from('.gsap-hero-reveal', {
        y: 36,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
      });

      // 2. Hero dashboard preview card scale-in on scroll
      gsap.fromTo(
        '.gsap-hero-console-frame',
        { scale: 0.92, opacity: 0.6 },
        {
          scale: 1,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.gsap-hero-console-frame',
            start: 'top 85%',
            end: 'top 35%',
            scrub: 0.6,
          },
        }
      );

      // 3. Infinite horizontal telemetry ticker
      gsap.to('.gsap-marquee-track', {
        xPercent: -50,
        repeat: -1,
        duration: 34,
        ease: 'none',
      });

      // 4. Bento Grid cards staggered scroll entrance
      gsap.from('.gsap-bento-card', {
        y: 48,
        opacity: 0,
        scale: 0.96,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#bento-suite',
          start: 'top 78%',
        },
      });

      // 5. Scrubbing word-by-word manifesto reveal
      const scrubWords = gsap.utils.toArray<HTMLElement>('.gsap-scrub-word');
      if (scrubWords.length > 0) {
        gsap.fromTo(
          scrubWords,
          { opacity: 0.16 },
          {
            opacity: 1,
            stagger: 0.05,
            ease: 'none',
            scrollTrigger: {
              trigger: '.gsap-scrub-container',
              start: 'top 80%',
              end: 'bottom 45%',
              scrub: true,
            },
          }
        );
      }

      // 6. Stacking biomechanical cards on scroll
      const stackCards = gsap.utils.toArray<HTMLElement>('.gsap-stack-card');
      stackCards.forEach((card, idx) => {
        gsap.fromTo(
          card,
          { y: 60, opacity: 0, scale: 0.94 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 84%',
              end: 'top 30%',
              toggleActions: 'play none none reverse',
            },
          }
        );
        void idx;
      });

      // 7. Track active section in floating SaaS chapter dock
      CHAPTER_NAV.forEach((chap) => {
        const el = document.querySelector(chap.id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: 'top 45%',
          end: 'bottom 45%',
          onEnter: () => setActiveChapter(chap.id),
          onEnterBack: () => setActiveChapter(chap.id),
        });
      });
    },
    { scope: containerRef }
  );

  const journalCategories = [
    'ALL',
    ...Array.from(
      new Set(latestPosts.map((p) => p.splitCategory).filter(Boolean))
    ).slice(0, 5),
  ];

  const filteredPosts =
    selectedJournalCategory === 'ALL'
      ? latestPosts.slice(0, 6)
      : latestPosts
          .filter((p) => p.splitCategory === selectedJournalCategory)
          .slice(0, 6);

  const manifestoSentence =
    'Every working set, rep ceiling, barbell sleeve load, metabolic calorie target, and biomechanical substitution operates inside one unified hypertrophy engine.';

  return (
    <div
      ref={containerRef}
      className="relative overflow-x-hidden w-full max-w-full"
    >
      {/* Floating SaaS Scroll-To Chapter Navigator (Desktop) */}
      <nav
        aria-label="Page section quick jump"
        className="hidden xl:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-40 items-center gap-1 p-1.5 rounded-full bg-[#090B0F]/85 backdrop-blur-xl border border-white/15 shadow-2xl"
      >
        <span className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-[#B7FF4A] flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5" /> Jump:
        </span>
        {CHAPTER_NAV.map((item) => {
          const isActive = activeChapter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#B7FF4A] text-[#090B0F] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* ========================================================= */}
      {/* 1. ATTENTION: CINEMATIC CENTER SAAS HERO                   */}
      {/* ========================================================= */}
      <section
        id="hero-top"
        className="relative pt-16 sm:pt-24 pb-24 md:pb-36 border-b border-[var(--border-subtle)] overflow-hidden"
      >
        {/* Ambient Mesh & Radial Lighting */}
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[980px] h-[560px] bg-gradient-to-tr from-[#B7FF4A]/12 via-[#36D6B0]/8 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-8">
          {/* Ultra-Wide 2-to-3 Line H1 with Inline Micro-Image */}
          <h1
            style={{ fontSize: 'clamp(2.5rem, 5.2vw, 5.25rem)' }}
            className="gsap-hero-reveal font-display font-black tracking-tight text-[var(--text-primary)] max-w-6xl mx-auto leading-[1.04] text-balance"
          >
            Precision hypertrophy{' '}
            <span
              aria-hidden="true"
              className="inline-block w-20 sm:w-28 h-9 sm:h-12 rounded-full align-middle bg-cover bg-center mx-1.5 border border-[#B7FF4A]/50 shadow-inner"
              style={{
                backgroundImage:
                  'url(https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=80)',
              }}
            />{' '}
            software for{' '}
            <span className="text-[#B7FF4A]">
              relentless progressive overload.
            </span>
          </h1>

          <p className="gsap-hero-reveal text-base sm:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed font-normal">
            Execute 4 periodized training splits, auto-detect double progression
            rep ceilings, sync biometrics across {tools.length} interconnected
            calculators, and explore {totalArticlesCount} peer-reviewed
            biomechanics studies.
          </p>

          {/* Dual High-Contrast CTAs + GSAP Smooth Scroll Action */}
          <div className="gsap-hero-reveal flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/tools/ppl-tracker"
              className="w-full sm:w-auto px-8 py-4 bg-[#B7FF4A] hover:bg-[#a8f23d] text-[#090B0F] font-display font-black uppercase tracking-wider text-sm rounded-2xl shadow-xl shadow-[#B7FF4A]/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <span>Launch Workout OS</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>

            <button
              type="button"
              onClick={() => scrollToSection('#live-engine')}
              className="w-full sm:w-auto px-8 py-4 bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] border border-[var(--border-strong)] text-[var(--text-primary)] font-mono font-bold text-xs uppercase tracking-wider rounded-2xl transition-all hover:border-[#B7FF4A]/60 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-[#36D6B0]" />
              <span>Scroll to Live Workout Engine</span>
            </button>
          </div>

          {/* Live Telemetry SaaS Console Frame (Real Data from Auth/Profile/Repository) */}
          <div className="gsap-hero-reveal gsap-hero-console-frame pt-8 max-w-6xl mx-auto">
            <div className="rounded-3xl bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--border-subtle)] shadow-2xl overflow-hidden text-left">
              {/* Window Top Bar */}
              <div className="px-5 py-3.5 bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
                  <span className="ml-2 text-xs font-mono text-[var(--text-muted)]">
                    ppltracker.web.id — Live Athlete Telemetry Workspace
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#B7FF4A]/15 text-[#B7FF4A] border border-[#B7FF4A]/30 font-bold">
                    {user?.name ? `Synced: ${user.name}` : 'Local-First Ready'}
                  </span>
                  <button
                    type="button"
                    onClick={() => scrollToSection('#bento-suite')}
                    className="text-[var(--text-secondary)] hover:text-[#B7FF4A] transition cursor-pointer"
                  >
                    Explore {tools.length} Connected Modules ↓
                  </button>
                </div>
              </div>

              {/* Real Platform Metrics Strip */}
              <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-subtle)] bg-[var(--bg-secondary)]/50">
                <div className="p-5 sm:p-6 space-y-1">
                  <div className="text-xs font-mono text-[var(--text-muted)] uppercase flex items-center justify-between">
                    <span>Canonical Exercises</span>
                    <Dumbbell className="w-4 h-4 text-[#B7FF4A]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-display font-black text-[var(--text-primary)] font-mono tabular-nums">
                    {totalExercisesCount}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    Verified EMG & vector profiles
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-1">
                  <div className="text-xs font-mono text-[var(--text-muted)] uppercase flex items-center justify-between">
                    <span>Published Research</span>
                    <BookOpen className="w-4 h-4 text-[#36D6B0]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-display font-black text-[var(--text-primary)] font-mono tabular-nums">
                    {totalArticlesCount}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    Sanity CMS peer-reviewed studies
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-1">
                  <div className="text-xs font-mono text-[var(--text-muted)] uppercase flex items-center justify-between">
                    <span>Connected Suite</span>
                    <Activity className="w-4 h-4 text-[#B7FF4A]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-display font-black text-[var(--text-primary)] font-mono tabular-nums">
                    {tools.length} Tools
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    Auto-synced with Athlete Profile
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-1">
                  <div className="text-xs font-mono text-[var(--text-muted)] uppercase flex items-center justify-between">
                    <span>Active Working Load</span>
                    <Scale className="w-4 h-4 text-[#36D6B0]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-display font-black text-[#B7FF4A] font-mono tabular-nums">
                    {metrics.workingWeightKg
                      ? `${metrics.workingWeightKg} kg`
                      : user?.weight
                      ? `${user.weight} kg BW`
                      : '4 Splits'}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {metrics.exerciseName
                      ? `Last logged: ${metrics.exerciseName}`
                      : 'PPL • Upper/Lower • Bro • Full Body'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* INFINITE GSAP TELEMETRY MARQUEE (REAL CANONICAL EXERCISES) */}
      {/* ========================================================= */}
      <div
        aria-label="Canonical exercise database ticker"
        className="py-5 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] overflow-hidden select-none"
      >
        <div className="gsap-marquee-track flex items-center gap-8 whitespace-nowrap w-max">
          {[...canonicalExerciseNames, ...canonicalExerciseNames].map(
            (ex, i) => (
              <div
                key={`${ex.name}-${i}`}
                className="inline-flex items-center gap-3 text-xs font-mono"
              >
                <span className="w-2 h-2 rounded-full bg-[#B7FF4A]" />
                <span className="font-bold text-[var(--text-primary)] uppercase">
                  {ex.name}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                  {ex.primaryMuscle}
                </span>
                <span className="text-[var(--text-muted)]">
                  [{ex.equipment}]
                </span>
              </div>
            )
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. INTEREST: GAPLESS 12-COLUMN BENTO GRID (5 CARDS)       */}
      {/* ========================================================= */}
      <section
        id="bento-suite"
        className="py-28 md:py-40 max-w-7xl mx-auto px-4 sm:px-6 space-y-12"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-[var(--text-primary)] leading-tight">
              One Athlete Profile.{' '}
              <span className="text-[#B7FF4A]">
                Every Calculator Connected.
              </span>
            </h2>
            <p className="text-base text-[var(--text-secondary)] leading-relaxed">
              Enter your age, height, weight, sex, or working set once. Every
              calculator across PPL Tracker reads your profile automatically—with
              an instant toggle to calculate for someone else.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollToSection('#live-engine')}
              className="px-4 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[#B7FF4A]/50 text-xs font-mono font-bold text-[var(--text-primary)] transition cursor-pointer"
            >
              Test Live Engine ↓
            </button>
            <Link
              href="/tools"
              className="px-4 py-2.5 rounded-xl bg-[#B7FF4A]/15 border border-[#B7FF4A]/40 text-xs font-mono font-bold text-[#B7FF4A] hover:bg-[#B7FF4A] hover:text-[#090B0F] transition inline-flex items-center gap-1.5"
            >
              <span>All {tools.length} Tools</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Mathematically Perfect 12-Column Gapless Bento Grid (Row 1: 8 + 4 = 12, Row 2: 4 + 4 + 4 = 12) */}
        <div className="grid grid-cols-1 md:grid-cols-12 grid-flow-dense gap-6">
          {/* Card 1: Span 8 — PPL Workout Tracker Flagship */}
          <div className="gsap-bento-card md:col-span-8 group relative rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[#B7FF4A]/50 p-7 sm:p-9 flex flex-col justify-between overflow-hidden shadow-xl transition-all">
            <div className="absolute -right-16 -top-16 w-72 h-72 bg-[#B7FF4A]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#B7FF4A]/20 transition-all duration-700" />

            <div className="space-y-4 relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-lg bg-[#B7FF4A]/15 text-[#B7FF4A] border border-[#B7FF4A]/30 text-xs font-mono font-bold">
                  Flagship Hypertrophy OS
                </span>
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  Offline LocalStorage + Supabase Cloud Sync
                </span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-display font-black text-[var(--text-primary)] tracking-tight">
                6-Day Push • Pull • Legs Progressive Overload Engine
              </h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl leading-relaxed">
                Automatically schedules your training day, prioritizes lagging
                muscle groups at the start of your workout, fires Web Audio rest
                timers, and flags exact +2.5 kg double progression jumps when
                every set clears the rep ceiling.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {ALL_TRAINING_PROGRAMS.map((prog) => (
                  <div
                    key={prog.id}
                    className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
                  >
                    <div className="text-xs font-mono font-bold text-[#B7FF4A] tabular-nums">
                      {prog.daysPerWeek} Days / Wk
                    </div>
                    <div className="text-xs font-semibold text-[var(--text-primary)] mt-0.5 truncate">
                      {prog.name.split('(')[0].trim()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4 relative z-10">
              <span className="text-xs font-mono text-[var(--text-secondary)]">
                Includes {totalExercisesCount} canonical exercises with
                biomechanical form cues
              </span>
              <Link
                href="/tools/ppl-tracker"
                className="px-6 py-3 rounded-2xl bg-[#B7FF4A] hover:bg-[#a8f23d] text-[#090B0F] font-display font-black uppercase tracking-wider text-xs inline-flex items-center gap-2 transition-all"
              >
                <span>Open Workout Tracker</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Span 4 — Deterministic Exercise Substitution Engine */}
          <div className="gsap-bento-card md:col-span-4 group relative rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[#36D6B0]/50 p-7 flex flex-col justify-between overflow-hidden shadow-xl transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-[#36D6B0]/15 text-[#36D6B0] border border-[#36D6B0]/30 text-xs font-mono font-bold">
                  Kinematic Matcher
                </span>
                <Database className="w-5 h-5 text-[#36D6B0]" />
              </div>

              <h3 className="text-2xl font-display font-black text-[var(--text-primary)] tracking-tight">
                Biomechanical Substitution Finder
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Cable tower or squat rack occupied? Filter {totalExercisesCount}{' '}
                canonical movements by available equipment and primary muscle
                vector.
              </p>

              <div className="space-y-2 pt-1 font-mono text-xs">
                {canonicalExerciseNames.slice(0, 3).map((ex) => (
                  <div
                    key={ex.name}
                    className="p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-between"
                  >
                    <span className="font-bold text-[var(--text-primary)] truncate">
                      {ex.name}
                    </span>
                    <span className="text-[10px] text-[#36D6B0] uppercase shrink-0 ml-2">
                      {ex.primaryMuscle}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-[var(--border-subtle)]">
              <Link
                href="/tools/workout-substitution-finder"
                className="w-full py-3 px-4 rounded-2xl bg-[var(--bg-elevated)] hover:bg-[#36D6B0] hover:text-[#090B0F] text-[var(--text-primary)] font-mono text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center justify-between"
              >
                <span>Swap Exercises</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 3: Span 4 — 1RM & RPE Strength Autoregulation */}
          <div className="gsap-bento-card md:col-span-4 group relative rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[#B7FF4A]/50 p-7 flex flex-col justify-between overflow-hidden shadow-xl transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-[#B7FF4A]/15 text-[#B7FF4A] border border-[#B7FF4A]/30 text-xs font-mono font-bold">
                  Epley • Brzycki • RIR
                </span>
                <Flame className="w-5 h-5 text-[#B7FF4A]" />
              </div>

              <h3 className="text-2xl font-display font-black text-[var(--text-primary)] tracking-tight">
                1RM & RPE Load Autoregulation
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Convert any working set into a 4-formula One-Rep Max consensus
                and 60%–95% load table, or prescribe exact weights from RPE
                6.5–10.
              </p>

              <div className="grid grid-cols-2 gap-2.5 pt-1 font-mono text-xs">
                <Link
                  href="/tools/one-rep-max-calculator"
                  className="p-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[#B7FF4A] transition"
                >
                  <div className="text-[10px] text-[var(--text-muted)] uppercase">
                    1RM Engine
                  </div>
                  <div className="font-bold text-[#B7FF4A] mt-0.5 tabular-nums">
                    {metrics.estimated1RMKg
                      ? `${metrics.estimated1RMKg} kg e1RM`
                      : '60%–100% Chart'}
                  </div>
                </Link>
                <Link
                  href="/tools/rpe-calculator"
                  className="p-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[#36D6B0] transition"
                >
                  <div className="text-[10px] text-[var(--text-muted)] uppercase">
                    RPE / RIR
                  </div>
                  <div className="font-bold text-[#36D6B0] mt-0.5">
                    0–4 RIR Matrix
                  </div>
                </Link>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-[var(--border-subtle)]">
              <Link
                href="/tools/one-rep-max-calculator"
                className="w-full py-3 px-4 rounded-2xl bg-[var(--bg-elevated)] hover:bg-[#B7FF4A] hover:text-[#090B0F] text-[var(--text-primary)] font-mono text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center justify-between"
              >
                <span>Compute 1RM & RPE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 4: Span 4 — TDEE, FFMI & Body Composition */}
          <div className="gsap-bento-card md:col-span-4 group relative rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[#36D6B0]/50 p-7 flex flex-col justify-between overflow-hidden shadow-xl transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-[#36D6B0]/15 text-[#36D6B0] border border-[#36D6B0]/30 text-xs font-mono font-bold">
                  Biometric Auto-Sync
                </span>
                <Activity className="w-5 h-5 text-[#36D6B0]" />
              </div>

              <h3 className="text-2xl font-display font-black text-[var(--text-primary)] tracking-tight">
                TDEE, FFMI & Athlete BMI Suite
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Your profile biometrics automatically compute Mifflin-St Jeor &
                Katch-McArdle macros, normalized FFMI, and muscular BMI.
              </p>

              <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px] text-center">
                <Link
                  href="/tools/tdee-calculator"
                  className="p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[#B7FF4A] font-bold text-[var(--text-primary)]"
                >
                  TDEE Macros
                </Link>
                <Link
                  href="/tools/ffmi-calculator"
                  className="p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[#36D6B0] font-bold text-[var(--text-primary)]"
                >
                  FFMI Limit
                </Link>
                <Link
                  href="/tools/bmi-calculator"
                  className="p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[#B7FF4A] font-bold text-[var(--text-primary)]"
                >
                  Athlete BMI
                </Link>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-[var(--border-subtle)]">
              <Link
                href="/tools/tdee-calculator"
                className="w-full py-3 px-4 rounded-2xl bg-[var(--bg-elevated)] hover:bg-[#36D6B0] hover:text-[#090B0F] text-[var(--text-primary)] font-mono text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center justify-between"
              >
                <span>Open Nutrition & FFMI</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 5: Span 4 — Olympic Barbell Plate Loader */}
          <div className="gsap-bento-card md:col-span-4 group relative rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[#B7FF4A]/50 p-7 flex flex-col justify-between overflow-hidden shadow-xl transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-[#B7FF4A]/15 text-[#B7FF4A] border border-[#B7FF4A]/30 text-xs font-mono font-bold">
                  IWF / IPF Calibrated
                </span>
                <Scale className="w-5 h-5 text-[#B7FF4A]" />
              </div>

              <h3 className="text-2xl font-display font-black text-[var(--text-primary)] tracking-tight">
                Olympic Barbell Plate Loader
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Receives your recommended working weight from the 1RM and RPE
                calculators and renders exact per-sleeve plate loading + warmup
                ladders.
              </p>

              <div className="flex items-center gap-1.5 justify-center py-2">
                <div className="w-5 h-16 rounded-md bg-red-600 text-[9px] text-white font-mono flex items-center justify-center font-bold">
                  25
                </div>
                <div className="w-5 h-14 rounded-md bg-blue-600 text-[9px] text-white font-mono flex items-center justify-center font-bold">
                  20
                </div>
                <div className="w-4 h-12 rounded-md bg-amber-400 text-[9px] text-black font-mono flex items-center justify-center font-bold">
                  15
                </div>
                <div className="w-4 h-10 rounded-md bg-emerald-600 text-[9px] text-white font-mono flex items-center justify-center font-bold">
                  10
                </div>
                <div className="w-3.5 h-8 rounded-md bg-zinc-700 text-[8px] text-white font-mono flex items-center justify-center font-bold">
                  5
                </div>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-[var(--border-subtle)]">
              <Link
                href="/tools/plate-calculator"
                className="w-full py-3 px-4 rounded-2xl bg-[var(--bg-elevated)] hover:bg-[#B7FF4A] hover:text-[#090B0F] text-[var(--text-primary)] font-mono text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center justify-between"
              >
                <span>Open Plate Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. LIVE WORKOUT & PLATE ENGINE (REAL PERSISTENT DATA)     */}
      {/* ========================================================= */}
      <section
        id="live-engine"
        className="py-28 md:py-36 bg-[var(--bg-secondary)] border-y border-[var(--border-subtle)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-[var(--text-primary)] leading-tight">
                Log Today&apos;s Scheduled Session{' '}
                <span className="text-[#B7FF4A]">Right From Home.</span>
              </h2>
              <p className="text-base text-[var(--text-secondary)]">
                Connected directly to your real training split, local workout
                database, and 1RM/Plate calculators—every set you check off here
                is saved to your tracker.
              </p>
            </div>

            <button
              type="button"
              onClick={() => scrollToSection('#split-programs')}
              className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[#B7FF4A]/40 text-xs font-mono font-bold text-[var(--text-primary)] transition cursor-pointer"
            >
              Inspect All 4 Periodized Splits ↓
            </button>
          </div>

          <HomeInteractiveDemo />
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. DESIRE: INTERACTIVE HORIZONTAL SPLIT ACCORDION         */}
      {/* ========================================================= */}
      <section
        id="split-programs"
        className="py-28 md:py-40 max-w-7xl mx-auto px-4 sm:px-6 space-y-12"
      >
        <div className="space-y-3 max-w-3xl">
          <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-[var(--text-primary)] leading-tight">
            Four Periodized Architectures.{' '}
            <span className="text-[#36D6B0]">Zero Guesswork.</span>
          </h2>
          <p className="text-base text-[var(--text-secondary)]">
            Click any program below to inspect the real microcycle structure,
            prescribed exercise count, and target rep ceilings loaded inside PPL
            Tracker.
          </p>
        </div>

        {/* Horizontal Expandable Split Cards */}
        <div className="flex flex-col lg:flex-row gap-4 min-h-[420px]">
          {ALL_TRAINING_PROGRAMS.map((prog, idx) => {
            const isExpanded = expandedSplitIdx === idx;
            const totalExercisesInProg = prog.days.reduce(
              (acc, d) => acc + d.exercises.length,
              0
            );
            const totalSetsInProg = prog.days.reduce(
              (acc, d) =>
                acc + d.exercises.reduce((sAcc, ex) => sAcc + ex.sets, 0),
              0
            );

            return (
              <div
                key={prog.id}
                onClick={() => setExpandedSplitIdx(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setExpandedSplitIdx(idx);
                  }
                }}
                aria-expanded={isExpanded}
                className={`rounded-3xl border p-6 sm:p-8 transition-all duration-500 cursor-pointer flex flex-col justify-between overflow-hidden ${
                  isExpanded
                    ? 'lg:flex-[2.6] bg-[var(--bg-card)] border-[#B7FF4A]/60 shadow-2xl'
                    : 'lg:flex-1 bg-[var(--bg-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-strong)] opacity-85 hover:opacity-100'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-lg bg-[#B7FF4A]/15 text-[#B7FF4A] border border-[#B7FF4A]/30 text-xs font-mono font-bold tabular-nums">
                      {prog.daysPerWeek} Days / Week
                    </span>
                    <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums">
                      {totalSetsInProg} Weekly Sets
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-display font-black text-[var(--text-primary)] tracking-tight">
                    {prog.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    {prog.description}
                  </p>

                  {isExpanded && (
                    <div className="pt-4 space-y-3 border-t border-[var(--border-subtle)]">
                      <div className="text-xs font-mono uppercase text-[#36D6B0] font-bold">
                        Included Training Days ({prog.days.length} Sessions •{' '}
                        {totalExercisesInProg} Exercises):
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {prog.days.slice(0, 6).map((day) => (
                          <div
                            key={day.id}
                            className="p-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs"
                          >
                            <div className="font-mono font-bold text-[var(--text-primary)]">
                              {day.title}
                            </div>
                            <div className="text-[11px] text-[var(--text-secondary)] truncate mt-0.5">
                              {day.subtitle}
                            </div>
                            <div className="text-[10px] font-mono text-[#B7FF4A] mt-1">
                              {day.exercises.length} exercises •{' '}
                              {day.exercises[0]?.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    Ideal for: {prog.idealFor.slice(0, 42)}...
                  </span>
                  <Link
                    href="/tools/ppl-tracker"
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-2 rounded-xl bg-[#B7FF4A] text-[#090B0F] font-mono font-bold text-xs uppercase inline-flex items-center gap-1.5 shrink-0"
                  >
                    <span>Run Split</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. GSAP SCRUBBING MANIFESTO & BIOMECHANICAL STACK         */}
      {/* ========================================================= */}
      <section
        id="science-scroll"
        className="py-28 md:py-40 bg-[var(--bg-secondary)] border-y border-[var(--border-subtle)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-20">
          {/* GSAP Scrubbed Word-by-Word Reveal */}
          <div className="gsap-scrub-container max-w-5xl mx-auto text-center">
            <p className="text-2xl sm:text-4xl md:text-5xl font-display font-black leading-[1.18] tracking-tight text-[var(--text-primary)]">
              {manifestoSentence.split(' ').map((word, idx) => (
                <span
                  key={idx}
                  className="gsap-scrub-word inline-block mr-2.5 text-[var(--text-primary)]"
                >
                  {word}
                </span>
              ))}
            </p>
          </div>

          {/* Stacking Biomechanical Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                badge: 'Clavicular Pec Mechanics',
                title: '15°–30° Low-Incline Vector Alignment',
                body: 'Surface EMG data (Lauver et al., 2016) confirms bench angles above 30° shift torque to the anterior deltoid. Our Push days lock incline pressing to 15°–30° for peak upper-chest fiber recruitment.',
                href: '/blog/low-incline-dumbbell-press-upper-pec',
                linkText: 'Read Incline Biomechanics Study',
              },
              {
                badge: 'Double Progression Math',
                title: 'Rep Ceiling Mastery Before Load Jumps',
                body: 'Adding barbell weight every week causes form breakdown and joint strain. PPL Tracker holds load constant until you hit the top of your target rep bracket across every working set.',
                href: '/blog/double-progression-protocol-hypertrophy',
                linkText: 'Explore Double Progression Protocol',
              },
              {
                badge: 'Autoregulated Readiness',
                title: 'RPE 8–9 & 1–2 Reps In Reserve Accuracy',
                body: 'Stimulate high-threshold motor units without central nervous system burnout by keeping compound lifts at 1–2 RIR and isolating lengthened partials on stable cables and machines.',
                href: '/blog/upper-chest-proximity-to-failure-rir',
                linkText: 'Read RIR & Failure Study',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="gsap-stack-card rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-8 flex flex-col justify-between space-y-6 shadow-xl"
              >
                <div className="space-y-4">
                  <span className="inline-block px-3 py-1 rounded-lg bg-[#B7FF4A]/10 text-[#B7FF4A] border border-[#B7FF4A]/25 text-xs font-mono font-bold">
                    {item.badge}
                  </span>
                  <h3 className="text-2xl font-display font-black text-[var(--text-primary)] tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {item.body}
                  </p>
                </div>

                <Link
                  href={item.href}
                  className="pt-4 border-t border-[var(--border-subtle)] inline-flex items-center justify-between text-xs font-mono font-bold text-[#B7FF4A] hover:underline"
                >
                  <span>{item.linkText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. REAL SANITY CMS RESEARCH JOURNAL (110 LIVE ARTICLES)   */}
      {/* ========================================================= */}
      <section
        id="research-journal"
        className="py-28 md:py-40 max-w-7xl mx-auto px-4 sm:px-6 space-y-12"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-[var(--text-primary)] leading-tight">
              Peer-Reviewed{' '}
              <span className="text-[#B7FF4A]">Biomechanics Journal.</span>
            </h2>
            <p className="text-base text-[var(--text-secondary)]">
              Live from our Sanity CMS knowledgebase: {totalArticlesCount}{' '}
              evidence-based hypertrophy, biomechanics, nutrition, and longevity
              monographs with zero duplicate visuals.
            </p>
          </div>

          {/* Live Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {journalCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedJournalCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                  selectedJournalCategory === cat
                    ? 'bg-[#B7FF4A] text-[#090B0F]'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="rounded-3xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[#B7FF4A]/50 transition-all flex flex-col justify-between group shadow-md hover:shadow-2xl"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--bg-elevated)]">
                {post.mainImage ? (
                  <Image
                    src={post.mainImage}
                    alt={post.imageAlt || post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[var(--bg-elevated)]">
                    <BookOpen className="w-8 h-8 text-[var(--text-muted)]" />
                  </div>
                )}
                <span className="absolute top-3 left-3 text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded-lg bg-[#090B0F]/85 backdrop-blur-md text-[#B7FF4A] border border-[#B7FF4A]/30">
                  {post.splitCategory}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                    <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                      <Calendar className="w-3.5 h-3.5 text-[#B7FF4A]" />
                      {formatPostDate(post.publishedAt)}
                    </span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-display font-bold text-[var(--text-primary)] group-hover:text-[#B7FF4A] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono">
                  <span className="text-[var(--text-muted)] truncate max-w-[160px]">
                    {post.author?.name}
                  </span>
                  <span className="text-[#B7FF4A] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read Study</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <Link
            href="/blog"
            className="px-8 py-4 rounded-2xl bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] border border-[var(--border-strong)] hover:border-[#B7FF4A]/50 text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] inline-flex items-center gap-2 transition-all"
          >
            <span>Browse All {totalArticlesCount} Peer-Reviewed Articles</span>
            <ArrowRight className="w-4 h-4 text-[#B7FF4A]" />
          </Link>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. ACTION: HIGH-CONTRAST FINAL CONVERSION SECTION         */}
      {/* ========================================================= */}
      <section className="py-24 md:py-36 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-[var(--bg-card)] border border-[#B7FF4A]/40 p-10 sm:p-16 text-center space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#B7FF4A]/12 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#36D6B0]/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-[var(--text-primary)] max-w-4xl mx-auto leading-[1.06]">
            Build muscle with mathematical certainty.
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Launch the PPL Workout Tracker, sync your biometrics across all{' '}
            {tools.length} calculators, and track every working set without
            paywalls or subscription clutter.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/tools/ppl-tracker"
              className="w-full sm:w-auto px-9 py-4 bg-[#B7FF4A] hover:bg-[#a8f23d] text-[#090B0F] font-display font-black uppercase tracking-wider text-sm rounded-2xl shadow-xl shadow-[#B7FF4A]/20 transition-all inline-flex items-center justify-center gap-2"
            >
              <span>Start Today&apos;s Workout</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
            <Link
              href="/tools"
              className="w-full sm:w-auto px-7 py-4 bg-[var(--bg-elevated)] hover:bg-[var(--border-strong)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-mono font-bold text-xs uppercase tracking-wider rounded-2xl transition inline-flex items-center justify-center gap-2"
            >
              <span>Open All {tools.length} Calculators</span>
              <ArrowUpRight className="w-4 h-4 text-[#36D6B0]" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

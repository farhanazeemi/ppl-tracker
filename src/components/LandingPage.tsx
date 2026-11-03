'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Dumbbell,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Timer,
  Scale,
  Target,
  Layers,
  TrendingUp,
  Zap,
  ShieldCheck,
  ChevronRight,
  Flame,
  Award,
  BookOpen,
  Calendar,
  Play,
  RotateCcw,
  Boxes,
  Cpu,
} from 'lucide-react';
import { ALL_TRAINING_PROGRAMS } from '../data/workouts';
import { MOCK_BLOG_POSTS, formatPostDate } from '../data/mockBlogPosts';
import { useAuth } from '../context/AuthContext';
import { playClickSound, playPopSound, playSetCompleteSound } from '../utils/audio';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onStartWorkout?: () => void;
  soundEnabled?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onStartWorkout,
  soundEnabled = true,
}) => {
  const { continueAsGuest } = useAuth();
  const [selectedSplitTab, setSelectedSplitTab] = useState<string>('ppl');

  // Interactive Live Demo preview states
  const [demoSets, setDemoSets] = useState([
    { id: 1, weight: 32.5, reps: 10, completed: true },
    { id: 2, weight: 32.5, reps: 10, completed: true },
    { id: 3, weight: 32.5, reps: 10, completed: false },
    { id: 4, weight: 32.5, reps: 8, completed: false },
  ]);
  const [demoPlateWeight, setDemoPlateWeight] = useState<number>(100);

  const toggleDemoSet = (id: number) => {
    playSetCompleteSound(soundEnabled);
    setDemoSets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleStartApp = () => {
    playClickSound(soundEnabled);
    continueAsGuest();
    if (onStartWorkout) onStartWorkout();
  };

  const completedCount = demoSets.filter((s) => s.completed).length;
  const demoTotalVolume = demoSets
    .filter((s) => s.completed && typeof s.reps === 'number')
    .reduce((acc, curr) => acc + curr.weight * Number(curr.reps), 0);

  // Plate math preview helper
  const calculatePlates = (totalKg: number) => {
    const bar = 20;
    let rem = Math.max(0, (totalKg - bar) / 2);
    const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25];
    const platesUsed: Record<number, number> = {};

    availablePlates.forEach((p) => {
      if (rem >= p) {
        const count = Math.floor(rem / p);
        if (count > 0) {
          platesUsed[p] = count;
          rem = Math.round((rem - count * p) * 100) / 100;
        }
      }
    });
    return platesUsed;
  };

  const plates = calculatePlates(demoPlateWeight);

  // Color mapping for plate graphic badges
  const plateBadgeStyles: Record<string, string> = {
    '25': 'bg-red-600/90 text-white border-red-500 shadow-sm',
    '20': 'bg-blue-600/90 text-white border-blue-500 shadow-sm',
    '15': 'bg-amber-400 text-black border-amber-300 font-bold shadow-sm',
    '10': 'bg-emerald-600/90 text-white border-emerald-500 shadow-sm',
    '5': 'bg-zinc-700 text-zinc-100 border-zinc-600',
    '2.5': 'bg-zinc-900 text-zinc-300 border-zinc-700',
    '1.25': 'bg-zinc-800 text-zinc-400 border-zinc-600',
  };

  return (
    <div className="bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
      {/* =================================================================== */}
      {/* 1. HERO SECTION: ATHLETIC DARK-TECH WITH DOUBLE-BEZEL EMBED        */}
      {/* =================================================================== */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-20 sm:pb-28 border-b border-[var(--border-subtle)] bg-grid-dots">
        {/* Ambient Radial Flare */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-[#B7FF4A]/12 via-[#36D6B0]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-7">
          {/* Top Status Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-strong)] text-[var(--text-secondary)] text-xs font-mono font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#B7FF4A] animate-pulse" />
            <span>Science-Backed Hypertrophy & Automated Day Scheduling</span>
          </div>

          {/* Main Editorial Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black uppercase tracking-tight text-[var(--text-primary)] max-w-5xl mx-auto leading-[0.95]">
            Relentless Progressive Overload.{' '}
            <span className="bg-gradient-to-r from-[#B7FF4A] via-[#36D6B0] to-[#B7FF4A] bg-clip-text text-transparent">
              Engineered For Hypertrophy.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto font-sans leading-relaxed">
            Eliminate mental math and fragmented notes apps. PPL Tracker detects today&apos;s scheduled split day, prioritizes lagging muscle groups, enforces double progression rep ceilings, and paces rest intervals in real time.
          </p>

          {/* Button-in-Button Action Capsule */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <button
              type="button"
              onClick={handleStartApp}
              className="w-full sm:w-auto px-8 py-4 bg-[#B7FF4A] hover:bg-[#a8f23d] text-[#090B0F] font-display font-black uppercase tracking-wider text-sm rounded-2xl shadow-xl shadow-[#B7FF4A]/25 transition-transform btn-tactile flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <Zap className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
              <span>Start Workout (Instant Free Tracker)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                onOpenAuth('signup');
              }}
              className="w-full sm:w-auto px-7 py-4 bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] border border-[var(--border-strong)] text-[var(--text-primary)] font-mono text-xs uppercase tracking-wider rounded-2xl transition-all btn-tactile flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-[#36D6B0]" />
              <span>Sign Up & Cloud Sync</span>
            </button>

            <a
              href="#demo"
              onClick={() => playClickSound(soundEnabled)}
              className="w-full sm:w-auto px-5 py-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-mono text-xs uppercase tracking-wider transition-all btn-tactile flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 text-[#B7FF4A]" />
              <span>Interactive Demo</span>
            </a>
          </div>

          {/* 4 Architecture Pillars Bar */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {[
              { val: '6-Day Split', label: 'Push · Pull · Legs System', icon: Dumbbell },
              { val: 'Double Progression', label: 'Auto Rep Ceiling Detection', icon: TrendingUp },
              { val: 'Web Audio Pacing', label: 'Precision Rest Intervals', icon: Timer },
              { val: 'Olympic Bar Math', label: 'Exact Plates Per Collar', icon: Scale },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-left space-y-1 shadow-xs transition hover:border-[var(--border-strong)]"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="w-4 h-4 text-[#B7FF4A]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B7FF4A]/40" />
                  </div>
                  <div className="text-base sm:text-lg font-display font-black text-[var(--text-primary)] tracking-tight">
                    {stat.val}
                  </div>
                  <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. HANDS-ON INTERACTIVE DEMO: SIMULATE THE ENGINE                  */}
      {/* =================================================================== */}
      <section id="demo" className="py-20 sm:py-24 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-[#B7FF4A] font-bold">
              {"// Hands-On Gym Simulation"}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
              Test The Engine Right Here
            </h2>
            <p className="text-sm text-[var(--text-secondary)] font-sans">
              Tap the checkmark buttons below to log working sets, trigger live volume calculations, and watch Olympic barbell plate math update in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Card: Live Interactive Exercise Set Logger */}
            <div className="lg:col-span-7 bezel-outer">
              <div className="bezel-inner p-6 sm:p-7 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#B7FF4A] bg-[#B7FF4A]/10 px-2.5 py-0.5 rounded-full border border-[#B7FF4A]/25">
                        ⚡ Weak Point Priority: Upper Chest
                      </span>
                      <span className="text-xs font-mono text-[var(--text-muted)]">
                        Rest: 2 min
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-display font-black uppercase text-[var(--text-primary)] mt-1.5 tracking-tight">
                      Incline Dumbbell Bench Press
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] font-sans">
                      Target: 8–10 Reps • Bench Angle: 15°–30° • Clavicular Pec Bias
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-mono uppercase text-[var(--text-muted)]">Session Volume</div>
                    <div className="text-2xl sm:text-3xl font-display font-black text-[#B7FF4A] font-mono tabular-nums">
                      {demoTotalVolume}{' '}
                      <span className="text-xs font-sans text-[var(--text-muted)] font-normal">kg</span>
                    </div>
                  </div>
                </div>

                {/* Set Rows Table */}
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider px-3 pb-1">
                    <div className="col-span-2">Set</div>
                    <div className="col-span-4">Weight</div>
                    <div className="col-span-3">Reps</div>
                    <div className="col-span-3 text-right">Log Set</div>
                  </div>

                  {demoSets.map((s) => (
                    <div
                      key={s.id}
                      className={`grid grid-cols-12 gap-2 items-center p-3 rounded-2xl border transition-all ${
                        s.completed
                          ? 'bg-[#B7FF4A]/10 border-[#B7FF4A]/30 text-[#B7FF4A]'
                          : 'bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-primary)]'
                      }`}
                    >
                      <div className="col-span-2 font-mono font-bold text-xs tabular-nums">
                        #{s.id}
                      </div>
                      <div className="col-span-4 font-mono font-bold text-sm tabular-nums">
                        {s.weight} kg
                      </div>
                      <div className="col-span-3 font-mono font-bold text-sm tabular-nums">
                        {s.reps || '—'}
                      </div>
                      <div className="col-span-3 text-right">
                        <button
                          type="button"
                          onClick={() => toggleDemoSet(s.id)}
                          aria-label={`Mark set ${s.id} as ${s.completed ? 'incomplete' : 'complete'}`}
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center ml-auto transition-transform active:scale-90 cursor-pointer ${
                            s.completed
                              ? 'bg-[#B7FF4A] border-[#B7FF4A] text-[#090B0F] shadow-md shadow-[#B7FF4A]/25'
                              : 'border-[var(--border-strong)] bg-[var(--bg-card)] hover:border-[#B7FF4A] text-[var(--text-muted)]'
                          }`}
                        >
                          {s.completed ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <span className="text-xs font-mono font-bold">✓</span>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Overload Trigger Feedback Pill */}
                <div className="p-3.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl flex items-center justify-between text-xs">
                  <span className="font-mono text-[#B7FF4A] font-bold">
                    {completedCount === 4
                      ? '🎉 Double Progression Achieved! Auto-increase to 35kg next session.'
                      : `Completed ${completedCount}/4 sets.`}
                  </span>
                  <span className="text-[var(--text-muted)] font-mono">
                    {completedCount === 4 ? 'Ceiling Unlocked' : 'Paces rest on tap'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Card: Live Olympic Barbell Plate Sleeve */}
            <div className="lg:col-span-5 bezel-outer">
              <div className="bezel-inner p-6 sm:p-7 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-[#36D6B0]" />
                    <h3 className="font-display font-black uppercase text-lg text-[var(--text-primary)] tracking-tight">
                      Olympic Barbell Math
                    </h3>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                    20kg Olympic Bar
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono uppercase text-[var(--text-secondary)]">
                    <span>Target Total Weight:</span>
                    <strong className="text-base text-[#B7FF4A] tabular-nums">{demoPlateWeight} kg</strong>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="180"
                    step="2.5"
                    value={demoPlateWeight}
                    onChange={(e) => setDemoPlateWeight(Number(e.target.value))}
                    className="w-full accent-[#B7FF4A] cursor-pointer h-2 bg-[var(--bg-elevated)] rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)]">
                    <span>30 kg</span>
                    <span>105 kg</span>
                    <span>180 kg</span>
                  </div>
                </div>

                {/* Visual Plate Sleeves */}
                <div className="space-y-2.5">
                  <div className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                    Plates per barbell collar side:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(plates).map(([plate, count]) => {
                      if (!count) return null;
                      const style = plateBadgeStyles[plate] || 'bg-[var(--bg-elevated)] text-[var(--text-primary)] border-[var(--border-subtle)]';
                      return (
                        <span
                          key={plate}
                          className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-bold flex items-center gap-1.5 ${style}`}
                        >
                          <span>{count} ×</span>
                          <span>{plate}kg</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] space-y-1">
                  <div className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#B7FF4A]" />
                    <span>Included Free In Full Tracker:</span>
                  </div>
                  <p className="leading-relaxed font-sans">
                    Auto-rest interval audio alerts, vector muscle anatomy rig, offline-first gym persistence, and 1RM tracking.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleStartApp}
                  className="w-full py-3.5 bg-[#B7FF4A] hover:bg-[#a8f23d] text-[#090B0F] font-display font-black uppercase tracking-wider text-xs rounded-xl transition shadow-md shadow-[#B7FF4A]/20 cursor-pointer btn-tactile flex items-center justify-center gap-2"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Launch Tracker App (Guest Mode)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. CORE ARCHITECTURE: ASYMMETRICAL BENTO GRID                       */}
      {/* =================================================================== */}
      <section id="features" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-[#B7FF4A] font-bold">
            {"// Core Architecture"}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
            Built Specifically For Hypertrophy Athletes
          </h2>
          <p className="text-sm text-[var(--text-secondary)] font-sans">
            Every screen, timer, algorithm, and modal is calibrated to keep you locked into high-intensity training.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Calendar,
              title: 'Day-Specific Smart Scheduling',
              desc: 'Upon opening PPL Tracker, the engine automatically detects today’s day of the week and loads today’s scheduled workout for your active split.',
              badge: 'Smart Calendar Detection',
              accent: 'text-[#B7FF4A] bg-[#B7FF4A]/10 border-[#B7FF4A]/25',
            },
            {
              icon: Target,
              title: 'Target Weak-Point Tailoring',
              desc: 'Select lagging muscle groups (e.g. Upper Chest, Lateral Delts, Hamstrings). The engine reorganizes exercises and places them first with fresh glycogen stores.',
              badge: 'Lagging Muscle Engine',
              accent: 'text-[#36D6B0] bg-[#36D6B0]/10 border-[#36D6B0]/25',
            },
            {
              icon: TrendingUp,
              title: 'Double Progression Tracking',
              desc: 'Fixed weight across all sets. Once you hit the top rep ceiling across every set, the app flags your achievement and triggers your next load jump.',
              badge: 'Scientific Overload',
              accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
            },
            {
              icon: Timer,
              title: 'Automated Rest Timers',
              desc: 'Checking a set auto-triggers the optimal rest interval (60s to 3min) with audio beeps and visual rings so you never under-recover or waste time.',
              badge: 'Audio Cues & Countdown',
              accent: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
            },
            {
              icon: Scale,
              title: 'Olympic Barbell Plate Math',
              desc: 'Enter any target weight and instantly view the exact 20kg, 15kg, 10kg, 5kg, and fractional plates needed per barbell collar side.',
              badge: 'Zero Mental Math',
              accent: 'text-sky-400 bg-sky-500/10 border-sky-500/25',
            },
            {
              icon: BookOpen,
              title: 'Sanity Biomechanics Blog',
              desc: 'Integrated fitness journal with peer-reviewed articles on clavicular chest angles, scapular scaption, and muscle protein synthesis.',
              badge: 'Sanity Studio Powered',
              accent: 'text-purple-400 bg-purple-500/10 border-purple-500/25',
            },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="bezel-outer group hover:-translate-y-1 transition-transform duration-200"
              >
                <div className="bezel-inner p-6 sm:p-7 flex flex-col justify-between h-full space-y-5">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-2xl bg-[var(--bg-elevated)] text-[#B7FF4A] border border-[var(--border-subtle)] group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded-full border ${f.accent}`}>
                        {f.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-display font-bold uppercase tracking-tight text-[var(--text-primary)]">
                      {f.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans leading-relaxed">
                      {f.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center gap-1.5 text-xs font-mono font-bold text-[#B7FF4A]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Included Free</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 4. TRAINING SPLIT CATALOG                                           */}
      {/* =================================================================== */}
      <section id="splits" className="py-20 sm:py-24 border-y border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-[#B7FF4A] font-bold">
              {"// Supported Periodization"}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
              Choose Your Blueprint
            </h2>
            <p className="text-sm text-[var(--text-secondary)] font-sans">
              Every split comes pre-loaded with optimal compound exercises, targeted rep ceilings, and biomechanical execution cues.
            </p>
          </div>

          {/* Tab Buttons */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {ALL_TRAINING_PROGRAMS.map((prog) => (
              <button
                key={prog.id}
                onClick={() => {
                  playClickSound(soundEnabled);
                  setSelectedSplitTab(prog.id);
                }}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition whitespace-nowrap cursor-pointer btn-tactile ${
                  selectedSplitTab === prog.id
                    ? 'bg-[#B7FF4A] text-[#090B0F] font-black shadow-md shadow-[#B7FF4A]/20'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                }`}
              >
                {prog.name.split(' (')[0]} ({prog.daysPerWeek}D)
              </button>
            ))}
          </div>

          {/* Selected Split Content Card */}
          {(() => {
            const currentProg = ALL_TRAINING_PROGRAMS.find((p) => p.id === selectedSplitTab) || ALL_TRAINING_PROGRAMS[0];
            return (
              <div className="bezel-outer">
                <div className="bezel-inner p-6 sm:p-10 space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#B7FF4A] uppercase tracking-wider">
                        {currentProg.daysPerWeek} Days Per Week
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-display font-black uppercase text-[var(--text-primary)] mt-1 tracking-tight">
                        {currentProg.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 max-w-2xl font-sans">
                        {currentProg.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleStartApp}
                      className="px-5 py-3 bg-[#B7FF4A] hover:bg-[#a8f23d] text-[#090B0F] font-display font-black uppercase text-xs rounded-xl shadow-md shadow-[#B7FF4A]/20 whitespace-nowrap self-start md:self-auto cursor-pointer btn-tactile flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>Adopt This Split</span>
                    </button>
                  </div>

                  {/* Day Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentProg.days.map((day) => (
                      <div
                        key={day.id}
                        className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-3 hover:border-[var(--border-strong)] transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-[#B7FF4A]">
                            Day {day.dayNumber}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                            {day.exercises.length} Exercises
                          </span>
                        </div>

                        <h4 className="font-display font-bold text-lg uppercase text-[var(--text-primary)] tracking-tight">
                          {day.title}
                        </h4>

                        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 font-sans">
                          {day.subtitle}
                        </p>

                        <div className="pt-2 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-muted)]">
                          Primary: <span className="text-[#B7FF4A] font-semibold">{day.focus}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 5. EVIDENCE-BASED HYPERTROPHY PRINCIPLES                            */}
      {/* =================================================================== */}
      <section className="py-20 sm:py-24 border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-[#B7FF4A] font-bold">
              {"// Scientific Foundation"}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
              The Golden Hypertrophy Rules
            </h2>
            <p className="text-sm text-[var(--text-secondary)] font-sans">
              Validated protocols from the Journal of Strength and Conditioning Research encoded directly into our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                rule: '01',
                title: '15°–30° Incline Angle',
                badge: 'Clavicular Pec Bias',
                desc: 'Steeper angles transfer tension to front deltoids. Keeping the bench between 15° and 30° isolates upper chest fibers with peak mechanical advantage.',
              },
              {
                rule: '02',
                title: 'Double Progression',
                badge: 'Rep Ceiling Rule',
                desc: 'Progress reps first across all target working sets. Only increase external load once every set hits the prescribed rep ceiling to prevent junk volume.',
              },
              {
                rule: '03',
                title: 'Loaded Stretch Under Control',
                badge: '2–3s Eccentric Negative',
                desc: 'Control the descent and eliminate bouncing at the bottom of incline presses, lateral raises, and RDLs for maximum sarcomere stretch under tension.',
              },
            ].map((r, i) => (
              <div
                key={i}
                className="bezel-outer"
              >
                <div className="bezel-inner p-7 space-y-4 h-full">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-display font-black text-[#B7FF4A] font-mono tabular-nums">
                      {r.rule}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-[#B7FF4A]/10 text-[#B7FF4A] border border-[#B7FF4A]/25">
                      {r.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-display font-bold uppercase tracking-tight text-[var(--text-primary)]">
                    {r.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                    {r.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 6. LATEST ARTICLES FROM BIOMECHANICS BLOG (SANITY CMS)               */}
      {/* =================================================================== */}
      <section className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#B7FF4A] font-bold">
              {"// Biomechanics Journal"}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
              Latest Research & Breakdowns
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-[#B7FF4A] hover:underline transition"
          >
            <span>Explore All 60+ Studies</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_BLOG_POSTS.slice(0, 3).map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="bezel-outer group hover:-translate-y-1 transition-transform duration-200 flex flex-col"
            >
              <div className="bezel-inner overflow-hidden flex flex-col justify-between h-full">
                {/* Featured Image Thumbnail */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--bg-elevated)]">
                  {post.mainImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.mainImage}
                      alt={post.imageAlt || post.title}
                      width={400}
                      height={250}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[var(--bg-elevated)]">
                      <BookOpen className="w-8 h-8 text-[var(--text-muted)]" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[#B7FF4A] border border-[#B7FF4A]/25">
                    {post.splitCategory}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                      <span className="flex items-center gap-1 text-[var(--text-secondary)] font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#B7FF4A]" />
                        {formatPostDate(post.publishedAt)}
                      </span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-lg font-display font-bold uppercase text-[var(--text-primary)] group-hover:text-[#B7FF4A] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-3 font-sans">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono">
                    <span className="text-[var(--text-muted)] truncate max-w-[140px]">{post.author.name}</span>
                    <span className="text-[#B7FF4A] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read Study <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 7. FINAL HIGH-CONVERTING CONVERSION SECTION                          */}
      {/* =================================================================== */}
      <section className="py-20 sm:py-28 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bezel-outer">
            <div className="bezel-inner p-8 sm:p-14 text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B7FF4A]/10 border border-[#B7FF4A]/25 text-[#B7FF4A] text-xs font-mono font-bold uppercase">
                <Sparkles className="w-3.5 h-3.5" /> Ready To Transform Your Lifts?
              </div>

              <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight leading-tight text-[var(--text-primary)]">
                Start Tracking With Surgical Precision Today
              </h2>
              <p className="text-sm sm:text-base font-normal max-w-2xl mx-auto text-[var(--text-secondary)] leading-relaxed font-sans">
                Pick your preferred split, choose your lagging weak points, and let PPL Tracker orchestrate your progressive overload. No paywalls, no clutter.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handleStartApp}
                  className="w-full sm:w-auto px-8 py-4 bg-[#B7FF4A] hover:bg-[#a8f23d] text-[#090B0F] font-display font-black uppercase tracking-wider text-sm rounded-2xl shadow-xl shadow-[#B7FF4A]/25 transition-transform btn-tactile inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Launch Tracker App (Free)</span>
                  <ArrowRight className="w-4 h-4 text-[#090B0F]" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playClickSound(soundEnabled);
                    onOpenAuth('signup');
                  }}
                  className="w-full sm:w-auto px-7 py-4 bg-[var(--bg-elevated)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-mono text-xs uppercase tracking-wider rounded-2xl transition-all btn-tactile inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#36D6B0]" />
                  <span>Create Cloud Account</span>
                </button>
              </div>

              <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Local-first guest mode • Instant setup • 100% Free
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

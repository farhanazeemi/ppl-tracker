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
  Play
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { ALL_TRAINING_PROGRAMS } from '../data/workouts';
import { MOCK_BLOG_POSTS, formatPostDate } from '../data/mockBlogPosts';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  const { continueAsGuest } = useAuth();
  const [selectedSplitTab, setSelectedSplitTab] = useState<string>('ppl');

  // Interactive Live Demo preview states
  const [demoSets, setDemoSets] = useState([
    { id: 1, weight: 32.5, reps: 10, completed: true },
    { id: 2, weight: 32.5, reps: 10, completed: true },
    { id: 3, weight: 32.5, reps: 9, completed: false },
    { id: 4, weight: 32.5, reps: '', completed: false },
  ]);
  const [demoPlateWeight, setDemoPlateWeight] = useState<number>(100);

  const toggleDemoSet = (id: number) => {
    setDemoSets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
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

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Top Marketing Navigation */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-[#090a0f]/85 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500 flex items-center justify-center text-black font-black font-display text-lg tracking-wider shadow-lg shadow-amber-500/25">
                PPL
              </div>
              <div>
                <span className="font-display font-black text-xl sm:text-2xl tracking-tight uppercase block leading-none text-zinc-900 dark:text-white">
                  HYPERTROPHY<span className="text-amber-500">.</span>
                </span>
                <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-600 dark:text-zinc-400 block">
                  Progressive Overload OS
                </span>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-6 text-xs font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              <a href="#features" className="hover:text-amber-500 transition-colors">
                Core Features
              </a>
              <a href="#splits" className="hover:text-amber-500 transition-colors">
                Training Splits
              </a>
              <a href="#demo" className="hover:text-amber-500 transition-colors">
                Live Interactive Demo
              </a>
              <Link href="/blog" className="hover:text-amber-500 transition-colors">
                Biomechanics Journal
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={continueAsGuest}
              className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-amber-500 hover:text-amber-400 font-bold transition cursor-pointer"
            >
              Guest Mode
            </button>
            <button
              type="button"
              onClick={() => onOpenAuth('login')}
              className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:text-amber-500 font-medium transition cursor-pointer"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => onOpenAuth('signup')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-display font-bold uppercase tracking-wider rounded-xl transition shadow-md shadow-amber-500/20 active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              Sign Up Free <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-24 border-b border-zinc-200 dark:border-zinc-800">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-amber-500/10 via-orange-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-500 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Science-Backed Hypertrophy & Automated Day Scheduling
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black uppercase tracking-tight text-zinc-900 dark:text-white max-w-5xl mx-auto leading-none">
            Relentless Progressive Overload. <br />
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 bg-clip-text text-transparent">
              Engineered For Maximum Muscle.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto font-sans leading-relaxed">
            Stop relying on generic notes apps. PPL Tracker automatically detects today&apos;s scheduled split day, tailors workouts to your lagging muscle groups, enforces double progression ceilings, and automates your rest intervals.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              type="button"
              onClick={continueAsGuest}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-display font-black uppercase tracking-wider text-sm rounded-2xl shadow-xl shadow-amber-500/25 transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              Start Workout Now (Instant Guest Mode)
            </button>
            <button
              type="button"
              onClick={() => onOpenAuth('signup')}
              className="w-full sm:w-auto px-6 py-4 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono text-xs uppercase tracking-wider rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Sign Up & Cloud Sync
            </button>
            <a
              href="#demo"
              className="w-full sm:w-auto px-5 py-4 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-mono text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 text-amber-500" /> Interactive Demo
            </a>
          </div>

          {/* Authentic Architecture Pillars Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { val: '6-Day Split', label: 'Push · Pull · Legs System' },
              { val: 'Double Progression', label: 'Auto Rep Ceiling Detection' },
              { val: 'Web Audio Rest', label: 'Built-in Interval Alerts' },
              { val: 'Olympic Math', label: 'Barbell Plates Per Sleeve' },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm"
              >
                <div className="text-lg sm:text-xl font-display font-black text-amber-500">
                  {stat.val}
                </div>
                <div className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 uppercase mt-0.5 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE ARCHITECTURE & FEATURES GRID */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">
            // Core Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight text-zinc-900 dark:text-white">
            Built Specifically For Hypertrophy Athletes
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 font-sans">
            Every screen, timer, algorithm, and modal is calibrated to keep you locked into high-intensity training.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Calendar,
              title: 'Day-Specific Smart Scheduling',
              desc: 'Upon logging in, PPL Tracker detects today’s exact day of the week and instantly loads today’s scheduled workout for your active split.',
              badge: 'Smart Calendar Detection',
              color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
            },
            {
              icon: Target,
              title: 'Target Weak-Point Tailoring',
              desc: 'Select lagging muscle groups (e.g. Upper Chest, Lateral Delts, Hamstrings). The engine reorganizes exercises and prioritizes them first with fresh glycogen.',
              badge: 'Lagging Muscle Engine',
              color: 'text-sky-500 bg-sky-500/10 border-sky-500/20'
            },
            {
              icon: TrendingUp,
              title: 'Double Progression Tracking',
              desc: 'Fixed weight across all sets. Once you hit the top rep ceiling across every set, the app flags your achievement and triggers your next load jump.',
              badge: 'Scientific Overload',
              color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
            },
            {
              icon: Timer,
              title: 'Automated Rest Timers',
              desc: 'Checking a set auto-triggers the optimal rest interval (60s to 3min) with audio beeps and visual rings so you never under-recover or waste time.',
              badge: 'Audio Cues & Countdown',
              color: 'text-orange-500 bg-orange-500/10 border-orange-500/20'
            },
            {
              icon: Scale,
              title: 'Olympic Barbell Plate Math',
              desc: 'Enter any target weight and instantly view the exact 20kg, 15kg, 10kg, 5kg, and fractional plates needed per barbell collar side.',
              badge: 'Zero Mental Math',
              color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20'
            },
            {
              icon: BookOpen,
              title: 'Sanity CMS Biomechanics Blog',
              desc: 'Integrated fitness journal with peer-reviewed articles on clavicular chest angles, scapular scaption, and muscle protein synthesis.',
              badge: 'Sanity Studio Powered',
              color: 'text-pink-500 bg-pink-500/10 border-pink-500/20'
            }
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/40 transition-all space-y-4 shadow-sm hover:shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-850 text-amber-500">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded-full border ${f.color}`}>
                      {f.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-display font-bold uppercase tracking-tight text-zinc-900 dark:text-white">
                    {f.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                    {f.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-1.5 text-xs font-mono font-bold text-amber-500">
                  <CheckCircle2 className="w-4 h-4" /> Included Free
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* INTERACTIVE LIVE DEMO PREVIEW (TRY BEFORE SIGNUP) */}
      <section id="demo" className="py-20 bg-zinc-100/60 dark:bg-zinc-900/30 border-y border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">
              // Hands-On Simulation
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight text-zinc-900 dark:text-white">
              Test The Engine Right Here
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Click the checkmarks below to simulate set completions, observe real-time volume calculations, and preview Olympic plate math.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Live Interactive Exercise Card */}
            <div className="lg:col-span-7 bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      ⚡ Weak Point Priority: Upper Chest
                    </span>
                    <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                      Rest: 2 min
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-display font-bold uppercase text-zinc-900 dark:text-white mt-1">
                    Incline Dumbbell Bench Press
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Target: 8–10 Reps • Bench Angle: 15°–30° • Clavicular Pec Bias
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono uppercase text-zinc-600 dark:text-zinc-400">Session Volume</div>
                  <div className="text-2xl font-display font-black text-amber-500">
                    {demoTotalVolume} <span className="text-xs font-sans text-zinc-400">kg</span>
                  </div>
                </div>
              </div>

              {/* Set rows */}
              <div className="space-y-2.5">
                <div className="grid grid-cols-12 gap-2 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 uppercase tracking-wider px-2">
                  <div className="col-span-2">Set</div>
                  <div className="col-span-4">Weight (kg)</div>
                  <div className="col-span-3">Reps</div>
                  <div className="col-span-3 text-right">Log Set</div>
                </div>

                {demoSets.map((s) => (
                  <div
                    key={s.id}
                    className={`grid grid-cols-12 gap-2 items-center p-3 rounded-2xl border transition-all ${
                      s.completed
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <div className="col-span-2 font-mono font-bold text-xs">
                      #{s.id}
                    </div>
                    <div className="col-span-4 font-mono font-bold text-sm">
                      {s.weight} kg
                    </div>
                    <div className="col-span-3 font-mono font-bold text-sm">
                      {s.reps || '—'}
                    </div>
                    <div className="col-span-3 text-right">
                      <button
                        type="button"
                        onClick={() => toggleDemoSet(s.id)}
                        className={`w-8 h-8 rounded-xl border flex items-center justify-center ml-auto transition-transform active:scale-90 cursor-pointer ${
                          s.completed
                            ? 'bg-emerald-500 border-emerald-500 text-black shadow-md shadow-emerald-500/20'
                            : 'border-zinc-300 dark:border-zinc-700 hover:border-amber-500'
                        }`}
                      >
                        {s.completed && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between text-xs">
                <span className="font-mono text-amber-500 font-semibold">
                  {completedCount === 4 ? '🎉 Double Progression Achieved! Add 2.5kg next session.' : `Completed ${completedCount}/4 sets.`}
                </span>
                <span className="text-zinc-600 dark:text-zinc-400">
                  {completedCount === 4 ? 'Ready to Overload' : 'Rest timer triggers on tap'}
                </span>
              </div>
            </div>

            {/* Live Interactive Olympic Plate Math */}
            <div className="lg:col-span-5 bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-amber-500" />
                  <h3 className="font-display font-bold uppercase text-lg text-zinc-900 dark:text-white">
                    Olympic Barbell Math
                  </h3>
                </div>
                <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400">20kg Bar</span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Target Weight: {demoPlateWeight} kg
                </label>
                <input
                  type="range"
                  min="30"
                  max="180"
                  step="2.5"
                  value={demoPlateWeight}
                  onChange={(e) => setDemoPlateWeight(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Visual Plates Display */}
              <div className="space-y-2">
                <div className="text-xs font-mono text-zinc-600 dark:text-zinc-400 uppercase">
                  Plates per collar side:
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(plates).map(([plate, count]) => {
                    if (!count) return null;
                    return (
                      <span
                        key={plate}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 font-mono text-xs font-bold"
                      >
                        {count} × {plate}kg
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Full Tracker Unlocks:
                </div>
                <p>
                  Automatic rest intervals with audio beeps, 3D gym visualizer, workout session history, and day-of-week scheduling.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onOpenAuth('signup')}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-display font-bold uppercase tracking-wider text-xs rounded-xl transition shadow-md shadow-amber-500/20 cursor-pointer"
              >
                Sign Up to Unlock Full Tracker
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TRAINING SPLIT CATALOG */}
      <section id="splits" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">
            // Supported Periodization
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight text-zinc-900 dark:text-white">
            Choose Your Blueprint
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 font-sans">
            Every split comes pre-loaded with optimal compound exercises, targeted rep ceilings, and biomechanical execution cues.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {ALL_TRAINING_PROGRAMS.map((prog) => (
            <button
              key={prog.id}
              onClick={() => setSelectedSplitTab(prog.id)}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${
                selectedSplitTab === prog.id
                  ? 'bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/20'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800'
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
            <div className="bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-500 uppercase">
                    {currentProg.daysPerWeek} Days Per Week
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-display font-bold uppercase text-zinc-900 dark:text-white mt-1">
                    {currentProg.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
                    {currentProg.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenAuth('signup')}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-display font-bold uppercase text-xs rounded-xl shadow-md shadow-amber-500/20 whitespace-nowrap self-start md:self-auto cursor-pointer"
                >
                  Adopt This Split
                </button>
              </div>

              {/* Day cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentProg.days.map((day) => (
                  <div
                    key={day.id}
                    className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-amber-500">
                        Day {day.dayNumber}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 uppercase">
                        {day.exercises.length} Exercises
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-lg uppercase text-zinc-900 dark:text-white">
                      {day.title}
                    </h4>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {day.subtitle}
                    </p>

                    <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-700 dark:text-zinc-300">
                      Primary: <span className="text-amber-500 font-semibold">{day.focus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </section>

      {/* EVIDENCE-BASED HYPERTROPHY PRINCIPLES */}
      <section className="py-20 bg-zinc-100/40 dark:bg-zinc-900/20 border-y border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">
              // Scientific Foundation
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight text-zinc-900 dark:text-white">
              The Golden Hypertrophy Rules
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Validated protocols from the Journal of Strength and Conditioning Research encoded directly into our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                rule: '01',
                title: '15°–30° Incline Angle',
                badge: 'Clavicular Pec Bias',
                desc: 'Steeper angles transfer tension to front deltoids. Keeping the bench between 15° and 30° isolates upper chest fibers.'
              },
              {
                rule: '02',
                title: 'Double Progression',
                badge: 'Rep Ceiling Rule',
                desc: 'Progress reps first across all target working sets. Only increase external load once every set hits the prescribed rep ceiling.'
              },
              {
                rule: '03',
                title: 'Loaded Stretch Under Control',
                badge: '2–3s Eccentric Negative',
                desc: 'Control the descent and eliminate bouncing at the bottom of incline presses, lateral raises, and RDLs for peak tension.'
              }
            ].map((r, i) => (
              <div
                key={i}
                className="p-7 rounded-3xl bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-display font-black text-amber-500">
                    {r.rule}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    {r.badge}
                  </span>
                </div>
                <h3 className="text-xl font-display font-bold uppercase tracking-tight text-zinc-900 dark:text-white">
                  {r.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST ARTICLES FROM BIOMECHANICS BLOG (SANITY CMS) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">
              // Biomechanics Journal
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight text-zinc-900 dark:text-white">
              Latest Research & Breakdowns
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-amber-500 hover:text-amber-400 transition"
          >
            Explore All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_BLOG_POSTS.slice(0, 3).map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="rounded-3xl overflow-hidden bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group shadow-sm hover:shadow-xl hover:-translate-y-1"
            >
              {/* Featured Image Thumbnail */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                {post.mainImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.mainImage}
                    alt={post.imageAlt || post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-200 dark:bg-zinc-800">
                    <BookOpen className="w-8 h-8 text-zinc-400" />
                  </div>
                )}
                <span className="absolute top-3 left-3 text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-amber-400 border border-amber-500/20">
                  {post.splitCategory}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-600 dark:text-zinc-400">
                    <span className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      {formatPostDate(post.publishedAt)}
                    </span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-display font-bold uppercase text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-600 dark:text-zinc-400 truncate max-w-[140px]">{post.author.name}</span>
                  <span className="text-amber-500 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Study <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FINAL HIGH-CONVERTING CONVERSION SECTION */}
      <section className="py-20 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 p-8 sm:p-14 text-black text-center space-y-6 shadow-2xl">
            <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight leading-none">
              Start Tracking With Surgical Precision Today
            </h2>
            <p className="text-sm sm:text-base font-medium max-w-2xl mx-auto text-black/85 leading-relaxed">
              Create your free account, pick your preferred split, choose your lagging weak points, and let PPL Tracker orchestrate your progressive overload.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onOpenAuth('signup')}
                className="px-8 py-4 bg-black hover:bg-zinc-900 text-white font-display font-bold uppercase tracking-wider text-sm rounded-2xl shadow-2xl transition-transform active:scale-95 inline-flex items-center gap-2 cursor-pointer"
              >
                Sign Up for Free — Unlock Workout Tracker <ArrowRight className="w-4 h-4 text-amber-500" />
              </button>
            </div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-black/70">
              No credit card required • Instant setup • 100% Free
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-10 text-center text-xs font-mono text-zinc-600 dark:text-zinc-400 space-y-2">
        <p>© 2026 PPL Hypertrophy Tracker. All scientific protocols based on peer-reviewed biomechanics.</p>
        <div className="flex items-center justify-center gap-4 text-amber-500 font-semibold">
          <Link href="/blog" className="hover:underline">
            Biomechanics Journal
          </Link>
          <span>•</span>
          <button type="button" onClick={() => onOpenAuth('login')} className="hover:underline cursor-pointer">
            Sign In
          </button>
          <span>•</span>
          <button type="button" onClick={() => onOpenAuth('signup')} className="hover:underline cursor-pointer">
            Create Profile
          </button>
        </div>
      </footer>
    </div>
  );
};

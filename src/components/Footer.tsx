'use client';

import React from 'react';
import Link from 'next/link';
import {
  Dumbbell,
  ArrowUp,
  Volume2,
  VolumeX,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface FooterProps {
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onOpenPlateCalc?: () => void;
  onOpenHistory?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  soundEnabled = true,
  onToggleSound,
  onOpenPlateCalc,
  onOpenHistory,
}) => {
  const scrollToTop = () => {
    playClickSound(soundEnabled);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClick = (fn?: () => void) => {
    playClickSound(soundEnabled);
    if (fn) fn();
  };

  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-[#07080c]/80 backdrop-blur-md transition-colors duration-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12">
        {/* 4-Column Structured Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-zinc-200/70 dark:border-zinc-800/70">
          {/* Column 1 & 2: Brand & Core Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black font-display text-base tracking-wider shadow-md shadow-amber-500/20">
                PPL
              </div>
              <span className="font-display font-black text-xl tracking-tight uppercase text-zinc-900 dark:text-white">
                HYPERTROPHY<span className="text-amber-500">.</span>
              </span>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed max-w-sm">
              Science-backed progressive overload operating system for dedicated resistance athletes. Eliminates mental plate math, automates rest interval pacing, and enforces double progression ceilings without distraction.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Zero Loading Screens
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-mono font-bold">
                <Zap className="w-3 h-3" />
                Local-First Offline Ready
              </span>
            </div>
          </div>

          {/* Column 2: Periodized Programs */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              Training Splits
            </h4>
            <ul className="space-y-2 text-xs font-mono text-zinc-600 dark:text-zinc-400">
              <li>
                <span className="hover:text-amber-500 transition-colors cursor-default">
                  6-Day Push • Pull • Legs
                </span>
              </li>
              <li>
                <span className="hover:text-amber-500 transition-colors cursor-default">
                  4-Day Upper / Lower
                </span>
              </li>
              <li>
                <span className="hover:text-amber-500 transition-colors cursor-default">
                  5-Day Bodybuilding Bro Split
                </span>
              </li>
              <li>
                <span className="hover:text-amber-500 transition-colors cursor-default">
                  3-Day Full Body Frequency
                </span>
              </li>
              <li>
                <span className="hover:text-amber-500 transition-colors cursor-default">
                  Weak-Point Priority Tailoring
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Built-in Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              Athlete Tools
            </h4>
            <ul className="space-y-2 text-xs font-mono text-zinc-600 dark:text-zinc-400">
              <li>
                <Link
                  href="/tools/ppl-tracker"
                  onClick={() => handleClick()}
                  className="hover:text-amber-500 transition-colors"
                >
                  PPL Workout Tracker
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/bmi-calculator"
                  onClick={() => handleClick()}
                  className="hover:text-amber-500 transition-colors"
                >
                  Body Mass Index (BMI) Calc
                </Link>
              </li>
              <li>
                <Link
                  href="/tools"
                  onClick={() => handleClick()}
                  className="hover:text-amber-500 transition-colors font-bold text-amber-500"
                >
                  View All Tools Directory →
                </Link>
              </li>
              {onOpenPlateCalc && (
                <li>
                  <button
                    type="button"
                    onClick={() => handleClick(onOpenPlateCalc)}
                    className="hover:text-amber-500 transition-colors cursor-pointer text-left"
                  >
                    Olympic Barbell Plate Math
                  </button>
                </li>
              )}
              {onOpenHistory && (
                <li>
                  <button
                    type="button"
                    onClick={() => handleClick(onOpenHistory)}
                    className="hover:text-amber-500 transition-colors cursor-pointer text-left"
                  >
                    Workout PR & Log History
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Biomechanics & Science */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              Biomechanics Journal
            </h4>
            <ul className="space-y-2 text-xs font-mono text-zinc-600 dark:text-zinc-400">
              <li>
                <Link
                  href="/blog"
                  onClick={() => handleClick()}
                  className="hover:text-amber-500 transition-colors"
                >
                  All Science Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/low-incline-dumbbell-press-upper-chest-hypertrophy"
                  onClick={() => handleClick()}
                  className="hover:text-amber-500 transition-colors line-clamp-1"
                >
                  Clavicular Chest Angles (15°-30°)
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/cable-lateral-raise-scapular-plane-3d-delts"
                  onClick={() => handleClick()}
                  className="hover:text-amber-500 transition-colors line-clamp-1"
                >
                  Scapular Plane Lateral Raises
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/double-progression-hypertrophy-overload-guide"
                  onClick={() => handleClick()}
                  className="hover:text-amber-500 transition-colors line-clamp-1"
                >
                  Double Progression Protocols
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Trust & Organization */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              Trust & Governance
            </h4>
            <ul className="space-y-2 text-xs font-mono text-zinc-600 dark:text-zinc-400">
              <li>
                <Link
                  href="/about"
                  onClick={() => handleClick()}
                  className="hover:text-amber-500 transition-colors"
                >
                  About PPL Tracker
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  onClick={() => handleClick()}
                  className="hover:text-amber-500 transition-colors"
                >
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  onClick={() => handleClick()}
                  className="hover:text-amber-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  onClick={() => handleClick()}
                  className="hover:text-amber-500 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: System Status, Audio Toggle, Shortcuts & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-600 dark:text-zinc-400">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Fast Edge Cache · All Systems Operational</span>
            </span>

            {onToggleSound && (
              <>
                <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">•</span>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound(!soundEnabled);
                    onToggleSound();
                  }}
                  className="hover:text-amber-500 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                      <span>Audio Clicks: Enabled</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Audio Clicks: Muted</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden lg:inline text-[11px] text-zinc-600 dark:text-zinc-400">
              Shortcuts: <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px]">T</kbd> Timer · <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px]">P</kbd> Plates
            </span>

            <button
              type="button"
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 btn-tactile transition-all cursor-pointer flex items-center gap-1 text-[11px]"
              title="Back to top"
              aria-label="Scroll to top of page"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Top</span>
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 text-center sm:text-left">
          <div>
            © 2026 PPL Hypertrophy Tracker. All scientific resistance protocols based on peer-reviewed biomechanics studies.
          </div>
          <div className="flex items-center gap-4 text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400">
            <Link href="/about" className="hover:text-amber-500 transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-amber-500 transition-colors">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-amber-500 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-amber-500 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

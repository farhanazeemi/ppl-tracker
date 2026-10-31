'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowUp,
  Volume2,
  VolumeX,
  Zap,
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
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] transition-colors duration-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12">
        {/* 5-Column Structured Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[var(--border-subtle)]">
          {/* Column 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-2xl bg-[#B7FF4A] text-[#090B0F] flex items-center justify-center font-black font-display text-sm tracking-wider shadow-md shadow-[#B7FF4A]/20">
                PPL
              </div>
              <span className="font-display font-black text-xl tracking-tight uppercase text-[var(--text-primary)]">
                TRACKER<span className="text-[#B7FF4A]">.</span>
              </span>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-sm">
              The evidence-based progressive overload operating system for dedicated resistance athletes. Eliminates mental plate math, automates rest interval pacing, and enforces double progression ceilings without distraction.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B7FF4A]/10 border border-[#B7FF4A]/25 text-[#B7FF4A] text-[10px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B7FF4A] animate-pulse" />
                Zero Latency
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] text-[10px] font-mono font-bold">
                <Zap className="w-3 h-3 text-[#36D6B0]" />
                Local-First Offline Ready
              </span>
            </div>
          </div>

          {/* Column 3: Training Programs */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Training Splits
            </h4>
            <ul className="space-y-2 text-xs font-mono text-[var(--text-secondary)]">
              <li>
                <Link
                  href="/tools/ppl-tracker"
                  className="hover:text-[#B7FF4A] transition-colors"
                >
                  6-Day Push • Pull • Legs
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/ppl-tracker"
                  className="hover:text-[#B7FF4A] transition-colors"
                >
                  4-Day Upper / Lower
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/ppl-tracker"
                  className="hover:text-[#B7FF4A] transition-colors"
                >
                  5-Day Bodybuilding Bro Split
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/ppl-tracker"
                  className="hover:text-[#B7FF4A] transition-colors"
                >
                  3-Day Full Body Frequency
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Athlete Utilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Athlete Tools
            </h4>
            <ul className="space-y-2 text-xs font-mono text-[var(--text-secondary)]">
              <li>
                <Link
                  href="/tools/ppl-tracker"
                  onClick={() => handleClick()}
                  className="hover:text-[#B7FF4A] transition-colors"
                >
                  PPL Workout Tracker
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/workout-substitution-finder"
                  onClick={() => handleClick()}
                  className="hover:text-[#B7FF4A] transition-colors"
                >
                  Workout Substitution Finder
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/bmi-calculator"
                  onClick={() => handleClick()}
                  className="hover:text-[#B7FF4A] transition-colors"
                >
                  BMI & Body Comp Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/tools"
                  onClick={() => handleClick()}
                  className="hover:text-[#B7FF4A] transition-colors font-bold text-[#B7FF4A]"
                >
                  View All Tools Directory →
                </Link>
              </li>
              {onOpenPlateCalc && (
                <li>
                  <button
                    type="button"
                    onClick={() => handleClick(onOpenPlateCalc)}
                    className="hover:text-[#B7FF4A] transition-colors cursor-pointer text-left"
                  >
                    Olympic Plate Calculator
                  </button>
                </li>
              )}
              {onOpenHistory && (
                <li>
                  <button
                    type="button"
                    onClick={() => handleClick(onOpenHistory)}
                    className="hover:text-[#B7FF4A] transition-colors cursor-pointer text-left"
                  >
                    Workout PR & Log History
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column 5: Research Journal */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Science Journal
            </h4>
            <ul className="space-y-2 text-xs font-mono text-[var(--text-secondary)]">
              <li>
                <Link
                  href="/blog"
                  onClick={() => handleClick()}
                  className="hover:text-[#B7FF4A] transition-colors"
                >
                  All 60+ Research Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/low-incline-dumbbell-press-upper-chest-hypertrophy"
                  onClick={() => handleClick()}
                  className="hover:text-[#B7FF4A] transition-colors line-clamp-1"
                >
                  Clavicular Chest Angles (15°-30°)
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/cable-lateral-raise-scapular-plane-3d-delts"
                  onClick={() => handleClick()}
                  className="hover:text-[#B7FF4A] transition-colors line-clamp-1"
                >
                  Scapular Plane Lateral Raises
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/double-progression-hypertrophy-overload-guide"
                  onClick={() => handleClick()}
                  className="hover:text-[#B7FF4A] transition-colors line-clamp-1"
                >
                  Double Progression Protocols
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: System Status, Audio Toggle, Shortcuts & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--text-muted)]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#B7FF4A]" />
              <span>Fast Edge Runtime · Systems Operational</span>
            </span>

            {onToggleSound && (
              <>
                <span className="text-[var(--border-strong)] hidden sm:inline">•</span>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound(!soundEnabled);
                    onToggleSound();
                  }}
                  className="hover:text-[#B7FF4A] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#B7FF4A]" />
                      <span>Sound Effects: Active</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Sound Effects: Muted</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={scrollToTop}
              className="p-2 px-3 rounded-2xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[var(--text-primary)] btn-tactile transition-all cursor-pointer flex items-center gap-1 text-[11px]"
              title="Scroll back to top"
              aria-label="Scroll to top of page"
            >
              <ArrowUp className="w-3.5 h-3.5 text-[#B7FF4A]" />
              <span>Top</span>
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-[var(--text-muted)] text-center sm:text-left">
          <div>
            © 2026 PPL Tracker. Scientific resistance training protocols based on peer-reviewed biomechanics studies.
          </div>
          <div className="flex items-center gap-4 text-[10px] uppercase font-bold text-[var(--text-secondary)]">
            <Link href="/about" className="hover:text-[#B7FF4A] transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-[#B7FF4A] transition-colors">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-[#B7FF4A] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#B7FF4A] transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Flame, CheckCircle2, Award, Clock, ArrowRight } from 'lucide-react';
import { playCelebrationSound, playClickSound } from '../utils/audio';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayTitle: string;
  totalVolume: number;
  totalSets: number;
  durationMinutes: number;
  doubleProgressions: string[];
  soundEnabled: boolean;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onClose,
  dayTitle,
  totalVolume,
  totalSets,
  durationMinutes,
  doubleProgressions,
  soundEnabled,
}) => {
  useEffect(() => {
    if (isOpen) {
      playCelebrationSound(soundEnabled);

      // Multi-stage confetti burst with volt and teal theme accents
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#B7FF4A', '#36D6B0', '#0ea5e9', '#ffffff'],
        });

        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#B7FF4A', '#36D6B0'],
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#36D6B0', '#B7FF4A'],
          });
        }, 250);
      } catch (e) {
        // Safe fallback
      }
    }
  }, [isOpen, soundEnabled]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-6 shadow-2xl text-center overflow-hidden text-[var(--text-primary)] card-bento">
        {/* Glow ambient background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-[var(--accent-primary)]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Trophy icon */}
        <div className="w-16 h-16 mx-auto bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/25 rounded-2xl flex items-center justify-center text-[var(--accent-primary)] mb-4 shadow-sm">
          <Trophy className="w-8 h-8 animate-bounce" />
        </div>

        <h3 className="text-2xl font-display font-black uppercase text-[var(--text-primary)] tracking-tight">
          Workout Crushed!
        </h3>
        <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">
          {dayTitle} logged to your training history.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 my-5 text-left font-mono tabular-nums">
          <div className="bg-[var(--bg-elevated)] p-3 rounded-2xl border border-[var(--border-subtle)]">
            <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] font-bold block">
              Volume
            </span>
            <span className="text-sm font-black text-[var(--text-primary)] flex items-center gap-1 mt-0.5">
              <Flame className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              {totalVolume.toLocaleString()} <span className="text-[10px] text-[var(--text-muted)] font-normal">KG</span>
            </span>
          </div>

          <div className="bg-[var(--bg-elevated)] p-3 rounded-2xl border border-[var(--border-subtle)]">
            <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] font-bold block">
              Sets
            </span>
            <span className="text-sm font-black text-[var(--text-primary)] flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              {totalSets}
            </span>
          </div>

          <div className="bg-[var(--bg-elevated)] p-3 rounded-2xl border border-[var(--border-subtle)]">
            <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] font-bold block">
              Time
            </span>
            <span className="text-sm font-black text-[var(--text-primary)] flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-sky-500" />
              {durationMinutes}m
            </span>
          </div>
        </div>

        {/* Double Progression Callouts */}
        {doubleProgressions.length > 0 && (
          <div className="mb-5 p-3.5 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/25 rounded-2xl text-left">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--accent-primary)] mb-1">
              <Award className="w-4 h-4" />
              Double Progression Earned!
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] font-medium leading-relaxed">
              You topped the rep ranges on:{' '}
              <strong className="text-[var(--text-primary)] font-bold">{doubleProgressions.join(', ')}</strong>.
              Increase weight by 2.5kg–5kg on these movements next session!
            </p>
          </div>
        )}

        <button
          onClick={() => {
            playClickSound(soundEnabled);
            onClose();
          }}
          className="w-full py-3 bg-[var(--accent-primary)] hover:opacity-95 text-black font-display font-black text-xs uppercase tracking-wider rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all btn-tactile cursor-pointer"
        >
          <span>Continue Tracking</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

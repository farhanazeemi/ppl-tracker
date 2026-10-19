'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Flame, CheckCircle2, Award, Clock, ArrowRight } from 'lucide-react';
import { playCelebrationSound } from '../utils/audio';

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

      // Multi-stage confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f97316', '#eab308', '#0ea5e9', '#10b981'],
        });

        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#f97316', '#22c55e'],
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#0ea5e9', '#f97316'],
          });
        }, 250);
      } catch (e) {
        // Safe fallback
      }
    }
  }, [isOpen, soundEnabled]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-700/80 rounded-3xl p-6 shadow-2xl text-center overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Trophy icon */}
        <div className="w-16 h-16 mx-auto bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-500/10">
          <Trophy className="w-8 h-8 animate-bounce" />
        </div>

        <h3 className="text-xl font-black text-white tracking-tight">Workout Crushed!</h3>
        <p className="text-xs text-zinc-400 mt-1">
          {dayTitle} logged to your training history.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 my-5 text-left">
          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">
              Volume
            </span>
            <span className="font-mono text-sm font-extrabold text-white flex items-center gap-1 mt-0.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              {totalVolume.toLocaleString()} <span className="text-[10px] text-zinc-500">KG</span>
            </span>
          </div>

          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">
              Sets
            </span>
            <span className="font-mono text-sm font-extrabold text-white flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {totalSets}
            </span>
          </div>

          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">
              Time
            </span>
            <span className="font-mono text-sm font-extrabold text-white flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              {durationMinutes}m
            </span>
          </div>
        </div>

        {/* Double Progression Callouts */}
        {doubleProgressions.length > 0 && (
          <div className="mb-5 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-left">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1">
              <Award className="w-4 h-4" />
              Double Progression Earned!
            </div>
            <p className="text-[11px] text-zinc-300">
              You topped the rep ranges on:{' '}
              <strong className="text-white">{doubleProgressions.join(', ')}</strong>.
              Increase weight by 2.5kg–5kg on these movements next session!
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition active:scale-95"
        >
          <span>Continue Tracking</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

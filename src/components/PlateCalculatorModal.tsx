'use client';

import { useModalAccessibility } from '../utils/useModalAccessibility';
import React, { useState, useEffect } from 'react';
import { X, Dumbbell, Info, Scale } from 'lucide-react';
import { calculatePlates } from '../utils/helpers';
import { playClickSound, playPopSound } from '../utils/audio';

interface PlateCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialWeight?: number;
  exerciseName?: string;
  soundEnabled?: boolean;
}

export const PlateCalculatorModal: React.FC<PlateCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialWeight = 60,
  exerciseName = 'Barbell Exercise',
  soundEnabled = true,
}) => {
  const [targetWeight, setTargetWeight] = useState<number>(initialWeight);
  const [barWeight, setBarWeight] = useState<number>(20);
  useModalAccessibility(isOpen, onClose);

  useEffect(() => {
    if (initialWeight && initialWeight > 0) {
      setTargetWeight(initialWeight);
    }
  }, [isOpen, initialWeight]);

  if (!isOpen) return null;

  const result = calculatePlates(targetWeight, barWeight);

  // Standard Olympic calibrated competition colors
  const plateColors: Record<number, { bg: string; text: string; border: string }> = {
    25: { bg: 'bg-red-600', text: 'text-white font-bold', border: 'border-red-700' },
    20: { bg: 'bg-blue-600', text: 'text-white font-bold', border: 'border-blue-700' },
    15: { bg: 'bg-amber-400', text: 'text-zinc-950 font-bold', border: 'border-amber-500' },
    10: { bg: 'bg-emerald-600', text: 'text-white font-bold', border: 'border-emerald-700' },
    5: { bg: 'bg-zinc-200 dark:bg-zinc-700', text: 'text-zinc-900 dark:text-white font-bold', border: 'border-zinc-300 dark:border-zinc-600' },
    2.5: { bg: 'bg-zinc-800 dark:bg-zinc-900', text: 'text-white font-bold', border: 'border-zinc-900 dark:border-zinc-700' },
    1.25: { bg: 'bg-zinc-300 dark:bg-zinc-600', text: 'text-zinc-950 dark:text-white font-bold', border: 'border-zinc-400 dark:border-zinc-500' },
  };

  const addWeight = (delta: number) => {
    playPopSound(soundEnabled);
    setTargetWeight((prev) => Math.max(barWeight, Math.round((prev + delta) * 10) / 10));
  };

  const handleClose = () => {
    playClickSound(soundEnabled);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bezel-outer">
        <div className="bezel-inner p-6 space-y-5 text-[var(--text-primary)]">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-[#B7FF4A]/10 text-[#B7FF4A] rounded-2xl border border-[#B7FF4A]/25">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-display font-black uppercase text-[var(--text-primary)] tracking-tight">
                  Barbell Plate Calculator
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-medium font-sans">{exerciseName}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition btn-tactile cursor-pointer"
              aria-label="Close plate calculator"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Target Weight Input */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-1.5 font-bold">
                Target Total Weight (kg)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="2.5"
                  min={barWeight}
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(parseFloat(e.target.value) || barWeight)}
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl px-4 py-2.5 text-lg font-mono tabular-nums font-bold text-[var(--text-primary)] focus:outline-none focus:border-[#B7FF4A] focus:ring-1 focus:ring-[#B7FF4A]"
                />
                <span className="text-sm font-bold text-[var(--text-secondary)] px-2 font-mono">KG</span>
              </div>
            </div>

            {/* Quick Increment Buttons */}
            <div className="flex flex-wrap gap-2">
              {[-10, -2.5, +2.5, +5, +10, +20].map((delta) => (
                <button
                  key={delta}
                  onClick={() => addWeight(delta)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono tabular-nums font-bold border transition btn-tactile cursor-pointer ${
                    delta > 0
                      ? 'bg-[#B7FF4A]/10 text-[#B7FF4A] border-[#B7FF4A]/30 hover:bg-[#B7FF4A]/20'
                      : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {delta > 0 ? `+${delta} kg` : `${delta} kg`}
                </button>
              ))}
            </div>

            {/* Barbell Weight Selection */}
            <div className="pt-2">
              <span className="block text-xs font-mono uppercase text-[var(--text-muted)] mb-1.5 font-bold">
                Barbell Base Weight:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Olympic Bar', weight: 20 },
                  { label: "Women's / Tech", weight: 15 },
                  { label: 'EZ Curl Bar', weight: 10 },
                ].map((bar) => (
                  <button
                    key={bar.weight}
                    onClick={() => {
                      playPopSound(soundEnabled);
                      setBarWeight(bar.weight);
                    }}
                    className={`py-2 px-2 rounded-2xl text-xs font-bold border text-center transition btn-tactile cursor-pointer font-mono tabular-nums ${
                      barWeight === bar.weight
                        ? 'bg-[#B7FF4A] text-[#090B0F] border-[#B7FF4A] shadow-xs'
                        : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {bar.label} ({bar.weight}kg)
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Barbell Sleeve Breakdown */}
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-3xl p-4 mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono tabular-nums">
                <span className="font-bold text-[var(--text-primary)]">Load Per Sleeve Side:</span>
                <span className="font-mono text-[#B7FF4A] font-black text-sm">
                  {result.weightPerSide} kg / side
                </span>
              </div>

              {/* Visual Plate Stack */}
              <div className="min-h-[84px] bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar shadow-xs">
                <div className="w-4 h-16 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-l-md shrink-0 flex items-center justify-center text-[9px] text-[var(--text-muted)] font-mono -rotate-90">
                  Collar
                </div>

                {result.platesPerSide.length === 0 ? (
                  <div className="text-xs text-[var(--text-muted)] italic mx-auto">
                    Only the empty {barWeight}kg barbell
                  </div>
                ) : (
                  result.platesPerSide.flatMap((p: { weight: number; count: number }) =>
                    Array.from({ length: p.count }).map((_, idx) => {
                      const style = plateColors[p.weight] || {
                        bg: 'bg-zinc-200 dark:bg-zinc-700',
                        text: 'text-zinc-900 dark:text-white',
                        border: 'border-zinc-300 dark:border-zinc-600',
                      };
                      const heightClass =
                        p.weight >= 20 ? 'h-20 w-8' : p.weight >= 10 ? 'h-16 w-7' : 'h-12 w-6';

                      return (
                        <div
                          key={`${p.weight}-${idx}`}
                          className={`${style.bg} ${style.border} ${style.text} ${heightClass} border rounded-md shrink-0 flex flex-col items-center justify-center font-mono tabular-nums text-[10px] font-bold shadow-xs`}
                        >
                          <span>{p.weight}</span>
                          <span className="text-[8px] opacity-75">kg</span>
                        </div>
                      );
                    })
                  )
                )}
              </div>

              {/* Plate Summary Badges */}
              <div className="flex flex-wrap gap-2">
                {result.platesPerSide.map((p: { weight: number; count: number }) => (
                  <span
                    key={p.weight}
                    className="px-2.5 py-1 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl text-xs font-mono tabular-nums font-bold text-[var(--text-secondary)] shadow-xs"
                  >
                    <strong className="text-[#B7FF4A] font-black">{p.count}×</strong> {p.weight}kg
                  </span>
                ))}
              </div>

              {result.remainder > 0 && (
                <div className="text-xs text-[#B7FF4A] flex items-center gap-1 font-mono pt-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>
                    Remainder of {result.remainder * 2}kg cannot be divided with standard plates.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Apply & Close Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleClose}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#B7FF4A] hover:bg-[#a8f23d] text-[#090B0F] font-display font-black text-xs uppercase tracking-wider transition btn-tactile shadow-md shadow-[#B7FF4A]/20 cursor-pointer"
            >
              Apply & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

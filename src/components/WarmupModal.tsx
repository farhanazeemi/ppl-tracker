'use client';

import React, { useState, useEffect } from 'react';
import { X, Flame, Dumbbell, Timer, Plus, Check } from 'lucide-react';
import { generateWarmupLadder, WarmupRung, isCompoundMovement } from '../utils/warmupEngine';
import { ExerciseSet } from '../types/workout';
import { playClickSound, playPopSound } from '../utils/audio';
import { useModalAccessibility } from '../utils/useModalAccessibility';

interface WarmupModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseName: string;
  exerciseId: string;
  currentWeight: number;
  existingSets: ExerciseSet[];
  onApplyWarmupSets: (exerciseId: string, updatedSets: ExerciseSet[]) => void;
  soundEnabled?: boolean;
  unitLabel?: 'kg' | 'lbs';
}

export const WarmupModal: React.FC<WarmupModalProps> = ({
  isOpen,
  onClose,
  exerciseName,
  exerciseId,
  currentWeight,
  existingSets,
  onApplyWarmupSets,
  soundEnabled = true,
  unitLabel = 'kg',
}) => {
  useModalAccessibility(isOpen, onClose);

  const [weight, setWeight] = useState<number>(currentWeight > 0 ? currentWeight : 60);
  const [applied, setApplied] = useState<boolean>(false);

  useEffect(() => {
    if (currentWeight > 0) {
      setWeight(currentWeight);
    }
    setApplied(false);
  }, [isOpen, currentWeight]);

  if (!isOpen) return null;

  const barWeight = unitLabel === 'kg' ? 20 : 45;
  const isCompound = isCompoundMovement(exerciseName);

  const ladder = generateWarmupLadder({
    workWeight: weight,
    unit: unitLabel,
    barWeight,
    isCompound,
  });

  const plateColors: Record<number, { bg: string; text: string }> = {
    45: { bg: 'bg-blue-600', text: 'text-white font-bold' },
    35: { bg: 'bg-amber-400', text: 'text-zinc-950 font-bold' },
    25: { bg: 'bg-red-600', text: 'text-white font-bold' },
    20: { bg: 'bg-blue-600', text: 'text-white font-bold' },
    15: { bg: 'bg-amber-400', text: 'text-zinc-950 font-bold' },
    10: { bg: 'bg-emerald-600', text: 'text-white font-bold' },
    5: { bg: 'bg-white', text: 'text-zinc-950 font-bold' },
    2.5: { bg: 'bg-zinc-400', text: 'text-zinc-950 font-bold' },
    1.25: { bg: 'bg-zinc-600', text: 'text-white font-bold' },
  };

  const handleApplyToExercise = () => {
    playPopSound(soundEnabled);

    // Keep only work sets from existingSets (remove any previous warmups if re-generating)
    const workSets = existingSets.filter((s) => !s.isWarmup);

    // Build new warmup set objects
    const warmupSets: ExerciseSet[] = ladder.map((rung, index) => ({
      id: `${exerciseId}-warmup-${Date.now()}-${index}`,
      setNumber: index + 1,
      weight: rung.weight,
      reps: rung.reps,
      completed: false,
      isWarmup: true,
    }));

    // Renumber work sets after warmups
    const renumberedWorkSets: ExerciseSet[] = workSets.map((s, idx) => ({
      ...s,
      setNumber: warmupSets.length + idx + 1,
    }));

    onApplyWarmupSets(exerciseId, [...warmupSets, ...renumberedWorkSets]);
    setApplied(true);

    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bezel-outer">
        <div className="bezel-inner p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-500/10 text-orange-400 rounded-2xl border border-orange-500/25">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-display font-black uppercase text-[var(--text-primary)] tracking-wide">
                  Warm-Up Sets
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  {exerciseName} • Top Set: {weight} {unitLabel}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                onClose();
              }}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--surface-hover)] transition cursor-pointer"
              aria-label="Close warm-up calculator"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick weight adjustment */}
          <div className="flex items-center justify-between bg-[var(--surface-sunken)] p-3 rounded-xl border border-[var(--border-subtle)]">
            <span className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase">
              Target Work Weight:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="2.5"
                min="1"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                className="w-24 px-2.5 py-1 text-right font-mono font-bold text-sm bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[#B7FF4A]"
              />
              <span className="text-xs font-mono text-[var(--text-muted)]">{unitLabel}</span>
            </div>
          </div>

          {/* Warmup ladder rows */}
          <div className="space-y-2.5 max-h-[46vh] overflow-y-auto pr-1">
            {ladder.map((rung) => (
              <div
                key={rung.setNumber}
                className="p-3 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-subtle)] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-orange-500/10 text-orange-400 border border-orange-500/25">
                      W{rung.setNumber}
                    </span>
                    <span className="font-mono font-black text-sm text-[var(--text-primary)]">
                      {rung.weight} {unitLabel} × {rung.reps} reps
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">
                      ({rung.percentage}%)
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-[var(--text-muted)] flex items-center gap-1">
                    <Timer className="w-3 h-3 text-purple-400" />
                    {rung.restSeconds}s rest
                  </span>
                </div>

                {/* Plates per side preview */}
                {rung.plates && rung.plates.platesPerSide.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-[var(--border-subtle)]/50">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">
                      Side:
                    </span>
                    {rung.plates.platesPerSide.map((p, idx) => {
                      const color = plateColors[p.weight] || { bg: 'bg-zinc-700', text: 'text-white' };
                      return (
                        <span
                          key={idx}
                          className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${color.bg} ${color.text}`}
                        >
                          {p.weight}{p.count > 1 ? ` × ${p.count}` : ''}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleApplyToExercise}
              disabled={applied || ladder.length === 0}
              className={`px-4 py-2 text-xs font-black font-display uppercase rounded-xl transition flex items-center gap-2 shadow-xs btn-tactile ${
                applied
                  ? 'bg-emerald-500 text-zinc-950'
                  : 'bg-orange-500 hover:bg-orange-400 text-zinc-950'
              }`}
            >
              {applied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Warm-Ups Added!</span>
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4" />
                  <span>Add Warm-Up Sets to Exercise</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

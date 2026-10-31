'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Calculator,
  Plus,
  Trash2,
  Flame,
  Award,
  Zap,
  Sparkles,
} from 'lucide-react';
import { ExerciseDefinition, ExerciseSet } from '../types/workout';
import { calculateEstimated1RM, checkDoubleProgression } from '../utils/helpers';
import { playSetCompleteSound, playClickSound, playPopSound, playTabSound } from '../utils/audio';

interface ExerciseCardProps {
  exercise: ExerciseDefinition;
  sets: ExerciseSet[];
  themeColor: 'push' | 'pull' | 'legs' | 'gold' | 'sky';
  onUpdateSets: (exerciseId: string, sets: ExerciseSet[]) => void;
  onTriggerRestTimer: (seconds: number) => void;
  onOpenPlateCalc: (weight: number, exerciseName: string) => void;
  soundEnabled: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = React.memo(({
  exercise,
  sets,
  themeColor,
  onUpdateSets,
  onTriggerRestTimer,
  onOpenPlateCalc,
  soundEnabled,
}) => {
  const [showCues, setShowCues] = useState(false);

  const colorStyles = {
    push: {
      badge: 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/25',
      accent: 'border-[var(--accent-primary)]/40',
      activeRow: 'bg-[var(--accent-primary)]/5',
    },
    pull: {
      badge: 'bg-sky-500/10 text-sky-400 border-sky-500/25',
      accent: 'border-sky-500/40',
      activeRow: 'bg-sky-500/5',
    },
    legs: {
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
      accent: 'border-emerald-500/40',
      activeRow: 'bg-emerald-500/5',
    },
    gold: {
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
      accent: 'border-amber-500/40',
      activeRow: 'bg-amber-500/5',
    },
    sky: {
      badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25',
      accent: 'border-cyan-500/40',
      activeRow: 'bg-cyan-500/5',
    },
  }[themeColor] || {
    badge: 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/25',
    accent: 'border-[var(--accent-primary)]/40',
    activeRow: 'bg-[var(--accent-primary)]/5',
  };

  const isDoubleProgressionReady = checkDoubleProgression(sets, exercise.maxReps);

  const handleToggleSetComplete = (setId: string) => {
    const nextSets = sets.map((s) => {
      if (s.id === setId) {
        const nextCompleted = !s.completed;
        if (nextCompleted) {
          playSetCompleteSound(soundEnabled);
          onTriggerRestTimer(exercise.restSeconds);
        }
        return { ...s, completed: nextCompleted };
      }
      return s;
    });
    onUpdateSets(exercise.id, nextSets);
  };

  const handleUpdateField = (
    setId: string,
    field: 'weight' | 'reps',
    val: string
  ) => {
    const num = val === '' ? '' : parseFloat(val);
    const nextSets = sets.map((s) => {
      if (s.id === setId) {
        return { ...s, [field]: num };
      }
      return s;
    });
    onUpdateSets(exercise.id, nextSets);
  };

  const handleAddSet = () => {
    const lastSet = sets[sets.length - 1];
    const newSet: ExerciseSet = {
      id: `${exercise.id}-${Date.now()}`,
      setNumber: sets.length + 1,
      weight: lastSet ? lastSet.weight : '',
      reps: lastSet ? lastSet.reps : '',
      completed: false,
    };
    onUpdateSets(exercise.id, [...sets, newSet]);
  };

  const handleRemoveSet = (setId: string) => {
    if (sets.length <= 1) return;
    const nextSets = sets
      .filter((s) => s.id !== setId)
      .map((s, idx) => ({ ...s, setNumber: idx + 1 }));
    onUpdateSets(exercise.id, nextSets);
  };

  const highest1RM = sets.reduce((max, s) => {
    if (s.completed && typeof s.weight === 'number' && typeof s.reps === 'number') {
      const e1rm = calculateEstimated1RM(s.weight, s.reps);
      return Math.max(max, e1rm);
    }
    return max;
  }, 0);

  const completedCount = sets.filter((s) => s.completed).length;

  return (
    <div className={`bg-[var(--bg-card)] border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all ${
      exercise.isPriorityWeakPoint ? 'border-[var(--accent-primary)]/60 ring-1 ring-[var(--accent-primary)]/20' : 'border-[var(--border-subtle)]'
    }`}>
      {/* Exercise Header */}
      <div className="p-4 sm:p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-card)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2.5 py-0.5 text-[11px] font-bold rounded-lg border shadow-xs font-mono ${colorStyles.badge}`}
            >
              {exercise.target}
            </span>
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)] rounded-lg uppercase font-mono">
              {exercise.equipment}
            </span>

            {/* Lagging Muscle Weak Point Badge */}
            {exercise.isPriorityWeakPoint && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 rounded-lg animate-pulse font-mono">
                <Zap className="w-3.5 h-3.5" />
                {exercise.weakPointBadge || 'Lagging Muscle Priority'}
              </span>
            )}

            {isDoubleProgressionReady && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-lg font-mono">
                <Award className="w-3.5 h-3.5" />
                Double Progression Earned
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-black text-[var(--text-primary)] uppercase tracking-tight">
            {exercise.name}
          </h3>

          {/* Double Progression Callout Banner */}
          {isDoubleProgressionReady && (
            <div className="p-2 sm:px-3 sm:py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-mono font-bold text-emerald-400">
                  Target Rep Ceiling Hit! Increase weight by +2.5kg next session.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Target Scheme Badges */}
        <div className="flex items-center gap-2 text-xs self-start sm:self-auto">
          <div className="px-2.5 py-1 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-center">
            <span className="text-[10px] text-[var(--text-muted)] block uppercase font-mono font-semibold">Sets</span>
            <span className="font-mono font-bold text-[var(--text-primary)] tabular-nums">
              {completedCount}/{sets.length}
            </span>
          </div>
          <div className="px-2.5 py-1 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-center">
            <span className="text-[10px] text-[var(--text-muted)] block uppercase font-mono font-semibold">Target</span>
            <span className="font-mono font-bold text-[var(--accent-primary)] tabular-nums">{exercise.targetReps} reps</span>
          </div>
          <div className="px-2.5 py-1 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-center">
            <span className="text-[10px] text-[var(--text-muted)] block uppercase font-mono font-semibold">Rest</span>
            <span className="font-mono font-bold text-[var(--text-secondary)] tabular-nums">{exercise.restDisplay}</span>
          </div>
        </div>
      </div>

      {/* Sets Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] text-[10px] uppercase tracking-wider text-[var(--text-muted)] bg-[var(--bg-elevated)]/40 font-mono">
              <th className="py-2.5 pl-4 pr-2 text-center w-12 font-bold">Set</th>
              <th className="py-2.5 px-3 min-w-[90px] font-bold">Weight (kg)</th>
              <th className="py-2.5 px-3 min-w-[80px] font-bold">Reps</th>
              <th className="py-2.5 px-3 hidden md:table-cell font-bold">Est. 1RM</th>
              <th className="py-2.5 px-3 text-center w-20 font-bold">Done</th>
              <th className="py-2.5 pr-4 pl-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {sets.map((set, idx) => {
              const est1RM =
                typeof set.weight === 'number' && typeof set.reps === 'number'
                  ? calculateEstimated1RM(set.weight, set.reps)
                  : 0;

              return (
                <tr
                  key={set.id}
                  className={`border-b border-[var(--border-subtle)] transition ${
                    set.completed
                      ? 'bg-[var(--accent-primary)]/5'
                      : 'hover:bg-[var(--bg-elevated)]/30'
                  }`}
                >
                  {/* Set number */}
                  <td className="py-3 pl-4 pr-2 text-center font-mono font-bold text-xs text-[var(--text-muted)] tabular-nums">
                    {idx + 1}
                  </td>

                  {/* Weight Input */}
                  <td className="py-3 px-3">
                    <div className="relative flex items-center gap-1.5">
                      <input
                        type="number"
                        placeholder="kg"
                        step="0.5"
                        min="0"
                        aria-label={`${exercise.name} Set ${idx + 1} weight in kg`}
                        value={set.weight}
                        onChange={(e) => handleUpdateField(set.id, 'weight', e.target.value)}
                        className={`w-20 sm:w-24 bg-[var(--bg-elevated)] border rounded-xl px-2.5 py-2 font-mono text-sm font-bold text-[var(--text-primary)] tabular-nums focus:outline-none focus:bg-[var(--bg-card)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)] transition ${
                          set.completed
                            ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/5'
                            : 'border-[var(--border-subtle)]'
                        }`}
                      />
                      <div className="hidden sm:flex flex-col gap-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            playPopSound(soundEnabled);
                            const cur = typeof set.weight === 'number' ? set.weight : 0;
                            handleUpdateField(set.id, 'weight', String(Math.max(0, cur + 2.5)));
                          }}
                          className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[var(--bg-elevated)] hover:bg-[var(--accent-primary)] hover:text-black text-[var(--text-secondary)] rounded border border-[var(--border-subtle)] transition btn-tactile cursor-pointer"
                          title="Add 2.5kg"
                          aria-label={`Add 2.5kg to set ${idx + 1}`}
                        >
                          +2.5
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            playPopSound(soundEnabled);
                            const cur = typeof set.weight === 'number' ? set.weight : 0;
                            handleUpdateField(set.id, 'weight', String(Math.max(0, cur - 2.5)));
                          }}
                          className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[var(--bg-elevated)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] rounded border border-[var(--border-subtle)] transition btn-tactile cursor-pointer"
                          title="Subtract 2.5kg"
                          aria-label={`Subtract 2.5kg from set ${idx + 1}`}
                        >
                          -2.5
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Reps Input */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        placeholder={exercise.targetReps}
                        min="0"
                        aria-label={`${exercise.name} Set ${idx + 1} completed reps`}
                        value={set.reps}
                        onChange={(e) => handleUpdateField(set.id, 'reps', e.target.value)}
                        className={`w-18 sm:w-20 bg-[var(--bg-elevated)] border rounded-xl px-2.5 py-2 font-mono text-sm font-bold text-[var(--text-primary)] tabular-nums focus:outline-none focus:bg-[var(--bg-card)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)] transition ${
                          set.completed
                            ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/5'
                            : 'border-[var(--border-subtle)]'
                        }`}
                      />
                    </div>
                  </td>

                  {/* 1RM calculation */}
                  <td className="py-3 px-3 hidden md:table-cell font-mono text-xs text-[var(--text-secondary)] tabular-nums">
                    {est1RM > 0 ? (
                      <span className="flex items-center gap-1 font-bold text-[var(--text-primary)]">
                        <Flame className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                        {est1RM} kg
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* Done Checkbox Button (Touch Target >= 44px) */}
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => handleToggleSetComplete(set.id)}
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition active:scale-90 mx-auto border cursor-pointer ${
                        set.completed
                          ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)] shadow-md shadow-[var(--accent-primary)]/25 ring-2 ring-[var(--accent-primary)]/30'
                          : 'bg-[var(--bg-elevated)] hover:bg-[var(--border-subtle)] text-[var(--text-muted)] border-[var(--border-subtle)] shadow-xs'
                      }`}
                      aria-label={`Mark set ${idx + 1} done`}
                    >
                      <Check className={`w-5 h-5 ${set.completed ? 'stroke-[3]' : 'opacity-30'}`} />
                    </button>
                  </td>

                  {/* Remove Set Button */}
                  <td className="py-3 pr-4 pl-2 text-right">
                    {sets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          playClickSound(soundEnabled);
                          handleRemoveSet(set.id);
                        }}
                        className="p-1 text-[var(--text-muted)] hover:text-red-400 rounded transition btn-tactile cursor-pointer"
                        title="Delete Set"
                        aria-label="Delete set"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Card Actions Footer */}
      <div className="p-3 sm:p-4 bg-[var(--bg-elevated)]/40 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              playClickSound(soundEnabled);
              handleAddSet();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-xl text-xs font-bold transition shadow-xs btn-tactile cursor-pointer font-mono"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Set
          </button>

          {exercise.equipment === 'barbell' && (
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                const currentWeight =
                  typeof sets[0]?.weight === 'number' ? sets[0].weight : 60;
                onOpenPlateCalc(currentWeight, exercise.name);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--accent-primary)]/10 hover:bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border border-[var(--accent-primary)]/25 rounded-xl text-xs font-bold transition shadow-xs btn-tactile cursor-pointer font-mono"
            >
              <Calculator className="w-3.5 h-3.5" />
              Plate Math
            </button>
          )}

          {highest1RM > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-[var(--text-muted)] pl-2">
              <Zap className="w-3 h-3 text-[var(--accent-primary)]" />
              Peak 1RM: <strong className="text-[var(--text-primary)] font-bold tabular-nums">{highest1RM} kg</strong>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Workout Substitution Finder Shortcut */}
          <Link
            href={`/tools/workout-substitution-finder?exercise=${encodeURIComponent(exercise.name)}`}
            className="flex items-center gap-1 text-xs font-bold text-[var(--accent-primary)] hover:underline transition font-mono"
            title={`Find equipment alternatives for ${exercise.name}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Find</span> Substitute
          </Link>

          {/* Collapsible Form & Biomechanics Cues Toggle */}
          <button
            type="button"
            onClick={() => {
              playTabSound(soundEnabled);
              setShowCues(!showCues);
            }}
            className="flex items-center gap-1 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition btn-tactile cursor-pointer font-mono"
          >
            <span>Biomechanics & Cues</span>
            {showCues ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Collapsible Form Cues Section */}
      {showCues && (
        <div className="p-4 bg-[var(--bg-elevated)] border-t border-[var(--border-subtle)] space-y-2.5 animate-in slide-in-from-top-2 duration-200">
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-3.5 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-primary)] block mb-1 font-mono">
              Execution Cue
            </span>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">{exercise.cue}</p>
          </div>

          {exercise.biomechanicsTip && (
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-3.5 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block mb-1 font-mono">
                Hypertrophy Biomechanics
              </span>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                {exercise.biomechanicsTip}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

ExerciseCard.displayName = 'ExerciseCard';

'use client';

import React, { useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  Calculator,
  Plus,
  Trash2,
  Flame,
  Award,
  Zap,
} from 'lucide-react';
import { ExerciseDefinition, ExerciseSet } from '../types/workout';
import { calculateEstimated1RM, checkDoubleProgression } from '../utils/helpers';
import { playSetCompleteSound } from '../utils/audio';

interface ExerciseCardProps {
  exercise: ExerciseDefinition;
  sets: ExerciseSet[];
  themeColor: 'push' | 'pull' | 'legs' | 'gold' | 'sky';
  onUpdateSets: (exerciseId: string, sets: ExerciseSet[]) => void;
  onTriggerRestTimer: (seconds: number) => void;
  onOpenPlateCalc: (weight: number, exerciseName: string) => void;
  soundEnabled: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  sets,
  themeColor,
  onUpdateSets,
  onTriggerRestTimer,
  onOpenPlateCalc,
  soundEnabled,
}) => {
  const [showCues, setShowCues] = useState(false);

  // Split themes for Minimalist Light/Dark mood
  const colorStyles = {
    push: {
      badge: 'bg-amber-500/10 text-amber-500 border-amber-500/25',
      accent: 'border-amber-500/40',
      activeRow: 'bg-amber-500/5',
      btn: 'bg-amber-500 text-black font-bold',
    },
    pull: {
      badge: 'bg-sky-500/10 text-sky-500 border-sky-500/25',
      accent: 'border-sky-500/40',
      activeRow: 'bg-sky-500/5',
      btn: 'bg-sky-500 text-white font-bold',
    },
    legs: {
      badge: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25',
      accent: 'border-emerald-500/40',
      activeRow: 'bg-emerald-500/5',
      btn: 'bg-emerald-500 text-black font-bold',
    },
    gold: {
      badge: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/25',
      accent: 'border-yellow-500/40',
      activeRow: 'bg-yellow-500/5',
      btn: 'bg-yellow-500 text-black font-bold',
    },
    sky: {
      badge: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/25',
      accent: 'border-cyan-500/40',
      activeRow: 'bg-cyan-500/5',
      btn: 'bg-cyan-500 text-white font-bold',
    },
  }[themeColor] || {
    badge: 'bg-amber-500/10 text-amber-500 border-amber-500/25',
    accent: 'border-amber-500/40',
    activeRow: 'bg-amber-500/5',
    btn: 'bg-amber-500 text-black font-bold',
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
    <div className={`bg-white dark:bg-[#12141c] border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all ${
      exercise.isPriorityWeakPoint ? 'border-amber-500/60 ring-1 ring-amber-500/20' : 'border-zinc-200 dark:border-zinc-800'
    }`}>
      {/* Exercise Header */}
      <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-[#12141c] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2.5 py-0.5 text-[11px] font-bold rounded-lg border shadow-xs font-mono ${colorStyles.badge}`}
            >
              {exercise.target}
            </span>
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded-lg uppercase font-mono">
              {exercise.equipment}
            </span>

            {/* Lagging Muscle Weak Point Badge */}
            {exercise.isPriorityWeakPoint && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/30 rounded-lg animate-pulse font-mono">
                <Zap className="w-3.5 h-3.5" />
                {exercise.weakPointBadge || 'Lagging Muscle Priority'}
              </span>
            )}

            {isDoubleProgressionReady && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-lg font-mono">
                <Award className="w-3.5 h-3.5" />
                Double Progression Earned
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-display font-black text-zinc-900 dark:text-white uppercase tracking-tight">
            {exercise.name}
          </h3>

          {/* Double Progression Callout Banner */}
          {isDoubleProgressionReady && (
            <div className="p-2 sm:px-3 sm:py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                  Target Rep Ceiling Hit! Increase weight by +2.5kg next session.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Target Scheme Badges */}
        <div className="flex items-center gap-2 text-xs self-start sm:self-auto">
          <div className="px-2.5 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-center">
            <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block uppercase font-mono font-semibold">Sets</span>
            <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
              {completedCount}/{sets.length}
            </span>
          </div>
          <div className="px-2.5 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-center">
            <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block uppercase font-mono font-semibold">Target</span>
            <span className="font-mono font-bold text-amber-500">{exercise.targetReps} reps</span>
          </div>
          <div className="px-2.5 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-center">
            <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block uppercase font-mono font-semibold">Rest</span>
            <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300">{exercise.restDisplay}</span>
          </div>
        </div>
      </div>

      {/* Sets Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400 bg-zinc-50/70 dark:bg-zinc-900/40 font-mono">
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
                  className={`border-b border-zinc-100 dark:border-zinc-800/80 transition ${
                    set.completed
                      ? 'bg-emerald-500/5 dark:bg-emerald-500/10'
                      : 'hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30'
                  }`}
                >
                  {/* Set number */}
                  <td className="py-3 pl-4 pr-2 text-center font-mono font-bold text-xs text-zinc-600 dark:text-zinc-400">
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
                        className={`w-20 sm:w-24 bg-zinc-50 dark:bg-zinc-900 border rounded-xl px-2.5 py-2 font-mono text-sm font-bold text-zinc-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-zinc-850 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition ${
                          set.completed
                            ? 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5'
                            : 'border-zinc-200 dark:border-zinc-700'
                        }`}
                      />
                      <div className="hidden sm:flex flex-col gap-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            const cur = typeof set.weight === 'number' ? set.weight : 0;
                            handleUpdateField(set.id, 'weight', String(Math.max(0, cur + 2.5)));
                          }}
                          className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-600 dark:text-zinc-400 rounded border border-zinc-200 dark:border-zinc-700 transition"
                          title="Add 2.5kg"
                          aria-label={`Add 2.5kg to set ${idx + 1}`}
                        >
                          +2.5
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = typeof set.weight === 'number' ? set.weight : 0;
                            handleUpdateField(set.id, 'weight', String(Math.max(0, cur - 2.5)));
                          }}
                          className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 rounded border border-zinc-200 dark:border-zinc-700 transition"
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
                        className={`w-18 sm:w-20 bg-zinc-50 dark:bg-zinc-900 border rounded-xl px-2.5 py-2 font-mono text-sm font-bold text-zinc-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-zinc-850 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition ${
                          set.completed
                            ? 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5'
                            : 'border-zinc-200 dark:border-zinc-700'
                        }`}
                      />
                    </div>
                  </td>

                  {/* 1RM calculation */}
                  <td className="py-3 px-3 hidden md:table-cell font-mono text-xs text-zinc-600 dark:text-zinc-400">
                    {est1RM > 0 ? (
                      <span className="flex items-center gap-1 font-bold text-zinc-900 dark:text-zinc-100">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
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
                          ? 'bg-emerald-500 text-black border-emerald-500 shadow-md shadow-emerald-500/25 ring-2 ring-emerald-500/30'
                          : 'bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 border-zinc-300 dark:border-zinc-700 shadow-xs'
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
                        onClick={() => handleRemoveSet(set.id)}
                        className="p-1 text-zinc-400 hover:text-red-500 rounded transition cursor-pointer"
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
      <div className="p-3 sm:p-4 bg-zinc-50/50 dark:bg-zinc-900/40 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddSet}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold transition shadow-xs active:scale-95 cursor-pointer font-mono"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Set
          </button>

          {exercise.equipment === 'barbell' && (
            <button
              onClick={() => {
                const currentWeight =
                  typeof sets[0]?.weight === 'number' ? sets[0].weight : 60;
                onOpenPlateCalc(currentWeight, exercise.name);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/25 rounded-xl text-xs font-bold transition shadow-xs active:scale-95 cursor-pointer font-mono"
            >
              <Calculator className="w-3.5 h-3.5" />
              Plate Math
            </button>
          )}

          {highest1RM > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 pl-2">
              <Zap className="w-3 h-3 text-amber-500" />
              Peak 1RM: <strong className="text-zinc-900 dark:text-zinc-100 font-bold">{highest1RM} kg</strong>
            </span>
          )}
        </div>

        {/* Collapsible Form & Biomechanics Cues Toggle */}
        <button
          onClick={() => setShowCues(!showCues)}
          className="flex items-center gap-1 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer font-mono"
        >
          <span>Biomechanics & Cues</span>
          {showCues ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Collapsible Form Cues Section */}
      {showCues && (
        <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 space-y-2.5 animate-in slide-in-from-top-2 duration-200">
          <div className="bg-white dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block mb-1 font-mono">
              Execution Cue
            </span>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">{exercise.cue}</p>
          </div>

          {exercise.biomechanicsTip && (
            <div className="bg-white dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-500 block mb-1 font-mono">
                Hypertrophy Biomechanics
              </span>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                {exercise.biomechanicsTip}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

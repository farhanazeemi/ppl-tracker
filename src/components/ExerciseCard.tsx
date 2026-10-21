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
  themeColor: 'push' | 'pull' | 'legs';
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

  // Split themes for Minimalist Light mood
  const colorStyles = {
    push: {
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      accent: 'border-amber-400',
      activeRow: 'bg-amber-50/40',
      btn: 'bg-amber-500 text-white',
    },
    pull: {
      badge: 'bg-sky-50 text-sky-700 border-sky-200',
      accent: 'border-sky-400',
      activeRow: 'bg-sky-50/40',
      btn: 'bg-sky-500 text-white',
    },
    legs: {
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      accent: 'border-emerald-400',
      activeRow: 'bg-emerald-50/40',
      btn: 'bg-emerald-500 text-white',
    },
  }[themeColor];

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
    <div className="bg-white border border-zinc-200/90 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
      {/* Exercise Header */}
      <div className="p-4 sm:p-5 border-b border-zinc-100 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2.5 py-0.5 text-[11px] font-bold rounded-lg border shadow-xs ${colorStyles.badge}`}
            >
              {exercise.target}
            </span>
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-zinc-100 text-zinc-600 border border-zinc-200 rounded-lg uppercase">
              {exercise.equipment}
            </span>
            {isDoubleProgressionReady && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 rounded-lg animate-pulse">
                <Award className="w-3.5 h-3.5" />
                Double Progression Earned!
              </span>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-black text-zinc-900 tracking-tight">
            {exercise.name}
          </h3>
        </div>

        {/* Target Scheme Badges */}
        <div className="flex items-center gap-2 text-xs self-start sm:self-auto">
          <div className="px-2.5 py-1 bg-zinc-50 border border-zinc-200 rounded-xl text-center">
            <span className="text-[10px] text-zinc-500 block uppercase font-mono font-semibold">Sets</span>
            <span className="font-mono font-bold text-zinc-900">
              {completedCount}/{sets.length}
            </span>
          </div>
          <div className="px-2.5 py-1 bg-zinc-50 border border-zinc-200 rounded-xl text-center">
            <span className="text-[10px] text-zinc-500 block uppercase font-mono font-semibold">Target</span>
            <span className="font-mono font-bold text-amber-600">{exercise.targetReps} reps</span>
          </div>
          <div className="px-2.5 py-1 bg-zinc-50 border border-zinc-200 rounded-xl text-center">
            <span className="text-[10px] text-zinc-500 block uppercase font-mono font-semibold">Rest</span>
            <span className="font-mono font-bold text-zinc-600">{exercise.restDisplay}</span>
          </div>
        </div>
      </div>

      {/* Sets Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-100 text-[10px] uppercase tracking-wider text-zinc-400 bg-zinc-50/70">
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
                  className={`border-b border-zinc-100 transition ${
                    set.completed ? 'bg-zinc-50/90 opacity-75' : 'hover:bg-zinc-50/50'
                  }`}
                >
                  {/* Set number */}
                  <td className="py-3 pl-4 pr-2 text-center font-mono font-bold text-xs text-zinc-500">
                    {idx + 1}
                  </td>

                  {/* Weight Input */}
                  <td className="py-3 px-3">
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        placeholder="kg"
                        step="0.5"
                        min="0"
                        value={set.weight}
                        onChange={(e) => handleUpdateField(set.id, 'weight', e.target.value)}
                        className={`w-24 sm:w-28 bg-zinc-50 border rounded-xl px-2.5 py-1.5 font-mono text-sm font-bold text-zinc-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition ${
                          set.completed ? 'border-zinc-200 text-zinc-500' : 'border-zinc-200'
                        }`}
                      />
                    </div>
                  </td>

                  {/* Reps Input */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        placeholder={exercise.targetReps}
                        min="0"
                        value={set.reps}
                        onChange={(e) => handleUpdateField(set.id, 'reps', e.target.value)}
                        className={`w-20 sm:w-24 bg-zinc-50 border rounded-xl px-2.5 py-1.5 font-mono text-sm font-bold text-zinc-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition ${
                          set.completed ? 'border-zinc-200 text-zinc-500' : 'border-zinc-200'
                        }`}
                      />
                    </div>
                  </td>

                  {/* 1RM calculation */}
                  <td className="py-3 px-3 hidden md:table-cell font-mono text-xs text-zinc-500">
                    {est1RM > 0 ? (
                      <span className="flex items-center gap-1 font-bold text-zinc-800">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        {est1RM} kg
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* Done Checkbox Button */}
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => handleToggleSetComplete(set.id)}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition active:scale-90 mx-auto border ${
                        set.completed
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                          : 'bg-white hover:bg-zinc-100 text-zinc-400 border-zinc-200'
                      }`}
                      aria-label={`Mark set ${idx + 1} done`}
                    >
                      <Check className={`w-4 h-4 ${set.completed ? 'stroke-[3]' : 'opacity-40'}`} />
                    </button>
                  </td>

                  {/* Remove Set Button */}
                  <td className="py-3 pr-4 pl-2 text-right">
                    {sets.length > 1 && (
                      <button
                        onClick={() => handleRemoveSet(set.id)}
                        className="p-1 text-zinc-400 hover:text-red-500 rounded transition"
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
      <div className="p-3 sm:p-4 bg-zinc-50/50 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddSet}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200 rounded-xl text-xs font-bold transition shadow-xs active:scale-95"
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
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl text-xs font-bold transition shadow-xs active:scale-95"
            >
              <Calculator className="w-3.5 h-3.5" />
              Plate Math
            </button>
          )}

          {highest1RM > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500 pl-2">
              <Zap className="w-3 h-3 text-amber-500" />
              Peak 1RM: <strong className="text-zinc-900 font-bold">{highest1RM} kg</strong>
            </span>
          )}
        </div>

        {/* Collapsible Form & Biomechanics Cues Toggle */}
        <button
          onClick={() => setShowCues(!showCues)}
          className="flex items-center gap-1 text-xs font-bold text-zinc-500 hover:text-zinc-900 transition"
        >
          <span>Biomechanics & Cues</span>
          {showCues ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Collapsible Form Cues Section */}
      {showCues && (
        <div className="p-4 bg-zinc-50 border-t border-zinc-100 space-y-2.5 animate-in slide-in-from-top-2 duration-200">
          <div className="bg-white border border-zinc-200 rounded-2xl p-3 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block mb-1">
              Execution Cue
            </span>
            <p className="text-xs text-zinc-700 leading-relaxed font-medium">{exercise.cue}</p>
          </div>

          {exercise.biomechanicsTip && (
            <div className="bg-white border border-zinc-200 rounded-2xl p-3 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 block mb-1">
                Hypertrophy Biomechanics
              </span>
              <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                {exercise.biomechanicsTip}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

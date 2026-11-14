'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Scale,
  CheckCircle2,
  ArrowRight,
  Dumbbell,
  RefreshCw,
  Calendar,
  Activity,
} from 'lucide-react';
import { playSetCompleteSound, playClickSound } from '../utils/audio';
import { useAuth } from '../context/AuthContext';
import {
  getScheduledDayForToday,
  ALL_TRAINING_PROGRAMS,
} from '../data/workouts';
import {
  getSharedToolMetrics,
  updateSharedToolMetrics,
} from './tools/AthleteSyncBanner';
import { calculatePlates, calculateOneRepMaxSuite } from '../utils/helpers';

interface LiveSetRow {
  id: number;
  weight: number;
  reps: number;
  completed: boolean;
}

const SETS_STORAGE_KEY = 'ppl_sets_v2';

export const HomeInteractiveDemo: React.FC = () => {
  const { user } = useAuth();
  const unit = user?.preferredUnit || 'kg';
  const barWeight = user?.barbellBaseWeight || (unit === 'kg' ? 20 : 45);

  const [selectedSplitId, setSelectedSplitId] = useState<string>(
    user?.selectedSplit || 'ppl'
  );
  const schedule = useMemo(
    () => getScheduledDayForToday(selectedSplitId),
    [selectedSplitId]
  );
  const workout = schedule.scheduledWorkout;

  const [selectedExIndex, setSelectedExIndex] = useState<number>(0);
  const activeExercise =
    workout.exercises[selectedExIndex] || workout.exercises[0];

  const [sets, setSets] = useState<LiveSetRow[]>([]);
  const [plateTargetWeight, setPlateTargetWeight] = useState<number>(100);
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  // Sync split selection when user profile loads
  useEffect(() => {
    if (user?.selectedSplit) {
      setSelectedSplitId(user.selectedSplit);
    }
  }, [user?.selectedSplit]);

  // Load real logged sets from ppl_sets_v2 or initialize from user bodyweight / shared metrics
  useEffect(() => {
    if (typeof window === 'undefined' || !activeExercise) return;
    const shared = getSharedToolMetrics();
    const defaultBaseKg =
      shared.workingWeightKg && shared.workingWeightKg > 0
        ? shared.workingWeightKg
        : user?.weight && user.weight > 0
        ? Math.round((user.weight * 0.85) / 2.5) * 2.5
        : activeExercise.equipment === 'barbell'
        ? 80
        : 32.5;

    try {
      const raw = localStorage.getItem(SETS_STORAGE_KEY);
      const allSaved = raw ? JSON.parse(raw) : {};
      const exSaved = allSaved[activeExercise.id];

      if (Array.isArray(exSaved) && exSaved.length > 0) {
        setSets(
          exSaved.map((s: any, idx: number) => ({
            id: idx + 1,
            weight: Number(s.weight) > 0 ? Number(s.weight) : defaultBaseKg,
            reps: Number(s.reps) > 0 ? Number(s.reps) : activeExercise.maxReps,
            completed: Boolean(s.completed),
          }))
        );
      } else {
        const count = activeExercise.sets || 4;
        const initialRows: LiveSetRow[] = Array.from({ length: count }, (_, idx) => ({
          id: idx + 1,
          weight: defaultBaseKg,
          reps: activeExercise.maxReps,
          completed: idx < 2,
        }));
        setSets(initialRows);
      }
    } catch {
      // fallback if storage is restricted
    }

    if (shared.workingWeightKg && shared.workingWeightKg >= barWeight) {
      setPlateTargetWeight(shared.workingWeightKg);
    } else if (user?.weight && user.weight > 0) {
      setPlateTargetWeight(Math.max(barWeight, Math.round((user.weight * 1.15) / 2.5) * 2.5));
    }
    setHasHydrated(true);
  }, [activeExercise, user?.weight, barWeight]);

  const persistSetsToTracker = (nextSets: LiveSetRow[]) => {
    if (typeof window === 'undefined' || !activeExercise) return;
    try {
      const raw = localStorage.getItem(SETS_STORAGE_KEY);
      const allSaved = raw ? JSON.parse(raw) : {};
      allSaved[activeExercise.id] = nextSets.map((s) => ({
        setNumber: s.id,
        weight: String(s.weight),
        reps: String(s.reps),
        completed: s.completed,
      }));
      localStorage.setItem(SETS_STORAGE_KEY, JSON.stringify(allSaved));

      const latestCompleted = nextSets.find((s) => s.completed && s.weight > 0 && s.reps > 0);
      if (latestCompleted) {
        const e1rm = calculateOneRepMaxSuite(latestCompleted.weight, latestCompleted.reps).average;
        updateSharedToolMetrics({
          workingWeightKg: latestCompleted.weight,
          reps: latestCompleted.reps,
          estimated1RMKg: e1rm,
          exerciseName: activeExercise.name,
        });
      }
    } catch {
      // ignore storage errors
    }
  };

  const toggleSet = (id: number) => {
    playSetCompleteSound(true);
    setSets((prev) => {
      const next = prev.map((s) =>
        s.id === id ? { ...s, completed: !s.completed } : s
      );
      persistSetsToTracker(next);
      return next;
    });
  };

  const updateSetField = (id: number, field: 'weight' | 'reps', val: number) => {
    setSets((prev) => {
      const next = prev.map((s) =>
        s.id === id ? { ...s, [field]: Math.max(0, val) } : s
      );
      persistSetsToTracker(next);
      return next;
    });
  };

  const completedSets = sets.filter((s) => s.completed);
  const totalVolume = completedSets.reduce(
    (sum, s) => sum + s.weight * s.reps,
    0
  );
  const allClearedCeiling =
    sets.length > 0 &&
    sets.every((s) => s.completed && s.reps >= activeExercise.maxReps);

  const plateBreakdown = useMemo(() => {
    const available =
      unit === 'kg' ? [25, 20, 15, 10, 5, 2.5, 1.25] : [45, 35, 25, 10, 5, 2.5];
    return calculatePlates(plateTargetWeight, barWeight, available);
  }, [plateTargetWeight, barWeight, unit]);

  return (
    <div className="space-y-6">
      {/* Real-Time Synced Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2.5 text-[var(--text-secondary)]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B7FF4A] animate-pulse" />
          <span>
            <strong className="text-[var(--text-primary)]">
              Live Synced Session ({schedule.dayOfWeekName}):
            </strong>{' '}
            {workout.title} — {workout.focus}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {ALL_TRAINING_PROGRAMS.map((prog) => (
            <button
              key={prog.id}
              type="button"
              onClick={() => {
                playClickSound(true);
                setSelectedSplitId(prog.id);
                setSelectedExIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition cursor-pointer ${
                selectedSplitId === prog.id
                  ? 'bg-[#B7FF4A] text-[#090B0F]'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
              }`}
            >
              {prog.id === 'ppl'
                ? '6-Day PPL'
                : prog.id === 'upper-lower'
                ? 'Upper/Lower'
                : prog.id === 'bro-split'
                ? 'Bro Split'
                : 'Full Body'}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Selector Pills from Today's Real Scheduled Workout */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5 mr-1">
          <Calendar className="w-3.5 h-3.5 text-[#B7FF4A]" /> Today&apos;s Exercises:
        </span>
        {workout.exercises.map((ex, idx) => (
          <button
            key={ex.id}
            type="button"
            onClick={() => {
              playClickSound(true);
              setSelectedExIndex(idx);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition cursor-pointer ${
              selectedExIndex === idx
                ? 'bg-[#B7FF4A]/15 text-[#B7FF4A] border border-[#B7FF4A]/40 font-bold'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
            }`}
          >
            {idx + 1}. {ex.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Live Workout Logger Card (Writes directly to ppl_sets_v2 & shared calculator state) */}
        <div className="lg:col-span-7 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase text-[#B7FF4A] bg-[#B7FF4A]/10 px-2.5 py-0.5 rounded-full border border-[#B7FF4A]/25">
                  Target: {activeExercise.primaryMuscle}
                </span>
                <span className="text-[11px] font-mono text-[var(--text-muted)]">
                  Rest: {activeExercise.restDisplay} • Equipment: {activeExercise.equipment}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold uppercase text-[var(--text-primary)] mt-1.5">
                {activeExercise.name}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {activeExercise.cue}
              </p>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-mono uppercase text-[var(--text-muted)]">
                Logged Volume
              </div>
              <div className="text-2xl font-display font-black text-[#B7FF4A] font-mono tabular-nums">
                {hasHydrated ? Math.round(totalVolume * 10) / 10 : 0}{' '}
                <span className="text-xs font-sans text-[var(--text-muted)]">
                  {unit}
                </span>
              </div>
            </div>
          </div>

          {/* Live Editable Set Rows */}
          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-2 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider px-2">
              <div className="col-span-2">Set</div>
              <div className="col-span-4">Load ({unit})</div>
              <div className="col-span-3">Reps ({activeExercise.targetReps})</div>
              <div className="col-span-3 text-right">Sync Set</div>
            </div>

            {sets.map((s) => (
              <div
                key={s.id}
                className={`grid grid-cols-12 gap-2 items-center p-2.5 sm:p-3 rounded-2xl border transition-all ${
                  s.completed
                    ? 'bg-[#B7FF4A]/10 border-[#B7FF4A]/35 text-[var(--text-primary)]'
                    : 'bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                <div className="col-span-2 font-mono font-bold text-xs tabular-nums pl-1">
                  #{s.id}
                </div>
                <div className="col-span-4">
                  <input
                    type="number"
                    step="2.5"
                    min="0"
                    max="600"
                    aria-label={`Set ${s.id} weight in ${unit}`}
                    value={s.weight}
                    onChange={(e) =>
                      updateSetField(s.id, 'weight', parseFloat(e.target.value) || 0)
                    }
                    className="w-20 sm:w-24 px-2.5 py-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] font-mono font-bold text-xs sm:text-sm tabular-nums text-[var(--text-primary)] focus:outline-none focus:border-[#B7FF4A]"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="50"
                    aria-label={`Set ${s.id} repetitions`}
                    value={s.reps}
                    onChange={(e) =>
                      updateSetField(s.id, 'reps', parseInt(e.target.value, 10) || 0)
                    }
                    className="w-16 sm:w-20 px-2.5 py-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] font-mono font-bold text-xs sm:text-sm tabular-nums text-[var(--text-primary)] focus:outline-none focus:border-[#B7FF4A]"
                  />
                </div>
                <div className="col-span-3 text-right">
                  <button
                    type="button"
                    onClick={() => toggleSet(s.id)}
                    className={`w-8 h-8 rounded-xl border flex items-center justify-center ml-auto transition-transform active:scale-90 cursor-pointer ${
                      s.completed
                        ? 'bg-[#B7FF4A] border-[#B7FF4A] text-[#090B0F] shadow-md shadow-[#B7FF4A]/25'
                        : 'border-[var(--border-strong)] hover:border-[#B7FF4A]'
                    }`}
                    aria-label={`Mark set ${s.id} completed`}
                  >
                    {s.completed && <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-mono text-[#B7FF4A] font-semibold">
              {allClearedCeiling
                ? `Double Progression Earned! Add +2.5 ${unit} next session.`
                : `Synced ${completedSets.length}/${sets.length} sets to your PPL Tracker & 1RM Calculator.`}
            </span>
            <Link
              href="/tools/one-rep-max-calculator"
              className="text-[11px] font-mono font-bold text-[#36D6B0] hover:underline inline-flex items-center gap-1"
            >
              <span>View Synced 1RM</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Live Synced Olympic Barbell Plate Loader */}
        <div className="lg:col-span-5 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#36D6B0]" />
              <h3 className="font-display font-bold uppercase text-lg text-[var(--text-primary)]">
                Live Barbell Sleeve Math
              </h3>
            </div>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              {barWeight} {unit} Bar
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="home-live-plate-slider"
                className="text-xs font-mono uppercase text-[var(--text-muted)]"
              >
                Target Barbell Load:
              </label>
              <span className="text-lg font-mono font-bold text-[#B7FF4A] tabular-nums">
                {plateTargetWeight} {unit}
              </span>
            </div>
            <input
              id="home-live-plate-slider"
              type="range"
              min={barWeight}
              max={unit === 'kg' ? 220 : 495}
              step={unit === 'kg' ? 2.5 : 5}
              value={plateTargetWeight}
              onChange={(e) => {
                const nextW = Number(e.target.value);
                setPlateTargetWeight(nextW);
                updateSharedToolMetrics({
                  workingWeightKg:
                    unit === 'kg' ? nextW : Math.round((nextW / 2.20462) * 10) / 10,
                });
              }}
              className="w-full accent-[#B7FF4A] cursor-pointer"
            />
          </div>

          {/* Per-Side Plate Badges */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase flex items-center justify-between">
              <span>Plates Per Side ({plateBreakdown.weightPerSide} {unit}/side):</span>
              <button
                type="button"
                onClick={() => {
                  const firstCompleted = sets.find((s) => s.weight >= barWeight);
                  if (firstCompleted) {
                    setPlateTargetWeight(firstCompleted.weight);
                  }
                }}
                className="text-[#36D6B0] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Pull from Set #1
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {plateBreakdown.platesPerSide.length === 0 ? (
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  Empty {barWeight} {unit} Barbell
                </span>
              ) : (
                plateBreakdown.platesPerSide.map(({ weight: pNum, count }) => {
                  const colorClass =
                    pNum === 25 || pNum === 45
                      ? 'bg-red-600 text-white'
                      : pNum === 20 || pNum === 35
                      ? 'bg-blue-600 text-white'
                      : pNum === 15
                      ? 'bg-yellow-500 text-black'
                      : pNum === 10
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-700 text-white';

                  return (
                    <div
                      key={pNum}
                      className={`px-3 py-2 rounded-2xl text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm ${colorClass}`}
                    >
                      <span className="tabular-nums">
                        {pNum} {unit}
                      </span>
                      <span className="text-[10px] bg-black/30 text-white px-1.5 py-0.5 rounded-full font-mono">
                        ×{count}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <Link
              href="/tools/ppl-tracker"
              className="py-3 px-4 rounded-2xl bg-[#B7FF4A] hover:bg-[#a8f23d] text-[#090B0F] font-display font-black uppercase text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all btn-tactile shadow-md shadow-[#B7FF4A]/20"
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Open Full Tracker</span>
            </Link>
            <Link
              href="/tools/plate-calculator"
              className="py-3 px-4 rounded-2xl bg-[var(--bg-elevated)] hover:bg-[var(--border-strong)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-mono font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Full Plate Loader</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#36D6B0]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

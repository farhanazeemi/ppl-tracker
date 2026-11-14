'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Flame,
  RotateCcw,
  AlertCircle,
  Dumbbell,
  Info,
  ArrowRight,
  Zap,
  Award,
} from 'lucide-react';
import { calculateOneRepMaxSuite } from '../../utils/helpers';
import { playClickSound, playPopSound } from '../../utils/audio';
import { useAuth } from '../../context/AuthContext';
import {
  AthleteSyncBanner,
  getSharedToolMetrics,
  updateSharedToolMetrics,
} from './AthleteSyncBanner';

type UnitMode = 'kg' | 'lbs';
type FormulaId = 'epley' | 'brzycki' | 'lombardi' | 'oconner' | 'average';

const FORMULA_OPTIONS: Array<{ id: FormulaId; label: string; equation: string; bestFor: string }> = [
  {
    id: 'epley',
    label: 'Epley (1985)',
    equation: '1RM = W × (1 + R / 30)',
    bestFor: 'General hypertrophy & moderate rep sets (5–10 reps)',
  },
  {
    id: 'brzycki',
    label: 'Brzycki (1993)',
    equation: '1RM = W × (36 / (37 − R))',
    bestFor: 'Heavy strength & low-rep compound lifts (2–6 reps)',
  },
  {
    id: 'lombardi',
    label: 'Lombardi (1989)',
    equation: '1RM = W × R^0.10',
    bestFor: 'Conservative upper-body pressing estimates',
  },
  {
    id: 'oconner',
    label: "O'Conner (1989)",
    equation: '1RM = W × (1 + 0.025 × R)',
    bestFor: 'High-rep endurance & accessory sets (10–15 reps)',
  },
  {
    id: 'average',
    label: '4-Formula Consensus',
    equation: 'Mean of Epley, Brzycki, Lombardi & O’Conner',
    bestFor: 'Balanced all-around strength & hypertrophy baseline',
  },
];

export const OneRepMaxCalculator: React.FC = () => {
  const { user } = useAuth();
  const [isForOthers, setIsForOthers] = useState<boolean>(false);
  const [unit, setUnit] = useState<UnitMode>('kg');
  const [weightInput, setWeightInput] = useState<string>('100');
  const [repsInput, setRepsInput] = useState<string>('8');
  const [selectedFormula, setSelectedFormula] = useState<FormulaId>('epley');
  const [syncedExerciseLabel, setSyncedExerciseLabel] = useState<string>('');
  const [touched, setTouched] = useState<{ weight: boolean; reps: boolean }>({
    weight: false,
    reps: false,
  });

  // Auto-load preferred unit and latest logged working weight from Profile / PPL Tracker / Shared Metrics
  useEffect(() => {
    if (!isForOthers) {
      const targetUnit: UnitMode = user?.preferredUnit || 'kg';
      setUnit(targetUnit);
      const shared = getSharedToolMetrics();
      if (shared.workingWeightKg && shared.workingWeightKg > 0) {
        const displayW =
          targetUnit === 'kg'
            ? shared.workingWeightKg
            : Math.round((shared.workingWeightKg * 2.20462) / 2.5) * 2.5;
        setWeightInput(String(displayW));
      } else if (user?.weight && user.weight > 0) {
        // Sensible compound starting benchmark (~1.15x bodyweight) if no set logged yet
        const benchRefKg = Math.round((user.weight * 1.15) / 2.5) * 2.5;
        const displayW =
          targetUnit === 'kg'
            ? benchRefKg
            : Math.round((benchRefKg * 2.20462) / 5) * 5;
        setWeightInput(String(displayW));
      }
      if (shared.reps && shared.reps >= 1 && shared.reps <= 20) {
        setRepsInput(String(shared.reps));
      }
      if (shared.exerciseName) {
        setSyncedExerciseLabel(shared.exerciseName);
      }
    }
  }, [user, isForOthers]);

  const handleToggleMode = (forOthers: boolean) => {
    setIsForOthers(forOthers);
    if (forOthers) {
      setWeightInput(unit === 'kg' ? '100' : '225');
      setRepsInput('8');
      setSyncedExerciseLabel('');
      setTouched({ weight: false, reps: false });
    }
  };

  const handleUnitToggle = (nextUnit: UnitMode) => {
    if (nextUnit === unit) return;
    playClickSound(true);
    const w = parseFloat(weightInput);
    if (!Number.isNaN(w) && w > 0) {
      if (nextUnit === 'lbs') {
        setWeightInput(String(Math.round(w * 2.20462 * 2) / 2));
      } else {
        setWeightInput(String(Math.round((w / 2.20462) * 2) / 2));
      }
    }
    setUnit(nextUnit);
    setTouched({ weight: false, reps: false });
  };

  const validation = useMemo(() => {
    const w = parseFloat(weightInput);
    const r = parseInt(repsInput, 10);
    const errors: { weight?: string; reps?: string } = {};

    const maxW = unit === 'kg' ? 600 : 1320;
    if (Number.isNaN(w) || w <= 0 || w > maxW) {
      errors.weight = `Enter a valid lifted load between 1 and ${maxW} ${unit}.`;
    }
    if (Number.isNaN(r) || r < 1 || r > 20) {
      errors.reps = 'Enter repetitions between 1 and 20 (1–10 reps is most accurate).';
    }

    return {
      isValid: !errors.weight && !errors.reps,
      weight: Number.isNaN(w) ? 0 : w,
      reps: Number.isNaN(r) ? 0 : r,
      errors,
    };
  }, [weightInput, repsInput, unit]);

  const suite = useMemo(() => {
    if (!validation.isValid) {
      return calculateOneRepMaxSuite(0, 0, selectedFormula);
    }
    return calculateOneRepMaxSuite(validation.weight, validation.reps, selectedFormula);
  }, [validation, selectedFormula]);

  const primary1RM =
    selectedFormula === 'brzycki'
      ? suite.brzycki
      : selectedFormula === 'lombardi'
      ? suite.lombardi
      : selectedFormula === 'oconner'
      ? suite.oconner
      : selectedFormula === 'average'
      ? suite.average
      : suite.epley;

  // Broadcast 1RM and working weight to RPE Estimator and Plate Loader when in My Profile mode
  useEffect(() => {
    if (!isForOthers && validation.isValid && primary1RM > 0) {
      const weightKg =
        unit === 'kg'
          ? validation.weight
          : Math.round((validation.weight / 2.20462) * 10) / 10;
      const e1rmKg =
        unit === 'kg'
          ? primary1RM
          : Math.round((primary1RM / 2.20462) * 10) / 10;
      updateSharedToolMetrics({
        workingWeightKg: weightKg,
        reps: validation.reps,
        estimated1RMKg: e1rmKg,
      });
    }
  }, [isForOthers, validation.isValid, validation.weight, validation.reps, primary1RM, unit]);

  const applyPreset = (kgLoad: number, reps: number) => {
    playPopSound(true);
    const displayLoad = unit === 'kg' ? kgLoad : Math.round((kgLoad * 2.20462) / 5) * 5;
    setWeightInput(String(displayLoad));
    setRepsInput(String(reps));
    setTouched({ weight: false, reps: false });
  };

  const handleReset = () => {
    playPopSound(true);
    setWeightInput(unit === 'kg' ? '100' : '225');
    setRepsInput('8');
    setSelectedFormula('epley');
    setTouched({ weight: false, reps: false });
  };

  const showWeightError = touched.weight && !!validation.errors.weight;
  const showRepsError = touched.reps && !!validation.errors.reps;

  return (
    <div className="space-y-10">
      <AthleteSyncBanner
        toolName="1RM & Training Percentages"
        isForOthers={isForOthers}
        onToggleMode={handleToggleMode}
        profilePayloadToSave={{ preferredUnit: unit }}
        syncedFieldsSummary={
          syncedExerciseLabel
            ? `Auto-loaded your logged set (${weightInput} ${unit} × ${repsInput} reps on ${syncedExerciseLabel}) and synced 1RM (${primary1RM} ${unit}) to RPE & Plate Calculators.`
            : `Synced with your preferred unit (${unit.toUpperCase()}) and broadcasting estimated 1RM (${primary1RM} ${unit}) to RPE & Plate Calculators.`
        }
        quickLinks={[
          { label: 'Load 80% Set on Plate Loader', href: '/tools/plate-calculator' },
          { label: 'Autoregulate Set in RPE Calculator', href: '/tools/rpe-calculator' },
        ]}
      />
      <div className="rounded-3xl card-bento overflow-hidden shadow-xl">
        {/* Top Bar */}
        <div className="p-6 sm:p-8 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-elevated)]/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20">
                <Flame className="w-5 h-5" aria-hidden="true" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[var(--text-primary)]">
                One-Rep Max (1RM) & Percentage Engine
              </h2>
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-sans">
              Enter your working set weight and repetitions to compute your max lift and 60%–95% training loads.
            </p>
          </div>

          <div
            role="group"
            aria-label="Weight unit system"
            className="inline-flex items-center p-1 bg-[var(--bg-elevated)] rounded-2xl self-start sm:self-auto border border-[var(--border-subtle)]"
          >
            <button
              type="button"
              onClick={() => handleUnitToggle('kg')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                unit === 'kg'
                  ? 'bg-[var(--accent-primary)] text-black shadow-sm font-black'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Kilograms (KG)
            </button>
            <button
              type="button"
              onClick={() => handleUnitToggle('lbs')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                unit === 'lbs'
                  ? 'bg-[var(--accent-primary)] text-black shadow-sm font-black'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Pounds (LBS)
            </button>
          </div>
        </div>

        {/* Calculator Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent-primary)] font-bold block">
                {"// Working Set Parameters"}
              </span>

              {/* Weight Input */}
              <div className="space-y-2">
                <label
                  htmlFor="orm-weight-input"
                  className="block text-xs font-mono font-semibold uppercase text-[var(--text-secondary)]"
                >
                  Weight Lifted ({unit.toUpperCase()})
                </label>
                <div className="relative">
                  <input
                    id="orm-weight-input"
                    name="weightLifted"
                    type="number"
                    min={1}
                    max={unit === 'kg' ? 600 : 1320}
                    step={unit === 'kg' ? 2.5 : 5}
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, weight: true }))}
                    aria-invalid={showWeightError ? 'true' : 'false'}
                    aria-describedby={showWeightError ? 'orm-weight-error' : undefined}
                    placeholder={unit === 'kg' ? 'e.g. 100' : 'e.g. 225'}
                    className={`w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl text-base font-mono font-bold tabular-nums text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-colors ${
                      showWeightError ? 'user-invalid-fallback' : ''
                    }`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--text-muted)] uppercase">
                    {unit}
                  </span>
                </div>
                {showWeightError && (
                  <p
                    id="orm-weight-error"
                    role="alert"
                    className="text-[11px] font-mono text-rose-400 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    {validation.errors.weight}
                  </p>
                )}
              </div>

              {/* Reps Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="orm-reps-input"
                    className="block text-xs font-mono font-semibold uppercase text-[var(--text-secondary)]"
                  >
                    Repetitions Completed (1–20)
                  </label>
                  <span className="text-[11px] font-mono text-[var(--accent-primary)] font-bold">
                    {validation.reps > 10 ? 'High-Rep Estimate' : 'Peak Accuracy Range'}
                  </span>
                </div>
                <div className="relative">
                  <input
                    id="orm-reps-input"
                    name="repsCompleted"
                    type="number"
                    min={1}
                    max={20}
                    step={1}
                    value={repsInput}
                    onChange={(e) => setRepsInput(e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, reps: true }))}
                    aria-invalid={showRepsError ? 'true' : 'false'}
                    aria-describedby={showRepsError ? 'orm-reps-error' : undefined}
                    placeholder="e.g. 8"
                    className={`w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl text-base font-mono font-bold tabular-nums text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-colors ${
                      showRepsError ? 'user-invalid-fallback' : ''
                    }`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--text-muted)]">
                    reps
                  </span>
                </div>
                {/* Quick Rep Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[2, 3, 5, 6, 8, 10, 12].map((repCount) => (
                    <button
                      key={repCount}
                      type="button"
                      onClick={() => {
                        playPopSound(true);
                        setRepsInput(String(repCount));
                      }}
                      className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                        parseInt(repsInput, 10) === repCount
                          ? 'bg-[var(--accent-primary)] text-black'
                          : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                      }`}
                    >
                      {repCount} reps
                    </button>
                  ))}
                </div>
                {showRepsError && (
                  <p
                    id="orm-reps-error"
                    role="alert"
                    className="text-[11px] font-mono text-rose-400 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    {validation.errors.reps}
                  </p>
                )}
              </div>

              {/* Formula Selector */}
              <fieldset className="space-y-2 pt-2">
                <legend className="text-xs font-mono font-semibold uppercase text-[var(--text-secondary)] mb-1">
                  Primary 1RM Equation
                </legend>
                <div className="space-y-1.5">
                  {FORMULA_OPTIONS.map((f) => {
                    const isSelected = selectedFormula === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          playPopSound(true);
                          setSelectedFormula(f.id);
                        }}
                        className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)] text-[var(--text-primary)]'
                            : 'bg-[var(--bg-elevated)]/60 border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-mono font-bold flex items-center gap-2">
                            <span>{f.label}</span>
                            <span className="text-[10px] text-[var(--text-muted)] font-normal">{f.equation}</span>
                          </div>
                          <div className="text-[11px] text-[var(--text-muted)] font-sans mt-0.5">{f.bestFor}</div>
                        </div>
                        <span className="text-xs font-mono font-black text-[var(--accent-primary)] tabular-nums">
                          {validation.isValid
                            ? `${
                                f.id === 'epley'
                                  ? suite.epley
                                  : f.id === 'brzycki'
                                  ? suite.brzycki
                                  : f.id === 'lombardi'
                                  ? suite.lombardi
                                  : f.id === 'oconner'
                                  ? suite.oconner
                                  : suite.average
                              } ${unit}`
                            : '—'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Quick Compound Lift Presets */}
              <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
                  Benchmark Presets:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => applyPreset(100, 5)}
                    className="px-3 py-1.5 rounded-xl text-xs font-mono bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] text-[var(--text-secondary)] border border-[var(--border-subtle)] cursor-pointer"
                  >
                    Bench (100kg × 5)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset(140, 5)}
                    className="px-3 py-1.5 rounded-xl text-xs font-mono bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] text-[var(--text-secondary)] border border-[var(--border-subtle)] cursor-pointer"
                  >
                    Squat (140kg × 5)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset(180, 3)}
                    className="px-3 py-1.5 rounded-xl text-xs font-mono bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] text-[var(--text-secondary)] border border-[var(--border-subtle)] cursor-pointer"
                  >
                    Deadlift (180kg × 3)
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-1.5 rounded-xl text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" aria-hidden="true" /> Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Primary Output + 60%–100% Rep-Max Table */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary 1RM Readout Banner */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--accent-primary)]/30 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent-primary)] font-bold block">
                    Estimated One-Rep Max ({FORMULA_OPTIONS.find((f) => f.id === selectedFormula)?.label})
                  </span>
                  <div className="text-4xl sm:text-6xl font-display font-black text-[var(--text-primary)] font-mono tabular-nums mt-1">
                    {validation.isValid ? (
                      <>
                        {primary1RM}{' '}
                        <span className="text-xl sm:text-2xl text-[var(--accent-primary)] uppercase">
                          {unit}
                        </span>
                      </>
                    ) : (
                      '—'
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-right font-mono">
                  <div className="p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase block">Hypertrophy (80%)</span>
                    <span className="text-base font-black text-[#B7FF4A] tabular-nums">
                      {validation.isValid ? `${Math.round(primary1RM * 0.8 * 10) / 10} ${unit}` : '—'}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase block">Heavy Strength (90%)</span>
                    <span className="text-base font-black text-[#36D6B0] tabular-nums">
                      {validation.isValid ? `${Math.round(primary1RM * 0.9 * 10) / 10} ${unit}` : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 4-Formula Comparison Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-[var(--border-subtle)] font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase block">Epley</span>
                  <strong className="text-[var(--text-primary)] tabular-nums">{suite.epley} {unit}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase block">Brzycki</span>
                  <strong className="text-[var(--text-primary)] tabular-nums">{suite.brzycki} {unit}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase block">Lombardi</span>
                  <strong className="text-[var(--text-primary)] tabular-nums">{suite.lombardi} {unit}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase block">O&apos;Conner</span>
                  <strong className="text-[var(--text-primary)] tabular-nums">{suite.oconner} {unit}</strong>
                </div>
              </div>
            </div>

            {/* Full Training Percentage & Rep-Max Breakdown Table (60% to 100%) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3
                  id="orm-percentage-table-heading"
                  className="text-sm font-display font-black uppercase tracking-wider text-[var(--text-primary)]"
                >
                  Training Percentage & Rep-Max Breakdown (60% – 100%)
                </h3>
                <span className="text-[11px] font-mono text-[var(--text-muted)]">
                  Calibrated for Double Progression
                </span>
              </div>

              <div
                className="table-responsive-region rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]"
                tabIndex={0}
                role="region"
                aria-labelledby="orm-percentage-table-heading"
              >
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <caption className="visually-hidden">
                    Training percentage breakdown table from 60% to 100% of estimated One-Rep Max
                  </caption>
                  <thead className="bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] text-[10px] uppercase text-[var(--text-muted)]">
                    <tr>
                      <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">% of 1RM</th>
                      <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Target Weight</th>
                      <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Rep-Max Bracket</th>
                      <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Physiological Adaptation Zone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)] tabular-nums">
                    {suite.percentages.map((row) => {
                      const isHypertrophySweetSpot = row.percent === 80 || row.percent === 75;
                      return (
                        <tr
                          key={row.percent}
                          className={
                            isHypertrophySweetSpot
                              ? 'bg-[var(--accent-primary)]/10 font-bold'
                              : 'hover:bg-[var(--bg-elevated)]/40'
                          }
                        >
                          <th scope="row" className="py-3 px-4 font-bold text-[var(--text-primary)]">
                            {row.percent}%
                          </th>
                          <td className="py-3 px-4 font-black text-[var(--accent-primary)] text-sm">
                            {row.weight} {unit}
                          </td>
                          <td className="py-3 px-4 text-[var(--text-secondary)]">{row.estReps}</td>
                          <td className="py-3 px-4 font-sans text-[var(--text-secondary)]">
                            {row.zone}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actionable PPL Tracker Callout */}
            <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-[var(--accent-primary)] shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                  For maximal myofibrillar hypertrophy, program your primary compound lifts at{' '}
                  <strong className="text-[var(--text-primary)]">75%–85% 1RM (6–10 reps)</strong> and{' '}
                  <Link href="/tools/ppl-tracker" className="text-[var(--accent-primary)] font-bold hover:underline">
                    track your progressive overload with PPL Tracker
                  </Link>
                  .
                </p>
              </div>
              <Link
                href="/tools/ppl-tracker"
                className="px-4 py-2.5 rounded-xl bg-[var(--accent-primary)] text-black font-mono font-bold text-xs uppercase tracking-wider whitespace-nowrap inline-flex items-center gap-1.5 btn-tactile shrink-0"
              >
                <span>Log in Tracker</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

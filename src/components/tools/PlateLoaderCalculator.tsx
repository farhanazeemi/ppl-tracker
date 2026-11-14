'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Dumbbell,
  RotateCcw,
  AlertCircle,
  Info,
  ArrowRight,
  Plus,
  Minus,
} from 'lucide-react';
import { calculatePlates } from '../../utils/helpers';
import { playClickSound, playPopSound } from '../../utils/audio';
import { useAuth } from '../../context/AuthContext';
import {
  AthleteSyncBanner,
  getSharedToolMetrics,
} from './AthleteSyncBanner';

type UnitMode = 'kg' | 'lbs';
type CalcMode = 'target-to-plates' | 'plates-to-total';

const KG_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];
const LBS_PLATES = [45, 35, 25, 10, 5, 2.5];

const PLATE_STYLES: Record<number, { bg: string; text: string; border: string; h: string }> = {
  45: { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-700', h: 'h-24 w-9' },
  35: { bg: 'bg-amber-400', text: 'text-zinc-950', border: 'border-amber-500', h: 'h-22 w-8' },
  25: { bg: 'bg-red-600', text: 'text-white', border: 'border-red-700', h: 'h-24 w-9' },
  20: { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-700', h: 'h-22 w-8' },
  15: { bg: 'bg-amber-400', text: 'text-zinc-950', border: 'border-amber-500', h: 'h-20 w-7' },
  10: { bg: 'bg-emerald-600', text: 'text-white', border: 'border-emerald-700', h: 'h-18 w-7' },
  5: { bg: 'bg-zinc-200 dark:bg-zinc-700', text: 'text-zinc-900 dark:text-white', border: 'border-zinc-400', h: 'h-14 w-6' },
  2.5: { bg: 'bg-zinc-800 dark:bg-zinc-900', text: 'text-white', border: 'border-zinc-700', h: 'h-12 w-5' },
  1.25: { bg: 'bg-zinc-400 dark:bg-zinc-500', text: 'text-zinc-950 dark:text-white', border: 'border-zinc-500', h: 'h-10 w-5' },
};

export const PlateLoaderCalculator: React.FC = () => {
  const { user } = useAuth();
  const [isForOthers, setIsForOthers] = useState<boolean>(false);
  const [unit, setUnit] = useState<UnitMode>('kg');
  const [mode, setMode] = useState<CalcMode>('target-to-plates');
  const [targetWeightInput, setTargetWeightInput] = useState<string>('100');
  const [barWeight, setBarWeight] = useState<number>(20);
  const [includeCollars, setIncludeCollars] = useState<boolean>(false);
  const [enabledPlates, setEnabledPlates] = useState<number[]>(KG_PLATES);
  const [reverseCounts, setReverseCounts] = useState<Record<number, number>>({ 20: 2 });
  const [touched, setTouched] = useState<boolean>(false);

  // Auto-load preferred unit, barbell base weight, and working weight from Profile / 1RM / RPE / PPL Tracker
  useEffect(() => {
    if (!isForOthers) {
      const targetUnit: UnitMode = user?.preferredUnit || 'kg';
      setUnit(targetUnit);
      setEnabledPlates(targetUnit === 'kg' ? KG_PLATES : LBS_PLATES);
      if (user?.barbellBaseWeight && user.barbellBaseWeight > 0) {
        setBarWeight(user.barbellBaseWeight);
      } else {
        setBarWeight(targetUnit === 'kg' ? 20 : 45);
      }
      const shared = getSharedToolMetrics();
      if (shared.workingWeightKg && shared.workingWeightKg > 0) {
        const displayTarget =
          targetUnit === 'kg'
            ? Math.round(shared.workingWeightKg / 2.5) * 2.5
            : Math.round((shared.workingWeightKg * 2.20462) / 5) * 5;
        setTargetWeightInput(String(Math.max(targetUnit === 'kg' ? 20 : 45, displayTarget)));
      }
    }
  }, [user, isForOthers]);

  const handleToggleMode = (forOthers: boolean) => {
    setIsForOthers(forOthers);
    if (forOthers) {
      setTargetWeightInput(unit === 'kg' ? '100' : '225');
      setBarWeight(unit === 'kg' ? 20 : 45);
      setTouched(false);
    }
  };

  const barOptions =
    unit === 'kg'
      ? [
          { label: "Men's Olympic Bar", weight: 20 },
          { label: "Women's Olympic Bar", weight: 15 },
          { label: 'EZ-Curl / Specialty', weight: 10 },
          { label: 'Hex / Trap Bar', weight: 25 },
        ]
      : [
          { label: "Men's Olympic Bar", weight: 45 },
          { label: "Women's Olympic Bar", weight: 35 },
          { label: 'EZ-Curl / Specialty', weight: 25 },
          { label: 'Hex / Trap Bar', weight: 55 },
        ];

  const allUnitPlates = unit === 'kg' ? KG_PLATES : LBS_PLATES;
  const collarTotal = includeCollars ? (unit === 'kg' ? 5 : 10) : 0;

  const handleUnitToggle = (nextUnit: UnitMode) => {
    if (nextUnit === unit) return;
    playClickSound(true);
    setUnit(nextUnit);
    if (nextUnit === 'lbs') {
      setBarWeight(45);
      setEnabledPlates(LBS_PLATES);
      setTargetWeightInput('225');
      setReverseCounts({ 45: 2 });
    } else {
      setBarWeight(20);
      setEnabledPlates(KG_PLATES);
      setTargetWeightInput('100');
      setReverseCounts({ 20: 2 });
    }
    setTouched(false);
  };

  const togglePlateAvailability = (plate: number) => {
    playPopSound(true);
    setEnabledPlates((prev) =>
      prev.includes(plate)
        ? prev.length > 1
          ? prev.filter((p) => p !== plate)
          : prev
        : [...prev, plate].sort((a, b) => b - a)
    );
  };

  const parsedTarget = parseFloat(targetWeightInput);
  const effectiveBarWeight = barWeight + collarTotal;
  const isInvalidTarget =
    mode === 'target-to-plates' &&
    (Number.isNaN(parsedTarget) || parsedTarget < effectiveBarWeight || parsedTarget > (unit === 'kg' ? 600 : 1320));

  const calculation = useMemo(() => {
    const safeTarget = Number.isNaN(parsedTarget) ? effectiveBarWeight : parsedTarget;
    return calculatePlates(safeTarget, effectiveBarWeight, enabledPlates);
  }, [parsedTarget, effectiveBarWeight, enabledPlates]);

  const reverseTotal = useMemo(() => {
    const oneSide = Object.entries(reverseCounts).reduce(
      (sum, [plateStr, count]) => sum + parseFloat(plateStr) * count,
      0
    );
    return Math.round((effectiveBarWeight + oneSide * 2) * 100) / 100;
  }, [reverseCounts, effectiveBarWeight]);

  const warmupLadder = useMemo(() => {
    const baseTarget = mode === 'target-to-plates' ? calculation.targetWeight : reverseTotal;
    if (baseTarget <= effectiveBarWeight) return [];
    return [0.4, 0.6, 0.75, 0.85, 1.0].map((pct) => {
      const step = unit === 'kg' ? 2.5 : 5;
      const raw = Math.max(effectiveBarWeight, Math.round((baseTarget * pct) / step) * step);
      const breakdown = calculatePlates(raw, effectiveBarWeight, enabledPlates);
      return {
        pct: Math.round(pct * 100),
        weight: raw,
        reps: pct === 1.0 ? 'Working Set' : pct <= 0.6 ? '5–8 Warmup' : '2–3 Acclimatization',
        platesSummary:
          breakdown.platesPerSide.length === 0
            ? 'Empty Bar'
            : breakdown.platesPerSide.map((p) => `${p.count}×${p.weight}${unit}`).join(' + '),
      };
    });
  }, [mode, calculation.targetWeight, reverseTotal, effectiveBarWeight, unit, enabledPlates]);

  return (
    <div className="space-y-10">
      <AthleteSyncBanner
        toolName="Barbell Plate Loader"
        isForOthers={isForOthers}
        onToggleMode={handleToggleMode}
        profilePayloadToSave={{
          preferredUnit: unit,
          barbellBaseWeight: barWeight,
        }}
        syncedFieldsSummary={`Auto-loaded your preferred unit (${unit.toUpperCase()}), default barbell (${barWeight} ${unit}), and working weight (${targetWeightInput} ${unit}) from your profile / 1RM / RPE tools.`}
        quickLinks={[
          { label: 'Compute 1RM & Percentages', href: '/tools/one-rep-max-calculator' },
          { label: 'Autoregulate Weight via RPE', href: '/tools/rpe-calculator' },
        ]}
      />
      <div className="rounded-3xl card-bento overflow-hidden shadow-xl">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-elevated)]/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20">
                <Dumbbell className="w-5 h-5" aria-hidden="true" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[var(--text-primary)]">
                Olympic Barbell Plate Loader
              </h2>
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-sans">
              Calculate exact plates per side for any target load or sum loaded sleeves in Reverse Mode.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div
              role="group"
              aria-label="Calculation mode"
              className="inline-flex items-center p-1 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)]"
            >
              <button
                type="button"
                onClick={() => {
                  playClickSound(true);
                  setMode('target-to-plates');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition cursor-pointer ${
                  mode === 'target-to-plates'
                    ? 'bg-[var(--accent-primary)] text-black font-black'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Target → Plates
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound(true);
                  setMode('plates-to-total');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition cursor-pointer ${
                  mode === 'plates-to-total'
                    ? 'bg-[var(--accent-primary)] text-black font-black'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Reverse Counter
              </button>
            </div>

            <div
              role="group"
              aria-label="Weight unit system"
              className="inline-flex items-center p-1 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)]"
            >
              <button
                type="button"
                onClick={() => handleUnitToggle('kg')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition cursor-pointer ${
                  unit === 'kg'
                    ? 'bg-[var(--accent-primary)] text-black font-black'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                KG
              </button>
              <button
                type="button"
                onClick={() => handleUnitToggle('lbs')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition cursor-pointer ${
                  unit === 'lbs'
                    ? 'bg-[var(--accent-primary)] text-black font-black'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                LBS
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Controls */}
          <div className="lg:col-span-5 space-y-6">
            {mode === 'target-to-plates' ? (
              <div className="space-y-3">
                <label
                  htmlFor="plate-calc-target-weight"
                  className="block text-xs font-mono font-semibold uppercase text-[var(--text-secondary)]"
                >
                  Target Total Barbell Weight ({unit.toUpperCase()})
                </label>
                <div className="relative">
                  <input
                    id="plate-calc-target-weight"
                    name="targetWeight"
                    type="number"
                    step={unit === 'kg' ? 2.5 : 5}
                    min={effectiveBarWeight}
                    max={unit === 'kg' ? 600 : 1320}
                    value={targetWeightInput}
                    onChange={(e) => setTargetWeightInput(e.target.value)}
                    onBlur={() => setTouched(true)}
                    aria-invalid={touched && isInvalidTarget ? 'true' : 'false'}
                    aria-describedby={touched && isInvalidTarget ? 'plate-target-error' : undefined}
                    className={`w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl text-xl font-mono font-black tabular-nums text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] ${
                      touched && isInvalidTarget ? 'user-invalid-fallback' : ''
                    }`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--text-muted)] uppercase">
                    {unit}
                  </span>
                </div>
                {touched && isInvalidTarget && (
                  <p id="plate-target-error" role="alert" className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    Enter a target weight of at least {effectiveBarWeight} {unit} (barbell weight).
                  </p>
                )}

                {/* Quick Load Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(unit === 'kg' ? [60, 80, 100, 120, 140, 180, 220] : [135, 185, 225, 275, 315, 405, 495]).map(
                    (presetW) => (
                      <button
                        key={presetW}
                        type="button"
                        onClick={() => {
                          playPopSound(true);
                          setTargetWeightInput(String(presetW));
                        }}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold tabular-nums transition cursor-pointer ${
                          parseFloat(targetWeightInput) === presetW
                            ? 'bg-[var(--accent-primary)] text-black'
                            : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                        }`}
                      >
                        {presetW} {unit}
                      </button>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <span className="block text-xs font-mono font-semibold uppercase text-[var(--text-secondary)]">
                  Tap Plates Loaded on ONE Side of the Bar:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {allUnitPlates.map((plate) => {
                    const count = reverseCounts[plate] || 0;
                    return (
                      <div
                        key={plate}
                        className="p-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex flex-col items-center gap-2 font-mono"
                      >
                        <span className="text-sm font-black text-[var(--text-primary)]">
                          {plate} {unit}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              playPopSound(true);
                              setReverseCounts((prev) => ({
                                ...prev,
                                [plate]: Math.max(0, (prev[plate] || 0) - 1),
                              }));
                            }}
                            aria-label={`Remove ${plate} ${unit} plate`}
                            className="w-7 h-7 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <span className="text-xs font-bold text-[var(--accent-primary)] w-5 text-center tabular-nums">
                            {count}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              playPopSound(true);
                              setReverseCounts((prev) => ({
                                ...prev,
                                [plate]: (prev[plate] || 0) + 1,
                              }));
                            }}
                            aria-label={`Add ${plate} ${unit} plate`}
                            className="w-7 h-7 rounded-lg bg-[var(--accent-primary)] text-black flex items-center justify-center cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Barbell Selector */}
            <fieldset className="space-y-2">
              <legend className="text-xs font-mono font-semibold uppercase text-[var(--text-secondary)]">
                Select Barbell Type
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {barOptions.map((bar) => (
                  <button
                    key={bar.weight}
                    type="button"
                    onClick={() => {
                      playPopSound(true);
                      setBarWeight(bar.weight);
                    }}
                    className={`p-3 rounded-2xl border text-left font-mono text-xs transition cursor-pointer ${
                      barWeight === bar.weight
                        ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)] text-[var(--text-primary)] font-bold'
                        : 'bg-[var(--bg-elevated)]/60 border-[var(--border-subtle)] text-[var(--text-secondary)]'
                    }`}
                  >
                    <div>{bar.label}</div>
                    <div className="text-[11px] text-[var(--accent-primary)] mt-0.5">
                      {bar.weight} {unit}
                    </div>
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Competition Collars Toggle & Available Plates Inventory */}
            <div className="space-y-3 pt-2 border-t border-[var(--border-subtle)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[var(--text-secondary)] font-semibold">
                  Available Gym Plate Inventory
                </span>
                <label className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeCollars}
                    onChange={(e) => setIncludeCollars(e.target.checked)}
                    className="rounded accent-[#B7FF4A]"
                  />
                  <span>+{unit === 'kg' ? '5kg' : '10lb'} Collars</span>
                </label>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {allUnitPlates.map((plate) => {
                  const isEnabled = enabledPlates.includes(plate);
                  return (
                    <button
                      key={plate}
                      type="button"
                      onClick={() => togglePlateAvailability(plate)}
                      aria-pressed={isEnabled}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition cursor-pointer ${
                        isEnabled
                          ? 'bg-[var(--accent-primary)]/15 border-[var(--accent-primary)] text-[var(--accent-primary)]'
                          : 'bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)] line-through opacity-60'
                      }`}
                    >
                      {plate} {unit}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Visual Sleeve & Warmup Progression Table */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--accent-primary)]/30 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent-primary)] font-bold block">
                    {mode === 'target-to-plates' ? 'Exact Load Per Sleeve Side' : 'Total Loaded Barbell Weight'}
                  </span>
                  <div className="text-3xl sm:text-5xl font-display font-black text-[var(--text-primary)] font-mono tabular-nums mt-1">
                    {mode === 'target-to-plates' ? (
                      <>
                        {calculation.weightPerSide}{' '}
                        <span className="text-lg sm:text-2xl text-[var(--accent-primary)]">
                          {unit} / side
                        </span>
                      </>
                    ) : (
                      <>
                        {reverseTotal}{' '}
                        <span className="text-lg sm:text-2xl text-[var(--accent-primary)]">{unit} total</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right font-mono text-xs text-[var(--text-secondary)]">
                  <div>Barbell: {barWeight} {unit}</div>
                  {includeCollars && <div>Collars: +{collarTotal} {unit}</div>}
                </div>
              </div>

              {/* Visual Barbell Sleeve */}
              <div className="min-h-[120px] bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <div className="w-12 h-4 bg-zinc-500 rounded-l-full shrink-0" />
                <div className="w-4 h-20 bg-zinc-400 dark:bg-zinc-600 rounded-sm shrink-0 flex items-center justify-center text-[9px] font-mono text-black font-bold -rotate-90">
                  SLEEVE
                </div>

                {(mode === 'target-to-plates'
                  ? calculation.platesPerSide
                  : Object.entries(reverseCounts)
                      .map(([w, c]) => ({ weight: parseFloat(w), count: c }))
                      .filter((x) => x.count > 0)
                      .sort((a, b) => b.weight - a.weight)
                ).flatMap((p) =>
                  Array.from({ length: p.count }).map((_, i) => {
                    const st = PLATE_STYLES[p.weight] || PLATE_STYLES[5];
                    return (
                      <div
                        key={`${p.weight}-${i}`}
                        className={`${st.bg} ${st.text} ${st.border} ${st.h} border rounded-md shrink-0 flex flex-col items-center justify-center font-mono text-[10px] font-black shadow-md`}
                      >
                        <span>{p.weight}</span>
                        <span className="text-[8px] opacity-80">{unit}</span>
                      </div>
                    );
                  })
                )}

                <div className="flex-1 h-5 bg-zinc-400 dark:bg-zinc-700 rounded-r-md min-w-[32px]" />
              </div>

              {/* Per-Side Plate Badges */}
              <div className="flex flex-wrap gap-2">
                {mode === 'target-to-plates' &&
                  calculation.platesPerSide.map((p) => (
                    <span
                      key={p.weight}
                      className="px-3 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-mono font-bold text-[var(--text-primary)]"
                    >
                      <strong className="text-[var(--accent-primary)]">{p.count}×</strong> {p.weight} {unit} per side
                    </span>
                  ))}
                {mode === 'target-to-plates' && calculation.remainder > 0 && (
                  <span className="text-xs font-mono text-amber-400 flex items-center gap-1.5">
                    <Info className="w-4 h-4" aria-hidden="true" />
                    Unloaded remainder: {calculation.remainder * 2} {unit} total ({calculation.remainder} {unit}/side).
                  </span>
                )}
              </div>
            </div>

            {/* Auto-Generated Warmup Progression Table */}
            {warmupLadder.length > 0 && (
              <div className="space-y-3">
                <h3
                  id="plate-warmup-heading"
                  className="text-sm font-display font-black uppercase tracking-wider text-[var(--text-primary)]"
                >
                  Recommended Warmup & Plate Progression Ladder
                </h3>
                <div
                  className="table-responsive-region rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]"
                  tabIndex={0}
                  role="region"
                  aria-labelledby="plate-warmup-heading"
                >
                  <table className="w-full text-left text-xs font-mono border-collapse tabular-nums">
                    <caption className="visually-hidden">
                      Warmup set progression ladder from 40% to 100% working weight with plates per side
                    </caption>
                    <thead className="bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] text-[10px] uppercase text-[var(--text-muted)]">
                      <tr>
                        <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Stage</th>
                        <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Total Load</th>
                        <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Prescribed Reps</th>
                        <th scope="col" className="py-3 px-4 font-bold text-[var(--accent-primary)]">Plates Per Side</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-subtle)]">
                      {warmupLadder.map((w) => (
                        <tr key={w.pct} className={w.pct === 100 ? 'bg-[var(--accent-primary)]/10 font-bold' : ''}>
                          <th scope="row" className="py-3 px-4 text-[var(--text-primary)]">{w.pct}%</th>
                          <td className="py-3 px-4 text-[var(--text-primary)] font-black">{w.weight} {unit}</td>
                          <td className="py-3 px-4 text-[var(--text-secondary)]">{w.reps}</td>
                          <td className="py-3 px-4 text-[var(--accent-primary)]">{w.platesSummary}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs text-[var(--text-secondary)] font-sans">
                Ready to start your working sets?{' '}
                <Link href="/tools/ppl-tracker" className="text-[var(--accent-primary)] font-bold hover:underline">
                  Launch the PPL Tracker workout tool
                </Link>{' '}
                with built-in rest timers and one-tap plate math on every barbell exercise.
              </p>
              <Link
                href="/tools/ppl-tracker"
                className="px-4 py-2.5 rounded-xl bg-[var(--accent-primary)] text-black font-mono font-bold text-xs uppercase tracking-wider whitespace-nowrap inline-flex items-center gap-1.5 btn-tactile shrink-0"
              >
                <span>Open PPL Tracker</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Timer,
  AlertCircle,
  ArrowRight,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { calculateRpeWorkingLoad, getRpePercentage } from '../../utils/helpers';
import { playClickSound, playPopSound } from '../../utils/audio';
import { useAuth } from '../../context/AuthContext';
import {
  AthleteSyncBanner,
  getSharedToolMetrics,
  updateSharedToolMetrics,
} from './AthleteSyncBanner';

type UnitMode = 'kg' | 'lbs';

const RPE_OPTIONS = [
  { rpe: 10, rir: 0, label: 'RPE 10 (0 RIR — True Muscular Failure)' },
  { rpe: 9.5, rir: 0.5, label: 'RPE 9.5 (0–1 RIR — Could maybe add 2.5kg)' },
  { rpe: 9.0, rir: 1, label: 'RPE 9.0 (1 RIR — 1 Clean Rep in Reserve)' },
  { rpe: 8.5, rir: 1.5, label: 'RPE 8.5 (1–2 RIR — Optimal Top Set)' },
  { rpe: 8.0, rir: 2, label: 'RPE 8.0 (2 RIR — Hypertrophy Sweet Spot)' },
  { rpe: 7.5, rir: 2.5, label: 'RPE 7.5 (2–3 RIR — Volume Accumulation)' },
  { rpe: 7.0, rir: 3, label: 'RPE 7.0 (3 RIR — Explosive Speed Work)' },
  { rpe: 6.5, rir: 3.5, label: 'RPE 6.5 (3–4 RIR — Introductory / Deload)' },
];

export const RpeCalculator: React.FC = () => {
  const { user } = useAuth();
  const [isForOthers, setIsForOthers] = useState<boolean>(false);
  const [unit, setUnit] = useState<UnitMode>('kg');
  const [weightInput, setWeightInput] = useState<string>('100');
  const [repsInput, setRepsInput] = useState<string>('6');
  const [rpeInput, setRpeInput] = useState<number>(8.5);
  const [targetReps, setTargetReps] = useState<number>(8);
  const [targetRpe, setTargetRpe] = useState<number>(8.0);
  const [touched, setTouched] = useState<{ weight: boolean; reps: boolean }>({
    weight: false,
    reps: false,
  });

  // Auto-load preferred unit and working weight from Profile / 1RM / PPL Tracker
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
        const refKg = Math.round((user.weight * 1.15) / 2.5) * 2.5;
        setWeightInput(
          String(targetUnit === 'kg' ? refKg : Math.round((refKg * 2.20462) / 5) * 5)
        );
      }
      if (shared.reps && shared.reps >= 1 && shared.reps <= 15) {
        setRepsInput(String(shared.reps));
      }
      if (shared.rpe && shared.rpe >= 6.5 && shared.rpe <= 10) {
        setRpeInput(shared.rpe);
      }
    }
  }, [user, isForOthers]);

  const handleToggleMode = (forOthers: boolean) => {
    setIsForOthers(forOthers);
    if (forOthers) {
      setWeightInput(unit === 'kg' ? '100' : '225');
      setRepsInput('6');
      setRpeInput(8.5);
      setTouched({ weight: false, reps: false });
    }
  };

  const handleUnitToggle = (nextUnit: UnitMode) => {
    if (nextUnit === unit) return;
    playClickSound(true);
    const w = parseFloat(weightInput);
    if (!Number.isNaN(w) && w > 0) {
      setWeightInput(
        String(
          nextUnit === 'lbs'
            ? Math.round((w * 2.20462) / 5) * 5
            : Math.round((w / 2.20462) / 2.5) * 2.5
        )
      );
    }
    setUnit(nextUnit);
  };

  const parsedW = parseFloat(weightInput);
  const parsedR = parseInt(repsInput, 10);
  const isWeightInvalid = Number.isNaN(parsedW) || parsedW <= 0 || parsedW > 1200;
  const isRepsInvalid = Number.isNaN(parsedR) || parsedR < 1 || parsedR > 15;

  const result = useMemo(() => {
    if (isWeightInvalid || isRepsInvalid) {
      return calculateRpeWorkingLoad({
        weight: 0,
        reps: 5,
        rpe: 8,
        targetReps,
        targetRpe,
      });
    }
    return calculateRpeWorkingLoad({
      weight: parsedW,
      reps: parsedR,
      rpe: rpeInput,
      targetReps,
      targetRpe,
    });
  }, [isWeightInvalid, isRepsInvalid, parsedW, parsedR, rpeInput, targetReps, targetRpe]);

  const rpeMatrixRows = [10, 9.5, 9.0, 8.5, 8.0, 7.5, 7.0];
  const rpeMatrixCols = [1, 2, 3, 4, 5, 6, 8, 10, 12];

  // Broadcast recommended working load to Plate Calculator when in My Profile mode
  useEffect(() => {
    if (!isForOthers && !isWeightInvalid && !isRepsInvalid && result.recommendedWeight > 0) {
      const recKg =
        unit === 'kg'
          ? result.recommendedWeight
          : Math.round((result.recommendedWeight / 2.20462) * 10) / 10;
      const e1rmKg =
        unit === 'kg'
          ? result.estimated1RM
          : Math.round((result.estimated1RM / 2.20462) * 10) / 10;
      updateSharedToolMetrics({
        workingWeightKg: recKg,
        reps: targetReps,
        rpe: targetRpe,
        estimated1RMKg: e1rmKg,
      });
    }
  }, [isForOthers, isWeightInvalid, isRepsInvalid, result.recommendedWeight, result.estimated1RM, targetReps, targetRpe, unit]);

  return (
    <div className="space-y-10">
      <AthleteSyncBanner
        toolName="RPE / RIR Working Load"
        isForOthers={isForOthers}
        onToggleMode={handleToggleMode}
        profilePayloadToSave={{ preferredUnit: unit }}
        syncedFieldsSummary={`Auto-loaded reference set from your profile/1RM and synced recommended working load (${result.recommendedWeight} ${unit}) directly to the Barbell Plate Loader.`}
        quickLinks={[
          { label: `Load ${result.recommendedWeight} ${unit} on Plate Calculator`, href: '/tools/plate-calculator' },
          { label: 'Full 1RM Percentage Table', href: '/tools/one-rep-max-calculator' },
        ]}
      />
      <div className="rounded-3xl card-bento overflow-hidden shadow-xl">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-elevated)]/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20">
                <Timer className="w-5 h-5" aria-hidden="true" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[var(--text-primary)]">
                RPE / RIR Autoregulation Load Estimator
              </h2>
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-sans">
              Convert Rate of Perceived Exertion (RPE 6.5–10) and Reps in Reserve (0–3.5 RIR) into exact working weights.
            </p>
          </div>

          <div
            role="group"
            aria-label="Weight unit system"
            className="inline-flex items-center p-1 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] self-start sm:self-auto"
          >
            <button
              type="button"
              onClick={() => handleUnitToggle('kg')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition cursor-pointer ${
                unit === 'kg'
                  ? 'bg-[var(--accent-primary)] text-black font-black'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Kilograms (KG)
            </button>
            <button
              type="button"
              onClick={() => handleUnitToggle('lbs')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition cursor-pointer ${
                unit === 'lbs'
                  ? 'bg-[var(--accent-primary)] text-black font-black'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Pounds (LBS)
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Reference Set & Target Prescription */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent-primary)] font-bold block">
                {"// 1. Performed Reference Set"}
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor="rpe-weight-input"
                    className="block text-xs font-mono font-semibold uppercase text-[var(--text-secondary)]"
                  >
                    Weight ({unit})
                  </label>
                  <input
                    id="rpe-weight-input"
                    type="number"
                    min={1}
                    max={1200}
                    step={2.5}
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                    onBlur={() => setTouched((p) => ({ ...p, weight: true }))}
                    aria-invalid={touched.weight && isWeightInvalid ? 'true' : 'false'}
                    aria-describedby={touched.weight && isWeightInvalid ? 'rpe-weight-error' : undefined}
                    className="w-full px-3.5 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl text-base font-mono font-bold tabular-nums text-[var(--text-primary)]"
                  />
                  {touched.weight && isWeightInvalid && (
                    <p id="rpe-weight-error" role="alert" className="text-[11px] font-mono text-rose-400">
                      Enter valid load &gt; 0.
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="rpe-reps-input"
                    className="block text-xs font-mono font-semibold uppercase text-[var(--text-secondary)]"
                  >
                    Reps (1–12)
                  </label>
                  <input
                    id="rpe-reps-input"
                    type="number"
                    min={1}
                    max={15}
                    value={repsInput}
                    onChange={(e) => setRepsInput(e.target.value)}
                    onBlur={() => setTouched((p) => ({ ...p, reps: true }))}
                    aria-invalid={touched.reps && isRepsInvalid ? 'true' : 'false'}
                    aria-describedby={touched.reps && isRepsInvalid ? 'rpe-reps-error' : undefined}
                    className="w-full px-3.5 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl text-base font-mono font-bold tabular-nums text-[var(--text-primary)]"
                  />
                  {touched.reps && isRepsInvalid && (
                    <p id="rpe-reps-error" role="alert" className="text-[11px] font-mono text-rose-400">
                      Enter 1 to 15 reps.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="rpe-performed-select"
                  className="block text-xs font-mono font-semibold uppercase text-[var(--text-secondary)]"
                >
                  Performed RPE / Reps in Reserve (RIR)
                </label>
                <select
                  id="rpe-performed-select"
                  value={rpeInput}
                  onChange={(e) => setRpeInput(parseFloat(e.target.value))}
                  className="w-full px-3.5 py-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl text-xs font-mono font-bold text-[var(--text-primary)]"
                >
                  {RPE_OPTIONS.map((opt) => (
                    <option key={opt.rpe} value={opt.rpe}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
              <span className="text-xs font-mono uppercase tracking-widest text-[#36D6B0] font-bold block">
                {"// 2. Target Set Prescription"}
              </span>

              <div className="space-y-2">
                <label
                  htmlFor="rpe-target-reps-select"
                  className="block text-xs font-mono font-semibold uppercase text-[var(--text-secondary)]"
                >
                  Target Repetitions: <strong className="text-[var(--text-primary)]">{targetReps} Reps</strong>
                </label>
                <div className="flex flex-wrap gap-1.5" id="rpe-target-reps-select">
                  {[3, 5, 6, 8, 10, 12].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        playPopSound(true);
                        setTargetReps(r);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                        targetReps === r
                          ? 'bg-[var(--accent-primary)] text-black'
                          : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                      }`}
                    >
                      {r} Reps
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="rpe-target-rpe-select"
                  className="block text-xs font-mono font-semibold uppercase text-[var(--text-secondary)]"
                >
                  Target Exertion (RPE / RIR)
                </label>
                <select
                  id="rpe-target-rpe-select"
                  value={targetRpe}
                  onChange={(e) => setTargetRpe(parseFloat(e.target.value))}
                  className="w-full px-3.5 py-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl text-xs font-mono font-bold text-[var(--text-primary)]"
                >
                  {RPE_OPTIONS.map((opt) => (
                    <option key={opt.rpe} value={opt.rpe}>
                      Target: {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* RIGHT: Recommended Working Load & RPE Matrix */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono tabular-nums">
              <div className="p-5 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-[10px] uppercase text-[var(--text-muted)] block">
                  Daily Readiness e1RM
                </span>
                <div className="text-2xl sm:text-3xl font-display font-black text-[var(--text-primary)]">
                  {result.estimated1RM} <span className="text-xs text-[var(--text-muted)]">{unit}</span>
                </div>
                <span className="text-[11px] text-[var(--text-muted)] block">
                  Set was {result.performedPct1RM}% of 1RM
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/40 space-y-1">
                <span className="text-[10px] uppercase text-[var(--accent-primary)] font-bold block">
                  Recommended Working Load
                </span>
                <div className="text-2xl sm:text-3xl font-display font-black text-[var(--text-primary)]">
                  {result.recommendedWeight}{' '}
                  <span className="text-xs text-[var(--accent-primary)]">{unit}</span>
                </div>
                <span className="text-[11px] text-[var(--text-secondary)] block">
                  For {targetReps} reps @ RPE {targetRpe} ({result.targetRir} RIR)
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-[10px] uppercase text-[#36D6B0] font-bold block">
                  Next Session Overload (+2.5%)
                </span>
                <div className="text-2xl sm:text-3xl font-display font-black text-[#36D6B0]">
                  {result.overloadWeight} <span className="text-xs text-[var(--text-muted)]">{unit}</span>
                </div>
                <span className="text-[11px] text-[var(--text-muted)] block">
                  Micro-progression target
                </span>
              </div>
            </div>

            {/* Interactive RPE-to-%1RM & Load Matrix */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3
                  id="rpe-matrix-heading"
                  className="text-sm font-display font-black uppercase tracking-wider text-[var(--text-primary)]"
                >
                  Personalized RPE / RIR Working Weight Matrix ({unit.toUpperCase()})
                </h3>
                <span className="text-[11px] font-mono text-[var(--text-muted)]">
                  Based on {result.estimated1RM} {unit} e1RM
                </span>
              </div>

              <div
                className="table-responsive-region rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]"
                tabIndex={0}
                role="region"
                aria-labelledby="rpe-matrix-heading"
              >
                <table className="w-full text-left text-xs font-mono border-collapse tabular-nums">
                  <caption className="visually-hidden">
                    RPE and RIR working weight chart across 1 to 12 repetitions
                  </caption>
                  <thead className="bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] text-[10px] uppercase text-[var(--text-muted)]">
                    <tr>
                      <th scope="col" className="py-2.5 px-3 font-bold text-[var(--text-primary)]">RPE (RIR)</th>
                      {rpeMatrixCols.map((repCol) => (
                        <th key={repCol} scope="col" className="py-2.5 px-2.5 font-bold text-center text-[var(--text-primary)]">
                          {repCol}R
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {rpeMatrixRows.map((rpeRow) => (
                      <tr key={rpeRow} className={rpeRow === targetRpe ? 'bg-[var(--accent-primary)]/10' : ''}>
                        <th scope="row" className="py-2.5 px-3 font-bold text-[var(--text-primary)] whitespace-nowrap">
                          RPE {rpeRow} <span className="text-[10px] text-[var(--text-muted)]">({10 - rpeRow} RIR)</span>
                        </th>
                        {rpeMatrixCols.map((repCol) => {
                          const pct = getRpePercentage(repCol, rpeRow);
                          const cellW = Math.round(result.estimated1RM * pct * 10) / 10;
                          const isHighlighted = rpeRow === targetRpe && repCol === targetReps;
                          return (
                            <td
                              key={repCol}
                              className={`py-2.5 px-2.5 text-center ${
                                isHighlighted
                                  ? 'bg-[var(--accent-primary)] text-black font-black rounded-lg'
                                  : 'text-[var(--text-secondary)]'
                              }`}
                            >
                              {cellW}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs text-[var(--text-secondary)] font-sans">
                Most hypertrophy working sets should be executed at{' '}
                <strong className="text-[var(--text-primary)]">RPE 8.0–9.0 (1–2 RIR)</strong> to maximize motor unit recruitment without excessive CNS recovery debt.{' '}
                <Link href="/tools/ppl-tracker" className="text-[var(--accent-primary)] font-bold hover:underline">
                  Log your sets, reps, and RPE with the PPL Tracker tool
                </Link>
                .
              </p>
              <Link
                href="/tools/ppl-tracker"
                className="px-4 py-2.5 rounded-xl bg-[var(--accent-primary)] text-black font-mono font-bold text-xs uppercase tracking-wider whitespace-nowrap inline-flex items-center gap-1.5 btn-tactile shrink-0"
              >
                <span>Open Tracker</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

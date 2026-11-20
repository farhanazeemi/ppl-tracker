'use client';

import React, { useState, useId } from 'react';
import Link from 'next/link';
import {
  Flame,
  Zap,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Info,
  Timer,
  Dumbbell,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { generateWarmupLadder, WarmupRung } from '../../utils/warmupEngine';
import { playClickSound, playTabSound } from '../../utils/audio';
import { AthleteSyncBanner } from './AthleteSyncBanner';
import { FaqAccordion } from '../FaqAccordion';

interface WarmupCalculatorProps {
  soundEnabled?: boolean;
}

export const WarmupCalculator: React.FC<WarmupCalculatorProps> = ({
  soundEnabled = true,
}) => {
  const [isForOthers, setIsForOthers] = useState<boolean>(false);
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [workWeightInput, setWorkWeightInput] = useState<string>('100');
  const [targetReps, setTargetReps] = useState<number>(5);
  const [isCompound, setIsCompound] = useState<boolean>(true);
  const [barWeight, setBarWeight] = useState<number>(20);

  const weightId = useId();
  const repsId = useId();

  const workWeight = parseFloat(workWeightInput) || 0;

  const handleUnitToggle = (newUnit: 'kg' | 'lbs') => {
    if (newUnit === unit) return;
    playTabSound(soundEnabled);
    if (newUnit === 'lbs') {
      const converted = Math.round(workWeight * 2.20462);
      setWorkWeightInput(String(converted));
      setBarWeight(45);
    } else {
      const converted = Math.round(workWeight * 0.453592);
      setWorkWeightInput(String(converted));
      setBarWeight(20);
    }
    setUnit(newUnit);
  };

  const ladder = generateWarmupLadder({
    workWeight,
    unit,
    barWeight,
    isCompound,
  });

  const plateColors: Record<number, { bg: string; text: string }> = {
    45: { bg: 'bg-blue-600', text: 'text-white' },
    35: { bg: 'bg-amber-400', text: 'text-zinc-950' },
    25: { bg: 'bg-red-600', text: 'text-white' },
    20: { bg: 'bg-blue-600', text: 'text-white' },
    15: { bg: 'bg-amber-400', text: 'text-zinc-950' },
    10: { bg: 'bg-emerald-600', text: 'text-white' },
    5: { bg: 'bg-white', text: 'text-zinc-950' },
    2.5: { bg: 'bg-zinc-400', text: 'text-zinc-950' },
    1.25: { bg: 'bg-zinc-600', text: 'text-white' },
  };

  const faqItems = [
    {
      question: 'Why not just jump straight into heavy working sets?',
      answer:
        'Lifting heavy loads without progressive ramping increases injury risk to tendons, ligaments, and spinal erectors. Synovial joint fluid requires progressive hydrostatic pressure to decrease viscosity. Furthermore, progressive ramp sets excite high-threshold motor units (post-activation potentiation) without exhausting the ATP-PCr phosphagen system.',
    },
    {
      question: 'Do warm-up sets count towards weekly hypertrophy volume (MEV/MAV)?',
      answer:
        'No. True hypertrophy stimulus requires sets taken close to muscular failure (0 to 3 RIR / RPE 7 to 10). Warm-up sets terminate far from failure (typically 4 to 8 RIR) and serve strictly for neural excitation and joint lubrication rather than mechanical tension.',
    },
    {
      question: 'Why do the warm-up reps decrease as the weight increases?',
      answer:
        'This follows the inverse rep-ramp principle used by elite strength athletes and coaches (and codified in openGym). The early bar-only sets use higher reps (10 reps) to promote blood flow. Later sets at 80% to 90% load only use 1 to 2 reps so you groove the neural bar path without producing muscle-fatiguing lactic acid.',
    },
    {
      question: 'How do I log these warm-up sets in the PPL Tracker?',
      answer:
        'In the PPL Workout Tracker, each set can be toggled with an optional warm-up tag, which keeps your working set volume calculations accurate while preserving your complete workout logs.',
    },
  ];

  return (
    <div className="w-full space-y-10">
      <AthleteSyncBanner
        toolName="Barbell Warm-Up Ladder"
        isForOthers={isForOthers}
        onToggleMode={setIsForOthers}
        profilePayloadToSave={{
          preferredUnit: unit,
          barbellBaseWeight: barWeight,
        }}
        syncedFieldsSummary={`Generating progressive warm-up sets leading up to ${workWeight} ${unit} working load.`}
        quickLinks={[
          { label: 'PPL Workout Tracker', href: '/tools/ppl-tracker' },
          { label: 'Barbell Plate Loader', href: '/tools/plate-calculator' },
          { label: '1RM & Percentages', href: '/tools/one-rep-max-calculator' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Configuration Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bezel-outer">
            <div className="bezel-inner p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-orange-500/10 text-orange-400 rounded-xl border border-orange-500/25">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-display font-black uppercase text-[var(--text-primary)] tracking-wide">
                      Warm-Up Protocol
                    </h2>
                    <p className="text-xs text-[var(--text-muted)] font-mono">
                      Neural Potentiation Ramp
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playClickSound(soundEnabled);
                    setWorkWeightInput('100');
                    setTargetReps(5);
                    setIsCompound(true);
                  }}
                  className="p-2 text-[var(--text-muted)] hover:text-[#B7FF4A] transition rounded-lg hover:bg-[var(--surface-hover)]"
                  title="Reset to defaults"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Unit & Exercise Type */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-mono text-[var(--text-muted)] uppercase">
                    Weight Unit
                  </label>
                  <div className="grid grid-cols-2 p-1 bg-[var(--surface-sunken)] rounded-xl border border-[var(--border-subtle)]">
                    <button
                      type="button"
                      onClick={() => handleUnitToggle('kg')}
                      className={`py-1.5 text-xs font-bold rounded-lg transition ${
                        unit === 'kg'
                          ? 'bg-[#36D6B0] text-zinc-950 shadow-xs'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      KG
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUnitToggle('lbs')}
                      className={`py-1.5 text-xs font-bold rounded-lg transition ${
                        unit === 'lbs'
                          ? 'bg-[#36D6B0] text-zinc-950 shadow-xs'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      LBS
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-mono text-[var(--text-muted)] uppercase">
                    Lift Category
                  </label>
                  <div className="grid grid-cols-2 p-1 bg-[var(--surface-sunken)] rounded-xl border border-[var(--border-subtle)]">
                    <button
                      type="button"
                      onClick={() => {
                        playTabSound(soundEnabled);
                        setIsCompound(true);
                      }}
                      className={`py-1.5 text-xs font-bold rounded-lg transition ${
                        isCompound
                          ? 'bg-[#B7FF4A] text-zinc-950 shadow-xs'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      Compound
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playTabSound(soundEnabled);
                        setIsCompound(false);
                      }}
                      className={`py-1.5 text-xs font-bold rounded-lg transition ${
                        !isCompound
                          ? 'bg-[#B7FF4A] text-zinc-950 shadow-xs'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      Isolation
                    </button>
                  </div>
                </div>
              </div>

              {/* Work Weight & Reps */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor={weightId} className="text-xs font-bold font-mono text-[var(--text-muted)] uppercase">
                    Working Load ({unit})
                  </label>
                  <input
                    id={weightId}
                    type="number"
                    step="2.5"
                    min="1"
                    value={workWeightInput}
                    onChange={(e) => setWorkWeightInput(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[var(--surface-sunken)] border border-[var(--border-subtle)] rounded-xl text-base font-bold text-[var(--text-primary)] focus:outline-none focus:border-[#B7FF4A] font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor={repsId} className="text-xs font-bold font-mono text-[var(--text-muted)] uppercase">
                    Working Reps
                  </label>
                  <select
                    id={repsId}
                    value={targetReps}
                    onChange={(e) => setTargetReps(parseInt(e.target.value, 10))}
                    className="w-full px-4 py-2.5 bg-[var(--surface-sunken)] border border-[var(--border-subtle)] rounded-xl text-base font-bold text-[var(--text-primary)] focus:outline-none focus:border-[#B7FF4A] font-mono"
                  >
                    {[1, 2, 3, 5, 6, 8, 10, 12].map((r) => (
                      <option key={r} value={r} className="bg-zinc-900 text-white">
                        {r} Reps {r <= 3 ? '(Max Strength)' : r <= 8 ? '(Hypertrophy)' : '(Metabolic)'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Barbell Selection */}
              {isCompound && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-mono text-[var(--text-muted)] uppercase">
                    Barbell Standard
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: unit === 'kg' ? 'Olympic 20kg' : 'Olympic 45lb', val: unit === 'kg' ? 20 : 45 },
                      { label: unit === 'kg' ? "Women's 15kg" : "Women's 35lb", val: unit === 'kg' ? 15 : 35 },
                      { label: unit === 'kg' ? 'Trap Bar 25kg' : 'Trap Bar 55lb', val: unit === 'kg' ? 25 : 55 },
                    ].map((b) => (
                      <button
                        key={b.val}
                        type="button"
                        onClick={() => {
                          playClickSound(soundEnabled);
                          setBarWeight(b.val);
                        }}
                        className={`p-2 rounded-xl text-xs font-mono font-bold border transition ${
                          barWeight === b.val
                            ? 'bg-[#B7FF4A]/10 border-[#B7FF4A] text-[#B7FF4A]'
                            : 'bg-[var(--surface-sunken)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Weight Presets */}
              <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2">
                <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase block">
                  Quick Load Presets
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {(unit === 'kg' ? [60, 100, 140, 180] : [135, 225, 315, 405]).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        playClickSound(soundEnabled);
                        setWorkWeightInput(String(preset));
                      }}
                      className="px-2 py-1.5 text-xs font-bold font-mono bg-[var(--surface-sunken)] hover:bg-[var(--surface-hover)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-muted)] hover:text-[#B7FF4A] transition"
                    >
                      {preset} {unit}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Generated Ladder Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bezel-outer">
            <div className="bezel-inner p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <div>
                  <h3 className="text-base font-display font-black uppercase text-[var(--text-primary)] tracking-wide">
                    Warm-Up Sets ({ladder.length} Sets Total)
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] font-mono">
                    Leading up to {workWeight} {unit} × {targetReps} reps
                  </p>
                </div>
                <div className="px-3 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/25 rounded-full text-xs font-mono font-bold">
                  Target Work Set: {workWeight} {unit}
                </div>
              </div>

              {/* Warm-Up Sets List */}
              <div className="space-y-3">
                {ladder.map((rung) => (
                  <div
                    key={rung.setNumber}
                    className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-subtle)] hover:border-orange-500/40 transition space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 font-mono text-xs font-black flex items-center justify-center">
                          W{rung.setNumber}
                        </span>
                        <div>
                          <div className="text-base font-mono font-black text-[var(--text-primary)]">
                            {rung.weight} {unit} × {rung.reps} reps
                          </div>
                          <span className="text-[11px] font-mono text-zinc-500">
                            {rung.percentage}% of work load
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] bg-[var(--surface-raised)] px-2.5 py-1 rounded-lg border border-[var(--border-subtle)]">
                        <Timer className="w-3.5 h-3.5 text-purple-400" />
                        <span>Rest {rung.restSeconds}s</span>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--text-muted)] italic">
                      {rung.purpose}
                    </p>

                    {/* Plate breakdown per side */}
                    {rung.plates && rung.plates.platesPerSide.length > 0 && (
                      <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">
                          Per Side:
                        </span>
                        {rung.plates.platesPerSide.map((plateGroup, pIdx) => {
                          const styling = plateColors[plateGroup.weight] || { bg: 'bg-zinc-700', text: 'text-white' };
                          return (
                            <span
                              key={pIdx}
                              className={`px-2 py-0.5 rounded text-[11px] font-mono font-black ${styling.bg} ${styling.text}`}
                            >
                              {plateGroup.weight}{plateGroup.count > 1 ? ` × ${plateGroup.count}` : ''}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}

                {/* Final Working Set Preview */}
                <div className="p-4 rounded-xl bg-[#B7FF4A]/10 border border-[#B7FF4A]/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#B7FF4A] text-zinc-950 font-mono text-xs font-black flex items-center justify-center">
                      ✓
                    </span>
                    <div>
                      <div className="text-base font-mono font-black text-[var(--text-primary)]">
                        {workWeight} {unit} × {targetReps} reps
                      </div>
                      <span className="text-[11px] font-mono text-[#B7FF4A]">
                        Working Top Set (RPE 8.0–9.0 Target)
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                    Work Set 1
                  </span>
                </div>
              </div>

              {/* Action Banner to PPL Tracker */}
              <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-mono text-[var(--text-muted)] text-center sm:text-left">
                  Track your working sets, progressive overload, and rest intervals directly:
                </span>
                <Link
                  href="/tools/ppl-tracker"
                  className="px-4 py-2 bg-[#B7FF4A] text-zinc-950 font-black font-display uppercase text-xs rounded-xl hover:bg-[#a6f03d] transition shadow-xs flex items-center gap-2 shrink-0 btn-tactile"
                >
                  <span>Launch PPL Tracker</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FaqAccordion items={faqItems} title="Warm-Up Science & Ramping FAQ" />
    </div>
  );
};

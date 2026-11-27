'use client';

import React, { useState, useId } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Shield,
  Activity,
  Flame,
  Zap,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Info,
  Scale,
  Award,
} from 'lucide-react';
import {
  calculateDots,
  calculateWilks,
  calculateIpfGl,
  getStrengthClassification,
  KG_TO_LB,
  LB_TO_KG,
} from '../../utils/strengthCalculators';
import { playClickSound, playTabSound } from '../../utils/audio';
import { AthleteSyncBanner } from './AthleteSyncBanner';

interface StrengthScoreCalculatorProps {
  soundEnabled?: boolean;
}

export const StrengthScoreCalculator: React.FC<StrengthScoreCalculatorProps> = ({
  soundEnabled = true,
}) => {
  const [isForOthers, setIsForOthers] = useState<boolean>(false);
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [inputMode, setInputMode] = useState<'lifts' | 'total'>('lifts');

  // Bodyweight input
  const [bwInput, setBwInput] = useState<string>('82.5');

  // Three-lift inputs
  const [squatInput, setSquatInput] = useState<string>('180');
  const [benchInput, setBenchInput] = useState<string>('125');
  const [deadliftInput, setDeadliftInput] = useState<string>('220');

  // Single total input
  const [totalInput, setTotalInput] = useState<string>('525');

  const bwId = useId();
  const squatId = useId();
  const benchId = useId();
  const deadliftId = useId();
  const totalId = useId();

  // Parsing & Unit conversions
  const bwVal = parseFloat(bwInput) || 0;
  const bwKg = unit === 'lbs' ? bwVal * LB_TO_KG : bwVal;

  let totalKg = 0;
  let squatKg = 0;
  let benchKg = 0;
  let deadliftKg = 0;

  if (inputMode === 'lifts') {
    const s = parseFloat(squatInput) || 0;
    const b = parseFloat(benchInput) || 0;
    const d = parseFloat(deadliftInput) || 0;
    const rawTotal = s + b + d;
    totalKg = unit === 'lbs' ? rawTotal * LB_TO_KG : rawTotal;
    squatKg = unit === 'lbs' ? s * LB_TO_KG : s;
    benchKg = unit === 'lbs' ? b * LB_TO_KG : b;
    deadliftKg = unit === 'lbs' ? d * LB_TO_KG : d;
  } else {
    const t = parseFloat(totalInput) || 0;
    totalKg = unit === 'lbs' ? t * LB_TO_KG : t;
  }

  // Calculated Scores
  const dotsScore = calculateDots(totalKg, bwKg, sex);
  const wilksScore = calculateWilks(totalKg, bwKg, sex);
  const ipfGlScore = calculateIpfGl(totalKg, bwKg, sex);
  const classification = dotsScore ? getStrengthClassification(dotsScore, sex) : null;

  // Lift ratios (% of total)
  const squatPct = totalKg > 0 ? Math.round((squatKg / totalKg) * 100) : 0;
  const benchPct = totalKg > 0 ? Math.round((benchKg / totalKg) * 100) : 0;
  const deadliftPct = totalKg > 0 ? Math.round((deadliftKg / totalKg) * 100) : 0;

  // Bodyweight multiple (e.g. 2.5x BW)
  const bwMultiple = bwKg > 0 && totalKg > 0 ? (totalKg / bwKg).toFixed(2) : '0.00';

  const handleUnitToggle = (newUnit: 'kg' | 'lbs') => {
    if (newUnit === unit) return;
    playTabSound(soundEnabled);
    if (newUnit === 'lbs') {
      if (bwInput) setBwInput((parseFloat(bwInput) * KG_TO_LB).toFixed(1));
      if (squatInput) setSquatInput((parseFloat(squatInput) * KG_TO_LB).toFixed(0));
      if (benchInput) setBenchInput((parseFloat(benchInput) * KG_TO_LB).toFixed(0));
      if (deadliftInput) setDeadliftInput((parseFloat(deadliftInput) * KG_TO_LB).toFixed(0));
      if (totalInput) setTotalInput((parseFloat(totalInput) * KG_TO_LB).toFixed(0));
    } else {
      if (bwInput) setBwInput((parseFloat(bwInput) * LB_TO_KG).toFixed(1));
      if (squatInput) setSquatInput((parseFloat(squatInput) * LB_TO_KG).toFixed(0));
      if (benchInput) setBenchInput((parseFloat(benchInput) * LB_TO_KG).toFixed(0));
      if (deadliftInput) setDeadliftInput((parseFloat(deadliftInput) * LB_TO_KG).toFixed(0));
      if (totalInput) setTotalInput((parseFloat(totalInput) * LB_TO_KG).toFixed(0));
    }
    setUnit(newUnit);
  };

  const handlePreset = (type: 'novice' | 'intermediate' | 'advanced' | 'elite') => {
    playClickSound(soundEnabled);
    if (type === 'novice') {
      setBwInput(unit === 'kg' ? '75' : '165');
      setSquatInput(unit === 'kg' ? '100' : '220');
      setBenchInput(unit === 'kg' ? '70' : '155');
      setDeadliftInput(unit === 'kg' ? '130' : '285');
    } else if (type === 'intermediate') {
      setBwInput(unit === 'kg' ? '82.5' : '182');
      setSquatInput(unit === 'kg' ? '170' : '375');
      setBenchInput(unit === 'kg' ? '115' : '255');
      setDeadliftInput(unit === 'kg' ? '210' : '465');
    } else if (type === 'advanced') {
      setBwInput(unit === 'kg' ? '85' : '187');
      setSquatInput(unit === 'kg' ? '220' : '485');
      setBenchInput(unit === 'kg' ? '150' : '330');
      setDeadliftInput(unit === 'kg' ? '260' : '575');
    } else {
      setBwInput(unit === 'kg' ? '90' : '198');
      setSquatInput(unit === 'kg' ? '275' : '605');
      setBenchInput(unit === 'kg' ? '185' : '405');
      setDeadliftInput(unit === 'kg' ? '315' : '695');
    }
  };

  return (
    <div className="w-full space-y-10">
      {/* Athlete Sync Banner */}
      <AthleteSyncBanner
        toolName="Powerlifting Strength Standards"
        isForOthers={isForOthers}
        onToggleMode={setIsForOthers}
        profilePayloadToSave={{
          gender: sex,
          weight: Math.round(bwKg * 10) / 10,
          preferredUnit: unit,
        }}
        syncedFieldsSummary={`Benchmarking ${sex === 'male' ? 'Male' : 'Female'} ${bwVal} ${unit} lifter with ${dotsScore ? `${dotsScore.toFixed(1)} DOTS points` : '3-lift standards'}.`}
        quickLinks={[
          { label: 'PPL Workout Tracker', href: '/tools/ppl-tracker' },
          { label: 'Compute 1RM & Percentages', href: '/tools/one-rep-max-calculator' },
          { label: 'Autoregulate Load via RPE', href: '/tools/rpe-calculator' },
        ]}
      />

      {/* Main Calculator Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bezel-outer">
            <div className="bezel-inner p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#B7FF4A]/10 text-[#B7FF4A] rounded-xl border border-[#B7FF4A]/25">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-display font-black uppercase text-[var(--text-primary)] tracking-wide">
                      Strength Parameters
                    </h2>
                    <p className="text-xs text-[var(--text-muted)] font-mono">
                      Formulas from openGym / USAPL / IPF
                    </p>
                  </div>
                </div>

                {/* Reset button */}
                <button
                  type="button"
                  onClick={() => {
                    playClickSound(soundEnabled);
                    setBwInput('82.5');
                    setSquatInput('180');
                    setBenchInput('125');
                    setDeadliftInput('220');
                    setTotalInput('525');
                  }}
                  className="p-2 text-[var(--text-muted)] hover:text-[#B7FF4A] transition rounded-lg hover:bg-[var(--surface-hover)]"
                  title="Reset to defaults"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Sex & Unit Selectors */}
              <div className="grid grid-cols-2 gap-3">
                {/* Sex */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-mono text-[var(--text-muted)] uppercase">
                    Lifter Sex
                  </label>
                  <div className="grid grid-cols-2 p-1 bg-[var(--surface-sunken)] rounded-xl border border-[var(--border-subtle)]">
                    <button
                      type="button"
                      onClick={() => {
                        playTabSound(soundEnabled);
                        setSex('male');
                      }}
                      className={`py-1.5 text-xs font-bold rounded-lg transition ${
                        sex === 'male'
                          ? 'bg-[#B7FF4A] text-zinc-950 shadow-xs'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playTabSound(soundEnabled);
                        setSex('female');
                      }}
                      className={`py-1.5 text-xs font-bold rounded-lg transition ${
                        sex === 'female'
                          ? 'bg-[#B7FF4A] text-zinc-950 shadow-xs'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      Female
                    </button>
                  </div>
                </div>

                {/* Unit */}
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
              </div>

              {/* Bodyweight Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor={bwId} className="text-xs font-bold font-mono text-[var(--text-muted)] uppercase">
                    Competitor Bodyweight ({unit})
                  </label>
                  <span className="text-[11px] font-mono text-[#B7FF4A]">
                    {sex === 'male' ? '40–210 kg range' : '40–150 kg range'}
                  </span>
                </div>
                <div className="relative">
                  <input
                    id={bwId}
                    type="number"
                    step="0.5"
                    min="35"
                    max="300"
                    value={bwInput}
                    onChange={(e) => setBwInput(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[var(--surface-sunken)] border border-[var(--border-subtle)] rounded-xl text-base font-bold text-[var(--text-primary)] focus:outline-none focus:border-[#B7FF4A] font-mono"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[var(--text-muted)]">
                    {unit}
                  </span>
                </div>
              </div>

              {/* Mode Toggle: 3 Lifts vs Total */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold font-mono text-[var(--text-muted)] uppercase">
                  Input Mode
                </label>
                <div className="grid grid-cols-2 p-1 bg-[var(--surface-sunken)] rounded-xl border border-[var(--border-subtle)]">
                  <button
                    type="button"
                    onClick={() => {
                      playTabSound(soundEnabled);
                      setInputMode('lifts');
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg transition ${
                      inputMode === 'lifts'
                        ? 'bg-[var(--surface-raised)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-xs'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    Squat / Bench / Deadlift
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playTabSound(soundEnabled);
                      setInputMode('total');
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg transition ${
                      inputMode === 'total'
                        ? 'bg-[var(--surface-raised)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-xs'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    Direct 3-Lift Total
                  </button>
                </div>
              </div>

              {/* Lift Inputs */}
              {inputMode === 'lifts' ? (
                <div className="space-y-3">
                  {/* Squat */}
                  <div className="space-y-1">
                    <label htmlFor={squatId} className="text-xs font-bold font-mono text-[var(--text-muted)] flex items-center justify-between">
                      <span>Barbell Back Squat</span>
                      <span className="text-[11px] text-zinc-500">{squatPct}% of total</span>
                    </label>
                    <div className="relative">
                      <input
                        id={squatId}
                        type="number"
                        step="2.5"
                        min="0"
                        value={squatInput}
                        onChange={(e) => setSquatInput(e.target.value)}
                        className="w-full px-4 py-2 bg-[var(--surface-sunken)] border border-[var(--border-subtle)] rounded-xl text-sm font-bold text-[var(--text-primary)] focus:outline-none focus:border-[#B7FF4A] font-mono"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--text-muted)]">
                        {unit}
                      </span>
                    </div>
                  </div>

                  {/* Bench */}
                  <div className="space-y-1">
                    <label htmlFor={benchId} className="text-xs font-bold font-mono text-[var(--text-muted)] flex items-center justify-between">
                      <span>Barbell Bench Press</span>
                      <span className="text-[11px] text-zinc-500">{benchPct}% of total</span>
                    </label>
                    <div className="relative">
                      <input
                        id={benchId}
                        type="number"
                        step="2.5"
                        min="0"
                        value={benchInput}
                        onChange={(e) => setBenchInput(e.target.value)}
                        className="w-full px-4 py-2 bg-[var(--surface-sunken)] border border-[var(--border-subtle)] rounded-xl text-sm font-bold text-[var(--text-primary)] focus:outline-none focus:border-[#36D6B0] font-mono"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--text-muted)]">
                        {unit}
                      </span>
                    </div>
                  </div>

                  {/* Deadlift */}
                  <div className="space-y-1">
                    <label htmlFor={deadliftId} className="text-xs font-bold font-mono text-[var(--text-muted)] flex items-center justify-between">
                      <span>Conventional Barbell Deadlift</span>
                      <span className="text-[11px] text-zinc-500">{deadliftPct}% of total</span>
                    </label>
                    <div className="relative">
                      <input
                        id={deadliftId}
                        type="number"
                        step="2.5"
                        min="0"
                        value={deadliftInput}
                        onChange={(e) => setDeadliftInput(e.target.value)}
                        className="w-full px-4 py-2 bg-[var(--surface-sunken)] border border-[var(--border-subtle)] rounded-xl text-sm font-bold text-[var(--text-primary)] focus:outline-none focus:border-sky-400 font-mono"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--text-muted)]">
                        {unit}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label htmlFor={totalId} className="text-xs font-bold font-mono text-[var(--text-muted)] uppercase">
                    3-Lift Powerlifting Total ({unit})
                  </label>
                  <div className="relative">
                    <input
                      id={totalId}
                      type="number"
                      step="5"
                      min="0"
                      value={totalInput}
                      onChange={(e) => setTotalInput(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[var(--surface-sunken)] border border-[var(--border-subtle)] rounded-xl text-base font-bold text-[var(--text-primary)] focus:outline-none focus:border-[#B7FF4A] font-mono"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[var(--text-muted)]">
                      {unit}
                    </span>
                  </div>
                </div>
              )}

              {/* Quick Presets */}
              <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2">
                <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase block">
                  Quick Lifter Presets
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['novice', 'intermediate', 'advanced', 'elite'] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => handlePreset(tier)}
                      className="px-2 py-1.5 text-[11px] font-bold font-mono uppercase bg-[var(--surface-sunken)] hover:bg-[var(--surface-hover)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-muted)] hover:text-[#B7FF4A] transition"
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bezel-outer">
            <div className="bezel-inner p-6 sm:p-8 space-y-8">
              {/* Primary Score Hero Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#B7FF4A]/10 via-[var(--surface-sunken)] to-[#36D6B0]/5 border border-[#B7FF4A]/25 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[var(--text-muted)]">
                    <Award className="w-4 h-4 text-[#B7FF4A]" />
                    <span>Normalized Strength Score</span>
                  </div>
                  {classification && (
                    <span className={`px-2.5 py-1 text-xs font-black font-mono uppercase rounded-full border ${classification.badgeColor}`}>
                      {classification.tier} ({classification.percentile})
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                  <div className="text-4xl sm:text-5xl font-display font-black text-[var(--text-primary)] tracking-tight font-mono">
                    {dotsScore ? dotsScore.toFixed(2) : '–'}
                  </div>
                  <div className="text-sm text-[var(--text-muted)] font-mono">
                    DOTS Points <span className="text-zinc-500">(USAPL / WRPF Standard)</span>
                  </div>
                </div>

                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {classification?.description || 'Enter bodyweight and lift metrics to calculate your strength classification.'}
                </p>

                {/* Progress bar to next tier */}
                {classification?.nextTierTargetDots && classification.pointsToNextTier && (
                  <div className="pt-2 space-y-1.5 border-t border-[var(--border-subtle)]">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[var(--text-muted)]">Target for Next Tier:</span>
                      <strong className="text-[#B7FF4A]">
                        +{classification.pointsToNextTier} DOTS to Next Tier
                      </strong>
                    </div>
                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#B7FF4A] to-[#36D6B0] rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, Math.max(10, ((dotsScore || 0) / classification.nextTierTargetDots) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Detailed Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-[var(--surface-sunken)] rounded-xl border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase block">
                    Wilks Score
                  </span>
                  <div className="text-lg font-black font-mono text-[var(--text-primary)]">
                    {wilksScore ? wilksScore.toFixed(2) : '–'}
                  </div>
                  <span className="text-[10px] text-zinc-500 block">Classic 1994</span>
                </div>

                <div className="p-3.5 bg-[var(--surface-sunken)] rounded-xl border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase block">
                    IPF GL Points
                  </span>
                  <div className="text-lg font-black font-mono text-[#36D6B0]">
                    {ipfGlScore ? ipfGlScore.toFixed(2) : '–'}
                  </div>
                  <span className="text-[10px] text-zinc-500 block">Raw Full Power</span>
                </div>

                <div className="p-3.5 bg-[var(--surface-sunken)] rounded-xl border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase block">
                    BW Multiple
                  </span>
                  <div className="text-lg font-black font-mono text-sky-400">
                    {bwMultiple}×
                  </div>
                  <span className="text-[10px] text-zinc-500 block">Total / Weight</span>
                </div>

                <div className="p-3.5 bg-[var(--surface-sunken)] rounded-xl border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase block">
                    3-Lift Total
                  </span>
                  <div className="text-lg font-black font-mono text-[var(--text-primary)]">
                    {totalKg > 0 ? (unit === 'kg' ? `${Math.round(totalKg)} kg` : `${Math.round(totalKg * KG_TO_LB)} lbs`) : '–'}
                  </div>
                  <span className="text-[10px] text-zinc-500 block">Combined Total</span>
                </div>
              </div>

              {/* Lift Distribution Breakdown (if 3-lift mode) */}
              {inputMode === 'lifts' && totalKg > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-[var(--text-muted)]">
                    <span>Powerlifting Ratio Distribution</span>
                    <span className="text-zinc-500">SQ / BP / DL Balance</span>
                  </div>

                  <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${squatPct}%` }}
                      className="bg-[#B7FF4A] h-full"
                      title={`Squat: ${squatPct}%`}
                    />
                    <div
                      style={{ width: `${benchPct}%` }}
                      className="bg-[#36D6B0] h-full"
                      title={`Bench: ${benchPct}%`}
                    />
                    <div
                      style={{ width: `${deadliftPct}%` }}
                      className="bg-sky-400 h-full"
                      title={`Deadlift: ${deadliftPct}%`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#B7FF4A]" />
                      <span>Squat: {squatPct}%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#36D6B0]" />
                      <span>Bench: {benchPct}%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                      <span>Deadlift: {deadliftPct}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Contextual Link to PPL Tracker (as mandatory per AGENTS.md) */}
              <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs font-mono font-bold text-[var(--text-primary)] block">
                    Ready to increase your 3-lift strength score?
                  </span>
                  <p className="text-xs text-[var(--text-muted)]">
                    Structure your training volume, track progressive overload, and autoregulate with RPE in real-time.
                  </p>
                </div>
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
    </div>
  );
};

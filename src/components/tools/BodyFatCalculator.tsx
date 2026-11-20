'use client';

import React, { useState, useId } from 'react';
import Link from 'next/link';
import {
  Scale,
  Activity,
  Flame,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Info,
  ShieldCheck,
  Award,
} from 'lucide-react';
import {
  calculateNavyBodyFat,
  getBodyFatCategory,
  CM_PER_IN,
  KG_TO_LB,
  LB_TO_KG,
} from '../../utils/strengthCalculators';
import { playClickSound, playTabSound } from '../../utils/audio';
import { AthleteSyncBanner } from './AthleteSyncBanner';
import { FaqAccordion } from '../FaqAccordion';

interface BodyFatCalculatorProps {
  soundEnabled?: boolean;
}

export const BodyFatCalculator: React.FC<BodyFatCalculatorProps> = ({
  soundEnabled = true,
}) => {
  const [isForOthers, setIsForOthers] = useState<boolean>(false);
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  // Metric inputs (cm & kg)
  const [heightCmInput, setHeightCmInput] = useState<string>('178');
  const [neckCmInput, setNeckCmInput] = useState<string>('39');
  const [waistCmInput, setWaistCmInput] = useState<string>('84');
  const [hipCmInput, setHipCmInput] = useState<string>('98');
  const [weightKgInput, setWeightKgInput] = useState<string>('80');

  // Imperial inputs (inches & lbs)
  const [heightInInput, setHeightInInput] = useState<string>('70');
  const [neckInInput, setNeckInInput] = useState<string>('15.5');
  const [waistInInput, setWaistInInput] = useState<string>('33');
  const [hipInInput, setHipInInput] = useState<string>('38.5');
  const [weightLbInput, setWeightLbInput] = useState<string>('176');

  const heightId = useId();
  const neckId = useId();
  const waistId = useId();
  const hipId = useId();
  const weightId = useId();

  // Normalized values in CM and KG
  const heightCm = unit === 'metric' ? parseFloat(heightCmInput) || 0 : (parseFloat(heightInInput) || 0) * CM_PER_IN;
  const neckCm = unit === 'metric' ? parseFloat(neckCmInput) || 0 : (parseFloat(neckInInput) || 0) * CM_PER_IN;
  const waistCm = unit === 'metric' ? parseFloat(waistCmInput) || 0 : (parseFloat(waistInInput) || 0) * CM_PER_IN;
  const hipCm = unit === 'metric' ? parseFloat(hipCmInput) || 0 : (parseFloat(hipInInput) || 0) * CM_PER_IN;
  const weightVal = unit === 'metric' ? parseFloat(weightKgInput) || 0 : parseFloat(weightLbInput) || 0;
  const weightKg = unit === 'metric' ? weightVal : weightVal * LB_TO_KG;

  const bfPct = calculateNavyBodyFat({
    sex,
    heightCm,
    neckCm,
    waistCm,
    hipCm: sex === 'female' ? hipCm : undefined,
  });

  const category = bfPct !== null ? getBodyFatCategory(bfPct, sex) : null;

  // Mass breakdowns
  const fatMassKg = bfPct !== null && weightKg > 0 ? (weightKg * bfPct) / 100 : null;
  const leanMassKg = bfPct !== null && weightKg > 0 && fatMassKg !== null ? weightKg - fatMassKg : null;

  const displayWeightUnit = unit === 'metric' ? 'kg' : 'lbs';
  const displayFatMass = fatMassKg !== null ? (unit === 'metric' ? fatMassKg.toFixed(1) : (fatMassKg * KG_TO_LB).toFixed(1)) : '–';
  const displayLeanMass = leanMassKg !== null ? (unit === 'metric' ? leanMassKg.toFixed(1) : (leanMassKg * KG_TO_LB).toFixed(1)) : '–';

  const handleUnitToggle = (newUnit: 'metric' | 'imperial') => {
    if (newUnit === unit) return;
    playTabSound(soundEnabled);
    if (newUnit === 'imperial') {
      setHeightInInput((heightCm / CM_PER_IN).toFixed(1));
      setNeckInInput((neckCm / CM_PER_IN).toFixed(1));
      setWaistInInput((waistCm / CM_PER_IN).toFixed(1));
      setHipInInput((hipCm / CM_PER_IN).toFixed(1));
      setWeightLbInput((weightKg * KG_TO_LB).toFixed(1));
    } else {
      setHeightCmInput(Math.round(heightCm).toString());
      setNeckCmInput(Math.round(neckCm).toString());
      setWaistCmInput(Math.round(waistCm).toString());
      setHipCmInput(Math.round(hipCm).toString());
      setWeightKgInput(Math.round(weightKg).toString());
    }
    setUnit(newUnit);
  };

  const faqItems = [
    {
      question: 'How accurate is the US Navy Body Fat equation compared to DEXA?',
      answer:
        'The US Navy circumference equation (Hodgdon & Beckett, 1984) correlates within 3–4% of dual-energy X-ray absorptiometry (DEXA) scans. Unlike standard BMI, which penalizes muscular athletes by counting muscle as fat, the Navy method accounts for waist circumference relative to neck and height, isolating visceral and subcutaneous adiposity accurately.',
    },
    {
      question: 'How should I measure my neck, waist, and hips for accurate results?',
      answer:
        'Measure in the morning before eating. Measure neck circumference just below the larynx (Adam’s apple) keeping shoulders relaxed. Measure waist horizontally at the narrowest point or at the navel level (do not suck in your stomach). Females should measure hips at the widest point around the buttocks.',
    },
    {
      question: 'What is the optimal body fat percentage for muscle hypertrophy?',
      answer:
        'For males, 10% to 15% body fat provides optimal insulin sensitivity, testosterone production, and nutrient partitioning. For females, 18% to 23% is optimal. Pushing below 8% (males) or 14% (females) suppresses natural hormone production and impairs strength progression.',
    },
    {
      question: 'How do I maintain my lean mass while cutting down body fat?',
      answer:
        'Maintain resistance training intensity (log your progressive overload with PPL Tracker), consume 1.8 to 2.2g of protein per kilogram of body weight, and maintain a moderate 300 to 500 kcal deficit rather than crash dieting.',
    },
  ];

  return (
    <div className="w-full space-y-10">
      <AthleteSyncBanner
        toolName="US Navy Body Fat Calculator"
        isForOthers={isForOthers}
        onToggleMode={setIsForOthers}
        profilePayloadToSave={{
          gender: sex,
          height: Math.round(heightCm * 10) / 10,
          weight: Math.round(weightKg * 10) / 10,
        }}
        syncedFieldsSummary={`Calculated ${bfPct !== null ? `${bfPct.toFixed(1)}% body fat` : 'body composition metrics'} via the clinical US Navy circumference method.`}
        quickLinks={[
          { label: 'FFMI Muscular Potential', href: '/tools/ffmi-calculator' },
          { label: 'Daily Energy & TDEE', href: '/tools/tdee-calculator' },
          { label: 'BMI Calculator', href: '/tools/bmi-calculator' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bezel-outer">
            <div className="bezel-inner p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#36D6B0]/10 text-[#36D6B0] rounded-xl border border-[#36D6B0]/25">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-display font-black uppercase text-[var(--text-primary)] tracking-wide">
                      Body Measurements
                    </h2>
                    <p className="text-xs text-[var(--text-muted)] font-mono">
                      US Navy Method (Hodgdon & Beckett)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playClickSound(soundEnabled);
                    if (unit === 'metric') {
                      setHeightCmInput('178');
                      setNeckCmInput('39');
                      setWaistCmInput('84');
                      setHipCmInput('98');
                      setWeightKgInput('80');
                    } else {
                      setHeightInInput('70');
                      setNeckInInput('15.5');
                      setWaistInInput('33');
                      setHipInInput('38.5');
                      setWeightLbInput('176');
                    }
                  }}
                  className="p-2 text-[var(--text-muted)] hover:text-[#B7FF4A] transition rounded-lg hover:bg-[var(--surface-hover)]"
                  title="Reset to defaults"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Sex & Unit Selectors */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-mono text-[var(--text-muted)] uppercase">
                    Gender
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

                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-mono text-[var(--text-muted)] uppercase">
                    Measurement Unit
                  </label>
                  <div className="grid grid-cols-2 p-1 bg-[var(--surface-sunken)] rounded-xl border border-[var(--border-subtle)]">
                    <button
                      type="button"
                      onClick={() => handleUnitToggle('metric')}
                      className={`py-1.5 text-xs font-bold rounded-lg transition ${
                        unit === 'metric'
                          ? 'bg-[#36D6B0] text-zinc-950 shadow-xs'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      Metric
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUnitToggle('imperial')}
                      className={`py-1.5 text-xs font-bold rounded-lg transition ${
                        unit === 'imperial'
                          ? 'bg-[#36D6B0] text-zinc-950 shadow-xs'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      Imperial
                    </button>
                  </div>
                </div>
              </div>

              {/* Height & Weight Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor={heightId} className="text-xs font-bold font-mono text-[var(--text-muted)] uppercase">
                    Height ({unit === 'metric' ? 'cm' : 'in'})
                  </label>
                  <input
                    id={heightId}
                    type="number"
                    step="0.5"
                    value={unit === 'metric' ? heightCmInput : heightInInput}
                    onChange={(e) =>
                      unit === 'metric' ? setHeightCmInput(e.target.value) : setHeightInInput(e.target.value)
                    }
                    className="w-full px-4 py-2 bg-[var(--surface-sunken)] border border-[var(--border-subtle)] rounded-xl text-sm font-bold text-[var(--text-primary)] focus:outline-none focus:border-[#B7FF4A] font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor={weightId} className="text-xs font-bold font-mono text-[var(--text-muted)] uppercase">
                    Weight ({unit === 'metric' ? 'kg' : 'lbs'})
                  </label>
                  <input
                    id={weightId}
                    type="number"
                    step="0.5"
                    value={unit === 'metric' ? weightKgInput : weightLbInput}
                    onChange={(e) =>
                      unit === 'metric' ? setWeightKgInput(e.target.value) : setWeightLbInput(e.target.value)
                    }
                    className="w-full px-4 py-2 bg-[var(--surface-sunken)] border border-[var(--border-subtle)] rounded-xl text-sm font-bold text-[var(--text-primary)] focus:outline-none focus:border-[#B7FF4A] font-mono"
                  />
                </div>
              </div>

              {/* Neck & Waist Circumferences */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor={neckId} className="text-xs font-bold font-mono text-[var(--text-muted)] uppercase">
                    Neck ({unit === 'metric' ? 'cm' : 'in'})
                  </label>
                  <input
                    id={neckId}
                    type="number"
                    step="0.5"
                    value={unit === 'metric' ? neckCmInput : neckInInput}
                    onChange={(e) =>
                      unit === 'metric' ? setNeckCmInput(e.target.value) : setNeckInInput(e.target.value)
                    }
                    className="w-full px-4 py-2 bg-[var(--surface-sunken)] border border-[var(--border-subtle)] rounded-xl text-sm font-bold text-[var(--text-primary)] focus:outline-none focus:border-[#36D6B0] font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor={waistId} className="text-xs font-bold font-mono text-[var(--text-muted)] uppercase">
                    Waist ({unit === 'metric' ? 'cm' : 'in'})
                  </label>
                  <input
                    id={waistId}
                    type="number"
                    step="0.5"
                    value={unit === 'metric' ? waistCmInput : waistInInput}
                    onChange={(e) =>
                      unit === 'metric' ? setWaistCmInput(e.target.value) : setWaistInInput(e.target.value)
                    }
                    className="w-full px-4 py-2 bg-[var(--surface-sunken)] border border-[var(--border-subtle)] rounded-xl text-sm font-bold text-[var(--text-primary)] focus:outline-none focus:border-[#36D6B0] font-mono"
                  />
                </div>
              </div>

              {/* Hip Circumference (Female only) */}
              {sex === 'female' && (
                <div className="space-y-1.5">
                  <label htmlFor={hipId} className="text-xs font-bold font-mono text-[var(--text-muted)] uppercase">
                    Hip Circumference ({unit === 'metric' ? 'cm' : 'in'})
                  </label>
                  <input
                    id={hipId}
                    type="number"
                    step="0.5"
                    value={unit === 'metric' ? hipCmInput : hipInInput}
                    onChange={(e) =>
                      unit === 'metric' ? setHipCmInput(e.target.value) : setHipInInput(e.target.value)
                    }
                    className="w-full px-4 py-2.5 bg-[var(--surface-sunken)] border border-[var(--border-subtle)] rounded-xl text-base font-bold text-[var(--text-primary)] focus:outline-none focus:border-[#B7FF4A] font-mono"
                  />
                  <span className="text-[11px] font-mono text-zinc-500">
                    Required for female body density calculation
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bezel-outer">
            <div className="bezel-inner p-6 sm:p-8 space-y-8">
              {/* Primary BF% Hero Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#36D6B0]/10 via-[var(--surface-sunken)] to-[#B7FF4A]/5 border border-[#36D6B0]/25 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[var(--text-muted)]">
                    <Activity className="w-4 h-4 text-[#36D6B0]" />
                    <span>Estimated Body Fat</span>
                  </div>
                  {category && (
                    <span className={`px-2.5 py-1 text-xs font-black font-mono uppercase rounded-full border ${category.badgeColor}`}>
                      {category.category} Tier
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                  <div className="text-4xl sm:text-5xl font-display font-black text-[var(--text-primary)] tracking-tight font-mono">
                    {bfPct !== null ? `${bfPct.toFixed(1)}%` : '–'}
                  </div>
                  <div className="text-sm text-[var(--text-muted)] font-mono">
                    Adipose Ratio <span className="text-zinc-500">(US Navy Formula)</span>
                  </div>
                </div>

                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {category?.description || 'Enter your circumferences to calculate your body composition.'}
                </p>
              </div>

              {/* Mass Breakdowns Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-[var(--surface-sunken)] rounded-xl border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase block">
                    Lean Body Mass
                  </span>
                  <div className="text-xl font-black font-mono text-[#B7FF4A]">
                    {displayLeanMass} {displayWeightUnit}
                  </div>
                  <span className="text-[10px] text-zinc-500 block">Muscle, bone, water</span>
                </div>

                <div className="p-3.5 bg-[var(--surface-sunken)] rounded-xl border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase block">
                    Fat Mass
                  </span>
                  <div className="text-xl font-black font-mono text-orange-400">
                    {displayFatMass} {displayWeightUnit}
                  </div>
                  <span className="text-[10px] text-zinc-500 block">Total adipose tissue</span>
                </div>

                <div className="p-3.5 bg-[var(--surface-sunken)] rounded-xl border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase block">
                    Total Body Mass
                  </span>
                  <div className="text-xl font-black font-mono text-[var(--text-primary)]">
                    {weightVal > 0 ? `${weightVal} ${displayWeightUnit}` : '–'}
                  </div>
                  <span className="text-[10px] text-zinc-500 block">Scale measurement</span>
                </div>
              </div>

              {/* Composition Ratio Bar */}
              {bfPct !== null && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-[var(--text-muted)]">
                    <span>Lean Mass vs Fat Mass Ratio</span>
                    <span className="text-[#B7FF4A]">{(100 - bfPct).toFixed(1)}% Lean</span>
                  </div>

                  <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${Math.max(10, 100 - bfPct)}%` }}
                      className="bg-[#B7FF4A] h-full"
                      title="Lean Mass"
                    />
                    <div
                      style={{ width: `${Math.min(90, bfPct)}%` }}
                      className="bg-orange-500 h-full"
                      title="Fat Mass"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#B7FF4A]" />
                      <span>Lean Mass: {(100 - bfPct).toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                      <span>Fat Mass: {bfPct.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Banner to PPL Tracker */}
              <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs font-mono font-bold text-[var(--text-primary)] block">
                    Preserve lean muscle while dropping fat
                  </span>
                  <p className="text-xs text-[var(--text-muted)]">
                    Use our resistance training tracker to log double progression, sets, and reps during your cut.
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

      <FaqAccordion items={faqItems} title="US Navy Body Fat Method FAQ" />
    </div>
  );
};

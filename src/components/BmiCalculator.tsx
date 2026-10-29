'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Scale,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Dumbbell,
  Info,
  ChevronRight,
  TrendingUp,
  HeartPulse
} from 'lucide-react';
import { playClickSound, playPopSound } from '../utils/audio';

type UnitSystem = 'metric' | 'imperial';

interface BmiCategory {
  name: string;
  min: number;
  max: number;
  color: string;
  bgLight: string;
  badgeClass: string;
  description: string;
}

const BMI_CATEGORIES: BmiCategory[] = [
  {
    name: 'Underweight',
    min: 0,
    max: 18.49,
    color: '#38bdf8', // sky-400
    bgLight: 'bg-sky-500/10 border-sky-500/25 text-sky-500',
    badgeClass: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
    description: 'Body weight is lower than standard epidemiological recommendations.',
  },
  {
    name: 'Normal Weight',
    min: 18.5,
    max: 24.99,
    color: '#10b981', // emerald-500
    bgLight: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-500',
    badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    description: 'Optimal epidemiological range associated with lowest all-cause metabolic risk.',
  },
  {
    name: 'Overweight',
    min: 25.0,
    max: 29.99,
    color: '#f59e0b', // amber-500
    bgLight: 'bg-amber-500/10 border-amber-500/25 text-amber-500',
    badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    description: 'Weight is above standard population averages. Often seen in muscular athletes.',
  },
  {
    name: 'Obese Class I',
    min: 30.0,
    max: 34.99,
    color: '#f97316', // orange-500
    bgLight: 'bg-orange-500/10 border-orange-500/25 text-orange-500',
    badgeClass: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30',
    description: 'Moderate excess body mass. Clinical body fat assessment recommended.',
  },
  {
    name: 'Obese Class II',
    min: 35.0,
    max: 39.99,
    color: '#ef4444', // red-500
    bgLight: 'bg-red-500/10 border-red-500/25 text-red-500',
    badgeClass: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
    description: 'Severe mass elevation. Health screening and body composition analysis advised.',
  },
  {
    name: 'Obese Class III',
    min: 40.0,
    max: 100,
    color: '#b91c1c', // red-700
    bgLight: 'bg-rose-500/10 border-rose-500/25 text-rose-500',
    badgeClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
    description: 'Very high epidemiological risk index. Comprehensive metabolic review recommended.',
  },
];

export const BmiCalculator: React.FC = () => {
  const [unit, setUnit] = useState<UnitSystem>('metric');

  // Metric states
  const [heightCm, setHeightCm] = useState<string>('178');
  const [weightKg, setWeightKg] = useState<string>('76');

  // Imperial states
  const [heightFt, setHeightFt] = useState<string>('5');
  const [heightIn, setHeightIn] = useState<string>('10');
  const [weightLbs, setWeightLbs] = useState<string>('168');

  // Validation errors
  const [errors, setErrors] = useState<{ height?: string; weight?: string }>({});

  const handleUnitToggle = (newUnit: UnitSystem) => {
    playClickSound(true);
    if (newUnit === unit) return;

    if (newUnit === 'imperial') {
      // Convert metric to imperial
      const cm = parseFloat(heightCm);
      const kg = parseFloat(weightKg);
      if (!isNaN(cm) && cm > 0) {
        const totalInches = cm / 2.54;
        const ft = Math.floor(totalInches / 12);
        const inch = Math.round(totalInches % 12);
        setHeightFt(ft.toString());
        setHeightIn(inch.toString());
      }
      if (!isNaN(kg) && kg > 0) {
        setWeightLbs((Math.round(kg * 2.20462 * 10) / 10).toString());
      }
    } else {
      // Convert imperial to metric
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      const lbs = parseFloat(weightLbs);
      const totalInches = ft * 12 + inch;
      if (totalInches > 0) {
        setHeightCm(Math.round(totalInches * 2.54).toString());
      }
      if (!isNaN(lbs) && lbs > 0) {
        setWeightKg((Math.round((lbs / 2.20462) * 10) / 10).toString());
      }
    }

    setUnit(newUnit);
    setErrors({});
  };

  // Perform calculation & validation
  const calculation = useMemo(() => {
    let totalHeightMeters = 0;
    let totalWeightKg = 0;
    let isValid = true;
    const currentErrors: { height?: string; weight?: string } = {};

    if (unit === 'metric') {
      const h = parseFloat(heightCm);
      const w = parseFloat(weightKg);

      if (isNaN(h) || h <= 0) {
        currentErrors.height = 'Please enter a valid height';
        isValid = false;
      } else if (h < 50 || h > 260) {
        currentErrors.height = 'Height must be between 50 cm and 260 cm';
        isValid = false;
      } else {
        totalHeightMeters = h / 100;
      }

      if (isNaN(w) || w <= 0) {
        currentErrors.weight = 'Please enter a valid weight';
        isValid = false;
      } else if (w < 20 || w > 350) {
        currentErrors.weight = 'Weight must be between 20 kg and 350 kg';
        isValid = false;
      } else {
        totalWeightKg = w;
      }
    } else {
      const ft = parseFloat(heightFt);
      const inch = parseFloat(heightIn);
      const w = parseFloat(weightLbs);

      if (isNaN(ft) || ft < 1 || ft > 8) {
        currentErrors.height = 'Feet must be between 1 and 8';
        isValid = false;
      }
      if (isNaN(inch) || inch < 0 || inch >= 12) {
        currentErrors.height = 'Inches must be between 0 and 11';
        isValid = false;
      }

      const totalInches = (ft || 0) * 12 + (inch || 0);
      if (totalInches < 20 || totalInches > 105) {
        currentErrors.height = 'Total height out of valid range';
        isValid = false;
      } else {
        totalHeightMeters = (totalInches * 2.54) / 100;
      }

      if (isNaN(w) || w <= 0) {
        currentErrors.weight = 'Please enter a valid weight';
        isValid = false;
      } else if (w < 40 || w > 750) {
        currentErrors.weight = 'Weight must be between 40 lbs and 750 lbs';
        isValid = false;
      } else {
        totalWeightKg = w / 2.20462;
      }
    }

    if (!isValid || totalHeightMeters <= 0 || totalWeightKg <= 0) {
      return {
        isValid: false,
        errors: currentErrors,
        bmi: null,
        category: null,
        healthyWeightMin: null,
        healthyWeightMax: null,
        gaugePercentage: 0,
      };
    }

    // BMI Formula: weight(kg) / [height(m)]^2
    const bmiVal = totalWeightKg / (totalHeightMeters * totalHeightMeters);
    const roundedBmi = Math.round(bmiVal * 10) / 10;

    // Find category
    const category =
      BMI_CATEGORIES.find((cat) => roundedBmi >= cat.min && roundedBmi <= cat.max) ||
      BMI_CATEGORIES[BMI_CATEGORIES.length - 1];

    // Healthy weight range (BMI 18.5 to 24.99)
    const minKg = 18.5 * (totalHeightMeters * totalHeightMeters);
    const maxKg = 24.99 * (totalHeightMeters * totalHeightMeters);

    let healthyMinStr = `${Math.round(minKg * 10) / 10} kg`;
    let healthyMaxStr = `${Math.round(maxKg * 10) / 10} kg`;

    if (unit === 'imperial') {
      healthyMinStr = `${Math.round(minKg * 2.20462)} lbs`;
      healthyMaxStr = `${Math.round(maxKg * 2.20462)} lbs`;
    }

    // Map BMI onto a visual gauge (scale 12 to 42 for pleasant display)
    const gaugeScaleMin = 14;
    const gaugeScaleMax = 42;
    const clampedBmi = Math.max(gaugeScaleMin, Math.min(gaugeScaleMax, roundedBmi));
    const gaugePercentage = ((clampedBmi - gaugeScaleMin) / (gaugeScaleMax - gaugeScaleMin)) * 100;

    return {
      isValid: true,
      errors: currentErrors,
      bmi: roundedBmi,
      category,
      healthyWeightMin: healthyMinStr,
      healthyWeightMax: healthyMaxStr,
      gaugePercentage,
      totalHeightMeters,
      totalWeightKg,
    };
  }, [unit, heightCm, weightKg, heightFt, heightIn, weightLbs]);

  const handleReset = () => {
    playPopSound(true);
    if (unit === 'metric') {
      setHeightCm('');
      setWeightKg('');
    } else {
      setHeightFt('');
      setHeightIn('');
      setWeightLbs('');
    }
    setErrors({});
  };

  const applyPreset = (preset: 'lean' | 'average' | 'muscular') => {
    playClickSound(true);
    if (unit === 'metric') {
      if (preset === 'lean') {
        setHeightCm('180');
        setWeightKg('68');
      } else if (preset === 'average') {
        setHeightCm('175');
        setWeightKg('75');
      } else {
        setHeightCm('178');
        setWeightKg('92'); // muscular athlete
      }
    } else {
      if (preset === 'lean') {
        setHeightFt('5');
        setHeightIn('11');
        setWeightLbs('150');
      } else if (preset === 'average') {
        setHeightFt('5');
        setHeightIn('9');
        setWeightLbs('165');
      } else {
        setHeightFt('5');
        setHeightIn('10');
        setWeightLbs('202'); // muscular athlete
      }
    }
  };

  return (
    <div className="space-y-10">
      {/* ========================================================= */}
      {/* MAIN TWO-COLUMN CALCULATOR CARD                           */}
      {/* ========================================================= */}
      <div className="rounded-3xl bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden transition-all">
        {/* Top Header / Unit Toggle Bar */}
        <div className="p-6 sm:p-8 border-b border-zinc-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50/70 dark:bg-zinc-900/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Scale className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                Body Mass Index Calculator
              </h2>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans">
              Enter height and body weight to screen BMI and explore optimal weight ranges.
            </p>
          </div>

          {/* Unit Toggle Tabs */}
          <div className="inline-flex items-center p-1 bg-zinc-200/80 dark:bg-zinc-800/90 rounded-2xl self-start sm:self-auto border border-zinc-300/60 dark:border-zinc-700/60">
            <button
              type="button"
              onClick={() => handleUnitToggle('metric')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                unit === 'metric'
                  ? 'bg-white dark:bg-zinc-900 text-amber-500 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Metric (cm / kg)
            </button>
            <button
              type="button"
              onClick={() => handleUnitToggle('imperial')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                unit === 'imperial'
                  ? 'bg-white dark:bg-zinc-900 text-amber-500 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Imperial (ft / in / lbs)
            </button>
          </div>
        </div>

        {/* Inputs & Results Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ========================================================= */}
          {/* LEFT: INPUTS FORM (5 Columns on Large)                    */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold block">
                // Measurement Inputs
              </span>

              {/* Height Field */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-semibold uppercase text-zinc-700 dark:text-zinc-300">
                  Height {unit === 'metric' ? '(Centimeters)' : '(Feet & Inches)'}
                </label>

                {unit === 'metric' ? (
                  <div className="relative">
                    <input
                      type="number"
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value)}
                      placeholder="e.g. 178"
                      min={50}
                      max={260}
                      step={0.5}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-base font-mono font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">
                      cm
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <input
                        type="number"
                        value={heightFt}
                        onChange={(e) => setHeightFt(e.target.value)}
                        placeholder="e.g. 5"
                        min={1}
                        max={8}
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-base font-mono font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">
                        ft
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={heightIn}
                        onChange={(e) => setHeightIn(e.target.value)}
                        placeholder="e.g. 10"
                        min={0}
                        max={11}
                        step={0.5}
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-base font-mono font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">
                        in
                      </span>
                    </div>
                  </div>
                )}
                {calculation.errors?.height && (
                  <p className="text-[11px] font-mono text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {calculation.errors.height}
                  </p>
                )}
              </div>

              {/* Weight Field */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-semibold uppercase text-zinc-700 dark:text-zinc-300">
                  Weight {unit === 'metric' ? '(Kilograms)' : '(Pounds)'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={unit === 'metric' ? weightKg : weightLbs}
                    onChange={(e) =>
                      unit === 'metric' ? setWeightKg(e.target.value) : setWeightLbs(e.target.value)
                    }
                    placeholder={unit === 'metric' ? 'e.g. 76' : 'e.g. 168'}
                    min={20}
                    max={750}
                    step={0.5}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-base font-mono font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">
                    {unit === 'metric' ? 'kg' : 'lbs'}
                  </span>
                </div>
                {calculation.errors?.weight && (
                  <p className="text-[11px] font-mono text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {calculation.errors.weight}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Test Presets */}
            <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block">
                Quick Example Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset('average')}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition cursor-pointer"
                >
                  Standard Population
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('lean')}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition cursor-pointer"
                >
                  Endurance / Lean
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('muscular')}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 transition cursor-pointer"
                >
                  Muscular Lifter
                </button>
              </div>
            </div>

            {/* Reset Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear Inputs
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT: RESULTS DISPLAY & VISUAL GAUGE (7 Columns)         */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6 lg:border-l lg:border-zinc-200 lg:dark:border-zinc-800 lg:pl-8">
            {calculation.isValid && calculation.bmi && calculation.category ? (
              <div className="space-y-6">
                {/* Result Score Card */}
                <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                        Calculated Body Mass Index
                      </span>
                      <div className="flex items-baseline gap-3 mt-1">
                        <span className="text-5xl sm:text-6xl font-display font-black tracking-tight text-zinc-900 dark:text-white">
                          {calculation.bmi}
                        </span>
                        <span className="text-sm font-mono text-zinc-500 font-semibold">kg/m²</span>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <span
                        className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase border ${calculation.category.badgeClass}`}
                      >
                        {calculation.category.name}
                      </span>
                      <p className="text-[11px] text-zinc-500 font-sans mt-1">
                        WHO Reference Standard
                      </p>
                    </div>
                  </div>

                  {/* VISUAL SPECTRUM GAUGE */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase">
                      <span>Underweight (&lt;18.5)</span>
                      <span>Normal (18.5-24.9)</span>
                      <span>Overweight (25-29.9)</span>
                      <span>Obese (30+)</span>
                    </div>

                    {/* Gradient colored spectrum bar */}
                    <div className="relative h-4 rounded-full w-full bg-gradient-to-r from-sky-400 via-emerald-400 via-amber-400 via-orange-500 to-rose-600 shadow-inner overflow-hidden">
                      {/* Sub-bands separators */}
                      <div className="absolute top-0 bottom-0 left-[16%] w-0.5 bg-black/25" />
                      <div className="absolute top-0 bottom-0 left-[39%] w-0.5 bg-black/25" />
                      <div className="absolute top-0 bottom-0 left-[57%] w-0.5 bg-black/25" />
                      <div className="absolute top-0 bottom-0 left-[75%] w-0.5 bg-black/25" />
                    </div>

                    {/* Needle Indicator */}
                    <div className="relative w-full h-5">
                      <div
                        className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                        style={{ left: `${calculation.gaugePercentage}%` }}
                      >
                        <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[8px] border-b-zinc-900 dark:border-b-white" />
                        <span className="text-[10px] font-mono font-black text-zinc-900 dark:text-white mt-0.5">
                          {calculation.bmi}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Healthy Weight Target Range */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-zinc-850 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono font-bold uppercase text-zinc-500 block">
                          Epidemiological Healthy Range for Your Height:
                        </span>
                        <span className="text-xs sm:text-sm font-mono font-bold text-zinc-900 dark:text-white">
                          {calculation.healthyWeightMin} — {calculation.healthyWeightMax}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category description */}
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                  <strong>Assessment:</strong> {calculation.category.description}
                </p>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-3">
                <div className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-850 text-zinc-400">
                  <Scale className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold uppercase text-zinc-700 dark:text-zinc-300">
                  Enter Valid Measurements
                </h3>
                <p className="text-xs text-zinc-500 font-sans max-w-xs">
                  Fill in your height and weight on the left to calculate your BMI and visualize your position across the spectrum.
                </p>
              </div>
            )}

            {/* Quick Cross-Link to PPL Tracker */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <Link
                href="/tools/ppl-tracker"
                className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500 text-black">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-display font-bold uppercase text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors block">
                      Ready to build dense muscle mass?
                    </span>
                    <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-sans">
                      Launch the 6-day PPL Progressive Overload Hypertrophy Tracker.
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ATHLETE CAVEAT SECTION: MUSCLE VS. FAT                    */}
      {/* ========================================================= */}
      <section className="rounded-3xl bg-amber-500/5 dark:bg-amber-500/[0.03] border border-amber-500/20 p-6 sm:p-8 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 shrink-0 mt-0.5 border border-amber-500/20">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-display font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                Critical Note for Resistance Athletes & Bodybuilders
              </h3>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/25">
                Screening Limitation
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-sans leading-relaxed">
              Body Mass Index is an epidemiological screening metric that solely divides total mass by height squared (kg/m²). It <strong>does not directly measure body fat percentage</strong>, nor does it distinguish between skeletal muscle tissue, bone mineral density, and adipose fat mass.
            </p>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-sans leading-relaxed">
              A trained athlete with 10%–12% body fat who has accumulated significant muscular hypertrophy (e.g., heavily developed quadriceps, back, and pectorals) will frequently register an &quot;Overweight&quot; or even &quot;Obese&quot; BMI score despite outstanding cardiovascular conditioning and low visceral fat. For competitive lifters, combine BMI with waist circumference, caliper skinfolds, or DEXA scans.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* BMI REFERENCE TABLE GRID                                  */}
      {/* ========================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-display font-bold uppercase tracking-tight text-zinc-900 dark:text-white">
            World Health Organization (WHO) BMI Classification
          </h3>
          <span className="text-xs font-mono text-zinc-500">Standard Population Criteria</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BMI_CATEGORIES.map((cat, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-zinc-900 dark:text-white">
                  {cat.name}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${cat.badgeClass}`}>
                  {cat.min === 0 ? '< 18.5' : cat.max === 100 ? '≥ 40.0' : `${cat.min} – ${cat.max}`}
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                {cat.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

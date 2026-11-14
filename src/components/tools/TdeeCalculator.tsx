'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Activity,
  RotateCcw,
  AlertCircle,
  Flame,
  ArrowRight,
  CheckCircle2,
  Scale,
} from 'lucide-react';
import { calculateTdeeAndMacros } from '../../utils/helpers';
import { playClickSound, playPopSound } from '../../utils/audio';
import { useAuth } from '../../context/AuthContext';
import { AthleteSyncBanner, getSharedToolMetrics, updateSharedToolMetrics } from './AthleteSyncBanner';

type UnitSystem = 'metric' | 'imperial';
type GoalId = 'aggressive-cut' | 'moderate-cut' | 'recomp' | 'lean-bulk' | 'hypertrophy-bulk';
type MacroPresetId = 'balanced' | 'high-protein' | 'performance' | 'low-carb';

const ACTIVITY_LEVELS = [
  { value: 1.2, label: 'Sedentary (Desk Job)', desc: 'Little to no formal exercise; < 4,000 steps/day' },
  { value: 1.375, label: 'Lightly Active (1–2 Days/Wk)', desc: 'Light resistance training or 6,000+ daily steps' },
  { value: 1.55, label: 'Moderately Active (3–5 Days/Wk)', desc: '4-day Upper/Lower or 3-day Full Body split' },
  { value: 1.725, label: 'Very Active (6-Day PPL Lifter)', desc: 'Intense 6-day Push/Pull/Legs hypertrophy routine' },
  { value: 1.9, label: 'Hybrid Athlete (2-a-Days)', desc: 'Heavy resistance training + daily Zone 2 / endurance' },
];

const GOAL_PRESETS: Array<{ id: GoalId; label: string; pct: number; tag: string }> = [
  { id: 'aggressive-cut', label: 'Mini-Cut (−20%)', pct: -0.2, tag: 'Rapid Fat Loss' },
  { id: 'moderate-cut', label: 'Sustainable Cut (−15%)', pct: -0.15, tag: 'Max Muscle Retention' },
  { id: 'recomp', label: 'Maintenance / Recomp (0%)', pct: 0, tag: 'Body Recomposition' },
  { id: 'lean-bulk', label: 'Lean Bulk (+10%)', pct: 0.1, tag: 'Clean Hypertrophy' },
  { id: 'hypertrophy-bulk', label: 'Mass Surplus (+15%)', pct: 0.15, tag: 'Max Strength & Size' },
];

const MACRO_PRESETS: Record<
  MacroPresetId,
  { label: string; proteinPct: number; carbsPct: number; fatPct: number; desc: string }
> = {
  balanced: {
    label: 'Balanced Hypertrophy (30P / 45C / 25F)',
    proteinPct: 30,
    carbsPct: 45,
    fatPct: 25,
    desc: 'Optimal glycogen replenishment & muscle protein synthesis',
  },
  'high-protein': {
    label: 'High-Protein Cut (35P / 40C / 25F)',
    proteinPct: 35,
    carbsPct: 40,
    fatPct: 25,
    desc: 'Elevated protein satiety to protect lean mass in a caloric deficit',
  },
  performance: {
    label: 'High-Carb Volume (25P / 55C / 20F)',
    proteinPct: 25,
    carbsPct: 55,
    fatPct: 20,
    desc: 'Maximizes glycolytic output for 6-day PPL & hybrid athletes',
  },
  'low-carb': {
    label: 'Lower-Carb Metabolic (35P / 25C / 40F)',
    proteinPct: 35,
    carbsPct: 25,
    fatPct: 40,
    desc: 'Higher dietary fat allocation for insulin-sensitive lifters',
  },
};

export const TdeeCalculator: React.FC = () => {
  const { user } = useAuth();
  const [isForOthers, setIsForOthers] = useState(false);
  const [unit, setUnit] = useState<UnitSystem>('metric');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<string>('27');
  const [heightCm, setHeightCm] = useState<string>('178');
  const [heightFt, setHeightFt] = useState<string>('5');
  const [heightIn, setHeightIn] = useState<string>('10');
  const [weightKg, setWeightKg] = useState<string>('78');
  const [weightLbs, setWeightLbs] = useState<string>('172');
  const [bodyFatInput, setBodyFatInput] = useState<string>('');
  const [activityMultiplier, setActivityMultiplier] = useState<number>(1.55);
  const [goalId, setGoalId] = useState<GoalId>('lean-bulk');
  const [macroPreset, setMacroPreset] = useState<MacroPresetId>('balanced');

  // Auto-sync from logged-in user's profile and shared FFMI metrics when in "My Profile" mode
  useEffect(() => {
    if (isForOthers) return;
    const shared = getSharedToolMetrics();
    if (user?.gender) setSex(user.gender);
    if (user?.age) setAge(String(user.age));
    if (user?.bodyFatPct) setBodyFatInput(String(user.bodyFatPct));
    else if (shared.bodyFatPct) setBodyFatInput(String(shared.bodyFatPct));

    if (user?.fitnessGoal === 'Cutting') {
      setGoalId('moderate-cut');
      setMacroPreset('high-protein');
    } else if (user?.fitnessGoal === 'Body Recomposition') {
      setGoalId('recomp');
    } else if (user?.fitnessGoal === 'Hypertrophy') {
      setGoalId('lean-bulk');
    }

    if (user?.preferredUnit === 'lbs') {
      setUnit('imperial');
      if (user.height) {
        const totalIn = user.height / 2.54;
        setHeightFt(String(Math.floor(totalIn / 12)));
        setHeightIn(String(Math.round(totalIn % 12)));
        setHeightCm(String(user.height));
      }
      if (user.weight) {
        setWeightLbs(String(user.weight));
        setWeightKg(String(Math.round((user.weight / 2.20462) * 10) / 10));
      }
    } else if (user) {
      setUnit('metric');
      if (user.height) {
        setHeightCm(String(user.height));
        const totalIn = user.height / 2.54;
        setHeightFt(String(Math.floor(totalIn / 12)));
        setHeightIn(String(Math.round(totalIn % 12)));
      }
      if (user.weight) {
        setWeightKg(String(user.weight));
        setWeightLbs(String(Math.round(user.weight * 2.20462 * 10) / 10));
      }
    }
  }, [user, isForOthers]);

  const handleToggleForOthers = (forOthers: boolean) => {
    setIsForOthers(forOthers);
    if (forOthers) {
      setSex('male');
      setAge('25');
      setHeightCm('175');
      setWeightKg('75');
      setHeightFt('5');
      setHeightIn('9');
      setWeightLbs('165');
      setBodyFatInput('');
    }
  };

  const [touched, setTouched] = useState<{ age: boolean; height: boolean; weight: boolean }>({
    age: false,
    height: false,
    weight: false,
  });

  const handleUnitToggle = (nextUnit: UnitSystem) => {
    if (nextUnit === unit) return;
    playClickSound(true);
    if (nextUnit === 'imperial') {
      const cm = parseFloat(heightCm);
      const kg = parseFloat(weightKg);
      if (!Number.isNaN(cm) && cm > 0) {
        const totalIn = cm / 2.54;
        setHeightFt(String(Math.floor(totalIn / 12)));
        setHeightIn(String(Math.round(totalIn % 12)));
      }
      if (!Number.isNaN(kg) && kg > 0) {
        setWeightLbs(String(Math.round(kg * 2.20462)));
      }
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      const lbs = parseFloat(weightLbs);
      if (ft * 12 + inch > 0) {
        setHeightCm(String(Math.round((ft * 12 + inch) * 2.54)));
      }
      if (!Number.isNaN(lbs) && lbs > 0) {
        setWeightKg(String(Math.round((lbs / 2.20462) * 10) / 10));
      }
    }
    setUnit(nextUnit);
    setTouched({ age: false, height: false, weight: false });
  };

  const validation = useMemo(() => {
    const parsedAge = parseInt(age, 10);
    const errors: { age?: string; height?: string; weight?: string } = {};

    if (Number.isNaN(parsedAge) || parsedAge < 14 || parsedAge > 100) {
      errors.age = 'Enter an age between 14 and 100 years.';
    }

    let resolvedHeightCm = 178;
    let resolvedWeightKg = 78;

    if (unit === 'metric') {
      const h = parseFloat(heightCm);
      const w = parseFloat(weightKg);
      if (Number.isNaN(h) || h < 100 || h > 250) {
        errors.height = 'Enter a height between 100 and 250 cm.';
      } else {
        resolvedHeightCm = h;
      }
      if (Number.isNaN(w) || w < 30 || w > 300) {
        errors.weight = 'Enter a weight between 30 and 300 kg.';
      } else {
        resolvedWeightKg = w;
      }
    } else {
      const ft = parseFloat(heightFt);
      const inch = parseFloat(heightIn) || 0;
      const w = parseFloat(weightLbs);
      if (Number.isNaN(ft) || ft < 3 || ft > 8 || inch < 0 || inch >= 12) {
        errors.height = 'Enter a valid height (3–8 ft, 0–11 in).';
      } else {
        resolvedHeightCm = (ft * 12 + inch) * 2.54;
      }
      if (Number.isNaN(w) || w < 66 || w > 660) {
        errors.weight = 'Enter a weight between 66 and 660 lbs.';
      } else {
        resolvedWeightKg = w / 2.20462;
      }
    }

    const bf = bodyFatInput.trim() === '' ? undefined : parseFloat(bodyFatInput);

    return {
      isValid: !errors.age && !errors.height && !errors.weight,
      age: Number.isNaN(parsedAge) ? 27 : parsedAge,
      heightCm: resolvedHeightCm,
      weightKg: resolvedWeightKg,
      bodyFatPct: bf !== undefined && !Number.isNaN(bf) ? bf : undefined,
      errors,
    };
  }, [age, heightCm, heightFt, heightIn, weightKg, weightLbs, bodyFatInput, unit]);

  const result = useMemo(() => {
    const activeGoal = GOAL_PRESETS.find((g) => g.id === goalId) || GOAL_PRESETS[2];
    const activeMacro = MACRO_PRESETS[macroPreset];
    return calculateTdeeAndMacros({
      sex,
      age: validation.age,
      heightCm: validation.heightCm,
      weightKg: validation.weightKg,
      activityMultiplier,
      goalAdjustmentPct: activeGoal.pct,
      macroSplit: activeMacro,
      bodyFatPct: validation.bodyFatPct,
    });
  }, [sex, validation, activityMultiplier, goalId, macroPreset]);

  const showAgeError = touched.age && !!validation.errors.age;
  const showHeightError = touched.height && !!validation.errors.height;
  const showWeightError = touched.weight && !!validation.errors.weight;

  useEffect(() => {
    if (!isForOthers) {
      updateSharedToolMetrics({ targetCalories: result.targetCalories });
    }
  }, [result.targetCalories, isForOthers]);

  return (
    <div className="space-y-6">
      <AthleteSyncBanner
        toolName="TDEE & Macros"
        isForOthers={isForOthers}
        onToggleMode={handleToggleForOthers}
        profilePayloadToSave={{
          gender: sex,
          age: validation.age,
          height: Math.round(validation.heightCm * 10) / 10,
          weight: unit === 'metric' ? Math.round(validation.weightKg * 10) / 10 : Math.round(validation.weightKg * 2.20462 * 10) / 10,
          bodyFatPct: validation.bodyFatPct,
          preferredUnit: unit === 'metric' ? 'kg' : 'lbs',
        }}
        syncedFieldsSummary={`Using ${result.formulaUsed} (${sex === 'male' ? 'Male' : 'Female'}, ${validation.age} yrs, ${
          validation.bodyFatPct ? `${validation.bodyFatPct}% BF synced from FFMI/Profile` : 'Standard anthropometrics'
        }).`}
        quickLinks={[
          { label: 'FFMI Body Comp', href: '/tools/ffmi-calculator' },
          { label: 'BMI Calculator', href: '/tools/bmi-calculator' },
        ]}
      />
      <div className="rounded-3xl card-bento overflow-hidden shadow-xl">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-elevated)]/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20">
                <Activity className="w-5 h-5" aria-hidden="true" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[var(--text-primary)]">
                TDEE & Macronutrient Split Calculator
              </h2>
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-sans">
              Mifflin-St Jeor & Katch-McArdle daily energy expenditure calibrated for resistance athletes.
            </p>
          </div>

          <div
            role="group"
            aria-label="Measurement unit system"
            className="inline-flex items-center p-1 bg-[var(--bg-elevated)] rounded-2xl self-start sm:self-auto border border-[var(--border-subtle)]"
          >
            <button
              type="button"
              onClick={() => handleUnitToggle('metric')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                unit === 'metric'
                  ? 'bg-[var(--accent-primary)] text-black shadow-sm font-black'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Metric (cm / kg)
            </button>
            <button
              type="button"
              onClick={() => handleUnitToggle('imperial')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                unit === 'imperial'
                  ? 'bg-[var(--accent-primary)] text-black shadow-sm font-black'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Imperial (ft / lbs)
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Biometric & Activity Inputs */}
          <div className="lg:col-span-5 space-y-5">
            {/* Sex & Age Row */}
            <div className="grid grid-cols-2 gap-3">
              <fieldset className="space-y-1.5">
                <legend className="text-xs font-mono font-semibold uppercase text-[var(--text-secondary)]">
                  Biological Sex
                </legend>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)]">
                  {(['male', 'female'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        playPopSound(true);
                        setSex(s);
                      }}
                      className={`py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition cursor-pointer ${
                        sex === s
                          ? 'bg-[var(--accent-primary)] text-black font-black'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="space-y-1.5">
                <label
                  htmlFor="tdee-age-input"
                  className="block text-xs font-mono font-semibold uppercase text-[var(--text-secondary)]"
                >
                  Age (Years)
                </label>
                <input
                  id="tdee-age-input"
                  name="age"
                  type="number"
                  min={14}
                  max={100}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, age: true }))}
                  aria-invalid={showAgeError ? 'true' : 'false'}
                  aria-describedby={showAgeError ? 'tdee-age-error' : undefined}
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl text-base font-mono font-bold tabular-nums text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
                {showAgeError && (
                  <p id="tdee-age-error" role="alert" className="text-[11px] font-mono text-rose-400">
                    {validation.errors.age}
                  </p>
                )}
              </div>
            </div>

            {/* Height & Weight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor={unit === 'metric' ? 'tdee-height-cm' : 'tdee-height-ft'}
                  className="block text-xs font-mono font-semibold uppercase text-[var(--text-secondary)]"
                >
                  Height ({unit === 'metric' ? 'cm' : 'ft / in'})
                </label>
                {unit === 'metric' ? (
                  <input
                    id="tdee-height-cm"
                    name="heightCm"
                    type="number"
                    min={100}
                    max={250}
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, height: true }))}
                    aria-invalid={showHeightError ? 'true' : 'false'}
                    aria-describedby={showHeightError ? 'tdee-height-error' : undefined}
                    className="w-full px-3.5 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl text-base font-mono font-bold tabular-nums text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      id="tdee-height-ft"
                      name="heightFt"
                      type="number"
                      min={3}
                      max={8}
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value)}
                      aria-label="Height feet"
                      className="w-full px-3 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl text-base font-mono font-bold tabular-nums text-[var(--text-primary)]"
                    />
                    <input
                      id="tdee-height-in"
                      name="heightIn"
                      type="number"
                      min={0}
                      max={11}
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value)}
                      aria-label="Height inches"
                      className="w-full px-3 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl text-base font-mono font-bold tabular-nums text-[var(--text-primary)]"
                    />
                  </div>
                )}
                {showHeightError && (
                  <p id="tdee-height-error" role="alert" className="text-[11px] font-mono text-rose-400">
                    {validation.errors.height}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="tdee-weight-input"
                  className="block text-xs font-mono font-semibold uppercase text-[var(--text-secondary)]"
                >
                  Body Weight ({unit === 'metric' ? 'kg' : 'lbs'})
                </label>
                <input
                  id="tdee-weight-input"
                  name="weight"
                  type="number"
                  step="0.5"
                  value={unit === 'metric' ? weightKg : weightLbs}
                  onChange={(e) =>
                    unit === 'metric' ? setWeightKg(e.target.value) : setWeightLbs(e.target.value)
                  }
                  onBlur={() => setTouched((prev) => ({ ...prev, weight: true }))}
                  aria-invalid={showWeightError ? 'true' : 'false'}
                  aria-describedby={showWeightError ? 'tdee-weight-error' : undefined}
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl text-base font-mono font-bold tabular-nums text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
                {showWeightError && (
                  <p id="tdee-weight-error" role="alert" className="text-[11px] font-mono text-rose-400">
                    {validation.errors.weight}
                  </p>
                )}
              </div>
            </div>

            {/* Optional Body Fat % (Switches to Katch-McArdle) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="tdee-bodyfat-input"
                  className="text-xs font-mono font-semibold uppercase text-[var(--text-secondary)]"
                >
                  Body Fat % (Optional — Enables Katch-McArdle)
                </label>
                <span className="text-[10px] font-mono text-[var(--accent-primary)]">
                  Using: {result.formulaUsed}
                </span>
              </div>
              <input
                id="tdee-bodyfat-input"
                name="bodyFatPct"
                type="number"
                min={4}
                max={55}
                step={0.5}
                value={bodyFatInput}
                onChange={(e) => setBodyFatInput(e.target.value)}
                placeholder="Leave blank for Mifflin-St Jeor (e.g. 14)"
                className="w-full px-3.5 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl text-sm font-mono tabular-nums text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            {/* Activity Multiplier */}
            <div className="space-y-1.5">
              <label
                htmlFor="tdee-activity-select"
                className="block text-xs font-mono font-semibold uppercase text-[var(--text-secondary)]"
              >
                Weekly Training & Activity Volume
              </label>
              <select
                id="tdee-activity-select"
                value={activityMultiplier}
                onChange={(e) => setActivityMultiplier(parseFloat(e.target.value))}
                className="w-full px-3.5 py-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl text-xs font-mono font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              >
                {ACTIVITY_LEVELS.map((act) => (
                  <option key={act.value} value={act.value}>
                    {act.label} — {act.desc}
                  </option>
                ))}
              </select>
            </div>

            {/* Goal Phase Selector */}
            <fieldset className="space-y-2">
              <legend className="text-xs font-mono font-semibold uppercase text-[var(--text-secondary)]">
                Caloric Phase Goal
              </legend>
              <div className="grid grid-cols-1 gap-1.5">
                {GOAL_PRESETS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      playPopSound(true);
                      setGoalId(g.id);
                    }}
                    className={`p-2.5 px-3.5 rounded-xl border text-left flex items-center justify-between text-xs font-mono transition cursor-pointer ${
                      goalId === g.id
                        ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)] text-[var(--text-primary)] font-bold'
                        : 'bg-[var(--bg-elevated)]/60 border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span>{g.label}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-card)] text-[var(--accent-primary)] border border-[var(--border-subtle)]">
                      {g.tag}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          {/* RIGHT: BMR, TDEE, Target Calories & Macro Breakdown */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Energy Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
                  Basal Metabolic Rate (BMR)
                </span>
                <div className="text-2xl sm:text-3xl font-display font-black text-[var(--text-primary)] font-mono tabular-nums">
                  {result.bmr.toLocaleString()} <span className="text-xs text-[var(--text-muted)]">kcal</span>
                </div>
                <span className="text-[11px] text-[var(--text-muted)] font-sans block">
                  Resting coma energy baseline
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
                  Maintenance TDEE
                </span>
                <div className="text-2xl sm:text-3xl font-display font-black text-[#36D6B0] font-mono tabular-nums">
                  {result.tdee.toLocaleString()} <span className="text-xs text-[var(--text-muted)]">kcal</span>
                </div>
                <span className="text-[11px] text-[var(--text-muted)] font-sans block">
                  Iso-caloric daily expenditure
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/40 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent-primary)] font-bold block">
                  Target Daily Intake
                </span>
                <div className="text-2xl sm:text-3xl font-display font-black text-[var(--text-primary)] font-mono tabular-nums">
                  {result.targetCalories.toLocaleString()}{' '}
                  <span className="text-xs text-[var(--accent-primary)]">kcal</span>
                </div>
                <span className="text-[11px] text-[var(--text-secondary)] font-mono block">
                  {GOAL_PRESETS.find((g) => g.id === goalId)?.label}
                </span>
              </div>
            </div>

            {/* Macro Split Preset Selector */}
            <div className="space-y-3">
              <label
                htmlFor="tdee-macro-preset"
                className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]"
              >
                Select Macronutrient Split Architecture
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(Object.keys(MACRO_PRESETS) as MacroPresetId[]).map((key) => {
                  const preset = MACRO_PRESETS[key];
                  const isSelected = macroPreset === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        playPopSound(true);
                        setMacroPreset(key);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]'
                          : 'bg-[var(--bg-elevated)]/60 border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                      }`}
                    >
                      <div className="text-xs font-mono font-bold text-[var(--text-primary)]">
                        {preset.label}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] font-sans mt-0.5">
                        {preset.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Macronutrient Grams & Calories Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono tabular-nums">
              <div className="p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-[#B7FF4A]">Protein ({result.proteinPct}%)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B7FF4A]/10 text-[#B7FF4A]">
                    {result.proteinPerKg} g/kg
                  </span>
                </div>
                <div className="text-3xl font-display font-black text-[var(--text-primary)]">
                  {result.proteinGrams}g
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  {result.proteinCalories} kcal • 4 kcal/g
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-sky-400">Carbohydrates ({result.carbsPct}%)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400">
                    Glycogen Fuel
                  </span>
                </div>
                <div className="text-3xl font-display font-black text-[var(--text-primary)]">
                  {result.carbsGrams}g
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  {result.carbsCalories} kcal • 4 kcal/g
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-amber-400">Dietary Fats ({result.fatPct}%)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">
                    Endocrine Support
                  </span>
                </div>
                <div className="text-3xl font-display font-black text-[var(--text-primary)]">
                  {result.fatGrams}g
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  {result.fatCalories} kcal • 9 kcal/g
                </div>
              </div>
            </div>

            {/* Meal Distribution Table */}
            <div
              className="table-responsive-region rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]"
              tabIndex={0}
              role="region"
              aria-label="Per-meal macronutrient distribution table"
            >
              <table className="w-full text-left text-xs font-mono border-collapse tabular-nums">
                <caption className="visually-hidden">
                  Daily macronutrient breakdown across 3, 4, and 5 meals per day
                </caption>
                <thead className="bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] text-[10px] uppercase text-[var(--text-muted)]">
                  <tr>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Meal Frequency</th>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Calories / Meal</th>
                    <th scope="col" className="py-3 px-4 font-bold text-[#B7FF4A]">Protein / Meal</th>
                    <th scope="col" className="py-3 px-4 font-bold text-sky-400">Carbs / Meal</th>
                    <th scope="col" className="py-3 px-4 font-bold text-amber-400">Fat / Meal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {[3, 4, 5].map((meals) => (
                    <tr key={meals} className={meals === 4 ? 'bg-[var(--accent-primary)]/5 font-bold' : ''}>
                      <th scope="row" className="py-3 px-4 text-[var(--text-primary)]">
                        {meals} Meals / Day {meals === 4 && '(Optimal MPS)'}
                      </th>
                      <td className="py-3 px-4 text-[var(--text-secondary)]">
                        {Math.round(result.targetCalories / meals)} kcal
                      </td>
                      <td className="py-3 px-4 text-[#B7FF4A]">{Math.round(result.proteinGrams / meals)}g</td>
                      <td className="py-3 px-4 text-sky-400">{Math.round(result.carbsGrams / meals)}g</td>
                      <td className="py-3 px-4 text-amber-400">{Math.round(result.fatGrams / meals)}g</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                Pair your {result.targetCalories.toLocaleString()} kcal nutrition target with structured mechanical tension:{' '}
                <Link href="/tools/ppl-tracker" className="text-[var(--accent-primary)] font-bold hover:underline">
                  record your training volume in PPL Tracker
                </Link>{' '}
                to ensure surplus calories partition into skeletal muscle.
              </p>
              <Link
                href="/tools/ppl-tracker"
                className="px-4 py-2.5 rounded-xl bg-[var(--accent-primary)] text-black font-mono font-bold text-xs uppercase tracking-wider whitespace-nowrap inline-flex items-center gap-1.5 btn-tactile shrink-0"
              >
                <span>Open Workout Tracker</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { calculateFfmiMetrics } from '@/utils/helpers';
import { useAuth } from '@/context/AuthContext';
import { AthleteSyncBanner, updateSharedToolMetrics } from './AthleteSyncBanner';

export default function FfmiCalculator() {
  const { user } = useAuth();
  const [isForOthers, setIsForOthers] = useState(false);
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [sex, setSex] = useState<'male' | 'female'>('male');

  // Metric inputs
  const [heightCmInput, setHeightCmInput] = useState<string>('178');
  const [weightKgInput, setWeightKgInput] = useState<string>('82');

  // Imperial inputs
  const [heightFtInput, setHeightFtInput] = useState<string>('5');
  const [heightInInput, setHeightInInput] = useState<string>('10');
  const [weightLbsInput, setWeightLbsInput] = useState<string>('181');

  // Body fat % input
  const [bodyFatInput, setBodyFatInput] = useState<string>('14');

  // Auto-sync from logged-in user's profile when in "My Profile" mode
  useEffect(() => {
    if (!user || isForOthers) return;
    if (user.gender) setSex(user.gender);
    if (user.bodyFatPct) setBodyFatInput(String(user.bodyFatPct));
    if (user.preferredUnit === 'lbs') {
      setUnitSystem('imperial');
      if (user.height) {
        const totalIn = user.height / 2.54;
        setHeightFtInput(String(Math.floor(totalIn / 12)));
        setHeightInInput(String(Math.round(totalIn % 12)));
        setHeightCmInput(String(user.height));
      }
      if (user.weight) {
        setWeightLbsInput(String(user.weight));
        setWeightKgInput(String(Math.round((user.weight / 2.20462) * 10) / 10));
      }
    } else {
      setUnitSystem('metric');
      if (user.height) {
        setHeightCmInput(String(user.height));
        const totalIn = user.height / 2.54;
        setHeightFtInput(String(Math.floor(totalIn / 12)));
        setHeightInInput(String(Math.round(totalIn % 12)));
      }
      if (user.weight) {
        setWeightKgInput(String(user.weight));
        setWeightLbsInput(String(Math.round(user.weight * 2.20462 * 10) / 10));
      }
    }
  }, [user, isForOthers]);

  const handleToggleForOthers = (forOthers: boolean) => {
    setIsForOthers(forOthers);
    if (forOthers) {
      setSex('male');
      setHeightCmInput('175');
      setWeightKgInput('78');
      setHeightFtInput('5');
      setHeightInInput('9');
      setWeightLbsInput('172');
      setBodyFatInput('15');
    }
  };

  // Post-interaction validation states
  const [touchedHeight, setTouchedHeight] = useState(false);
  const [touchedWeight, setTouchedWeight] = useState(false);
  const [touchedBf, setTouchedBf] = useState(false);

  const handleUnitSwitch = (nextUnit: 'metric' | 'imperial') => {
    if (nextUnit === unitSystem) return;
    if (nextUnit === 'imperial') {
      const cm = parseFloat(heightCmInput);
      const kg = parseFloat(weightKgInput);
      if (Number.isFinite(cm) && cm > 0) {
        const totalInches = cm / 2.54;
        const ft = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches - ft * 12);
        setHeightFtInput(String(inches === 12 ? ft + 1 : ft));
        setHeightInInput(String(inches === 12 ? 0 : inches));
      }
      if (Number.isFinite(kg) && kg > 0) {
        setWeightLbsInput(String(Math.round(kg * 2.20462 * 10) / 10));
      }
    } else {
      const ft = parseFloat(heightFtInput) || 0;
      const inches = parseFloat(heightInInput) || 0;
      const totalInches = ft * 12 + inches;
      const lbs = parseFloat(weightLbsInput);
      if (totalInches > 0) {
        setHeightCmInput(String(Math.round(totalInches * 2.54 * 10) / 10));
      }
      if (Number.isFinite(lbs) && lbs > 0) {
        setWeightKgInput(String(Math.round((lbs / 2.20462) * 10) / 10));
      }
    }
    setUnitSystem(nextUnit);
  };

  const parsedHeightCm = useMemo(() => {
    if (unitSystem === 'metric') {
      return parseFloat(heightCmInput);
    }
    const ft = parseFloat(heightFtInput) || 0;
    const inches = parseFloat(heightInInput) || 0;
    return (ft * 12 + inches) * 2.54;
  }, [unitSystem, heightCmInput, heightFtInput, heightInInput]);

  const parsedWeightKg = useMemo(() => {
    if (unitSystem === 'metric') {
      return parseFloat(weightKgInput);
    }
    const lbs = parseFloat(weightLbsInput);
    return Number.isFinite(lbs) ? lbs / 2.20462 : NaN;
  }, [unitSystem, weightKgInput, weightLbsInput]);

  const parsedBodyFat = parseFloat(bodyFatInput);

  const isHeightInvalid = !Number.isFinite(parsedHeightCm) || parsedHeightCm < 120 || parsedHeightCm > 250;
  const isWeightInvalid = !Number.isFinite(parsedWeightKg) || parsedWeightKg < 30 || parsedWeightKg > 250;
  const isBfInvalid = !Number.isFinite(parsedBodyFat) || parsedBodyFat < 3 || parsedBodyFat > 60;

  const showHeightError = touchedHeight && isHeightInvalid;
  const showWeightError = touchedWeight && isWeightInvalid;
  const showBfError = touchedBf && isBfInvalid;

  const safeHeightCm = isHeightInvalid ? 178 : parsedHeightCm;
  const safeWeightKg = isWeightInvalid ? 82 : parsedWeightKg;
  const safeBodyFat = isBfInvalid ? 14 : parsedBodyFat;

  const ffmiMetrics = useMemo(() => {
    return calculateFfmiMetrics({
      heightCm: safeHeightCm,
      weightKg: safeWeightKg,
      bodyFatPct: safeBodyFat,
      sex,
    });
  }, [safeHeightCm, safeWeightKg, safeBodyFat, sex]);

  const displayLeanMass =
    unitSystem === 'metric'
      ? `${ffmiMetrics.leanBodyMassKg.toFixed(1)} kg`
      : `${(ffmiMetrics.leanBodyMassKg * 2.20462).toFixed(1)} lbs`;

  const displayFatMass =
    unitSystem === 'metric'
      ? `${ffmiMetrics.fatMassKg.toFixed(1)} kg`
      : `${(ffmiMetrics.fatMassKg * 2.20462).toFixed(1)} lbs`;

  // Goal Body Weight projections while preserving 100% of current Lean Body Mass
  const goalProjections = useMemo(() => {
    const targetBfs = sex === 'male' ? [8, 10, 12, 15, 18] : [14, 16, 19, 22, 25];
    const lbmKg = ffmiMetrics.leanBodyMassKg;
    return targetBfs.map((targetBf) => {
      const projectedWeightKg = lbmKg / (1 - targetBf / 100);
      const weightDeltaKg = projectedWeightKg - safeWeightKg;
      const projectedFatKg = projectedWeightKg - lbmKg;
      return {
        targetBf,
        weightDisplay:
          unitSystem === 'metric'
            ? `${projectedWeightKg.toFixed(1)} kg`
            : `${(projectedWeightKg * 2.20462).toFixed(1)} lbs`,
        fatDisplay:
          unitSystem === 'metric'
            ? `${projectedFatKg.toFixed(1)} kg`
            : `${(projectedFatKg * 2.20462).toFixed(1)} lbs`,
        deltaDisplay:
          unitSystem === 'metric'
            ? `${weightDeltaKg >= 0 ? '+' : ''}${weightDeltaKg.toFixed(1)} kg`
            : `${weightDeltaKg >= 0 ? '+' : ''}${(weightDeltaKg * 2.20462).toFixed(1)} lbs`,
        isCurrentZone: Math.abs(targetBf - safeBodyFat) <= 1.2,
      };
    });
  }, [ffmiMetrics.leanBodyMassKg, safeWeightKg, safeBodyFat, sex, unitSystem]);

  // Natural ceiling projection at 12% BF (Male: 25.0 FFMI, Female: 21.0 FFMI)
  const naturalCeilingProjection = useMemo(() => {
    const heightM = safeHeightCm / 100;
    const targetNormalizedFfmi = sex === 'male' ? 25.0 : 21.0;
    const targetRawFfmi = targetNormalizedFfmi - 6.1 * (1.8 - heightM);
    const maxNaturalLbmKg = Math.max(30, targetRawFfmi * heightM * heightM);
    const refBf = sex === 'male' ? 12 : 18;
    const maxNaturalStageWeightKg = maxNaturalLbmKg / (1 - refBf / 100);
    const remainingMuscleGainKg = Math.max(0, maxNaturalLbmKg - ffmiMetrics.leanBodyMassKg);

    return {
      refBf,
      targetNormalizedFfmi,
      maxLbmDisplay:
        unitSystem === 'metric'
          ? `${maxNaturalLbmKg.toFixed(1)} kg`
          : `${(maxNaturalLbmKg * 2.20462).toFixed(1)} lbs`,
      maxWeightDisplay:
        unitSystem === 'metric'
          ? `${maxNaturalStageWeightKg.toFixed(1)} kg`
          : `${(maxNaturalStageWeightKg * 2.20462).toFixed(1)} lbs`,
      remainingGainDisplay:
        unitSystem === 'metric'
          ? `+${remainingMuscleGainKg.toFixed(1)} kg`
          : `+${(remainingMuscleGainKg * 2.20462).toFixed(1)} lbs`,
    };
  }, [safeHeightCm, sex, ffmiMetrics.leanBodyMassKg, unitSystem]);

  // Sync calculated bodyFatPct and leanBodyMassKg into shared tool state for TDEE Calculator
  useEffect(() => {
    if (!isForOthers) {
      updateSharedToolMetrics({
        bodyFatPct: safeBodyFat,
        leanBodyMassKg: ffmiMetrics.leanBodyMassKg,
      });
    }
  }, [safeBodyFat, ffmiMetrics.leanBodyMassKg, isForOthers]);

  return (
    <div>
      <AthleteSyncBanner
        toolName="FFMI & Body Composition"
        isForOthers={isForOthers}
        onToggleMode={handleToggleForOthers}
        profilePayloadToSave={{
          gender: sex,
          height: Math.round(safeHeightCm * 10) / 10,
          weight: unitSystem === 'metric' ? Math.round(safeWeightKg * 10) / 10 : Math.round(safeWeightKg * 2.20462 * 10) / 10,
          bodyFatPct: safeBodyFat,
          preferredUnit: unitSystem === 'metric' ? 'kg' : 'lbs',
        }}
        syncedFieldsSummary={`Auto-calculating FFMI & Lean Body Mass (${displayLeanMass} @ ${safeBodyFat.toFixed(1)}% BF) and feeding Katch-McArdle BMR into the TDEE Calculator.`}
        quickLinks={[
          { label: 'TDEE & Macro Split (Katch-McArdle)', href: '/tools/tdee-calculator' },
          { label: 'BMI Calculator', href: '/tools/bmi-calculator' },
        ]}
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Anthropometric Inputs */}
      <div className="lg:col-span-5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-[var(--border-subtle)]">
          <div>
            <h2 className="text-lg font-extrabold text-[var(--text-primary)] tracking-tight">
              Body Composition Inputs
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Kouri et al. (1995) height-normalized FFMI model
            </p>
          </div>

          <div
            role="group"
            aria-label="Measurement unit system"
            className="inline-flex rounded-lg bg-[var(--bg-primary)] p-1 border border-[var(--border-subtle)]"
          >
            <button
              type="button"
              onClick={() => handleUnitSwitch('metric')}
              aria-pressed={unitSystem === 'metric'}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                unitSystem === 'metric'
                  ? 'bg-[var(--accent-primary)] text-[#090b10] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Metric (kg/cm)
            </button>
            <button
              type="button"
              onClick={() => handleUnitSwitch('imperial')}
              aria-pressed={unitSystem === 'imperial'}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                unitSystem === 'imperial'
                  ? 'bg-[var(--accent-primary)] text-[#090b10] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Imperial (lbs/ft)
            </button>
          </div>
        </div>

        <div className="space-y-5">
          {/* Biological Sex Selection */}
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Reference Spectrum (Sex)
            </span>
            <div
              role="group"
              aria-label="Biological Sex Reference"
              className="grid grid-cols-2 gap-2.5"
            >
              <button
                type="button"
                onClick={() => setSex('male')}
                aria-pressed={sex === 'male'}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                  sex === 'male'
                    ? 'bg-[var(--accent-primary)]/15 border-[var(--accent-primary)] text-[var(--accent-primary)] shadow-sm'
                    : 'bg-[var(--bg-primary)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Male (Peak ~25.0)
              </button>
              <button
                type="button"
                onClick={() => setSex('female')}
                aria-pressed={sex === 'female'}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                  sex === 'female'
                    ? 'bg-[var(--accent-primary)]/15 border-[var(--accent-primary)] text-[var(--accent-primary)] shadow-sm'
                    : 'bg-[var(--bg-primary)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Female (Peak ~21.0)
              </button>
            </div>
          </div>

          {/* Height Input */}
          {unitSystem === 'metric' ? (
            <div>
              <label
                htmlFor="ffmi-height-cm"
                className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2"
              >
                Height (cm)
              </label>
              <input
                id="ffmi-height-cm"
                type="number"
                inputMode="decimal"
                min={120}
                max={250}
                step="0.5"
                value={heightCmInput}
                onChange={(e) => setHeightCmInput(e.target.value)}
                onBlur={() => setTouchedHeight(true)}
                aria-invalid={showHeightError ? 'true' : undefined}
                aria-describedby={showHeightError ? 'ffmi-height-error' : undefined}
                className={`w-full bg-[var(--bg-primary)] border rounded-xl px-4 py-3 text-base font-bold text-[var(--text-primary)] tabular-nums focus:outline-none transition-colors ${
                  showHeightError
                    ? 'border-[var(--accent-danger)] focus:border-[var(--accent-danger)]'
                    : 'border-[var(--border-subtle)] focus:border-[var(--accent-primary)]'
                }`}
              />
              {showHeightError && (
                <p id="ffmi-height-error" role="alert" className="text-xs text-[var(--accent-danger)] mt-1.5 font-medium">
                  Enter a valid height between 120 cm and 250 cm.
                </p>
              )}
            </div>
          ) : (
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Height (Feet & Inches)
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="ffmi-height-ft" className="sr-only">
                    Height Feet
                  </label>
                  <div className="relative">
                    <input
                      id="ffmi-height-ft"
                      type="number"
                      inputMode="numeric"
                      min={4}
                      max={8}
                      value={heightFtInput}
                      onChange={(e) => setHeightFtInput(e.target.value)}
                      onBlur={() => setTouchedHeight(true)}
                      aria-invalid={showHeightError ? 'true' : undefined}
                      aria-describedby={showHeightError ? 'ffmi-height-error' : undefined}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 pr-10 text-base font-bold text-[var(--text-primary)] tabular-nums focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-muted)]">
                      ft
                    </span>
                  </div>
                </div>
                <div>
                  <label htmlFor="ffmi-height-in" className="sr-only">
                    Height Inches
                  </label>
                  <div className="relative">
                    <input
                      id="ffmi-height-in"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={11}
                      value={heightInInput}
                      onChange={(e) => setHeightInInput(e.target.value)}
                      onBlur={() => setTouchedHeight(true)}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 pr-10 text-base font-bold text-[var(--text-primary)] tabular-nums focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-muted)]">
                      in
                    </span>
                  </div>
                </div>
              </div>
              {showHeightError && (
                <p id="ffmi-height-error" role="alert" className="text-xs text-[var(--accent-danger)] mt-1.5 font-medium">
                  Enter a valid height between 4 ft 0 in and 8 ft 0 in.
                </p>
              )}
            </div>
          )}

          {/* Body Weight Input */}
          <div>
            <label
              htmlFor="ffmi-weight-input"
              className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2"
            >
              Total Body Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
            </label>
            <input
              id="ffmi-weight-input"
              type="number"
              inputMode="decimal"
              min={30}
              max={550}
              step="0.5"
              value={unitSystem === 'metric' ? weightKgInput : weightLbsInput}
              onChange={(e) =>
                unitSystem === 'metric'
                  ? setWeightKgInput(e.target.value)
                  : setWeightLbsInput(e.target.value)
              }
              onBlur={() => setTouchedWeight(true)}
              aria-invalid={showWeightError ? 'true' : undefined}
              aria-describedby={showWeightError ? 'ffmi-weight-error' : undefined}
              className={`w-full bg-[var(--bg-primary)] border rounded-xl px-4 py-3 text-base font-bold text-[var(--text-primary)] tabular-nums focus:outline-none transition-colors ${
                showWeightError
                  ? 'border-[var(--accent-danger)] focus:border-[var(--accent-danger)]'
                  : 'border-[var(--border-subtle)] focus:border-[var(--accent-primary)]'
              }`}
            />
            {showWeightError && (
              <p id="ffmi-weight-error" role="alert" className="text-xs text-[var(--accent-danger)] mt-1.5 font-medium">
                Please enter a realistic body weight ({unitSystem === 'metric' ? '30–250 kg' : '66–550 lbs'}).
              </p>
            )}
          </div>

          {/* Body Fat % Input + Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="ffmi-bf-input"
                className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]"
              >
                Estimated Body Fat (%)
              </label>
              <span className="text-xs font-extrabold text-[var(--accent-primary)] tabular-nums">
                {safeBodyFat.toFixed(1)}% BF
              </span>
            </div>
            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-4">
                <input
                  id="ffmi-bf-input"
                  type="number"
                  inputMode="decimal"
                  min={3}
                  max={60}
                  step="0.5"
                  value={bodyFatInput}
                  onChange={(e) => setBodyFatInput(e.target.value)}
                  onBlur={() => setTouchedBf(true)}
                  aria-invalid={showBfError ? 'true' : undefined}
                  aria-describedby={showBfError ? 'ffmi-bf-error' : 'ffmi-bf-hint'}
                  className={`w-full bg-[var(--bg-primary)] border rounded-xl px-3 py-2.5 text-sm font-bold text-[var(--text-primary)] tabular-nums focus:outline-none ${
                    showBfError
                      ? 'border-[var(--accent-danger)]'
                      : 'border-[var(--border-subtle)] focus:border-[var(--accent-primary)]'
                  }`}
                />
              </div>
              <div className="col-span-8">
                <label htmlFor="ffmi-bf-slider" className="sr-only">
                  Body Fat Percentage Slider
                </label>
                <input
                  id="ffmi-bf-slider"
                  type="range"
                  min={4}
                  max={45}
                  step={0.5}
                  value={Math.min(45, Math.max(4, safeBodyFat))}
                  onChange={(e) => setBodyFatInput(e.target.value)}
                  className="w-full accent-[var(--accent-primary)] cursor-pointer"
                />
              </div>
            </div>
            <p id="ffmi-bf-hint" className="text-[11px] text-[var(--text-muted)] mt-1.5">
              {sex === 'male'
                ? 'Men: 8–12% (visible abs), 13–17% (athletic), 18–24% (off-season/average).'
                : 'Women: 15–19% (defined athletic), 20–24% (fit), 25–31% (average).'}
            </p>
            {showBfError && (
              <p id="ffmi-bf-error" role="alert" className="text-xs text-[var(--accent-danger)] mt-1 font-medium">
                Enter a body fat percentage between 3% and 60%.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Live FFMI Readout, Spectrum Bar & Goal Weight Table */}
      <div className="lg:col-span-7 space-y-6">
        {/* Primary KPI Bento Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-[var(--bg-secondary)] border border-[var(--accent-primary)]/40 rounded-2xl p-4 shadow-md">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Normalized FFMI
            </span>
            <p className="text-2xl sm:text-3xl font-black text-[var(--accent-primary)] mt-1 tabular-nums">
              {ffmiMetrics.normalizedFfmi.toFixed(1)}
            </p>
            <span className="inline-block text-[11px] font-semibold text-[var(--text-muted)] mt-1">
              1.80m Adjusted
            </span>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-4">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Raw FFMI
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] mt-1 tabular-nums">
              {ffmiMetrics.rawFfmi.toFixed(1)}
            </p>
            <span className="inline-block text-[11px] font-semibold text-[var(--text-muted)] mt-1">
              kg / m²
            </span>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-4">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Lean Body Mass
            </span>
            <p className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1 tabular-nums">
              {displayLeanMass}
            </p>
            <span className="inline-block text-[11px] font-semibold text-[var(--accent-secondary)] mt-1 tabular-nums">
              {(100 - safeBodyFat).toFixed(1)}% Fat-Free
            </span>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-4">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Adipose Fat Mass
            </span>
            <p className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1 tabular-nums">
              {displayFatMass}
            </p>
            <span className="inline-block text-[11px] font-semibold text-[var(--text-muted)] mt-1 tabular-nums">
              {safeBodyFat.toFixed(1)}% Body Fat
            </span>
          </div>
        </div>

        {/* Natural Muscular Potential Spectrum Card */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Muscularity Classification
              </span>
              <h3 className="text-lg font-extrabold text-[var(--text-primary)]">
                {ffmiMetrics.category}
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/30 text-xs font-extrabold text-[var(--accent-primary)] tabular-nums">
              {ffmiMetrics.naturalPotentialPct}% of Natural Ceiling
            </span>
          </div>

          {/* Visual Gauge */}
          <div className="w-full h-3.5 bg-[var(--bg-primary)] rounded-full overflow-hidden border border-[var(--border-subtle)] p-0.5 my-3">
            <div
              className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-[var(--accent-secondary)] via-[var(--accent-primary)] to-amber-400"
              style={{ width: `${ffmiMetrics.naturalPotentialPct}%` }}
            />
          </div>

          <div className="grid grid-cols-3 text-[11px] font-semibold text-[var(--text-muted)] tabular-nums">
            <span>Baseline ({sex === 'male' ? '18.0' : '14.0'})</span>
            <span className="text-center">Advanced ({sex === 'male' ? '22.5' : '18.5'})</span>
            <span className="text-right text-[var(--accent-primary)]">
              Natural Limit (~{sex === 'male' ? '25.0' : '21.0'})
            </span>
          </div>

          {/* Genetic Potential Summary Box */}
          <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-[var(--bg-primary)]/70 rounded-xl p-3 border border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)] block font-medium">
                Est. Natural LBM Ceiling
              </span>
              <strong className="text-sm font-extrabold text-[var(--text-primary)] tabular-nums mt-0.5 block">
                {naturalCeilingProjection.maxLbmDisplay}
              </strong>
            </div>
            <div className="bg-[var(--bg-primary)]/70 rounded-xl p-3 border border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)] block font-medium">
                Peak Weight @ {naturalCeilingProjection.refBf}% BF
              </span>
              <strong className="text-sm font-extrabold text-[var(--text-primary)] tabular-nums mt-0.5 block">
                {naturalCeilingProjection.maxWeightDisplay}
              </strong>
            </div>
            <div className="bg-[var(--bg-primary)]/70 rounded-xl p-3 border border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)] block font-medium">
                Untapped Lean Mass Room
              </span>
              <strong className="text-sm font-extrabold text-[var(--accent-secondary)] tabular-nums mt-0.5 block">
                {naturalCeilingProjection.remainingGainDisplay}
              </strong>
            </div>
          </div>
        </div>

        {/* Target Body Fat Weight Projections Table */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-extrabold text-[var(--text-primary)]">
                Body Recomposition & Cut Weight Projections
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Target scale weight at different body fat percentages assuming 100% Lean Body Mass retention ({displayLeanMass}).
              </p>
            </div>
          </div>

          <div
            className="table-responsive-region rounded-xl border border-[var(--border-subtle)]"
            tabIndex={0}
            role="region"
            aria-label="Target body fat weight projections"
          >
            <table className="w-full text-left border-collapse text-sm">
              <caption className="visually-hidden">
                Projected body weight and fat mass across target body fat percentages
              </caption>
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  <th scope="col" className="py-3 px-4">
                    Target Body Fat
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Projected Scale Weight
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Fat Mass Remaining
                  </th>
                  <th scope="col" className="py-3 px-4 text-right">
                    Scale Change Needed
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] tabular-nums">
                {goalProjections.map((row) => (
                  <tr
                    key={row.targetBf}
                    className={
                      row.isCurrentZone
                        ? 'bg-[var(--accent-primary)]/10 font-bold'
                        : 'hover:bg-[var(--bg-primary)]/50 transition-colors'
                    }
                  >
                    <td className="py-3 px-4 font-bold text-[var(--text-primary)]">
                      {row.targetBf}% BF
                      {row.isCurrentZone && (
                        <span className="ml-2 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[var(--accent-primary)] text-[#090b10]">
                          Current
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-[var(--text-primary)]">
                      {row.weightDisplay}
                    </td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">
                      {row.fatDisplay}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-[var(--accent-primary)]">
                      {row.deltaDisplay}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--text-secondary)]">
            <span>
              Want to preserve 100% of your lean mass during a fat-loss phase? Maintain mechanical tension and{' '}
              <Link
                href="/tools/ppl-tracker"
                className="text-[var(--accent-primary)] font-bold underline underline-offset-4 hover:opacity-90"
              >
                track your progressive overload with PPL Tracker
              </Link>
              .
            </span>
            <Link
              href="/tools/tdee-calculator"
              className="text-[var(--text-primary)] font-bold hover:text-[var(--accent-primary)] transition-colors"
            >
              Calculate Deficit Macros →
            </Link>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

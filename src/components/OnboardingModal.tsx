'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Dumbbell,
  Target,
  Flame,
  Zap,
  TrendingUp,
  Layers,
  Scale,
  Award,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { TrainingSplitId } from '../types/auth';
import { playClickSound, playPopSound } from '../utils/audio';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const SPLIT_OPTIONS: Array<{
  id: TrainingSplitId;
  name: string;
  days: string;
  tag: string;
  color: string;
  description: string;
}> = [
  {
    id: 'ppl',
    name: 'Push-Pull-Legs (PPL)',
    days: '6 Days / Week',
    tag: 'Gold Standard Hypertrophy',
    color: 'from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 border-[var(--accent-primary)]/40 text-[var(--accent-primary)]',
    description: 'Hits every muscle group twice every 7 days. Superior frequency and volume balance for aesthetic bodybuilding.'
  },
  {
    id: 'bro-split',
    name: 'Bro Split (Single Muscle Focus)',
    days: '5 Days / Week',
    tag: 'Classic Bodybuilding',
    color: 'from-sky-500/20 to-blue-500/20 border-sky-500/40 text-sky-400',
    description: 'Dedicated focus days: Chest, Back, Shoulders, Arms, and Legs. Insane muscle pumps with 7 days of localized recovery.'
  },
  {
    id: 'upper-lower',
    name: 'Upper / Lower Split',
    days: '4 Days / Week',
    tag: 'Strength & Hypertrophy',
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-400',
    description: 'Hits upper body twice and lower body twice. Perfect harmony of heavy compound overload and ample recovery.'
  },
  {
    id: 'full-body',
    name: 'Full Body Compound Split',
    days: '3 Days / Week',
    tag: 'Maximum Efficiency',
    color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/40 text-purple-400',
    description: 'Compound multi-joint lifts targeting the entire physique every session. Unmatched stimulus per gym hour.'
  }
];

const WEAK_POINT_OPTIONS = [
  { id: 'Upper Chest', label: 'Upper Chest', sub: 'Clavicular Pec Shelf' },
  { id: 'Lateral Delts', label: 'Lateral Delts', sub: 'Capped 3D Shoulder Width' },
  { id: 'Rear Delts', label: 'Rear Delts', sub: 'Posterior Upper-Back Posture' },
  { id: 'Triceps', label: 'Triceps (Long Head)', sub: 'Overhead Arm Thickness' },
  { id: 'Biceps', label: 'Biceps Peak', sub: 'Arm Height & Brachialis' },
  { id: 'Hamstrings', label: 'Hamstrings', sub: 'Posterior Chain & RDL Overload' },
  { id: 'Quads', label: 'Quads (Teardrop)', sub: 'Front Leg Sweep & Depth' },
  { id: 'Calves', label: 'Calves (Soleus/Gastrocnemius)', sub: 'Full Lower Leg Sweep' },
  { id: 'Lats', label: 'Lats (V-Taper)', sub: 'Wide Back Lat Pulldowns' }
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const { user, updateProfile } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [fitnessGoal, setFitnessGoal] = useState<'Hypertrophy' | 'Strength' | 'Cutting' | 'Body Recomposition'>(
    user?.fitnessGoal || 'Hypertrophy'
  );
  const [experienceLevel, setExperienceLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(
    user?.experienceLevel || 'Intermediate'
  );
  const [selectedSplit, setSelectedSplit] = useState<TrainingSplitId>(
    user?.selectedSplit || 'ppl'
  );
  const [weakPoints, setWeakPoints] = useState<string[]>(
    user?.weakPoints || ['Upper Chest', 'Lateral Delts']
  );
  const [weight, setWeight] = useState<number | ''>(user?.weight || 75);
  const [height, setHeight] = useState<number | ''>(user?.height || 178);
  const [preferredUnit, setPreferredUnit] = useState<'kg' | 'lbs'>(user?.preferredUnit || 'kg');
  const [barbellBaseWeight, setBarbellBaseWeight] = useState<number>(user?.barbellBaseWeight || 20);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const toggleWeakPoint = (wpId: string) => {
    playPopSound(true);
    setWeakPoints((prev) =>
      prev.includes(wpId) ? prev.filter((item) => item !== wpId) : [...prev, wpId]
    );
  };

  const handleFinish = async () => {
    playClickSound(true);
    setIsSaving(true);
    try {
      await updateProfile({
        name: user?.name || 'Athlete',
        fitnessGoal,
        experienceLevel,
        selectedSplit,
        weakPoints,
        weight: typeof weight === 'number' ? weight : undefined,
        height: typeof height === 'number' ? height : undefined,
        preferredUnit,
        barbellBaseWeight,
        onboardingCompleted: true,
      });

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#B7FF4A', '#36D6B0', '#0ea5e9'],
        });
      } catch (e) {
        // Safe fallback
      }

      onComplete();
    } catch (e) {
      console.error('Failed to complete onboarding:', e);
      onComplete();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl shadow-2xl p-6 sm:p-8 text-[var(--text-primary)] my-8 transition-all animate-in fade-in zoom-in-95 duration-200 card-bento">
        {/* Progress Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-mono tracking-widest text-[var(--accent-primary)] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[var(--accent-primary)] animate-spin-slow" />
              Onboarding • Step {step} of 4
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              {step === 1 && 'Goal & Experience'}
              {step === 2 && 'Training Split'}
              {step === 3 && 'Lagging Muscle Priorities'}
              {step === 4 && 'Biometrics & Setup'}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-[var(--bg-elevated)] rounded-full overflow-hidden flex border border-[var(--border-subtle)]">
            <div
              className="h-full bg-[var(--accent-primary)] transition-all duration-300 ease-out"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Goal & Experience */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight text-[var(--text-primary)]">
                Define Your Hypertrophy Goal
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Our algorithm will adjust your baseline rep ceilings and progressive overload thresholds.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'Hypertrophy',
                  title: 'Pure Hypertrophy',
                  desc: 'Maximum muscle fiber recruitment, volume & sarcoplasmic hypertrophy (8–12 reps).',
                  icon: Dumbbell,
                },
                {
                  id: 'Strength',
                  title: 'Strength & Power',
                  desc: 'Maximal neuromuscular recruitment on barbell compounds (4–6 reps).',
                  icon: Zap,
                },
                {
                  id: 'Cutting',
                  title: 'Cutting & Retention',
                  desc: 'High mechanical tension to preserve lean tissue during caloric deficits.',
                  icon: Flame,
                },
                {
                  id: 'Body Recomposition',
                  title: 'Body Recomposition',
                  desc: 'Simultaneous fat loss and muscle gain with strict double progression.',
                  icon: TrendingUp,
                },
              ].map((goal) => {
                const Icon = goal.icon;
                const isSelected = fitnessGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => {
                      playPopSound(true);
                      setFitnessGoal(goal.id as any);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all btn-tactile cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 ring-2 ring-[var(--accent-primary)]/20'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                        <Icon className="w-5 h-5" />
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-[var(--accent-primary)]" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-[var(--text-primary)]">{goal.title}</h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{goal.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-2">
                Lifting Experience
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Beginner', label: 'Beginner', sub: '< 1 Year' },
                  { id: 'Intermediate', label: 'Intermediate', sub: '1–3 Years' },
                  { id: 'Advanced', label: 'Advanced', sub: '3+ Years' },
                ].map((exp) => (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => {
                      playPopSound(true);
                      setExperienceLevel(exp.id as any);
                    }}
                    className={`py-3 px-3 rounded-xl border text-center transition-all btn-tactile cursor-pointer ${
                      experienceLevel === exp.id
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-semibold'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <div className="text-xs font-semibold">{exp.label}</div>
                    <div className="text-[10px] text-[var(--text-muted)] mt-0.5 font-mono tabular-nums">{exp.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Training Split Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight text-[var(--text-primary)]">
                Select Your Training Split
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Choose the structural program that fits your weekly recovery capacity and schedule.
              </p>
            </div>

            <div className="space-y-3">
              {SPLIT_OPTIONS.map((split) => {
                const isSelected = selectedSplit === split.id;
                return (
                  <button
                    key={split.id}
                    type="button"
                    onClick={() => {
                      playPopSound(true);
                      setSelectedSplit(split.id);
                    }}
                    className={`w-full p-4 rounded-2xl border text-left transition-all btn-tactile cursor-pointer flex items-start gap-4 ${
                      isSelected
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 ring-2 ring-[var(--accent-primary)]/20'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--accent-primary)] shrink-0 mt-0.5">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-semibold text-sm text-[var(--text-primary)]">{split.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-2 py-0.5 rounded-full border border-[var(--accent-primary)]/20">
                            {split.days}
                          </span>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-[var(--accent-primary)]" />}
                        </div>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                        {split.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Lagging Muscle Weak Points */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight text-[var(--text-primary)] flex items-center gap-2">
                <Target className="w-7 h-7 text-[var(--accent-primary)]" />
                Target Lagging Weak Points
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Select your lagging muscle groups. Our smart engine will reorganize exercise sequences, place priority compounds first in your session, and attach specialized hypertrophy volume.
              </p>
            </div>

            <div className="p-3 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 rounded-2xl flex items-center justify-between">
              <span className="text-xs font-mono text-[var(--accent-primary)] font-semibold tabular-nums">
                {weakPoints.length} Priority Muscles Selected
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                Recommended: 1 to 3 priorities
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
              {WEAK_POINT_OPTIONS.map((wp) => {
                const isSelected = weakPoints.includes(wp.id);
                return (
                  <button
                    key={wp.id}
                    type="button"
                    onClick={() => toggleWeakPoint(wp.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all btn-tactile cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">{wp.label}</div>
                      <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{wp.sub}</div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-black'
                          : 'border-[var(--border-strong)]'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-black" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Biometrics & Preferences */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight text-[var(--text-primary)]">
                Biometrics & Equipment Math
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Customize units and default barbell collar weights for the integrated Olympic Plate Math calculator.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[var(--text-muted)] mb-1.5">
                  Body Weight ({preferredUnit})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] font-mono tabular-nums text-sm focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)]"
                    placeholder="e.g. 75"
                  />
                  <Scale className="absolute right-3.5 top-3.5 w-4 h-4 text-[var(--text-muted)]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[var(--text-muted)] mb-1.5">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] font-mono tabular-nums text-sm focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)]"
                  placeholder="e.g. 178"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[var(--text-muted)] mb-1.5">
                  Preferred Units
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playPopSound(true);
                      setPreferredUnit('kg');
                    }}
                    className={`py-3 rounded-xl border font-mono text-xs font-bold transition-all btn-tactile ${
                      preferredUnit === 'kg'
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-black'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]'
                    }`}
                  >
                    Kilograms (KG)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playPopSound(true);
                      setPreferredUnit('lbs');
                    }}
                    className={`py-3 rounded-xl border font-mono text-xs font-bold transition-all btn-tactile ${
                      preferredUnit === 'lbs'
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-black'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]'
                    }`}
                  >
                    Pounds (LBS)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[var(--text-muted)] mb-1.5">
                  Default Olympic Barbell Weight
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 20, label: '20kg / 45lb' },
                    { val: 15, label: '15kg / 35lb' },
                    { val: 10, label: '10kg EZ' },
                  ].map((bar) => (
                    <button
                      key={bar.val}
                      type="button"
                      onClick={() => {
                        playPopSound(true);
                        setBarbellBaseWeight(bar.val);
                      }}
                      className={`py-3 rounded-xl border font-mono tabular-nums text-xs font-bold transition-all btn-tactile ${
                        barbellBaseWeight === bar.val
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-black'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {bar.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Overview pill */}
            <div className="p-4 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
                <Award className="w-4 h-4 text-[var(--accent-primary)]" /> Ready to Launch Your Personalized Routine
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Selected Split: <span className="text-[var(--accent-primary)] font-bold">{selectedSplit.toUpperCase()}</span> • Prioritizing{' '}
                <span className="text-[var(--text-primary)] font-semibold">{weakPoints.join(', ') || 'None'}</span>. Today&apos;s workout will be automatically loaded based on the current day of the week!
              </p>
            </div>
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="mt-8 pt-5 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => {
                playClickSound(true);
                setStep((s) => (s - 1) as any);
              }}
              className="px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer btn-tactile"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => {
                playClickSound(true);
                setStep((s) => (s + 1) as any);
              }}
              className="px-6 py-2.5 rounded-xl bg-[var(--accent-primary)] hover:opacity-95 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all btn-tactile cursor-pointer shadow-md shadow-[var(--accent-primary)]/20"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSaving}
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-[var(--accent-primary)] hover:opacity-95 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all btn-tactile cursor-pointer shadow-md shadow-[var(--accent-primary)]/25 disabled:opacity-50"
            >
              {isSaving ? 'Configuring Profile...' : 'Launch Workout Tracker'}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

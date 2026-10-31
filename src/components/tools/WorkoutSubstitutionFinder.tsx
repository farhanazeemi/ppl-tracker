'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Check,
  Info,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  SubstitutionExercise,
  EquipmentCategory,
  TrainingGoal,
  MovementPattern,
  ExerciseDifficulty,
  ExerciseMechanics,
} from '../../types/substitution';
import {
  CANONICAL_EXERCISE_DATABASE,
} from '../../lib/workout-substitution/exerciseRepository';
import {
  findExerciseSubstitutes,
  findExerciseByIdOrName
} from '../../lib/workout-substitution/engine';
import { playClickSound, playPopSound, playTabSound } from '../../utils/audio';

const EQUIPMENT_OPTIONS: Array<{ id: EquipmentCategory; label: string; icon: string }> = [
  { id: 'dumbbell', label: 'Dumbbells', icon: '🏋️' },
  { id: 'barbell', label: 'Barbell', icon: '⚡' },
  { id: 'cable', label: 'Cable Machine', icon: '⚙️' },
  { id: 'machine', label: 'Weight Machines', icon: '🦾' },
  { id: 'smith', label: 'Smith Machine', icon: '🔒' },
  { id: 'bodyweight', label: 'Bodyweight', icon: '🤸' },
  { id: 'bands', label: 'Resistance Bands', icon: '🎗️' },
  { id: 'kettlebell', label: 'Kettlebell', icon: '🔔' },
  { id: 'bench', label: 'Adjustable Bench', icon: '🛋️' },
  { id: 'pullup_bar', label: 'Pull-Up Bar', icon: '🪜' }
];

const TRAINING_GOALS: Array<{ id: TrainingGoal; label: string; description: string }> = [
  {
    id: 'hypertrophy',
    label: 'Muscle Hypertrophy',
    description: 'Prioritizes lengthened-position tension, constant cable load, and peak mechanical stress.'
  },
  {
    id: 'strength',
    label: 'Maximal Strength',
    description: 'Prioritizes heavy bilateral compound mechanics with high nervous system recruitment.'
  },
  {
    id: 'general_fitness',
    label: 'General Fitness',
    description: 'Balanced, joint-friendly movements with low injury risk and functional athletic carryover.'
  },
  {
    id: 'home_workout',
    label: 'Home / Calisthenics',
    description: 'Prioritizes minimal-equipment alternatives utilizing bodyweight, bands, or dumbbells.'
  }
];

const POPULAR_SEARCH_PRESETS = [
  'Wide-Grip Lat Pulldown',
  'Flat Barbell Bench Press',
  '45-Degree Leg Press',
  'Standing Middle Cable Fly',
  'Barbell Back Squat'
];

export const WorkoutSubstitutionFinder: React.FC = () => {
  // 1. Core Selection States
  const [selectedExercise, setSelectedExercise] = useState<SubstitutionExercise>(() => {
    return CANONICAL_EXERCISE_DATABASE[0];
  });

  const [availableEquipment, setAvailableEquipment] = useState<EquipmentCategory[]>([]);
  const [trainingGoal, setTrainingGoal] = useState<TrainingGoal>('hypertrophy');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // 2. Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // 3. Advanced Filters
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [targetMuscleFilter, setTargetMuscleFilter] = useState<string>('all');
  const [movementPatternFilter, setMovementPatternFilter] = useState<MovementPattern | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<ExerciseDifficulty | 'all'>('all');
  const [mechanicsFilter, setMechanicsFilter] = useState<ExerciseMechanics | 'all'>('all');

  // 4. Modal and Toast States
  const [detailModalExercise, setDetailModalExercise] = useState<SubstitutionExercise | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check audio settings and URL search params on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedSound = localStorage.getItem('ppl_sound');
    if (savedSound !== null) setSoundEnabled(savedSound === 'true');

    const params = new URLSearchParams(window.location.search);
    const exerciseParam = params.get('exercise');
    if (exerciseParam) {
      const match = findExerciseByIdOrName(exerciseParam);
      if (match) setSelectedExercise(match);
    }
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered search results for autocomplete
  const filteredSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return CANONICAL_EXERCISE_DATABASE.slice(0, 8);
    const q = searchQuery.toLowerCase().trim();
    return CANONICAL_EXERCISE_DATABASE.filter(
      (ex) =>
        ex.name.toLowerCase().includes(q) ||
        ex.movementPattern.toLowerCase().includes(q) ||
        ex.primaryMuscles.some((m) => m.toLowerCase().includes(q)) ||
        ex.aliases?.some((a) => a.toLowerCase().includes(q))
    ).slice(0, 10);
  }, [searchQuery]);

  // Handle Equipment Pill Click
  const handleToggleEquipment = (eq: EquipmentCategory) => {
    playClickSound(soundEnabled);
    setAvailableEquipment((prev) => {
      if (prev.includes(eq)) {
        return prev.filter((item) => item !== eq);
      } else {
        return [...prev, eq];
      }
    });
  };

  const handleClearEquipment = () => {
    playClickSound(soundEnabled);
    setAvailableEquipment([]);
  };

  // Run Deterministic Matching Algorithm
  const matchResults = useMemo(() => {
    return findExerciseSubstitutes(selectedExercise, {
      availableEquipment,
      trainingGoal,
      targetMuscle: targetMuscleFilter === 'all' ? 'all' : (targetMuscleFilter as any),
      movementPattern: movementPatternFilter,
      difficulty: difficultyFilter,
      exerciseType: mechanicsFilter
    });
  }, [
    selectedExercise,
    availableEquipment,
    trainingGoal,
    targetMuscleFilter,
    movementPatternFilter,
    difficultyFilter,
    mechanicsFilter
  ]);

  // Handle Select Exercise from Autocomplete or Presets
  const handleSelectExercise = (exercise: SubstitutionExercise) => {
    playPopSound(soundEnabled);
    setSelectedExercise(exercise);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  // Handle "Use in PPL Tracker" action
  const handleUseInTracker = (candidate: SubstitutionExercise) => {
    playPopSound(soundEnabled);
    if (typeof window !== 'undefined') {
      const payload = {
        originalId: selectedExercise.id,
        originalName: selectedExercise.name,
        substituteId: candidate.id,
        substituteName: candidate.name,
        timestamp: Date.now()
      };
      localStorage.setItem('ppl_active_substitution', JSON.stringify(payload));
    }
    setToastMessage(`Swapped "${candidate.name}" for "${selectedExercise.name}" in your active session!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleResetFilters = () => {
    playClickSound(soundEnabled);
    setTargetMuscleFilter('all');
    setMovementPatternFilter('all');
    setDifficultyFilter('all');
    setMechanicsFilter('all');
    setAvailableEquipment([]);
  };

  return (
    <div className="space-y-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 max-w-md p-4 rounded-2xl bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--accent-primary)] shadow-2xl shadow-[var(--accent-primary)]/20 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-[var(--accent-primary)] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold font-mono uppercase tracking-wider text-[var(--accent-primary)]">
              PPL Workout Tracker Synced
            </p>
            <p className="text-xs text-[var(--text-secondary)]">{toastMessage}</p>
            <Link
              href="/tools/ppl-tracker"
              className="inline-flex items-center gap-1.5 pt-1 text-xs font-mono font-bold text-[var(--accent-primary)] hover:underline"
            >
              Open PPL Tracker to Log Sets →
            </Link>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] ml-auto cursor-pointer"
            aria-label="Dismiss toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =========================================================================
          SECTION A: HERO & EXERCISE SEARCH
          ========================================================================= */}
      <section className="relative p-6 sm:p-10 rounded-3xl card-bento shadow-xl shadow-black/5 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[var(--accent-primary)]/10 blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Biomechanical Exercise Substitution Engine
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[var(--text-primary)] leading-tight">
            Find Your Perfect Workout Alternative
          </h2>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-sans">
            Can&apos;t use your preferred gym equipment? Find effective exercise alternatives based on your target muscles, available equipment, and training goals without sacrificing progressive overload.
          </p>

          {/* Search Box with Autocomplete */}
          <div className="space-y-3 pt-2" ref={searchContainerRef}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-[var(--text-muted)]" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search exercise (e.g., Lat Pulldown, Bench Press, Leg Press)..."
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm font-sans placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)] transition-all"
                aria-label="Search exercise to substitute"
                aria-autocomplete="list"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Autocomplete Dropdown */}
              {isSearchOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-strong)] shadow-2xl z-40 max-h-80 overflow-y-auto space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Select Target Exercise
                  </div>
                  {filteredSearchResults.length > 0 ? (
                    filteredSearchResults.map((ex) => (
                      <button
                        key={ex.id}
                        onClick={() => handleSelectExercise(ex)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-sans flex items-center justify-between transition-colors cursor-pointer ${
                          selectedExercise.id === ex.id
                            ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-bold'
                            : 'hover:bg-[var(--bg-elevated)] text-[var(--text-primary)]'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="font-bold">{ex.name}</div>
                          <div className="text-[11px] text-[var(--text-muted)] font-mono">
                            {ex.movementPattern} • {ex.primaryMuscles.join(', ')}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                          {ex.equipment.join('/')}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-xs text-[var(--text-muted)] font-sans">
                      No matching exercises found. Try searching by muscle group or movement pattern.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="font-mono text-[var(--text-muted)] text-[11px] uppercase tracking-wider">
                Popular Searches:
              </span>
              {POPULAR_SEARCH_PRESETS.map((preset) => {
                const isSelected = selectedExercise.name.toLowerCase() === preset.toLowerCase();
                return (
                  <button
                    key={preset}
                    onClick={() => {
                      const match = findExerciseByIdOrName(preset);
                      if (match) handleSelectExercise(match);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--accent-primary)] text-black font-bold shadow-md shadow-[var(--accent-primary)]/20'
                        : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                    }`}
                  >
                    {preset}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Exercise Hero Card */}
        <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-[var(--bg-elevated)]/60 border border-[var(--accent-primary)]/30 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-lg bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/25 text-[var(--accent-primary)] text-xs font-mono font-bold">
                Currently Selected Exercise
              </span>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                Pattern: {selectedExercise.movementPattern}
              </span>
            </div>
            <button
              onClick={() => setDetailModalExercise(selectedExercise)}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--accent-primary)] hover:underline transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              View Form Guide
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-black uppercase text-[var(--text-primary)]">
                {selectedExercise.name}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                {selectedExercise.description}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold">
                Muscles Targeted
              </span>
              <div className="text-xs font-mono text-[var(--text-primary)] font-bold">
                Primary: {selectedExercise.primaryMuscles.join(', ')}
              </div>
              {selectedExercise.secondaryMuscles.length > 0 && (
                <div className="text-[11px] font-mono text-[var(--text-muted)]">
                  Secondary: {selectedExercise.secondaryMuscles.join(', ')}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold">
                Equipment & Demands
              </span>
              <div className="text-xs font-mono text-[var(--text-primary)] capitalize">
                Gear: {selectedExercise.equipment.join(' + ')}
              </div>
              <div className="text-[11px] font-mono text-[var(--text-muted)] capitalize">
                Stabilization: {selectedExercise.biomechanics.stabilizationDemand}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION B: CONTROLS (EQUIPMENT, GOALS & ADVANCED FILTERS)
          ========================================================================= */}
      <section className="space-y-6">
        {/* Equipment Selector */}
        <div className="p-6 rounded-3xl card-bento space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                1. Select Available Equipment
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-sans">
                Only show exercises executable with gear currently open in your gym.
              </p>
            </div>
            {availableEquipment.length > 0 && (
              <button
                onClick={handleClearEquipment}
                className="text-xs font-mono text-[var(--accent-primary)] hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset to &quot;Any Equipment&quot;
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={handleClearEquipment}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                availableEquipment.length === 0
                  ? 'bg-[var(--accent-primary)] text-black shadow-md shadow-[var(--accent-primary)]/20'
                  : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
              }`}
            >
              <span>🌐</span> Any Equipment
            </button>
            {EQUIPMENT_OPTIONS.map((eq) => {
              const isSelected = availableEquipment.includes(eq.id);
              return (
                <button
                  key={eq.id}
                  onClick={() => handleToggleEquipment(eq.id)}
                  aria-pressed={isSelected}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--accent-primary)] text-black font-bold shadow-md shadow-[var(--accent-primary)]/20 ring-2 ring-[var(--accent-primary)]'
                      : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                  }`}
                >
                  <span>{eq.icon}</span> {eq.label}
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Training Goal Selector */}
        <div className="p-6 rounded-3xl card-bento space-y-4">
          <div>
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
              2. Select Training Priority
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-sans">
              Adjusts recommendation weighting toward stretch hypertrophy, heavy neural strength, or home convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {TRAINING_GOALS.map((goal) => {
              const isActive = trainingGoal === goal.id;
              return (
                <button
                  key={goal.id}
                  onClick={() => {
                    playTabSound(soundEnabled);
                    setTrainingGoal(goal.id);
                  }}
                  className={`p-4 rounded-2xl text-left border transition-all space-y-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)] shadow-md shadow-[var(--accent-primary)]/10'
                      : 'bg-[var(--bg-elevated)]/60 border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold uppercase ${
                        isActive ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'
                      }`}
                    >
                      {goal.label}
                    </span>
                    {isActive && <Check className="w-4 h-4 text-[var(--accent-primary)]" />}
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] font-sans leading-relaxed">
                    {goal.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Collapsible Advanced Filters */}
        <div className="rounded-3xl card-bento overflow-hidden">
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              setIsFiltersOpen(!isFiltersOpen);
            }}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-[var(--bg-elevated)]/50 transition-colors cursor-pointer"
            aria-expanded={isFiltersOpen}
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[var(--accent-primary)]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Advanced Biomechanical Filters
              </span>
              <span className="text-[11px] text-[var(--text-muted)] font-mono hidden sm:inline">
                (Muscle, Pattern, Mechanics, Difficulty)
              </span>
            </div>
            {isFiltersOpen ? (
              <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
            )}
          </button>

          {isFiltersOpen && (
            <div className="p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
              {/* Muscle Group Filter */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold">
                  Target Muscle Group
                </label>
                <select
                  value={targetMuscleFilter}
                  onChange={(e) => setTargetMuscleFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-sans text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                >
                  <option value="all">All Muscles</option>
                  <option value="Lats">Lats</option>
                  <option value="Upper Back">Upper Back</option>
                  <option value="Mid Chest">Mid Chest</option>
                  <option value="Upper Chest">Upper Chest</option>
                  <option value="Quads">Quads</option>
                  <option value="Hamstrings">Hamstrings</option>
                  <option value="Glutes">Glutes</option>
                  <option value="Front Delts">Front Delts</option>
                  <option value="Lateral Delts">Lateral Delts</option>
                  <option value="Rear Delts">Rear Delts</option>
                  <option value="Triceps">Triceps</option>
                  <option value="Biceps">Biceps</option>
                  <option value="Abs">Abs</option>
                  <option value="Calves">Calves</option>
                </select>
              </div>

              {/* Movement Pattern Filter */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold">
                  Movement Pattern
                </label>
                <select
                  value={movementPatternFilter}
                  onChange={(e) => setMovementPatternFilter(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-sans text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                >
                  <option value="all">All Patterns</option>
                  <option value="Vertical Pull">Vertical Pull</option>
                  <option value="Horizontal Pull">Horizontal Pull</option>
                  <option value="Horizontal Push">Horizontal Push</option>
                  <option value="Vertical Push">Vertical Push</option>
                  <option value="Squat">Squat</option>
                  <option value="Hip Hinge">Hip Hinge</option>
                  <option value="Lunge">Lunge</option>
                  <option value="Knee Extension">Knee Extension</option>
                  <option value="Knee Flexion">Knee Flexion</option>
                  <option value="Shoulder Isolation">Shoulder Isolation</option>
                  <option value="Arm Isolation">Arm Isolation</option>
                  <option value="Core Flexion">Core Flexion</option>
                  <option value="Core Anti-Extension">Core Anti-Extension</option>
                  <option value="Calf Isolation">Calf Isolation</option>
                </select>
              </div>

              {/* Mechanics Filter */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold">
                  Exercise Mechanics
                </label>
                <select
                  value={mechanicsFilter}
                  onChange={(e) => setMechanicsFilter(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-sans text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                >
                  <option value="all">All Mechanics</option>
                  <option value="compound">Multi-Joint Compound</option>
                  <option value="isolation">Single-Joint Isolation</option>
                </select>
              </div>

              {/* Difficulty Filter */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold">
                  Difficulty Level
                </label>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-sans text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner Friendly</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-4 flex justify-end pt-2">
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Reset all filters
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION C: RESULTS SECTION (RANKED ALTERNATIVES)
          ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[var(--text-primary)]">
                Recommended Alternatives
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-mono font-bold">
                {matchResults.length} Matched
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-sans pt-1">
              Deterministic ranking calculated from primary muscle recruitment, joint angles, equipment fit, and movement pattern parity.
            </p>
          </div>
        </div>

        {/* Empty State */}
        {matchResults.length === 0 ? (
          <div className="p-12 text-center rounded-3xl card-bento space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold uppercase text-[var(--text-primary)]">
              No Direct Substitutes Found With Current Filters
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto font-sans leading-relaxed">
              Your selected equipment or strict muscle/pattern filters excluded all available alternatives. Try expanding your equipment selection or resetting filters to &quot;Any Equipment&quot;.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] text-black font-mono text-xs font-bold shadow-md shadow-[var(--accent-primary)]/20 hover:bg-[var(--accent-hover)] transition-colors cursor-pointer"
            >
              Reset Equipment & Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matchResults.map((result, idx) => {
              const { exercise, score, scoreLabel, labels, whyRecommended, keyDifferences } = result;

              const isTopMatch = idx === 0 || score >= 90;
              const badgeColor =
                score >= 85
                  ? 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border-[var(--accent-primary)]/30'
                  : score >= 65
                  ? 'bg-sky-500/15 text-sky-400 border-sky-500/30'
                  : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border-[var(--border-subtle)]';

              return (
                <article
                  key={exercise.id}
                  className={`relative p-6 rounded-3xl card-bento transition-all space-y-5 flex flex-col justify-between ${
                    isTopMatch
                      ? 'border-[var(--accent-primary)]/40 shadow-lg shadow-[var(--accent-primary)]/5'
                      : ''
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold tabular-nums ${badgeColor}`}
                        >
                          {score}% Match • {scoreLabel}
                        </span>
                        {labels.map((lbl) => (
                          <span
                            key={lbl}
                            className="px-2 py-0.5 rounded-md bg-[var(--bg-elevated)] text-[10px] font-mono font-medium text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                          >
                            {lbl}
                          </span>
                        ))}
                      </div>
                      <span className="text-[11px] font-mono text-[var(--text-muted)] capitalize">
                        {exercise.exerciseType}
                      </span>
                    </div>

                    {/* Exercise Title & Summary */}
                    <div className="space-y-1">
                      <h3 className="text-xl font-black uppercase text-[var(--text-primary)] leading-tight">
                        {exercise.name}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                        {exercise.description}
                      </p>
                    </div>

                    {/* Target Muscle & Equipment Badges */}
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)] text-[11px] font-mono">
                      <div>
                        <span className="text-[var(--text-muted)] uppercase text-[9px] block">Primary Target</span>
                        <span className="font-bold text-[var(--text-primary)]">
                          {exercise.primaryMuscles.join(', ')}
                        </span>
                      </div>
                      <div>
                        <span className="text-[var(--text-muted)] uppercase text-[9px] block">Required Gear</span>
                        <span className="font-bold text-[var(--text-primary)] capitalize">
                          {exercise.equipment.join(' + ')}
                        </span>
                      </div>
                    </div>

                    {/* Why Recommended Callout */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-500 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" /> Why This Is A Suitable Alternative
                      </div>
                      <ul className="space-y-1 text-xs text-[var(--text-secondary)] font-sans pl-1">
                        {whyRecommended.map((r, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-2">
                            <span className="text-[var(--accent-primary)] font-bold">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Differences / Biomechanical Nuance */}
                    {keyDifferences.length > 0 && (
                      <div className="p-3.5 rounded-2xl bg-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/15 space-y-1">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent-primary)] font-bold flex items-center gap-1">
                          <Info className="w-3 h-3" /> Biomechanical Differences & Adjustments
                        </div>
                        <ul className="space-y-1 text-xs text-[var(--text-secondary)] font-sans">
                          {keyDifferences.map((d, dIdx) => (
                            <li key={dIdx} className="leading-snug">
                              • {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-[var(--border-subtle)]">
                    <button
                      onClick={() => setDetailModalExercise(exercise)}
                      className="flex-1 min-w-[130px] px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-primary)] text-xs font-mono font-bold hover:bg-[var(--border-subtle)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[var(--border-subtle)]"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      View Form Guide
                    </button>
                    <button
                      onClick={() => handleUseInTracker(exercise)}
                      className="flex-1 min-w-[160px] px-3.5 py-2.5 rounded-xl bg-[var(--accent-primary)] text-black text-xs font-mono font-bold hover:bg-[var(--accent-hover)] transition-colors shadow-md shadow-[var(--accent-primary)]/20 flex items-center justify-center gap-1.5 cursor-pointer btn-tactile"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      Use in PPL Tracker
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION D: EXERCISE DETAIL MODAL
          ========================================================================= */}
      {detailModalExercise && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-exercise-title"
        >
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
              <div className="space-y-1">
                <span className="px-2.5 py-1 rounded-md bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-[10px] font-mono font-bold uppercase">
                  {detailModalExercise.movementPattern} • {detailModalExercise.difficulty}
                </span>
                <h3
                  id="modal-exercise-title"
                  className="text-2xl sm:text-3xl font-black uppercase text-[var(--text-primary)]"
                >
                  {detailModalExercise.name}
                </h3>
              </div>
              <button
                onClick={() => setDetailModalExercise(null)}
                className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[var(--accent-primary)]" /> Execution Instructions
              </h4>
              <ol className="space-y-2 text-xs sm:text-sm text-[var(--text-secondary)] font-sans list-decimal pl-4 leading-relaxed">
                {detailModalExercise.instructions.map((step, sIdx) => (
                  <li key={sIdx}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Pro Form Cues */}
            <div className="space-y-2 p-4 rounded-2xl bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)]">
              <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                {"// Critical Form Cues"}
              </h4>
              <ul className="space-y-1.5 text-xs text-[var(--text-secondary)] font-sans">
                {detailModalExercise.cues.map((cue, cIdx) => (
                  <li key={cIdx} className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)] font-bold">✓</span>
                    <span>{cue}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Biomechanical Profile */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Biomechanical Breakdown
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block font-bold">
                    Resistance Curve
                  </span>
                  <span className="text-[var(--text-primary)]">
                    {detailModalExercise.biomechanics.resistanceProfile}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block font-bold">
                    Joint & Spine Profile
                  </span>
                  <span className="text-[var(--text-primary)]">
                    {detailModalExercise.biomechanics.jointStressProfile}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-end gap-3 border-t border-[var(--border-subtle)]">
              <button
                onClick={() => setDetailModalExercise(null)}
                className="px-4 py-2 rounded-xl bg-[var(--bg-elevated)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleUseInTracker(detailModalExercise);
                  setDetailModalExercise(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] text-black text-xs font-mono font-bold hover:bg-[var(--accent-hover)] shadow-md shadow-[var(--accent-primary)]/20 cursor-pointer btn-tactile"
              >
                Use in PPL Tracker
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

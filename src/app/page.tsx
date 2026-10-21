'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import {
  SplitDayId,
  ExerciseSet,
  LoggedWorkoutSession,
  DayWorkout,
} from '../types/workout';
import { WORKOUT_DAYS } from '../data/workouts';
import { calculateExerciseVolume, checkDoubleProgression } from '../utils/helpers';
import { WorkoutSummaryHeader } from '../components/WorkoutSummaryHeader';
import { ThreeGymVisualizer } from '../components/ThreeGymVisualizer';
import { RestTimer } from '../components/RestTimer';
import { ExerciseCard } from '../components/ExerciseCard';
import { GoldenRulesSection } from '../components/GoldenRulesSection';
import { PlateCalculatorModal } from '../components/PlateCalculatorModal';
import { WorkoutHistoryModal } from '../components/WorkoutHistoryModal';
import { CelebrationModal } from '../components/CelebrationModal';
import { AuthModal } from '../components/AuthModal';
import { ProfileModal } from '../components/ProfileModal';
import { Search, Filter, RotateCcw, ChevronRight, Sparkles } from 'lucide-react';

export default function PplTrackerHome() {
  const [activeDayId, setActiveDayId] = useState<SplitDayId | 'all'>('push-a');
  const [setsState, setSetsState] = useState<Record<string, ExerciseSet[]>>({});
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [historyLogs, setHistoryLogs] = useState<LoggedWorkoutSession[]>([]);

  // Rest Timer auto-trigger
  const [autoTimerTrigger, setAutoTimerTrigger] = useState<{
    timestamp: number;
    seconds: number;
  } | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [muscleFilter, setMuscleFilter] = useState<string>('All');

  // Modals state
  const [isPlateCalcOpen, setIsPlateCalcOpen] = useState(false);
  const [plateCalcWeight, setPlateCalcWeight] = useState(60);
  const [plateCalcExercise, setPlateCalcExercise] = useState('');

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [celebrationData, setCelebrationData] = useState<{
    dayTitle: string;
    totalVolume: number;
    totalSets: number;
    durationMinutes: number;
    doubleProgressions: string[];
  }>({
    dayTitle: '',
    totalVolume: 0,
    totalSets: 0,
    durationMinutes: 0,
    doubleProgressions: [],
  });

  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // Initialize data from localStorage (including legacy ppl-tracker.html support!)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load saved sound preference
    const savedSound = localStorage.getItem('ppl_sound');
    if (savedSound !== null) setSoundEnabled(savedSound === 'true');

    // Load saved history
    const savedHistory = localStorage.getItem('ppl_history_v2');
    if (savedHistory) {
      try {
        setHistoryLogs(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }

    // Build initial sets state
    const initialSets: Record<string, ExerciseSet[]> = {};
    const legacyChecked = JSON.parse(localStorage.getItem('ppl_checked') || '{}');
    const savedSets = JSON.parse(localStorage.getItem('ppl_sets_v2') || '{}');

    WORKOUT_DAYS.forEach((day) => {
      day.exercises.forEach((ex, exIdx) => {
        if (savedSets[ex.id]) {
          initialSets[ex.id] = savedSets[ex.id];
        } else {
          // Check if user had legacy checkmarks from old ppl-tracker.html
          const legacyKey = `${day.id}-${exIdx}`;
          const isLegacyChecked = !!legacyChecked[legacyKey];

          const defaultSets: ExerciseSet[] = Array.from({ length: ex.sets }).map((_, idx) => ({
            id: `${ex.id}-set-${idx + 1}`,
            setNumber: idx + 1,
            weight: '',
            reps: '',
            completed: isLegacyChecked,
          }));
          initialSets[ex.id] = defaultSets;
        }
      });
    });

    setSetsState(initialSets);
    setSessionStartTime(Date.now());
  }, []);

  // Save sets state to localStorage
  const handleUpdateSets = (exerciseId: string, nextSets: ExerciseSet[]) => {
    setSetsState((prev) => {
      const updated = { ...prev, [exerciseId]: nextSets };
      if (typeof window !== 'undefined') {
        localStorage.setItem('ppl_sets_v2', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('ppl_sound', String(next));
      }
      return next;
    });
  };

  const handleTriggerRestTimer = (seconds: number) => {
    setAutoTimerTrigger({
      timestamp: Date.now(),
      seconds,
    });
  };

  const openPlateCalculator = (weight: number, exerciseName: string) => {
    setPlateCalcWeight(weight || 60);
    setPlateCalcExercise(exerciseName);
    setIsPlateCalcOpen(true);
  };

  // Calculate active workout metrics
  const activeDaysList = useMemo(() => {
    if (activeDayId === 'all') return WORKOUT_DAYS;
    return WORKOUT_DAYS.filter((d) => d.id === activeDayId);
  }, [activeDayId]);

  const activeDayObject = useMemo(() => {
    if (activeDayId === 'all') return WORKOUT_DAYS[0];
    return WORKOUT_DAYS.find((d) => d.id === activeDayId) || WORKOUT_DAYS[0];
  }, [activeDayId]);

  const totalSessionVolume = useMemo(() => {
    let volume = 0;
    activeDaysList.forEach((day) => {
      day.exercises.forEach((ex) => {
        const sets = setsState[ex.id] || [];
        volume += calculateExerciseVolume(sets);
      });
    });
    return volume;
  }, [activeDaysList, setsState]);

  const { completedSetsCount, totalSetsCount } = useMemo(() => {
    let done = 0;
    let total = 0;
    activeDaysList.forEach((day) => {
      day.exercises.forEach((ex) => {
        const sets = setsState[ex.id] || [];
        total += sets.length;
        done += sets.filter((s) => s.completed).length;
      });
    });
    return { completedSetsCount: done, totalSetsCount: total };
  }, [activeDaysList, setsState]);

  // Finish Workout
  const handleFinishWorkout = () => {
    const durationMinutes = sessionStartTime
      ? Math.max(1, Math.round((Date.now() - sessionStartTime) / 60000))
      : 30;

    const doubleProgressionsEarned: string[] = [];
    activeDaysList.forEach((day) => {
      day.exercises.forEach((ex) => {
        const sets = setsState[ex.id] || [];
        if (checkDoubleProgression(sets, ex.maxReps)) {
          doubleProgressionsEarned.push(ex.name);
        }
      });
    });

    const newLog: LoggedWorkoutSession = {
      id: `session-${Date.now()}`,
      dayId: activeDayId === 'all' ? 'push-a' : activeDayId,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      startTime: sessionStartTime || Date.now() - 1800000,
      endTime: Date.now(),
      durationMinutes,
      totalVolumeKg: totalSessionVolume,
      totalSetsCompleted: completedSetsCount,
      totalRepsCompleted: 0,
      exercisesLogged: setsState,
      doubleProgressionsEarned,
    };

    const nextHistory = [newLog, ...historyLogs];
    setHistoryLogs(nextHistory);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ppl_history_v2', JSON.stringify(nextHistory));
    }

    setCelebrationData({
      dayTitle: activeDayId === 'all' ? '6-Day Split' : activeDayObject.title,
      totalVolume: totalSessionVolume,
      totalSets: completedSetsCount,
      durationMinutes,
      doubleProgressions: doubleProgressionsEarned,
    });
    setIsCelebrationOpen(true);
  };

  const handleResetSession = () => {
    if (!confirm("Reset all completed sets for current view? Your weights and rep numbers will be kept for reference.")) {
      return;
    }
    setSetsState((prev) => {
      const copy = { ...prev };
      activeDaysList.forEach((day) => {
        day.exercises.forEach((ex) => {
          if (copy[ex.id]) {
            copy[ex.id] = copy[ex.id].map((s) => ({ ...s, completed: false }));
          }
        });
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('ppl_sets_v2', JSON.stringify(copy));
        localStorage.removeItem('ppl_checked'); // clean legacy key
      }
      return copy;
    });
    setSessionStartTime(Date.now());
  };

  // GSAP animated transition on day tab switch
  useEffect(() => {
    if (cardsContainerRef.current) {
      gsap.fromTo(
        cardsContainerRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [activeDayId]);

  // Muscle filter categories
  const muscleGroups = ['All', 'Chest', 'Delts', 'Back', 'Triceps', 'Biceps', 'Quads', 'Hamstrings', 'Calves', 'Abs'];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-24 selection:bg-amber-500 selection:text-black">
      {/* Sticky Top Header Navigation */}
      <WorkoutSummaryHeader
        activeDayId={activeDayId}
        onSelectDay={setActiveDayId}
        totalVolume={totalSessionVolume}
        completedSetsCount={completedSetsCount}
        totalSetsCount={totalSetsCount}
        onFinishWorkout={handleFinishWorkout}
        onResetSession={handleResetSession}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAuth={() => {
          setAuthMode('login');
          setIsAuthModalOpen(true);
        }}
        sessionStartTime={sessionStartTime}
      />

      <main className="max-w-6xl mx-auto px-4 mt-6 space-y-7">
        {/* Top Interactive Row: 3D Rig & Rest Timer */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Three.js 3D Visualizer */}
          <div className="lg:col-span-7">
            <ThreeGymVisualizer
              splitType={activeDayObject.splitType}
              focusText={activeDayObject.focus}
              themeColorHex={activeDayObject.accentHex}
            />
          </div>

          {/* Rest Timer Widget */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <RestTimer
              initialSeconds={90}
              soundEnabled={soundEnabled}
              onToggleSound={toggleSound}
              autoStartedTimestamp={autoTimerTrigger?.timestamp}
              autoSeconds={autoTimerTrigger?.seconds}
            />

            {/* Quick Split Insight Pill */}
            <div className="mt-3 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  {activeDayObject.title} Protocol
                </h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {activeDayObject.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* 3 Golden Rules Section */}
        <GoldenRulesSection />

        {/* Search & Muscle Filters Bar */}
        <section className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-md">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search exercise, target muscle, or cue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* Muscle Chips Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <Filter className="w-3.5 h-3.5 text-zinc-500 shrink-0 ml-1 mr-0.5" />
            {muscleGroups.map((mg) => (
              <button
                key={mg}
                onClick={() => setMuscleFilter(mg)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition active:scale-95 border ${
                  muscleFilter === mg
                    ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white border-zinc-800'
                }`}
              >
                {mg}
              </button>
            ))}
          </div>
        </section>

        {/* Workout Days & Exercises Container */}
        <div ref={cardsContainerRef} className="space-y-8">
          {activeDaysList.map((day) => {
            // Apply search & muscle filter to exercises
            const filteredExercises = day.exercises.filter((ex) => {
              const matchesSearch =
                searchQuery === '' ||
                ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ex.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ex.cue.toLowerCase().includes(searchQuery.toLowerCase());

              const matchesMuscle =
                muscleFilter === 'All' ||
                ex.target.toLowerCase().includes(muscleFilter.toLowerCase()) ||
                ex.primaryMuscle.toLowerCase().includes(muscleFilter.toLowerCase());

              return matchesSearch && matchesMuscle;
            });

            if (filteredExercises.length === 0) return null;

            return (
              <section key={day.id} className="space-y-4">
                {/* Day Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-zinc-800/80 gap-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400 uppercase">
                        Day {day.dayNumber}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                      <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                        {day.title}
                      </h2>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">{day.subtitle}</p>
                  </div>

                  <span className="text-xs font-mono text-zinc-500 uppercase self-start sm:self-auto">
                    {filteredExercises.length} Exercises Prescribed
                  </span>
                </div>

                {/* Exercise Cards Grid */}
                <div className="grid grid-cols-1 gap-4">
                  {filteredExercises.map((exercise) => {
                    const currentSets = setsState[exercise.id] || [];

                    return (
                      <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        sets={currentSets}
                        themeColor={day.themeColor}
                        onUpdateSets={handleUpdateSets}
                        onTriggerRestTimer={handleTriggerRestTimer}
                        onOpenPlateCalc={openPlateCalculator}
                        soundEnabled={soundEnabled}
                      />
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Bottom Actions: Reset Checkmarks & Clear */}
        <div className="pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <span className="text-zinc-500">
            Progress is automatically saved to your browser&apos;s local storage.
          </span>

          <button
            onClick={handleResetSession}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded-xl transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Current Sets
          </button>
        </div>
      </main>

      {/* Modals */}
      <PlateCalculatorModal
        isOpen={isPlateCalcOpen}
        onClose={() => setIsPlateCalcOpen(false)}
        initialWeight={plateCalcWeight}
        exerciseName={plateCalcExercise}
      />

      <WorkoutHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyLogs={historyLogs}
        onClearHistory={() => {
          setHistoryLogs([]);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('ppl_history_v2');
          }
        }}
        onImportData={(imported) => {
          setHistoryLogs(imported);
          if (typeof window !== 'undefined') {
            localStorage.setItem('ppl_history_v2', JSON.stringify(imported));
          }
        }}
      />

      <CelebrationModal
        isOpen={isCelebrationOpen}
        onClose={() => setIsCelebrationOpen(false)}
        dayTitle={celebrationData.dayTitle}
        totalVolume={celebrationData.totalVolume}
        totalSets={celebrationData.totalSets}
        durationMinutes={celebrationData.durationMinutes}
        doubleProgressions={celebrationData.doubleProgressions}
        soundEnabled={soundEnabled}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}

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
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  Search,
  Filter,
  RotateCcw,
  ChevronRight,
  Dumbbell,
  Timer,
  Boxes,
  History,
  User,
  Sparkles,
} from 'lucide-react';

export default function PplTrackerHome() {
  const { user, isAuthenticated } = useAuth();
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
  const timerSectionRef = useRef<HTMLDivElement>(null);
  const rigSectionRef = useRef<HTMLDivElement>(null);

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

  // Sync workout history with Supabase when user logs in
  useEffect(() => {
    if (!user?.id) return;

    async function syncCloudWorkouts() {
      try {
        const { data, error } = await supabase
          .from('workout_sessions')
          .select('*')
          .eq('user_id', user!.id)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const cloudLogs: LoggedWorkoutSession[] = data.map((row: any) => ({
            id: row.id,
            dayId: row.day_id,
            date: row.date,
            startTime: Date.now() - (row.duration_minutes || 30) * 60000,
            endTime: Date.now(),
            durationMinutes: row.duration_minutes || 0,
            totalVolumeKg: Number(row.total_volume_kg) || 0,
            totalSetsCompleted: row.total_sets_completed || 0,
            totalRepsCompleted: 0,
            exercisesLogged: row.exercises_logged || {},
            doubleProgressionsEarned: row.double_progressions || [],
          }));
          setHistoryLogs(cloudLogs);
          if (typeof window !== 'undefined') {
            localStorage.setItem('ppl_history_v2', JSON.stringify(cloudLogs));
          }
        }
      } catch (err) {
        console.error('Error fetching workout sessions from Supabase:', err);
      }
    }

    syncCloudWorkouts();
  }, [user?.id]);

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

    // Persist workout to Supabase if authenticated
    if (user?.id) {
      supabase
        .from('workout_sessions')
        .insert({
          user_id: user.id,
          day_id: newLog.dayId,
          date: newLog.date,
          duration_minutes: newLog.durationMinutes,
          total_volume_kg: newLog.totalVolumeKg,
          total_sets_completed: newLog.totalSetsCompleted,
          double_progressions: newLog.doubleProgressionsEarned,
          exercises_logged: newLog.exercisesLogged,
        })
        .then(({ error }) => {
          if (error) console.error('Failed to sync workout to Supabase:', error);
        });
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
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [activeDayId]);

  // Muscle filter categories
  const muscleGroups = ['All', 'Chest', 'Delts', 'Back', 'Triceps', 'Biceps', 'Quads', 'Hamstrings', 'Calves', 'Abs'];

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 pb-32 selection:bg-amber-500 selection:text-white">
      {/* Sticky App Header */}
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

      <main className="max-w-6xl mx-auto px-4 mt-5 space-y-6">
        {/* Top Interactive Row: 3D Rig & Rest Timer */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Three.js 3D Visualizer */}
          <div ref={rigSectionRef} className="lg:col-span-7">
            <ThreeGymVisualizer
              splitType={activeDayObject.splitType}
              focusText={activeDayObject.focus}
              themeColorHex={activeDayObject.accentHex}
            />
          </div>

          {/* Rest Timer Widget */}
          <div ref={timerSectionRef} className="lg:col-span-5 flex flex-col justify-between">
            <RestTimer
              initialSeconds={90}
              soundEnabled={soundEnabled}
              onToggleSound={toggleSound}
              autoStartedTimestamp={autoTimerTrigger?.timestamp}
              autoSeconds={autoTimerTrigger?.seconds}
            />

            {/* Quick Split Insight Pill */}
            <div className="mt-3 bg-white border border-zinc-200/90 rounded-3xl p-4 shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                  {activeDayObject.title} Focus
                </h4>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                {activeDayObject.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* 3 Golden Rules Section */}
        <GoldenRulesSection />

        {/* Search & Muscle Filters Bar */}
        <section className="bg-white border border-zinc-200/90 rounded-3xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search exercise, target muscle, or cue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-10 pr-4 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-amber-500 transition font-medium"
            />
          </div>

          {/* Muscle Chips Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <Filter className="w-3.5 h-3.5 text-zinc-400 shrink-0 ml-1 mr-0.5" />
            {muscleGroups.map((mg) => (
              <button
                key={mg}
                onClick={() => setMuscleFilter(mg)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition active:scale-95 border ${
                  muscleFilter === mg
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                    : 'bg-zinc-50 text-zinc-600 hover:text-zinc-900 border-zinc-200'
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-zinc-200 gap-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-600 uppercase">
                        Day {day.dayNumber}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                      <h2 className="text-lg sm:text-xl font-black text-zinc-900 tracking-tight">
                        {day.title}
                      </h2>
                    </div>
                    <p className="text-xs text-zinc-500 font-medium mt-0.5">{day.subtitle}</p>
                  </div>

                  <span className="text-xs font-mono font-bold text-zinc-500 uppercase self-start sm:self-auto">
                    {filteredExercises.length} Movements
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
        <div className="pt-6 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <span className="text-zinc-500 font-medium">
            Progress is automatically saved to your browser&apos;s local storage.
          </span>

          <button
            onClick={handleResetSession}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200 rounded-2xl shadow-xs transition active:scale-95 font-bold"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Current Sets
          </button>
        </div>
      </main>

      {/* Native App-Style Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-zinc-200 px-4 py-2 sm:hidden shadow-lg">
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center justify-center py-1 text-zinc-700 hover:text-amber-600 transition"
          >
            <Dumbbell className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-0.5">Workout</span>
          </button>

          <button
            onClick={() => scrollToSection(timerSectionRef)}
            className="flex flex-col items-center justify-center py-1 text-zinc-700 hover:text-amber-600 transition"
          >
            <Timer className="w-5 h-5 text-amber-500" />
            <span className="text-[10px] font-bold mt-0.5">Timer</span>
          </button>

          <button
            onClick={() => scrollToSection(rigSectionRef)}
            className="flex flex-col items-center justify-center py-1 text-zinc-700 hover:text-amber-600 transition"
          >
            <Boxes className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-0.5">3D Rig</span>
          </button>

          <button
            onClick={() => setIsHistoryOpen(true)}
            className="flex flex-col items-center justify-center py-1 text-zinc-700 hover:text-amber-600 transition"
          >
            <History className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-0.5">Logs</span>
          </button>

          <button
            onClick={() => {
              if (isAuthenticated && user) {
                setIsProfileModalOpen(true);
              } else {
                setAuthMode('login');
                setIsAuthModalOpen(true);
              }
            }}
            className="flex flex-col items-center justify-center py-1 text-zinc-700 hover:text-amber-600 transition"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-0.5">
              {isAuthenticated ? 'Profile' : 'Sign In'}
            </span>
          </button>
        </div>
      </nav>

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
        onClearHistory={async () => {
          setHistoryLogs([]);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('ppl_history_v2');
          }
          if (user?.id) {
            await supabase.from('workout_sessions').delete().eq('user_id', user.id);
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

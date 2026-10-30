'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  SplitDayId,
  ExerciseSet,
  LoggedWorkoutSession,
  DayWorkout,
} from '../types/workout';
import {
  WORKOUT_DAYS,
  getWorkoutDaysForSplit,
  getScheduledDayForToday,
  applyWeakPointPriorities,
} from '../data/workouts';
import { calculateExerciseVolume, checkDoubleProgression } from '../utils/helpers';
import { playClickSound, playTabSound, playPopSound } from '../utils/audio';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { WorkoutSummaryHeader } from './WorkoutSummaryHeader';
import { GymRigVisualizer } from './GymRigVisualizer';
import { RestTimer } from './RestTimer';
import { ExerciseCard } from './ExerciseCard';
import { GoldenRulesSection } from './GoldenRulesSection';
import { useAuth } from '../context/AuthContext';
import { AuthModalMode } from '../types/auth';
import { supabase } from '../lib/supabase';

// Dynamically import heavy modals to eliminate them from initial JavaScript bundle
const PlateCalculatorModal = dynamic(
  () => import('./PlateCalculatorModal').then((m) => m.PlateCalculatorModal),
  { ssr: false }
);
const WorkoutHistoryModal = dynamic(
  () => import('./WorkoutHistoryModal').then((m) => m.WorkoutHistoryModal),
  { ssr: false }
);
const CelebrationModal = dynamic(
  () => import('./CelebrationModal').then((m) => m.CelebrationModal),
  { ssr: false }
);
const AuthModal = dynamic(
  () => import('./AuthModal').then((m) => m.AuthModal),
  { ssr: false }
);
const ProfileModal = dynamic(
  () => import('./ProfileModal').then((m) => m.ProfileModal),
  { ssr: false }
);
const OnboardingModal = dynamic(
  () => import('./OnboardingModal').then((m) => m.OnboardingModal),
  { ssr: false }
);
const LandingPage = dynamic(
  () => import('./LandingPage').then((m) => m.LandingPage),
  { ssr: false }
);
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
  Calendar,
  Zap,
  Wifi,
  WifiOff,
} from 'lucide-react';

export function PplTrackerApp({
  initialView = 'app',
}: {
  initialView?: 'app' | 'landing';
} = {}) {
  const { user, isAuthenticated, isLoading, isPasswordRecovery, refreshProfile } = useAuth();

  // Active workout program based on user's split selection
  const userSplitId = user?.selectedSplit || 'ppl';
  const splitWorkouts = useMemo(() => getWorkoutDaysForSplit(userSplitId), [userSplitId]);

  // Day-Specific Smart Scheduling: detect current day of the week
  const scheduleInfo = useMemo(() => getScheduledDayForToday(userSplitId), [userSplitId]);

  // Active selected workout day & View mode
  const [activeDayId, setActiveDayId] = useState<SplitDayId | 'all'>('push-a');
  const [hasInitializedDay, setHasInitializedDay] = useState(false);
  const [activeView, setActiveView] = useState<'app' | 'landing'>(initialView);

  // Network connectivity state for gym offline usage
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [showReconnectedBanner, setShowReconnectedBanner] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnectedBanner(true);
      const timer = setTimeout(() => setShowReconnectedBanner(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnectedBanner(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sets state & logging
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
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthModalMode>('login');

  // Trigger modal when password recovery link is opened
  useEffect(() => {
    if (isPasswordRecovery) {
      setAuthMode('reset-password');
      setIsAuthModalOpen(true);
    }
  }, [isPasswordRecovery]);

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

  // Auto-route to today's scheduled day upon load/login
  useEffect(() => {
    if (!hasInitializedDay && scheduleInfo?.scheduledDayId) {
      setActiveDayId(scheduleInfo.scheduledDayId);
      setHasInitializedDay(true);
    }
  }, [scheduleInfo, hasInitializedDay]);

  // When split changes, make sure active day is valid
  useEffect(() => {
    if (splitWorkouts.length > 0 && activeDayId !== 'all') {
      const exists = splitWorkouts.some((d) => d.id === activeDayId);
      if (!exists) {
        setActiveDayId(scheduleInfo.scheduledDayId || splitWorkouts[0].id);
      }
    }
  }, [splitWorkouts, activeDayId, scheduleInfo]);

  // Initialize data from localStorage & build sets state
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

    // Build initial sets state for all exercises in the active split
    const initialSets: Record<string, ExerciseSet[]> = {};
    const legacyChecked = JSON.parse(localStorage.getItem('ppl_checked') || '{}');
    const savedSets = JSON.parse(localStorage.getItem('ppl_sets_v2') || '{}');

    splitWorkouts.forEach((day) => {
      day.exercises.forEach((ex, exIdx) => {
        if (savedSets[ex.id]) {
          initialSets[ex.id] = savedSets[ex.id];
        } else {
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

    setSetsState((prev) => ({ ...defaultFallbackSets(savedSets), ...prev, ...initialSets }));
    setSessionStartTime(Date.now());
  }, [splitWorkouts]);

  const defaultFallbackSets = (saved: any) => saved || {};

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

  // Weak-point prioritized days list
  const activeDaysList = useMemo(() => {
    const rawDays = activeDayId === 'all'
      ? splitWorkouts
      : splitWorkouts.filter((d) => d.id === activeDayId);

    // Run each day through weak-point priority engine
    return rawDays.map((day) => applyWeakPointPriorities(day, user?.weakPoints || []));
  }, [activeDayId, splitWorkouts, user?.weakPoints]);

  const activeDayObject = useMemo(() => {
    if (activeDayId === 'all') return activeDaysList[0] || splitWorkouts[0];
    return activeDaysList.find((d) => d.id === activeDayId) || activeDaysList[0] || splitWorkouts[0];
  }, [activeDayId, activeDaysList, splitWorkouts]);

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
      dayId: activeDayId === 'all' ? splitWorkouts[0]?.id || 'push-a' : activeDayId,
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
      dayTitle: activeDayId === 'all' ? `${userSplitId.toUpperCase()} Split` : (activeDayObject?.title || 'Workout Session'),
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
        localStorage.removeItem('ppl_checked');
      }
      return copy;
    });
    setSessionStartTime(Date.now());
  };

  // High-performance hardware-accelerated CSS Web Animations API transition on day tab switch
  useEffect(() => {
    if (cardsContainerRef.current) {
      cardsContainerRef.current.animate(
        [
          { opacity: 0, transform: 'translateY(10px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 200, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
      );
    }
  }, [activeDayId]);

  const muscleGroups = ['All', 'Chest', 'Delts', 'Back', 'Triceps', 'Biceps', 'Quads', 'Hamstrings', 'Calves', 'Abs'];

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Onboarding & Profile Setup requirement
  const needsOnboarding = (user && !user.onboardingCompleted && !user.isGuest) || isOnboardingModalOpen;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-white transition-colors duration-200">
      {/* Onboarding Wizard Modal */}
      <OnboardingModal
        isOpen={needsOnboarding}
        onComplete={() => {
          setIsOnboardingModalOpen(false);
          refreshProfile();
        }}
      />

      {/* Universal Top Navigation Header */}
      <Navbar
        activeView={activeView}
        onSwitchView={setActiveView}
        onOpenPlateCalc={() => openPlateCalculator(60, 'Barbell Press')}
        onOpenHistory={() => {
          playClickSound(soundEnabled);
          setIsHistoryOpen(true);
        }}
        onOpenProfile={() => {
          playClickSound(soundEnabled);
          setIsProfileModalOpen(true);
        }}
        onOpenAuth={(mode) => {
          playClickSound(soundEnabled);
          setAuthMode(mode);
          setIsAuthModalOpen(true);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        totalVolume={totalSessionVolume}
        completedSetsCount={completedSetsCount}
        totalSetsCount={totalSetsCount}
      />

      {/* CONDITIONAL MAIN VIEW: Tracker App vs Platform Marketing & Guide */}
      {activeView === 'landing' ? (
        <main className="flex-1">
          <LandingPage
            onOpenAuth={(mode) => {
              playClickSound(soundEnabled);
              setAuthMode(mode);
              setIsAuthModalOpen(true);
            }}
            onStartWorkout={() => {
              playTabSound(soundEnabled);
              setActiveView('app');
            }}
            soundEnabled={soundEnabled}
          />
        </main>
      ) : (
        <div className="flex-1 pb-24 sm:pb-12">
          {/* Sticky Session Metrics & Day Selector HUD */}
          <WorkoutSummaryHeader
            activeDayId={activeDayId}
            onSelectDay={setActiveDayId}
            totalVolume={totalSessionVolume}
            completedSetsCount={completedSetsCount}
            totalSetsCount={totalSetsCount}
            onFinishWorkout={handleFinishWorkout}
            onResetSession={handleResetSession}
            onOpenHistory={() => {
              playClickSound(soundEnabled);
              setIsHistoryOpen(true);
            }}
            onOpenProfile={() => {
              playClickSound(soundEnabled);
              setIsProfileModalOpen(true);
            }}
            onOpenAuth={() => {
              playClickSound(soundEnabled);
              setAuthMode('login');
              setIsAuthModalOpen(true);
            }}
            sessionStartTime={sessionStartTime}
            daysList={splitWorkouts}
            scheduledDayId={scheduleInfo.scheduledDayId}
            dayOfWeekName={scheduleInfo.dayOfWeekName}
            soundEnabled={soundEnabled}
          />

          <main className="max-w-6xl mx-auto px-4 mt-6 space-y-6">
            {/* OFFLINE GYM STATUS BANNER */}
            {!isOnline && (
              <div
                role="status"
                aria-live="polite"
                className="bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-3xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono shadow-xs animate-in fade-in"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500 shrink-0">
                    <WifiOff className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-amber-500 uppercase tracking-wider block sm:inline">
                      Offline Mode Active • Gym-Safe Session
                    </span>
                    <span className="text-zinc-600 dark:text-zinc-400 block sm:inline sm:ml-2">
                      All sets, weights, reps & timers are securely saving locally on this device.
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-black px-2.5 py-1 rounded-full self-start sm:self-auto shrink-0 shadow-xs">
                  100% Offline Ready
                </span>
              </div>
            )}

            {showReconnectedBanner && (
              <div
                role="status"
                aria-live="polite"
                className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-3xl p-4 flex items-center justify-between gap-3 text-xs font-mono shadow-xs animate-in fade-in"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <span>
                    <strong className="text-emerald-400">Connection Restored:</strong> Cloud sync re-established.
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-black px-2.5 py-1 rounded-full shrink-0 shadow-xs">
                  Synced
                </span>
              </div>
            )}

            {/* DAY-SPECIFIC SMART SCHEDULING BANNER */}
            <section className="bg-white dark:bg-[#12141c] border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold uppercase text-amber-500 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Today is {scheduleInfo.dayOfWeekName}
                      </span>
                      <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                        • Scheduled: <strong className="text-zinc-900 dark:text-white">{scheduleInfo.scheduledWorkout.title}</strong>
                      </span>
                      {scheduleInfo.isRestDay && (
                        <span className="px-2 py-0.2 rounded-full bg-sky-500/15 text-sky-500 text-[10px] font-mono font-bold">
                          Active Recovery Day
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                      {scheduleInfo.statusMessage}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  {activeDayId !== scheduleInfo.scheduledDayId && (
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound(soundEnabled);
                        setActiveDayId(scheduleInfo.scheduledDayId);
                      }}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-black text-xs font-mono font-bold uppercase rounded-xl transition-all btn-tactile cursor-pointer flex items-center gap-1"
                    >
                      <Zap className="w-3.5 h-3.5" /> Jump to Today
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound(soundEnabled);
                      setIsProfileModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 text-xs font-mono font-semibold rounded-xl transition-all btn-tactile cursor-pointer"
                  >
                    Change Split
                  </button>
                </div>
              </div>
            </section>

            {/* Top Interactive Row: Rig & Rest Timer */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* High-Performance Vector Rig & Kinematics Visualizer */}
              <div ref={rigSectionRef} className="lg:col-span-7">
                <GymRigVisualizer
                  splitType={activeDayObject.splitType as any}
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
                <div className="mt-3 bg-white dark:bg-[#12141c] border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-4 shadow-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <h4 className="text-xs font-display font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                      {activeDayObject.title} Focus
                    </h4>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                    {activeDayObject.subtitle}
                  </p>
                </div>
              </div>
            </section>

            {/* 3 Golden Rules Section */}
            <GoldenRulesSection />

            {/* Search & Muscle Filters Bar */}
            <section className="bg-white dark:bg-[#12141c] border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search exercise, target muscle, or cue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-amber-500 transition font-medium"
                />
              </div>

              {/* Muscle Chips Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                <Filter className="w-3.5 h-3.5 text-zinc-400 shrink-0 ml-1 mr-0.5" />
                {muscleGroups.map((mg) => (
                  <button
                    key={mg}
                    onClick={() => {
                      playTabSound(soundEnabled);
                      setMuscleFilter(mg);
                    }}
                    type="button"
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all btn-tactile border cursor-pointer ${
                      muscleFilter === mg
                        ? 'bg-amber-500 text-black border-amber-500 shadow-xs'
                        : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border-zinc-200 dark:border-zinc-800'
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
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-zinc-200/80 dark:border-zinc-800/80 gap-1">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-500 uppercase">
                            Day {day.dayNumber}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                          <h2 className="text-lg sm:text-xl font-display font-black text-zinc-900 dark:text-white tracking-tight uppercase">
                            {day.title}
                          </h2>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mt-0.5">{day.subtitle}</p>
                      </div>

                      <span className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 uppercase self-start sm:self-auto">
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
            <div className="pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
              <span className="text-zinc-600 dark:text-zinc-400 font-medium font-mono">
                Progress automatically saved to your browser&apos;s local storage and synced to cloud.
              </span>

              <button
                onClick={() => {
                  playClickSound(soundEnabled);
                  handleResetSession();
                }}
                type="button"
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs transition-all btn-tactile font-mono font-bold cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Current Sets
              </button>
            </div>
          </main>
        </div>
      )}

      {/* Structured Comprehensive Minimalist Footer */}
      <Footer
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onOpenPlateCalc={() => openPlateCalculator(60, 'Barbell Press')}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Native App-Style Mobile Bottom Navigation Bar */}
      {activeView === 'app' && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#090a0f]/95 backdrop-blur-lg border-t border-zinc-200/80 dark:border-zinc-800/80 px-4 py-2 sm:hidden shadow-lg transition-colors">
          <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
            <button
              onClick={() => {
                playClickSound(soundEnabled);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              type="button"
              className="flex flex-col items-center justify-center py-1 text-zinc-700 dark:text-zinc-300 hover:text-amber-500 transition-all btn-tactile cursor-pointer"
            >
              <Dumbbell className="w-5 h-5 text-amber-500" />
              <span className="text-[10px] font-bold mt-0.5">Workout</span>
            </button>

            <button
              onClick={() => {
                playClickSound(soundEnabled);
                scrollToSection(timerSectionRef);
              }}
              type="button"
              className="flex flex-col items-center justify-center py-1 text-zinc-700 dark:text-zinc-300 hover:text-amber-500 transition-all btn-tactile cursor-pointer"
            >
              <Timer className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-0.5">Timer</span>
            </button>

            <button
              onClick={() => {
                playClickSound(soundEnabled);
                scrollToSection(rigSectionRef);
              }}
              type="button"
              className="flex flex-col items-center justify-center py-1 text-zinc-700 dark:text-zinc-300 hover:text-amber-500 transition-all btn-tactile cursor-pointer"
            >
              <Boxes className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-0.5">3D Rig</span>
            </button>

            <button
              onClick={() => {
                playClickSound(soundEnabled);
                setIsHistoryOpen(true);
              }}
              type="button"
              className="flex flex-col items-center justify-center py-1 text-zinc-700 dark:text-zinc-300 hover:text-amber-500 transition-all btn-tactile cursor-pointer"
            >
              <History className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-0.5">Logs</span>
            </button>

            <button
              onClick={() => {
                playClickSound(soundEnabled);
                setIsProfileModalOpen(true);
              }}
              type="button"
              className="flex flex-col items-center justify-center py-1 text-zinc-700 dark:text-zinc-300 hover:text-amber-500 transition-all btn-tactile cursor-pointer"
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-0.5">Profile</span>
            </button>
          </div>
        </nav>
      )}

      {/* On-Demand Modals (Rendered only when open to preserve DOM performance) */}
      {isPlateCalcOpen && (
        <PlateCalculatorModal
          isOpen={isPlateCalcOpen}
          onClose={() => setIsPlateCalcOpen(false)}
          initialWeight={plateCalcWeight}
          exerciseName={plateCalcExercise}
          soundEnabled={soundEnabled}
        />
      )}

      {isHistoryOpen && (
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
          soundEnabled={soundEnabled}
        />
      )}

      {isCelebrationOpen && (
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
      )}

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authMode}
        />
      )}

      {isProfileModalOpen && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onOpenOnboarding={() => setIsOnboardingModalOpen(true)}
        />
      )}
    </div>
  );
}

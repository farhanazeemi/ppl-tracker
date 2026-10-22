'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Flame,
  CheckCircle2,
  Clock,
  History,
  RotateCcw,
  Sparkles,
  Trophy,
  User,
  LogIn,
  BookOpen,
  Calendar,
  Layers
} from 'lucide-react';
import { SplitDayId, DayWorkout } from '../types/workout';
import { WORKOUT_DAYS } from '../data/workouts';
import { formatTime } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

interface WorkoutSummaryHeaderProps {
  activeDayId: SplitDayId | 'all';
  onSelectDay: (dayId: SplitDayId | 'all') => void;
  totalVolume: number;
  completedSetsCount: number;
  totalSetsCount: number;
  onFinishWorkout: () => void;
  onResetSession: () => void;
  onOpenHistory: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  sessionStartTime: number | null;
  daysList?: DayWorkout[];
  scheduledDayId?: SplitDayId;
  dayOfWeekName?: string;
}

export const WorkoutSummaryHeader: React.FC<WorkoutSummaryHeaderProps> = ({
  activeDayId,
  onSelectDay,
  totalVolume,
  completedSetsCount,
  totalSetsCount,
  onFinishWorkout,
  onResetSession,
  onOpenHistory,
  onOpenProfile,
  onOpenAuth,
  sessionStartTime,
  daysList = WORKOUT_DAYS,
  scheduledDayId,
  dayOfWeekName,
}) => {
  const { user, isAuthenticated, isGuest } = useAuth();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!sessionStartTime) {
      setElapsedSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      setElapsedSeconds(Math.floor((now - sessionStartTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStartTime]);

  const progressPercent =
    totalSetsCount > 0 ? Math.round((completedSetsCount / totalSetsCount) * 100) : 0;

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const splitDisplayTitle = {
    ppl: 'Push-Pull-Legs (6D)',
    'bro-split': 'Bro Split (5D)',
    'upper-lower': 'Upper / Lower (4D)',
    'full-body': 'Full Body (3D)',
  }[user?.selectedSplit || 'ppl'] || 'Push-Pull-Legs';

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#090a0f]/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 sm:py-3.5 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-3">
        {/* Main Title Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/25 rounded-md font-mono">
                {splitDisplayTitle}
              </span>
              {dayOfWeekName && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 rounded-md font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Today is {dayOfWeekName}
                </span>
              )}
              {user?.weakPoints && user.weakPoints.length > 0 && (
                <span className="hidden sm:inline-flex text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                  Focus: {user.weakPoints.join(', ')}
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-black tracking-tight text-zinc-900 dark:text-white mt-0.5 flex items-center gap-2 uppercase">
              Hypertrophy Tracker
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 hidden sm:inline" />
            </h1>
          </div>

          {/* Quick Metrics Bar & CTAs */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Volume Pill */}
            <div className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center gap-2 shadow-xs">
              <Flame className="w-4 h-4 text-amber-500" />
              <div>
                <span className="text-[9px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block font-bold font-mono">
                  Volume
                </span>
                <span className="font-mono text-xs sm:text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
                  {totalVolume.toLocaleString()}{' '}
                  <span className="text-zinc-600 dark:text-zinc-400 text-[10px]">
                    {user?.preferredUnit ? user.preferredUnit.toUpperCase() : 'KG'}
                  </span>
                </span>
              </div>
            </div>

            {/* Sets Done Pill */}
            <div className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center gap-2 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <div>
                <span className="text-[9px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block font-bold font-mono">
                  Sets Done
                </span>
                <span className="font-mono text-xs sm:text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
                  {completedSetsCount}/{totalSetsCount} ({progressPercent}%)
                </span>
              </div>
            </div>

            {/* Duration Timer */}
            <div className="hidden lg:flex px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl items-center gap-2 shadow-xs">
              <Clock className="w-4 h-4 text-sky-500" />
              <div>
                <span className="text-[9px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block font-bold font-mono">
                  Duration
                </span>
                <span className="font-mono text-xs sm:text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
                  {formatTime(elapsedSeconds)}
                </span>
              </div>
            </div>

            {/* Blog Link */}
            <Link
              href="/blog"
              className="p-2 sm:px-3 sm:py-1.5 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs active:scale-95"
              title="Hypertrophy Science Blog"
            >
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Articles</span>
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* History Button */}
            <button
              onClick={onOpenHistory}
              className="p-2 sm:px-3 sm:py-1.5 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs active:scale-95 cursor-pointer"
              title="Workout History & PRs"
              aria-label="Workout History & PRs"
            >
              <History className="w-4 h-4 text-zinc-500" />
              <span className="hidden sm:inline">Logs</span>
            </button>

            {/* Finish Workout CTA */}
            <button
              onClick={onFinishWorkout}
              className="px-3.5 sm:px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-display font-bold text-xs uppercase tracking-wider rounded-2xl shadow-sm flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <Trophy className="w-4 h-4" />
              <span>Finish</span>
            </button>

            {/* Profile / Auth Button */}
            {isAuthenticated && user ? (
              isGuest ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={onOpenProfile}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-xs font-mono font-medium transition cursor-pointer"
                    title="Guest Athlete Settings"
                    aria-label="Guest Athlete Settings"
                  >
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="hidden sm:inline">Guest</span>
                  </button>
                  <button
                    onClick={onOpenAuth}
                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black font-display font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xs transition active:scale-95 cursor-pointer"
                    title="Save to Free Cloud Account"
                    aria-label="Save to Free Cloud Account"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sync Cloud</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenProfile}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl transition shadow-xs active:scale-95 group cursor-pointer"
                  title="View & Edit Profile"
                  aria-label="View & Edit Profile"
                >
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-black font-black text-xs shadow-xs">
                    {getInitials(user.name)}
                  </div>
                  <div className="text-left hidden xl:block pr-1">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block leading-tight truncate max-w-[90px]">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-zinc-500 dark:text-zinc-400 font-mono block">
                      {user.weight ? `${user.weight}kg` : 'Profile'}
                    </span>
                  </div>
                </button>
              )
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded-2xl text-xs font-bold transition shadow-xs active:scale-95 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Segmented Controls for Days (Dynamically renders days for user's split) */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar p-1 bg-zinc-100 dark:bg-zinc-900/80 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => onSelectDay('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition active:scale-95 cursor-pointer ${
              activeDayId === 'all'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm border border-zinc-200 dark:border-zinc-700'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            All Days ({daysList.length})
          </button>

          {daysList.map((day) => {
            const isActive = activeDayId === day.id;
            const isTodayScheduled = scheduledDayId === day.id;

            return (
              <button
                key={day.id}
                onClick={() => onSelectDay(day.id)}
                className={`relative px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-800/50'
                }`}
              >
                {day.title}
                {isTodayScheduled && (
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-black text-amber-400' : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                    }`}
                  >
                    Today
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

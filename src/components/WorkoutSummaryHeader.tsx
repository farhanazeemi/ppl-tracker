'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { SplitDayId } from '../types/workout';
import { WORKOUT_DAYS } from '../data/workouts';
import { formatTime } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

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
}) => {
  const { user, isAuthenticated } = useAuth();
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

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-zinc-200/90 px-4 py-3 sm:py-3.5">
      <div className="max-w-6xl mx-auto space-y-3">
        {/* Main Title Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 rounded-md">
                6-Day PPL Hypertrophy
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                Upper Chest & 3D Delts
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-mono text-zinc-400">
                Double Progression
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 mt-0.5 flex items-center gap-2">
              Push • Pull • Legs Tracker
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 hidden sm:inline" />
            </h1>
          </div>

          {/* Quick Metrics Bar & CTAs */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Volume Pill */}
            <div className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center gap-2 shadow-xs">
              <Flame className="w-4 h-4 text-amber-500" />
              <div>
                <span className="text-[9px] uppercase tracking-wider text-zinc-400 block font-bold">
                  Volume
                </span>
                <span className="font-mono text-xs sm:text-sm font-extrabold text-zinc-900">
                  {totalVolume.toLocaleString()}{' '}
                  <span className="text-zinc-500 text-[10px]">
                    {user?.preferredUnit ? user.preferredUnit.toUpperCase() : 'KG'}
                  </span>
                </span>
              </div>
            </div>

            {/* Sets Done Pill */}
            <div className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center gap-2 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-[9px] uppercase tracking-wider text-zinc-400 block font-bold">
                  Sets Done
                </span>
                <span className="font-mono text-xs sm:text-sm font-extrabold text-zinc-900">
                  {completedSetsCount}/{totalSetsCount} ({progressPercent}%)
                </span>
              </div>
            </div>

            {/* Duration Timer */}
            <div className="hidden lg:flex px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-2xl items-center gap-2 shadow-xs">
              <Clock className="w-4 h-4 text-sky-600" />
              <div>
                <span className="text-[9px] uppercase tracking-wider text-zinc-400 block font-bold">
                  Duration
                </span>
                <span className="font-mono text-xs sm:text-sm font-extrabold text-zinc-900">
                  {formatTime(elapsedSeconds)}
                </span>
              </div>
            </div>

            {/* History Button */}
            <button
              onClick={onOpenHistory}
              className="p-2 sm:px-3 sm:py-1.5 bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs active:scale-95"
              title="Workout History & PRs"
              aria-label="Workout History & PRs"
            >
              <History className="w-4 h-4 text-zinc-500" />
              <span className="hidden sm:inline">Logs</span>
            </button>

            {/* Finish Workout CTA */}
            <button
              onClick={onFinishWorkout}
              className="px-3.5 sm:px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-sm flex items-center gap-1.5 transition active:scale-95"
            >
              <Trophy className="w-4 h-4" />
              <span>Finish</span>
            </button>

            {/* Profile / Auth Button */}
            {isAuthenticated && user ? (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-2xl transition shadow-xs active:scale-95 group"
                title="View & Edit Profile"
                aria-label="View & Edit Profile"
              >
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-black text-xs shadow-xs">
                  {getInitials(user.name)}
                </div>
                <div className="text-left hidden xl:block pr-1">
                  <span className="text-xs font-bold text-zinc-900 block leading-tight truncate max-w-[90px]">
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-mono block">
                    {user.weight ? `${user.weight}kg` : 'Profile'}
                  </span>
                </div>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-2xl text-xs font-bold transition shadow-xs active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Native Segmented Controls for Days */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar p-1 bg-zinc-100/80 rounded-2xl border border-zinc-200/60">
          <button
            onClick={() => onSelectDay('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition active:scale-95 ${
              activeDayId === 'all'
                ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/80'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            All 6 Days
          </button>

          {WORKOUT_DAYS.map((day) => {
            const isActive = activeDayId === day.id;
            const activeStyle = {
              push: 'bg-amber-500 text-white shadow-xs',
              pull: 'bg-sky-500 text-white shadow-xs',
              legs: 'bg-emerald-500 text-white shadow-xs',
            }[day.splitType];

            return (
              <button
                key={day.id}
                onClick={() => onSelectDay(day.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition active:scale-95 ${
                  isActive
                    ? activeStyle
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50'
                }`}
              >
                {day.title}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

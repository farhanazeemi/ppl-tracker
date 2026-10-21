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
    <header className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3 sm:py-4">
      <div className="max-w-6xl mx-auto space-y-3.5">
        {/* Main Title Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/25 rounded-md">
                6-Day PPL Hypertrophy
              </span>
              <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 rounded-md">
                Upper Chest & 3D Delts Priority
              </span>
              <span className="hidden sm:inline-flex text-[11px] font-mono text-zinc-500">
                Double Progression Protocol
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1 flex items-center gap-2">
              Push • Pull • Legs Tracker
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 hidden sm:inline" />
            </h1>
          </div>

          {/* Quick Metrics Bar & CTAs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Volume Pill */}
            <div className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 block font-bold">
                  Session Volume
                </span>
                <span className="font-mono text-xs sm:text-sm font-extrabold text-white">
                  {totalVolume.toLocaleString()}{' '}
                  <span className="text-zinc-400 text-[10px]">
                    {user?.preferredUnit ? user.preferredUnit.toUpperCase() : 'KG'}
                  </span>
                </span>
              </div>
            </div>

            {/* Sets Done Pill */}
            <div className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 block font-bold">
                  Sets Done
                </span>
                <span className="font-mono text-xs sm:text-sm font-extrabold text-white">
                  {completedSetsCount}/{totalSetsCount} ({progressPercent}%)
                </span>
              </div>
            </div>

            {/* Duration Timer */}
            <div className="hidden lg:flex px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <div>
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 block font-bold">
                  Duration
                </span>
                <span className="font-mono text-xs sm:text-sm font-extrabold text-white">
                  {formatTime(elapsedSeconds)}
                </span>
              </div>
            </div>

            {/* History Button */}
            <button
              onClick={onOpenHistory}
              className="p-2 sm:px-3 sm:py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
              title="Workout History & PRs"
              aria-label="Workout History & PRs"
            >
              <History className="w-4 h-4 text-zinc-400" />
              <span className="hidden sm:inline">Logs</span>
            </button>

            {/* Finish Workout CTA */}
            <button
              onClick={onFinishWorkout}
              className="px-3 sm:px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/10 flex items-center gap-1.5 transition active:scale-95"
            >
              <Trophy className="w-4 h-4" />
              <span>Finish</span>
            </button>

            {/* Profile / Auth Button */}
            {isAuthenticated && user ? (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded-xl transition active:scale-95 group"
                title="View & Edit Profile"
                aria-label="View & Edit Profile"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-zinc-950 font-black text-[11px] shadow">
                  {getInitials(user.name)}
                </div>
                <div className="text-left hidden xl:block">
                  <span className="text-xs font-bold text-white block leading-tight truncate max-w-[100px]">
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-zinc-400 font-mono block">
                    {user.weight ? `${user.weight}kg` : 'Profile'}
                  </span>
                </div>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => onSelectDay('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition active:scale-95 border ${
              activeDayId === 'all'
                ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-zinc-900/90 text-zinc-400 hover:text-white border-zinc-800/80 hover:bg-zinc-800'
            }`}
          >
            All 6 Days
          </button>

          {WORKOUT_DAYS.map((day) => {
            const isActive = activeDayId === day.id;
            const splitBadgeStyles = {
              push: isActive
                ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-zinc-900/90 text-zinc-400 hover:text-amber-400 border-zinc-800/80',
              pull: isActive
                ? 'bg-sky-500 text-zinc-950 border-sky-400 shadow-md shadow-sky-500/20'
                : 'bg-zinc-900/90 text-zinc-400 hover:text-sky-400 border-zinc-800/80',
              legs: isActive
                ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                : 'bg-zinc-900/90 text-zinc-400 hover:text-emerald-400 border-zinc-800/80',
            }[day.splitType];

            return (
              <button
                key={day.id}
                onClick={() => onSelectDay(day.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition active:scale-95 border ${splitBadgeStyles}`}
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

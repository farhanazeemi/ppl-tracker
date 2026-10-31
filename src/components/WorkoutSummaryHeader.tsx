'use client';

import React, { useState, useEffect } from 'react';
import {
  Flame,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { SplitDayId, DayWorkout } from '../types/workout';
import { WORKOUT_DAYS } from '../data/workouts';
import { formatTime } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { playClickSound, playTabSound } from '../utils/audio';

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
  soundEnabled?: boolean;
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
  soundEnabled = true,
}) => {
  const { user } = useAuth();
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

  const handleDaySelect = (dayId: SplitDayId | 'all') => {
    playTabSound(soundEnabled);
    onSelectDay(dayId);
  };

  const handleFinish = () => {
    playClickSound(soundEnabled);
    onFinishWorkout();
  };

  const handleReset = () => {
    playClickSound(soundEnabled);
    onResetSession();
  };

  const splitDisplayTitle = {
    ppl: 'Push-Pull-Legs (6D)',
    'bro-split': 'Bro Split (5D)',
    'upper-lower': 'Upper / Lower (4D)',
    'full-body': 'Full Body (3D)',
  }[user?.selectedSplit || 'ppl'] || 'Push-Pull-Legs';

  return (
    <div className="bg-[var(--bg-card)]/90 backdrop-blur-xl border-b border-[var(--border-subtle)] px-4 py-3 sm:py-3.5 transition-colors duration-200 sticky top-16 z-30 shadow-xs">
      {/* Session Progress Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--bg-elevated)] overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#B7FF4A] to-[#36D6B0] transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="max-w-6xl mx-auto space-y-3">
        {/* Main Title Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#B7FF4A]/10 text-[#B7FF4A] border border-[#B7FF4A]/25 rounded-md font-mono">
                {splitDisplayTitle}
              </span>
              {dayOfWeekName && (
                <span className="px-2.5 py-0.5 text-[10px] font-bold bg-[#36D6B0]/10 text-[#36D6B0] border border-[#36D6B0]/25 rounded-md font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#36D6B0] animate-pulse" />
                  Today is {dayOfWeekName}
                </span>
              )}
              {user?.weakPoints && user.weakPoints.length > 0 && (
                <span className="hidden sm:inline-flex text-[10px] font-mono text-[var(--text-muted)]">
                  Focus: {user.weakPoints.join(', ')}
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)] uppercase flex items-center gap-2 font-display">
              Active Workout Session
              <Sparkles className="w-4 h-4 text-[#B7FF4A] shrink-0 hidden sm:inline" />
            </h1>
          </div>

          {/* Quick Metrics Bar & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Volume Metric */}
            <div className="px-3 py-1.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl flex items-center gap-2 shadow-xs">
              <Flame className="w-4 h-4 text-[#B7FF4A]" />
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] block font-bold font-mono">
                  Volume
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-[var(--text-primary)] tabular-nums">
                  {totalVolume.toLocaleString()}{' '}
                  <span className="text-[var(--text-muted)] text-[10px]">
                    {user?.preferredUnit ? user.preferredUnit.toUpperCase() : 'KG'}
                  </span>
                </span>
              </div>
            </div>

            {/* Sets Done Metric */}
            <div className="px-3 py-1.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl flex items-center gap-2 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-[#36D6B0]" />
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] block font-bold font-mono">
                  Sets Done
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-[var(--text-primary)] tabular-nums">
                  {completedSetsCount}/{totalSetsCount} ({progressPercent}%)
                </span>
              </div>
            </div>

            {/* Duration Timer */}
            <div className="hidden lg:flex px-3 py-1.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl items-center gap-2 shadow-xs">
              <Clock className="w-4 h-4 text-sky-400" />
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] block font-bold font-mono">
                  Duration
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-[var(--text-primary)] tabular-nums">
                  {formatTime(elapsedSeconds)}
                </span>
              </div>
            </div>

            {/* Reset Session Button */}
            <button
              type="button"
              onClick={handleReset}
              className="p-2 bg-[var(--bg-elevated)] hover:bg-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-xl transition-all btn-tactile cursor-pointer"
              title="Reset current session progress"
              aria-label="Reset session progress"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Finish Workout CTA */}
            <button
              type="button"
              onClick={handleFinish}
              className="px-4 py-2 bg-[#B7FF4A] hover:bg-[#a8f23d] text-[#090B0F] font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-md shadow-[#B7FF4A]/20 flex items-center gap-1.5 transition-all btn-tactile cursor-pointer"
            >
              <Trophy className="w-4 h-4 fill-current" />
              <span>Finish Workout</span>
            </button>
          </div>
        </div>

        {/* Minimalist Day Tabs Strip (Push A, Pull A, Legs A, etc.) */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar p-1 bg-[var(--bg-elevated)]/60 rounded-xl border border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={() => handleDaySelect('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-all btn-tactile cursor-pointer ${
              activeDayId === 'all'
                ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-xs border border-[var(--border-strong)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            All Days ({daysList.length})
          </button>

          {daysList.map((day) => {
            const isActive = activeDayId === day.id;
            const isTodayScheduled = scheduledDayId === day.id;

            return (
              <button
                type="button"
                key={day.id}
                onClick={() => handleDaySelect(day.id)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-all btn-tactile flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#B7FF4A] text-[#090B0F] shadow-xs font-black'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
                }`}
              >
                <span>{day.title}</span>
                {isTodayScheduled && (
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-[#090B0F] text-[#B7FF4A]'
                        : 'bg-[#36D6B0]/20 text-[#36D6B0] border border-[#36D6B0]/30'
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
    </div>
  );
};

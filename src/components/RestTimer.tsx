'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Plus, Minus, Timer } from 'lucide-react';
import { playTimerDoneSound, playClickSound, playPopSound } from '../utils/audio';
import { formatTime } from '../utils/helpers';

interface RestTimerProps {
  initialSeconds?: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  autoStartedTimestamp?: number;
  autoSeconds?: number;
}

export const RestTimer: React.FC<RestTimerProps> = ({
  initialSeconds = 90,
  soundEnabled,
  onToggleSound,
  autoStartedTimestamp,
  autoSeconds,
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [remaining, setRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-start timer when an external trigger (like set completed) occurs
  useEffect(() => {
    if (autoStartedTimestamp && autoSeconds) {
      setTotalSeconds(autoSeconds);
      setRemaining(autoSeconds);
      setIsRunning(true);
      setIsDone(false);
    }
  }, [autoStartedTimestamp, autoSeconds]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            setIsDone(true);
            playTimerDoneSound(soundEnabled);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, soundEnabled]);

  const handleStart = (seconds: number) => {
    playClickSound(soundEnabled);
    setTotalSeconds(seconds);
    setRemaining(seconds);
    setIsRunning(true);
    setIsDone(false);
  };

  const togglePause = () => {
    playClickSound(soundEnabled);
    if (remaining === 0) {
      handleStart(totalSeconds);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    playClickSound(soundEnabled);
    setIsRunning(false);
    setIsDone(false);
    setRemaining(totalSeconds);
  };

  const adjustTime = (delta: number) => {
    playPopSound(soundEnabled);
    setRemaining((prev) => {
      const next = Math.max(0, prev + delta);
      if (next > totalSeconds) setTotalSeconds(next);
      return next;
    });
  };

  const percent = totalSeconds > 0 ? ((totalSeconds - remaining) / totalSeconds) * 100 : 0;

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-4 shadow-sm transition-all">
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] rounded-xl border border-[var(--accent-primary)]/20">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold block">
              Auto Rest Timer
            </span>
            <span className="text-xs text-[var(--text-muted)] hidden sm:inline">
              Triggers automatically on set completion
            </span>
          </div>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={onToggleSound}
          className={`p-1.5 px-2 rounded-xl border text-xs flex items-center gap-1.5 transition cursor-pointer ${
            soundEnabled
              ? 'bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--border-subtle)]'
              : 'bg-[var(--bg-elevated)]/40 border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
          title={soundEnabled ? 'Mute Audio Cues' : 'Enable Louder Audio Cues'}
          aria-label={soundEnabled ? 'Mute Audio Cues' : 'Enable Louder Audio Cues'}
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
          ) : (
            <VolumeX className="w-3.5 h-3.5" />
          )}
          <span className="text-[10px] font-mono font-bold">{soundEnabled ? 'LOUD' : 'OFF'}</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)] rounded-2xl p-3">
        {/* Digital Display & Controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`font-mono text-2xl sm:text-3xl font-black tracking-tight px-3 py-1 rounded-xl border tabular-nums ${
                isDone
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse'
                  : isRunning
                  ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border-[var(--accent-primary)]/40'
                  : 'bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-subtle)] shadow-sm'
              }`}
            >
              {isDone ? 'READY!' : formatTime(remaining)}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={togglePause}
              className={`p-2.5 rounded-xl font-bold text-xs border transition active:scale-95 flex items-center justify-center cursor-pointer ${
                isRunning
                  ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)] hover:bg-[var(--accent-hover)]'
                  : 'bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] border-[var(--border-subtle)] shadow-sm'
              }`}
              title={isRunning ? 'Pause' : 'Play'}
              aria-label={isRunning ? 'Pause rest timer' : 'Start rest timer'}
            >
              {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button
              onClick={handleReset}
              className="p-2.5 bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-xl transition shadow-sm active:scale-95 cursor-pointer"
              title="Reset"
              aria-label="Reset rest timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => adjustTime(-15)}
              className="p-2 bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-xl text-xs shadow-sm transition active:scale-95 cursor-pointer"
              title="Subtract 15 seconds"
              aria-label="Subtract 15 seconds"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => adjustTime(15)}
              className="p-2 bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-xl text-xs shadow-sm transition active:scale-95 cursor-pointer"
              title="Add 15 seconds"
              aria-label="Add 15 seconds"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { label: '45s', sec: 45 },
            { label: '60s', sec: 60 },
            { label: '90s', sec: 90 },
            { label: '2m', sec: 120 },
            { label: '3m', sec: 180 },
          ].map((preset) => (
            <button
              key={preset.sec}
              onClick={() => handleStart(preset.sec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition active:scale-95 border cursor-pointer tabular-nums ${
                totalSeconds === preset.sec && isRunning
                  ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)] shadow-sm'
                  : 'bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)] shadow-sm'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[var(--bg-elevated)] h-2 rounded-full mt-2.5 overflow-hidden border border-[var(--border-subtle)]">
        <div
          className={`h-full transition-all duration-300 ${
            isDone ? 'bg-emerald-500' : 'bg-[var(--accent-primary)]'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Floating Sticky Mini-Timer when Active (Positioned safely above mobile bottom nav) */}
      {(isRunning || isDone) && (
        <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 bg-[var(--bg-card)]/95 text-[var(--text-primary)] border border-[var(--accent-primary)]/40 rounded-2xl p-2.5 sm:px-4 sm:py-3 shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-2">
            <Timer className={`w-4 h-4 ${isDone ? 'text-emerald-400 animate-bounce' : 'text-[var(--accent-primary)]'}`} />
            <span className="font-mono text-sm sm:text-base font-bold text-[var(--text-primary)] tabular-nums">
              {isDone ? 'REST DONE!' : formatTime(remaining)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={togglePause}
              className="p-1.5 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-black rounded-lg transition active:scale-90 cursor-pointer"
              aria-label={isRunning ? 'Pause rest timer' : 'Resume rest timer'}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>
            <button
              onClick={() => adjustTime(15)}
              className="px-2 py-1 bg-[var(--bg-elevated)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] rounded-lg text-xs font-mono font-bold transition cursor-pointer"
              aria-label="Add 15 seconds"
            >
              +15s
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition cursor-pointer"
              aria-label="Stop rest timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

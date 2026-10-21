'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Plus, Minus, Timer } from 'lucide-react';
import { playTimerDoneSound } from '../utils/audio';
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
    setTotalSeconds(seconds);
    setRemaining(seconds);
    setIsRunning(true);
    setIsDone(false);
  };

  const togglePause = () => {
    if (remaining === 0) {
      handleStart(totalSeconds);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsDone(false);
    setRemaining(totalSeconds);
  };

  const adjustTime = (delta: number) => {
    setRemaining((prev) => {
      const next = Math.max(0, prev + delta);
      if (next > totalSeconds) setTotalSeconds(next);
      return next;
    });
  };

  const percent = totalSeconds > 0 ? ((totalSeconds - remaining) / totalSeconds) * 100 : 0;

  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-4 shadow-sm transition-all">
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-200/60">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block">
              Auto Rest Timer
            </span>
            <span className="text-xs text-zinc-600 hidden sm:inline">
              Triggers automatically on set completion
            </span>
          </div>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={onToggleSound}
          className={`p-1.5 px-2 rounded-xl border text-xs flex items-center gap-1.5 transition ${
            soundEnabled
              ? 'bg-zinc-50 border-zinc-200 text-zinc-800 hover:bg-zinc-100'
              : 'bg-zinc-100 border-zinc-200 text-zinc-400 hover:text-zinc-600'
          }`}
          title={soundEnabled ? 'Mute Audio Cues' : 'Enable Louder Audio Cues'}
          aria-label={soundEnabled ? 'Mute Audio Cues' : 'Enable Louder Audio Cues'}
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-amber-500" />
          ) : (
            <VolumeX className="w-3.5 h-3.5" />
          )}
          <span className="text-[10px] font-mono font-bold">{soundEnabled ? 'LOUD' : 'OFF'}</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-zinc-50 border border-zinc-200/70 rounded-2xl p-3">
        {/* Digital Display & Controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`font-mono text-2xl sm:text-3xl font-black tracking-tight px-3 py-1 rounded-xl border ${
                isDone
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-300 animate-pulse'
                  : isRunning
                  ? 'bg-amber-50 text-amber-600 border-amber-300'
                  : 'bg-white text-zinc-900 border-zinc-200 shadow-sm'
              }`}
            >
              {isDone ? 'READY!' : formatTime(remaining)}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={togglePause}
              className={`p-2.5 rounded-xl font-bold text-xs border transition active:scale-95 flex items-center justify-center ${
                isRunning
                  ? 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600'
                  : 'bg-zinc-900 hover:bg-black text-white border-zinc-900 shadow-sm'
              }`}
              title={isRunning ? 'Pause' : 'Play'}
              aria-label={isRunning ? 'Pause rest timer' : 'Start rest timer'}
            >
              {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button
              onClick={handleReset}
              className="p-2.5 bg-white hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-zinc-200 rounded-xl transition shadow-sm active:scale-95"
              title="Reset"
              aria-label="Reset rest timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => adjustTime(-15)}
              className="p-2 bg-white hover:bg-zinc-100 text-zinc-600 border border-zinc-200 rounded-xl text-xs shadow-sm transition active:scale-95"
              title="Subtract 15 seconds"
              aria-label="Subtract 15 seconds"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => adjustTime(15)}
              className="p-2 bg-white hover:bg-zinc-100 text-zinc-600 border border-zinc-200 rounded-xl text-xs shadow-sm transition active:scale-95"
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
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition active:scale-95 border ${
                totalSeconds === preset.sec && isRunning
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                  : 'bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-200 shadow-sm'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-100 h-2 rounded-full mt-2.5 overflow-hidden border border-zinc-200/80">
        <div
          className={`h-full transition-all duration-300 ${
            isDone ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

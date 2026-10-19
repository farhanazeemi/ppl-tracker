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
    <div className="bg-zinc-900/95 border border-zinc-800 rounded-2xl p-3 sm:p-4 shadow-xl backdrop-blur-md transition-all">
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
              Auto Rest Timer
            </span>
            <span className="text-xs text-zinc-500 hidden sm:inline">
              Triggers automatically on set completion
            </span>
          </div>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={onToggleSound}
          className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition ${
            soundEnabled
              ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:text-white'
              : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-400'
          }`}
          title={soundEnabled ? 'Mute Audio Cues' : 'Enable Audio Cues'}
          aria-label={soundEnabled ? 'Mute Audio Cues' : 'Enable Audio Cues'}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="text-[10px] font-mono">{soundEnabled ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-3">
        {/* Digital Display & Controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`font-mono text-2xl sm:text-3xl font-extrabold tracking-tight px-3 py-1 rounded-lg border ${
                isDone
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse'
                  : isRunning
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-800'
              }`}
            >
              {isDone ? 'READY!' : formatTime(remaining)}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={togglePause}
              className={`p-2 rounded-xl font-semibold text-xs border transition active:scale-95 flex items-center justify-center ${
                isRunning
                  ? 'bg-amber-500 text-zinc-950 border-amber-400 hover:bg-amber-400'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700'
              }`}
              title={isRunning ? 'Pause' : 'Play'}
              aria-label={isRunning ? 'Pause rest timer' : 'Start rest timer'}
            >
              {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button
              onClick={handleReset}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded-xl transition active:scale-95"
              title="Reset"
              aria-label="Reset rest timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => adjustTime(-15)}
              className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded-lg text-xs"
              title="Subtract 15 seconds"
              aria-label="Subtract 15 seconds"
            >
              <Minus className="w-3 h-3" />
            </button>
            <button
              onClick={() => adjustTime(15)}
              className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded-lg text-xs"
              title="Add 15 seconds"
              aria-label="Add 15 seconds"
            >
              <Plus className="w-3 h-3" />
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
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition active:scale-95 border ${
                totalSeconds === preset.sec && isRunning
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-950 h-1.5 rounded-full mt-2.5 overflow-hidden border border-zinc-800/50">
        <div
          className={`h-full transition-all duration-300 ${
            isDone ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-500 to-orange-500'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

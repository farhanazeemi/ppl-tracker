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
    <div className="bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 shadow-sm transition-all">
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-bold block">
              Auto Rest Timer
            </span>
            <span className="text-xs text-zinc-600 dark:text-zinc-400 hidden sm:inline">
              Triggers automatically on set completion
            </span>
          </div>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={onToggleSound}
          className={`p-1.5 px-2 rounded-xl border text-xs flex items-center gap-1.5 transition cursor-pointer ${
            soundEnabled
              ? 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100'
              : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-600'
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3">
        {/* Digital Display & Controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`font-mono text-2xl sm:text-3xl font-black tracking-tight px-3 py-1 rounded-xl border ${
                isDone
                  ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/40 animate-pulse'
                  : isRunning
                  ? 'bg-amber-500/20 text-amber-500 border-amber-500/40'
                  : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700 shadow-sm'
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
                  ? 'bg-amber-500 text-black border-amber-500 hover:bg-amber-600'
                  : 'bg-zinc-900 dark:bg-zinc-100 hover:bg-black text-white dark:text-black border-zinc-900 dark:border-zinc-100 shadow-sm'
              }`}
              title={isRunning ? 'Pause' : 'Play'}
              aria-label={isRunning ? 'Pause rest timer' : 'Start rest timer'}
            >
              {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button
              onClick={handleReset}
              className="p-2.5 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-700 rounded-xl transition shadow-sm active:scale-95 cursor-pointer"
              title="Reset"
              aria-label="Reset rest timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => adjustTime(-15)}
              className="p-2 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs shadow-sm transition active:scale-95 cursor-pointer"
              title="Subtract 15 seconds"
              aria-label="Subtract 15 seconds"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => adjustTime(15)}
              className="p-2 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs shadow-sm transition active:scale-95 cursor-pointer"
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
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition active:scale-95 border cursor-pointer ${
                totalSeconds === preset.sec && isRunning
                  ? 'bg-amber-500 text-black border-amber-500 shadow-sm'
                  : 'bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 shadow-sm'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full mt-2.5 overflow-hidden border border-zinc-200/80 dark:border-zinc-700">
        <div
          className={`h-full transition-all duration-300 ${
            isDone ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Floating Sticky Mini-Timer when Active */}
      {(isRunning || isDone) && (
        <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 bg-zinc-950/95 text-white border border-amber-500/40 rounded-2xl p-2.5 sm:px-4 sm:py-3 shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-2">
            <Timer className={`w-4 h-4 ${isDone ? 'text-emerald-400 animate-bounce' : 'text-amber-500'}`} />
            <span className="font-mono text-sm sm:text-base font-extrabold text-white">
              {isDone ? 'REST DONE!' : formatTime(remaining)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={togglePause}
              className="p-1.5 bg-amber-500 hover:bg-amber-600 text-black rounded-lg transition active:scale-90 cursor-pointer"
              aria-label={isRunning ? 'Pause rest timer' : 'Resume rest timer'}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>
            <button
              onClick={() => adjustTime(15)}
              className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-mono font-bold transition cursor-pointer"
              aria-label="Add 15 seconds"
            >
              +15s
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 text-zinc-400 hover:text-white transition cursor-pointer"
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

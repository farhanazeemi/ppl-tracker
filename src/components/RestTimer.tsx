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
  const targetEndTimeRef = useRef<number | null>(null);

  // Auto-start timer when an external trigger (like set completed) occurs
  useEffect(() => {
    if (autoStartedTimestamp && autoSeconds) {
      setTotalSeconds(autoSeconds);
      setRemaining(autoSeconds);
      targetEndTimeRef.current = Date.now() + autoSeconds * 1000;
      setIsRunning(true);
      setIsDone(false);
    }
  }, [autoStartedTimestamp, autoSeconds]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const checkRemaining = () => {
      if (!targetEndTimeRef.current) return;
      const diff = Math.ceil((targetEndTimeRef.current - Date.now()) / 1000);
      if (diff <= 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        targetEndTimeRef.current = null;
        setRemaining(0);
        setIsRunning(false);
        setIsDone(true);
        playTimerDoneSound(soundEnabled);
      } else {
        setRemaining(diff);
      }
    };

    checkRemaining();
    intervalRef.current = setInterval(checkRemaining, 500);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkRemaining();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isRunning, soundEnabled]);

  const handleStart = (seconds: number) => {
    playClickSound(soundEnabled);
    setTotalSeconds(seconds);
    setRemaining(seconds);
    targetEndTimeRef.current = Date.now() + seconds * 1000;
    setIsRunning(true);
    setIsDone(false);
  };

  const togglePause = () => {
    playClickSound(soundEnabled);
    if (remaining === 0) {
      handleStart(totalSeconds);
    } else if (isRunning) {
      setIsRunning(false);
      targetEndTimeRef.current = null;
    } else {
      targetEndTimeRef.current = Date.now() + remaining * 1000;
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    playClickSound(soundEnabled);
    setIsRunning(false);
    setIsDone(false);
    targetEndTimeRef.current = null;
    setRemaining(totalSeconds);
  };

  const adjustTime = (delta: number) => {
    playPopSound(soundEnabled);
    setRemaining((prev) => {
      const next = Math.max(0, prev + delta);
      if (next > totalSeconds) setTotalSeconds(next);
      if (targetEndTimeRef.current) {
        targetEndTimeRef.current += delta * 1000;
      }
      return next;
    });
  };

  const percent = totalSeconds > 0 ? ((totalSeconds - remaining) / totalSeconds) * 100 : 0;

  return (
    <div className="card-bento p-5 shadow-sm transition-all border-[var(--border-subtle)]">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#B7FF4A]/10 text-[#B7FF4A] rounded-xl border border-[#B7FF4A]/25">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold block">
              Auto Rest Timer
            </span>
            <span className="text-xs text-[var(--text-secondary)] hidden sm:inline font-sans">
              Paces intervals automatically on set completion
            </span>
          </div>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={onToggleSound}
          className={`p-1.5 px-2.5 rounded-xl border text-xs flex items-center gap-1.5 transition btn-tactile cursor-pointer ${
            soundEnabled
              ? 'bg-[#B7FF4A]/10 border-[#B7FF4A]/30 text-[#B7FF4A]'
              : 'bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
          title={soundEnabled ? 'Mute Audio Cues' : 'Enable Louder Audio Cues'}
          aria-label={soundEnabled ? 'Mute Audio Cues' : 'Enable Louder Audio Cues'}
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-[#B7FF4A]" />
          ) : (
            <VolumeX className="w-3.5 h-3.5" />
          )}
          <span className="text-[10px] font-mono font-bold">{soundEnabled ? 'AUDIO ON' : 'MUTED'}</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)] rounded-2xl p-3.5">
        {/* Digital Display & Controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`font-mono text-2xl sm:text-3xl font-black tracking-tight px-3.5 py-1.5 rounded-xl border tabular-nums transition-all ${
                isDone
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse'
                  : isRunning
                  ? 'bg-[#B7FF4A]/15 text-[#B7FF4A] border-[#B7FF4A]/35 shadow-sm'
                  : 'bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-subtle)] shadow-xs'
              }`}
            >
              {isDone ? 'READY!' : formatTime(remaining)}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={togglePause}
              className={`p-2.5 rounded-xl font-bold text-xs border transition active:scale-95 flex items-center justify-center cursor-pointer btn-tactile ${
                isRunning
                  ? 'bg-[#B7FF4A] text-[#090B0F] border-[#B7FF4A] shadow-md shadow-[#B7FF4A]/20'
                  : 'bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] border-[var(--border-subtle)] shadow-xs'
              }`}
              title={isRunning ? 'Pause' : 'Play'}
              aria-label={isRunning ? 'Pause rest timer' : 'Start rest timer'}
            >
              {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button
              onClick={handleReset}
              className="p-2.5 bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-xl transition shadow-xs active:scale-95 cursor-pointer btn-tactile"
              title="Reset"
              aria-label="Reset rest timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => adjustTime(-15)}
              className="p-2 bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-xl text-xs shadow-xs transition active:scale-95 cursor-pointer btn-tactile font-mono font-bold"
              title="Subtract 15 seconds"
              aria-label="Subtract 15 seconds"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => adjustTime(15)}
              className="p-2 bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-xl text-xs shadow-xs transition active:scale-95 cursor-pointer btn-tactile font-mono font-bold"
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
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition active:scale-95 border cursor-pointer tabular-nums btn-tactile ${
                totalSeconds === preset.sec && isRunning
                  ? 'bg-[#B7FF4A] text-[#090B0F] border-[#B7FF4A] shadow-xs'
                  : 'bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)] shadow-xs'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[var(--bg-elevated)] h-2 rounded-full mt-3 overflow-hidden border border-[var(--border-subtle)]">
        <div
          className={`h-full transition-all duration-300 ${
            isDone ? 'bg-emerald-500' : 'bg-gradient-to-r from-[#B7FF4A] to-[#36D6B0]'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Floating Sticky Mini-Timer when Active */}
      {(isRunning || isDone) && (
        <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 bg-[var(--bg-card)]/95 text-[var(--text-primary)] border border-[#B7FF4A]/40 rounded-2xl p-2.5 sm:px-4 sm:py-3 shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-2">
            <Timer className={`w-4 h-4 ${isDone ? 'text-emerald-400 animate-bounce' : 'text-[#B7FF4A]'}`} />
            <span className="font-mono text-sm sm:text-base font-bold text-[var(--text-primary)] tabular-nums">
              {isDone ? 'REST DONE!' : formatTime(remaining)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={togglePause}
              className="p-1.5 bg-[#B7FF4A] hover:bg-[#a8f23d] text-[#090B0F] rounded-lg transition active:scale-90 cursor-pointer btn-tactile"
              aria-label={isRunning ? 'Pause rest timer' : 'Resume rest timer'}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>
            <button
              onClick={() => adjustTime(15)}
              className="px-2 py-1 bg-[var(--bg-elevated)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] rounded-lg text-xs font-mono font-bold transition cursor-pointer btn-tactile"
              aria-label="Add 15 seconds"
            >
              +15s
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition cursor-pointer btn-tactile"
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

'use client';

import { useModalAccessibility } from '../utils/useModalAccessibility';
import { validateAndSanitizeHistory } from '../utils/historyValidation';

import React, { useState, useMemo } from 'react';
import {
  X,
  Calendar,
  Flame,
  Download,
  Upload,
  Trash2,
  Trophy,
  Dumbbell,
} from 'lucide-react';
import { LoggedWorkoutSession } from '../types/workout';
import { ALL_TRAINING_PROGRAMS } from '../data/workouts';
import { playClickSound, playTabSound } from '../utils/audio';

interface WorkoutHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyLogs: LoggedWorkoutSession[];
  onClearHistory: () => void;
  onImportData: (data: LoggedWorkoutSession[]) => void;
  soundEnabled?: boolean;
}

export const WorkoutHistoryModal: React.FC<WorkoutHistoryModalProps> = ({
  isOpen,
  onClose,
  historyLogs,
  onClearHistory,
  onImportData,
  soundEnabled = true,
}) => {
  useModalAccessibility(isOpen, onClose);
  const [activeTab, setActiveTab] = useState<'sessions' | 'prs'>('sessions');

  // Exercise and Day names lookup across all training splits
  const { exerciseNamesMap, dayNamesMap } = useMemo(() => {
    const exMap: Record<string, string> = {};
    const dMap: Record<string, string> = {};

    ALL_TRAINING_PROGRAMS.forEach((program) => {
      program.days.forEach((day) => {
        dMap[day.id] = day.title;
        day.exercises.forEach((ex) => {
          exMap[ex.id] = ex.name;
        });
      });
    });
    return { exerciseNamesMap: exMap, dayNamesMap: dMap };
  }, []);

  if (!isOpen) return null;

  // Compute PRs for each exercise across all history
  const allPRs: Record<string, { weight: number; reps: number; e1rm: number; date: string }> = {};

  historyLogs.forEach((session) => {
    Object.entries(session.exercisesLogged).forEach(([exId, sets]) => {
      sets.forEach((set) => {
        if (set.completed && typeof set.weight === 'number' && typeof set.reps === 'number') {
          const e1rm = Math.round(set.weight * (1 + set.reps / 30) * 10) / 10;
          if (!allPRs[exId] || e1rm > allPRs[exId].e1rm) {
            allPRs[exId] = {
              weight: set.weight,
              reps: set.reps,
              e1rm,
              date: session.date,
            };
          }
        }
      });
    });
  });

  const handleExport = () => {
    playClickSound(soundEnabled);
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(historyLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ppl-workout-history-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const { validLogs, isValid, errorMessage } = validateAndSanitizeHistory(parsed);
        if (!isValid) {
          alert(errorMessage || 'Invalid JSON file format.');
          return;
        }
        onImportData(validLogs);
        playClickSound(soundEnabled);
        alert(`Successfully imported ${validLogs.length} workout logs!`);
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    playClickSound(soundEnabled);
    if (confirm('Are you sure you want to clear your workout history? This action cannot be undone.')) {
      onClearHistory();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[88vh] flex flex-col bezel-outer">
        <div className="bezel-inner p-6 flex flex-col flex-1 overflow-hidden space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-[#B7FF4A]/10 text-[#B7FF4A] rounded-2xl border border-[#B7FF4A]/25">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-display font-black uppercase text-[var(--text-primary)] tracking-tight">
                  Workout History & PR Hall of Fame
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono tabular-nums">
                  {historyLogs.length} Completed Sessions Logged
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition cursor-pointer btn-tactile"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs & Data Portability CTAs */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[var(--border-subtle)] shrink-0">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  playTabSound(soundEnabled);
                  setActiveTab('sessions');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition btn-tactile cursor-pointer ${
                  activeTab === 'sessions'
                    ? 'bg-[#B7FF4A] text-[#090B0F] shadow-xs font-black'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Session Logs ({historyLogs.length})
              </button>
              <button
                onClick={() => {
                  playTabSound(soundEnabled);
                  setActiveTab('prs');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition btn-tactile cursor-pointer ${
                  activeTab === 'prs'
                    ? 'bg-[#B7FF4A] text-[#090B0F] shadow-xs font-black'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Personal Records ({Object.keys(allPRs).length})
              </button>
            </div>

            {/* Export / Import CTAs */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                title="Export JSON Data"
                className="p-1.5 px-2.5 bg-[var(--bg-elevated)] hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-xl text-xs font-mono font-bold flex items-center gap-1 transition btn-tactile cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-[#36D6B0]" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <label className="p-1.5 px-2.5 bg-[var(--bg-elevated)] hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-xl text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition btn-tactile shadow-xs">
                <Upload className="w-3.5 h-3.5 text-[#B7FF4A]" />
                <span className="hidden sm:inline">Import</span>
                <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
              </label>
            </div>
          </div>

          {/* Body Content */}
          <div className="overflow-y-auto space-y-3 pr-1 flex-1 font-mono tabular-nums">
            {activeTab === 'sessions' ? (
              historyLogs.length === 0 ? (
                <div className="py-14 text-center text-[var(--text-muted)] space-y-2">
                  <Dumbbell className="w-8 h-8 mx-auto text-[var(--text-muted)]" />
                  <p className="text-sm font-display font-bold uppercase text-[var(--text-secondary)]">
                    No workouts finished yet
                  </p>
                  <p className="text-xs text-[var(--text-muted)] font-sans">
                    Complete a workout session to log your history and track progressive overload.
                  </p>
                </div>
              ) : (
                historyLogs.map((log) => {
                  const dayTitle = dayNamesMap[log.dayId] || log.dayId;
                  return (
                    <div
                      key={log.id}
                      className="p-4 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl space-y-2.5 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase bg-[#B7FF4A]/10 text-[#B7FF4A] border border-[#B7FF4A]/25">
                            {dayTitle}
                          </span>
                          <span className="text-xs text-[var(--text-secondary)] font-mono flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#B7FF4A]" />
                            {log.date}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-[var(--text-secondary)]">
                          {log.durationMinutes} min
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs font-mono">
                        <div className="bg-[var(--bg-card)] p-2.5 rounded-xl border border-[var(--border-subtle)]">
                          <span className="text-[10px] text-[var(--text-muted)] uppercase block font-semibold">Total Volume</span>
                          <span className="font-mono font-black text-[var(--text-primary)] flex items-center gap-1">
                            <Flame className="w-3 h-3 text-[#B7FF4A]" />
                            {log.totalVolumeKg.toLocaleString()} kg
                          </span>
                        </div>
                        <div className="bg-[var(--bg-card)] p-2.5 rounded-xl border border-[var(--border-subtle)]">
                          <span className="text-[10px] text-[var(--text-muted)] uppercase block font-semibold">Sets Done</span>
                          <span className="font-mono font-black text-[var(--text-primary)]">
                            {log.totalSetsCompleted} sets
                          </span>
                        </div>
                        <div className="bg-[var(--bg-card)] p-2.5 rounded-xl border border-[var(--border-subtle)] col-span-2 sm:col-span-1">
                          <span className="text-[10px] text-[var(--text-muted)] uppercase block font-semibold">PR Flags</span>
                          <span className="font-mono font-black text-[#B7FF4A]">
                            {log.doubleProgressionsEarned && log.doubleProgressionsEarned.length > 0
                              ? `${log.doubleProgressionsEarned.length} Overload 🏆`
                              : 'Solid Work'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              /* PR Hall of Fame */
              Object.keys(allPRs).length === 0 ? (
                <div className="py-14 text-center text-[var(--text-muted)] space-y-2">
                  <Trophy className="w-8 h-8 mx-auto text-[var(--text-muted)]" />
                  <p className="text-sm font-display font-bold uppercase text-[var(--text-secondary)]">
                    No Personal Records logged
                  </p>
                  <p className="text-xs text-[var(--text-muted)] font-sans">
                    Log completed sets with weight and reps to build your PR trophy case.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(allPRs).map(([exId, pr]) => {
                    const exName = exerciseNamesMap[exId] || exId;
                    return (
                      <div
                        key={exId}
                        className="p-3.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <span className="text-xs font-display font-bold text-[var(--text-primary)] uppercase line-clamp-1">
                            {exName}
                          </span>
                          <span className="text-[10px] text-[var(--text-muted)] block font-mono">
                            Best: {pr.weight}kg × {pr.reps} reps
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-black text-[#B7FF4A] block">
                            {pr.e1rm} kg
                          </span>
                          <span className="text-[9px] text-[var(--text-muted)] font-mono uppercase">
                            Est. 1RM
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between shrink-0">
            {historyLogs.length > 0 ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1 transition btn-tactile cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Logs</span>
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-mono font-bold uppercase text-[var(--text-primary)] transition btn-tactile cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

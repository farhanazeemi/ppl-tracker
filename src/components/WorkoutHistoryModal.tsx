'use client';

import React, { useState, useMemo } from 'react';
import {
  X,
  Calendar,
  Flame,
  Award,
  Download,
  Upload,
  Trash2,
  Trophy,
  Dumbbell,
} from 'lucide-react';
import { LoggedWorkoutSession } from '../types/workout';
import { ALL_TRAINING_PROGRAMS } from '../data/workouts';

interface WorkoutHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyLogs: LoggedWorkoutSession[];
  onClearHistory: () => void;
  onImportData: (data: LoggedWorkoutSession[]) => void;
}

export const WorkoutHistoryModal: React.FC<WorkoutHistoryModalProps> = ({
  isOpen,
  onClose,
  historyLogs,
  onClearHistory,
  onImportData,
}) => {
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
        if (Array.isArray(parsed)) {
          onImportData(parsed);
          alert('Workout history imported successfully!');
        }
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh] text-zinc-900 dark:text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold uppercase text-zinc-900 dark:text-white tracking-tight">
                Workout History & PR Hall of Fame
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                {historyLogs.length} Completed Sessions Logged
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between mt-4 pb-2 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('sessions')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                activeTab === 'sessions'
                  ? 'bg-amber-500 text-black shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Session Logs ({historyLogs.length})
            </button>
            <button
              onClick={() => setActiveTab('prs')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                activeTab === 'prs'
                  ? 'bg-amber-500 text-black shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
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
              className="p-1.5 px-2 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-mono font-bold flex items-center gap-1 transition shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <label className="p-1.5 px-2 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition shadow-2xs">
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Import</span>
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>
          </div>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto mt-4 space-y-3 pr-1 flex-1">
          {activeTab === 'sessions' ? (
            historyLogs.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 space-y-2">
                <Dumbbell className="w-8 h-8 mx-auto text-zinc-400" />
                <p className="text-sm font-display font-bold uppercase text-zinc-600 dark:text-zinc-300">
                  No workouts finished yet
                </p>
                <p className="text-xs text-zinc-500">
                  Complete a workout session to log your history and track progressive overload.
                </p>
              </div>
            ) : (
              historyLogs.map((log) => {
                const dayTitle = dayNamesMap[log.dayId] || log.dayId;
                return (
                  <div
                    key={log.id}
                    className="p-4 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2.5 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase bg-amber-500/10 text-amber-500 border border-amber-500/25">
                          {dayTitle}
                        </span>
                        <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {log.date}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400">
                        {log.durationMinutes} min
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs font-mono">
                      <div className="bg-white dark:bg-zinc-850 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs">
                        <span className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase block font-semibold">Total Volume</span>
                        <span className="font-mono font-black text-zinc-900 dark:text-white flex items-center gap-1">
                          <Flame className="w-3 h-3 text-amber-500" />
                          {log.totalVolumeKg.toLocaleString()} kg
                        </span>
                      </div>
                      <div className="bg-white dark:bg-zinc-850 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs">
                        <span className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase block font-semibold">Sets Done</span>
                        <span className="font-mono font-black text-zinc-900 dark:text-white">
                          {log.totalSetsCompleted} sets
                        </span>
                      </div>
                      <div className="bg-white dark:bg-zinc-850 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase block font-semibold">PR Flags</span>
                        <span className="font-mono font-bold text-amber-500">
                          {log.doubleProgressionsEarned?.length || 0} Overloads
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            Object.keys(allPRs).length === 0 ? (
              <div className="py-12 text-center text-zinc-400 space-y-2">
                <Trophy className="w-8 h-8 mx-auto text-zinc-400" />
                <p className="text-sm font-display font-bold uppercase text-zinc-600 dark:text-zinc-300">
                  No PRs recorded yet
                </p>
                <p className="text-xs text-zinc-500">
                  Log sets with weights and reps to establish your baseline 1RMs.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(allPRs).map(([exId, pr]) => (
                  <div
                    key={exId}
                    className="p-3.5 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-1.5"
                  >
                    <div className="text-xs font-mono uppercase text-amber-500 font-bold truncate">
                      {exerciseNamesMap[exId] || exId}
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-lg font-mono font-black text-zinc-900 dark:text-white">
                        {pr.weight} kg × {pr.reps} reps
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-500">
                        {pr.e1rm} kg 1RM
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">Set on {pr.date}</div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        {historyLogs.length > 0 && (
          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end shrink-0">
            <button
              onClick={() => {
                if (confirm('Clear all logged workout history? This cannot be undone.')) {
                  onClearHistory();
                }
              }}
              className="text-xs font-mono text-red-500 hover:text-red-600 flex items-center gap-1 font-bold cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

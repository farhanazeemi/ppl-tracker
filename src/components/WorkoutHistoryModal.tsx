'use client';

import React, { useState } from 'react';
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
import { WORKOUT_DAYS } from '../data/workouts';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-zinc-200 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-2xl border border-amber-200">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-zinc-900">Workout History & PR Hall of Fame</h3>
              <p className="text-xs text-zinc-500">
                {historyLogs.length} Completed Sessions Logged
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between mt-4 pb-2 border-b border-zinc-100 shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('sessions')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'sessions'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Session Logs ({historyLogs.length})
            </button>
            <button
              onClick={() => setActiveTab('prs')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'prs'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900'
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
              className="p-1.5 px-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200 rounded-xl text-xs font-bold flex items-center gap-1 transition shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <label className="p-1.5 px-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition shadow-2xs">
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Import</span>
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>
          </div>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto mt-4 space-y-3 pr-1">
          {activeTab === 'sessions' ? (
            historyLogs.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 space-y-2">
                <Dumbbell className="w-8 h-8 mx-auto text-zinc-300" />
                <p className="text-sm font-bold text-zinc-600">No workouts finished yet</p>
                <p className="text-xs">Complete a workout session to log your history and track progressive overload.</p>
              </div>
            ) : (
              historyLogs.map((log) => {
                const dayMeta = WORKOUT_DAYS.find((d) => d.id === log.dayId);
                return (
                  <div
                    key={log.id}
                    className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2.5 hover:border-zinc-300 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                          {dayMeta?.title || log.dayId}
                        </span>
                        <span className="text-xs text-zinc-500 font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-zinc-400" />
                          {log.date}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-zinc-600">
                        {log.durationMinutes} min
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
                      <div className="bg-white p-2.5 rounded-xl border border-zinc-200 shadow-2xs">
                        <span className="text-[10px] text-zinc-400 uppercase block font-semibold">Total Volume</span>
                        <span className="font-mono font-black text-zinc-900 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-amber-500" />
                          {log.totalVolumeKg.toLocaleString()} kg
                        </span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-zinc-200 shadow-2xs">
                        <span className="text-[10px] text-zinc-400 uppercase block font-semibold">Sets Done</span>
                        <span className="font-mono font-black text-zinc-900">
                          {log.totalSetsCompleted} sets
                        </span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-zinc-200 shadow-2xs col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-zinc-400 uppercase block font-semibold">Progressions</span>
                        <span className="font-mono font-black text-amber-600 flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {log.doubleProgressionsEarned.length} earned
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            // PRs Tab
            Object.keys(allPRs).length === 0 ? (
              <div className="py-12 text-center text-zinc-400 space-y-2">
                <Trophy className="w-8 h-8 mx-auto text-zinc-300" />
                <p className="text-sm font-bold text-zinc-600">No PRs recorded yet</p>
                <p className="text-xs">Log working sets to establish your personal records.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(allPRs).map(([exId, pr]) => {
                  let foundName = exId;
                  WORKOUT_DAYS.forEach((d) => {
                    const match = d.exercises.find((e) => e.id === exId);
                    if (match) foundName = match.name;
                  });

                  return (
                    <div
                      key={exId}
                      className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-1.5"
                    >
                      <h4 className="text-xs font-bold text-zinc-900 truncate">{foundName}</h4>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500">
                          {pr.weight} kg × {pr.reps} reps
                        </span>
                        <span className="font-mono font-bold text-amber-600">
                          Est. 1RM: {pr.e1rm} kg
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono pt-1">
                        Recorded on {pr.date}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        {historyLogs.length > 0 && (
          <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-between items-center shrink-0">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all workout history logs?')) {
                  onClearHistory();
                }
              }}
              className="text-xs text-red-500 hover:text-red-600 font-semibold flex items-center gap-1 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear History
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-zinc-900 hover:bg-black text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

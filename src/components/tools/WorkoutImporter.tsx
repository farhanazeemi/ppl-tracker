'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Flame,
  ArrowRight,
  Database,
  Sparkles,
  HelpCircle,
  Dumbbell,
  Clock,
  Layers,
} from 'lucide-react';
import { parseWorkoutCsv, CsvImportSummary } from '../../utils/csvWorkoutImporter';
import { validateAndSanitizeHistory } from '../../utils/historyValidation';
import { LoggedWorkoutSession } from '../../types/workout';
import { playClickSound, playSetCompleteSound } from '../../utils/audio';
import { AthleteSyncBanner } from './AthleteSyncBanner';
import { FaqAccordion } from '../FaqAccordion';

interface WorkoutImporterProps {
  soundEnabled?: boolean;
}

export const WorkoutImporter: React.FC<WorkoutImporterProps> = ({
  soundEnabled = true,
}) => {
  const [isForOthers, setIsForOthers] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [summary, setSummary] = useState<CsvImportSummary | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isImported, setIsImported] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');

  const processFile = (file: File) => {
    setErrorMsg(null);
    setIsImported(false);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text || !text.trim()) {
          setErrorMsg('Uploaded file is empty.');
          return;
        }

        // Try validation engine (handles CSV and JSON)
        const validation = validateAndSanitizeHistory(text);
        if (!validation.isValid || validation.validLogs.length === 0) {
          setErrorMsg(validation.errorMessage || 'Could not parse workout data from this file.');
          return;
        }

        // Build summary
        let parsedSummary: CsvImportSummary;
        try {
          parsedSummary = parseWorkoutCsv(text);
        } catch {
          // If pure JSON format
          const exSet = new Set<string>();
          let vol = 0;
          let sets = 0;
          validation.validLogs.forEach((s) => {
            vol += s.totalVolumeKg;
            sets += s.totalSetsCompleted;
            Object.keys(s.exercisesLogged).forEach((k) => exSet.add(k));
          });
          parsedSummary = {
            format: 'Standard CSV',
            totalSessions: validation.validLogs.length,
            totalSets: sets,
            totalVolumeKg: vol,
            exercisesFound: Array.from(exSet),
            dateRange: {
              start: validation.validLogs[validation.validLogs.length - 1]?.date || '',
              end: validation.validLogs[0]?.date || '',
            },
            sessions: validation.validLogs,
          };
        }

        setSummary(parsedSummary);
        playClickSound(soundEnabled);
      } catch (err: any) {
        setErrorMsg(err?.message || 'Failed to process workout file.');
      }
    };

    reader.onerror = () => {
      setErrorMsg('Error reading uploaded file.');
    };

    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleCommitImport = () => {
    if (!summary || summary.sessions.length === 0) return;

    try {
      // Fetch existing local history
      const existingRaw = localStorage.getItem('ppl_workout_history');
      let existingLogs: LoggedWorkoutSession[] = [];
      if (existingRaw) {
        try {
          existingLogs = JSON.parse(existingRaw);
          if (!Array.isArray(existingLogs)) existingLogs = [];
        } catch {
          existingLogs = [];
        }
      }

      // Merge avoiding duplicate IDs
      const existingIds = new Set(existingLogs.map((l) => l.id));
      const newLogs = summary.sessions.filter((s) => !existingIds.has(s.id));
      const merged = [...newLogs, ...existingLogs];

      localStorage.setItem('ppl_workout_history', JSON.stringify(merged));
      setIsImported(true);
      playSetCompleteSound(soundEnabled);
    } catch (err: any) {
      setErrorMsg('Failed to save imported workouts to local storage: ' + err.message);
    }
  };

  const faqItems = [
    {
      question: 'How do I export my workout data from Hevy?',
      answer:
        'Open the Hevy app, navigate to Profile → Settings (gear icon) → Export Data → CSV. You will receive an email with your workout history CSV file containing all sets, weights, reps, and RPE.',
    },
    {
      question: 'How do I export my workouts from the Strong app?',
      answer:
        'In Strong, tap Profile → Settings → Export Workouts → Export as CSV. The exported file includes your workout dates, exercise names, set order, weights, and completed reps.',
    },
    {
      question: 'Will importing overwrite my existing PPL Tracker history?',
      answer:
        'No. The importer merges incoming sessions into your current history log without overwriting existing entries. Duplicate sessions are automatically detected and omitted.',
    },
    {
      question: 'Is my workout data kept private and local?',
      answer:
        'Yes. All CSV processing runs 100% locally in your web browser. No workout files or personal fitness logs are uploaded to third-party tracking servers.',
    },
  ];

  return (
    <div className="w-full space-y-10">
      <AthleteSyncBanner
        toolName="Workout History Importer"
        isForOthers={isForOthers}
        onToggleMode={setIsForOthers}
        syncedFieldsSummary="Seamlessly migrate and merge completed workouts from Strong, Hevy, FitNotes, or openGym into PPL Tracker with zero data lock-in."
        quickLinks={[
          { label: 'Launch PPL Tracker', href: '/tools/ppl-tracker' },
          { label: 'Browse All Tools', href: '/tools' },
        ]}
      />

      {/* Main Container */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Upload Dropzone */}
        <div className="bezel-outer">
          <div className="bezel-inner p-6 sm:p-10 space-y-6">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition flex flex-col items-center justify-center space-y-4 cursor-pointer ${
                isDragging
                  ? 'border-[#B7FF4A] bg-[#B7FF4A]/5'
                  : 'border-[var(--border-subtle)] hover:border-[#B7FF4A]/50 bg-[var(--surface-sunken)]'
              }`}
            >
              <div className="p-4 rounded-2xl bg-[#B7FF4A]/10 text-[#B7FF4A] border border-[#B7FF4A]/25">
                <Upload className="w-8 h-8" />
              </div>

              <div className="space-y-1 max-w-md">
                <p className="text-base font-display font-black uppercase text-[var(--text-primary)] tracking-wide">
                  Drag & Drop Your Workout CSV / JSON File
                </p>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Supports Hevy, Strong, FitNotes, openGym, and PPL Tracker formats
                </p>
              </div>

              <label className="px-5 py-2.5 bg-[#B7FF4A] text-zinc-950 font-bold font-display uppercase text-xs rounded-xl hover:bg-[#a6f03d] transition shadow-xs cursor-pointer btn-tactile">
                <span>Browse Local File</span>
                <input
                  type="file"
                  accept=".csv,.json,text/csv,application/json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {fileName && (
                <div className="flex items-center gap-2 text-xs font-mono text-[#36D6B0] pt-2">
                  <FileText className="w-4 h-4" />
                  <span>Selected: {fileName}</span>
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-xs text-red-400 font-mono">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Parsed Summary Card */}
        {summary && !isImported && (
          <div className="bezel-outer">
            <div className="bezel-inner p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#B7FF4A]/10 border border-[#B7FF4A]/30 text-[#B7FF4A]">
                      {summary.format} Detected
                    </span>
                    <h3 className="text-base font-display font-black uppercase text-[var(--text-primary)]">
                      Ready to Import
                    </h3>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] font-mono pt-1">
                    Date Range: {summary.dateRange.start} – {summary.dateRange.end}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCommitImport}
                  className="px-5 py-2.5 bg-[#B7FF4A] text-zinc-950 font-black font-display uppercase text-xs rounded-xl hover:bg-[#a6f03d] transition shadow-xs flex items-center gap-2 btn-tactile cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Import History</span>
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-[var(--surface-sunken)] rounded-xl border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase block">
                    Total Workouts
                  </span>
                  <div className="text-xl font-black font-mono text-[var(--text-primary)]">
                    {summary.totalSessions}
                  </div>
                </div>

                <div className="p-3.5 bg-[var(--surface-sunken)] rounded-xl border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase block">
                    Sets Parsed
                  </span>
                  <div className="text-xl font-black font-mono text-[#36D6B0]">
                    {summary.totalSets}
                  </div>
                </div>

                <div className="p-3.5 bg-[var(--surface-sunken)] rounded-xl border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase block">
                    Volume Lifted
                  </span>
                  <div className="text-xl font-black font-mono text-sky-400">
                    {summary.totalVolumeKg.toLocaleString()} kg
                  </div>
                </div>

                <div className="p-3.5 bg-[var(--surface-sunken)] rounded-xl border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase block">
                    Unique Exercises
                  </span>
                  <div className="text-xl font-black font-mono text-orange-400">
                    {summary.exercisesFound.length}
                  </div>
                </div>
              </div>

              {/* Exercises Matched Chips */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase block">
                  Mapped Exercises Preview:
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-subtle)]">
                  {summary.exercisesFound.map((ex, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded-md text-[11px] font-mono bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Card */}
        {isImported && (
          <div className="p-6 sm:p-8 rounded-2xl bg-[#B7FF4A]/10 border border-[#B7FF4A]/30 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#B7FF4A] text-zinc-950 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-display font-black uppercase text-[var(--text-primary)]">
                Import Successful!
              </h3>
              <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
                {summary?.totalSessions} workout sessions and {summary?.totalSets} sets have been merged into your local PPL Tracker history.
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/tools/ppl-tracker"
                className="px-5 py-2.5 bg-[#B7FF4A] text-zinc-950 font-black font-display uppercase text-xs rounded-xl hover:bg-[#a6f03d] transition shadow-xs flex items-center gap-2 btn-tactile"
              >
                <span>Open PPL Tracker History</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* How to export guides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#B7FF4A] uppercase">
              <Database className="w-4 h-4" />
              <span>Hevy Export Guide</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              In Hevy, go to Profile → Settings → Export Data → CSV. Check your email for the downloadable history file.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#36D6B0] uppercase">
              <Database className="w-4 h-4" />
              <span>Strong Export Guide</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              In Strong, open Profile → Settings → Export Workouts → Export as CSV. Save the file to your device or iCloud.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400 uppercase">
              <Database className="w-4 h-4" />
              <span>FitNotes Guide</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              In FitNotes, tap Menu → Backup/Export → Export Workout Log (CSV). Save to device storage and drop here.
            </p>
          </div>
        </div>
      </div>

      <FaqAccordion items={faqItems} title="Workout Import & Data Migration FAQ" />
    </div>
  );
};

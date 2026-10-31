'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Scale,
  CheckCircle2,
  ArrowRight,
  Zap,
  Sparkles,
  Info,
} from 'lucide-react';
import { playSetCompleteSound } from '../utils/audio';

export const HomeInteractiveDemo: React.FC = () => {
  const [demoSets, setDemoSets] = useState([
    { id: 1, weight: 32.5, reps: 10, completed: true },
    { id: 2, weight: 32.5, reps: 10, completed: true },
    { id: 3, weight: 32.5, reps: 9, completed: false },
    { id: 4, weight: 32.5, reps: '', completed: false },
  ]);
  const [demoPlateWeight, setDemoPlateWeight] = useState<number>(100);

  const toggleDemoSet = (id: number) => {
    playSetCompleteSound(true);
    setDemoSets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const completedCount = demoSets.filter((s) => s.completed).length;
  const demoTotalVolume = demoSets
    .filter((s) => s.completed && typeof s.reps === 'number')
    .reduce((acc, curr) => acc + curr.weight * Number(curr.reps), 0);

  // Olympic plate math calculation
  const calculatePlates = (totalKg: number) => {
    const bar = 20;
    let rem = Math.max(0, (totalKg - bar) / 2);
    const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25];
    const platesUsed: Record<number, number> = {};

    availablePlates.forEach((p) => {
      if (rem >= p) {
        const count = Math.floor(rem / p);
        if (count > 0) {
          platesUsed[p] = count;
          rem = Math.round((rem - count * p) * 100) / 100;
        }
      }
    });
    return platesUsed;
  };

  const plates = calculatePlates(demoPlateWeight);

  return (
    <div className="space-y-4">
      {/* Explicit Demo Disclaimer Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-mono">
        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
          <Info className="w-4 h-4 text-[#B7FF4A] shrink-0" />
          <span>
            <strong className="text-[var(--text-primary)]">Interactive Preview:</strong> Built with live workout tracker components using sample session data.
          </span>
        </div>
        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#B7FF4A]/10 text-[#B7FF4A] border border-[#B7FF4A]/25">
          Sample Data Mode
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Live Interactive Exercise Card */}
        <div className="lg:col-span-7 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-7 shadow-xl space-y-5 transition-all">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-[#B7FF4A] bg-[#B7FF4A]/10 px-2.5 py-0.5 rounded-full border border-[#B7FF4A]/25">
                  ⚡ Lagging Muscle Focus: Upper Chest
                </span>
                <span className="text-[11px] font-mono text-[var(--text-muted)]">
                  Rest: 120s
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold uppercase text-[var(--text-primary)] mt-1.5">
                Incline Dumbbell Bench Press
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Rep Ceiling: 8–10 Reps • Bench Angle: 15°–30° • Clavicular Pec Bias
              </p>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Session Volume</div>
              <div className="text-2xl font-display font-black text-[#B7FF4A] font-mono tnum">
                {demoTotalVolume} <span className="text-xs font-sans text-[var(--text-muted)]">kg</span>
              </div>
            </div>
          </div>

          {/* Set rows */}
          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-2 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider px-2">
              <div className="col-span-2">Set</div>
              <div className="col-span-4">Load (kg)</div>
              <div className="col-span-3">Reps</div>
              <div className="col-span-3 text-right">Logged</div>
            </div>

            {demoSets.map((s) => (
              <div
                key={s.id}
                className={`grid grid-cols-12 gap-2 items-center p-3 rounded-2xl border transition-all ${
                  s.completed
                    ? 'bg-[#B7FF4A]/10 border-[#B7FF4A]/30 text-[var(--text-primary)]'
                    : 'bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                <div className="col-span-2 font-mono font-bold text-xs tnum">
                  #{s.id}
                </div>
                <div className="col-span-4 font-mono font-bold text-sm tnum">
                  {s.weight} kg
                </div>
                <div className="col-span-3 font-mono font-bold text-sm tnum">
                  {s.reps || '—'}
                </div>
                <div className="col-span-3 text-right">
                  <button
                    type="button"
                    onClick={() => toggleDemoSet(s.id)}
                    className={`w-8 h-8 rounded-xl border flex items-center justify-center ml-auto transition-transform active:scale-90 cursor-pointer ${
                      s.completed
                        ? 'bg-[#B7FF4A] border-[#B7FF4A] text-[#090B0F] shadow-md shadow-[#B7FF4A]/25'
                        : 'border-[var(--border-strong)] hover:border-[#B7FF4A]'
                    }`}
                    aria-label={`Toggle demo set ${s.id}`}
                  >
                    {s.completed && <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl flex items-center justify-between text-xs">
            <span className="font-mono text-[#B7FF4A] font-semibold">
              {completedCount === 4
                ? '🎉 Double Progression Cleared! Advance +2.5kg next session.'
                : `Logged ${completedCount}/4 target sets.`}
            </span>
            <span className="text-[var(--text-muted)] text-[11px] font-mono">
              {completedCount === 4 ? 'Ready to Overload' : 'Tap checkmark to test rest chime'}
            </span>
          </div>
        </div>

        {/* Live Interactive Olympic Plate Math */}
        <div className="lg:col-span-5 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-7 shadow-xl space-y-5 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#36D6B0]" />
              <h3 className="font-display font-bold uppercase text-lg text-[var(--text-primary)]">
                Olympic Plate Math
              </h3>
            </div>
            <span className="text-xs font-mono text-[var(--text-muted)]">20kg Standard Bar</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-[var(--text-muted)]">
                Total Bar Weight:
              </span>
              <span className="text-lg font-mono font-bold text-[#B7FF4A] tnum">
                {demoPlateWeight} kg
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="180"
              step="2.5"
              value={demoPlateWeight}
              onChange={(e) => setDemoPlateWeight(Number(e.target.value))}
              className="w-full accent-[#B7FF4A] cursor-pointer"
            />
          </div>

          {/* Visual Plates Display */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase">
              Plates Per Sleeve Collar:
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(plates).map(([plate, count]) => {
                const pNum = Number(plate);
                const colorClass =
                  pNum === 25
                    ? 'bg-red-600 text-white'
                    : pNum === 20
                    ? 'bg-blue-600 text-white'
                    : pNum === 15
                    ? 'bg-yellow-500 text-black'
                    : pNum === 10
                    ? 'bg-emerald-600 text-white'
                    : pNum === 5
                    ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white'
                    : 'bg-zinc-400 text-black';

                return (
                  <div
                    key={plate}
                    className={`px-3 py-2 rounded-2xl text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm ${colorClass}`}
                  >
                    <span className="tnum">{plate} kg</span>
                    <span className="text-[10px] bg-black/30 text-white px-1.5 py-0.5 rounded-full font-mono">
                      ×{count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--border-subtle)]">
            <Link
              href="/tools/ppl-tracker"
              className="w-full py-3.5 px-4 rounded-2xl bg-[#B7FF4A] hover:bg-[#a8f23d] text-[#090B0F] font-display font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 transition-all btn-tactile shadow-md shadow-[#B7FF4A]/20"
            >
              <span>Launch Full PPL Workout Tracker</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

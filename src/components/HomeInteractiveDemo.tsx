'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Scale,
  CheckCircle2,
  ArrowRight,
  Zap,
  Play
} from 'lucide-react';
import { playClickSound, playSetCompleteSound } from '../utils/audio';

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

  // Plate math calculation
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Live Interactive Exercise Card */}
      <div className="lg:col-span-7 bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                ⚡ Weak Point Priority: Upper Chest
              </span>
              <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                Rest: 2 min
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-bold uppercase text-zinc-900 dark:text-white mt-1">
              Incline Dumbbell Bench Press
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Target: 8–10 Reps • Bench Angle: 15°–30° • Clavicular Pec Bias
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs font-mono uppercase text-zinc-600 dark:text-zinc-400">Session Volume</div>
            <div className="text-2xl font-display font-black text-amber-500">
              {demoTotalVolume} <span className="text-xs font-sans text-zinc-400">kg</span>
            </div>
          </div>
        </div>

        {/* Set rows */}
        <div className="space-y-2.5">
          <div className="grid grid-cols-12 gap-2 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 uppercase tracking-wider px-2">
            <div className="col-span-2">Set</div>
            <div className="col-span-4">Weight (kg)</div>
            <div className="col-span-3">Reps</div>
            <div className="col-span-3 text-right">Log Set</div>
          </div>

          {demoSets.map((s) => (
            <div
              key={s.id}
              className={`grid grid-cols-12 gap-2 items-center p-3 rounded-2xl border transition-all ${
                s.completed
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <div className="col-span-2 font-mono font-bold text-xs">
                #{s.id}
              </div>
              <div className="col-span-4 font-mono font-bold text-sm">
                {s.weight} kg
              </div>
              <div className="col-span-3 font-mono font-bold text-sm">
                {s.reps || '—'}
              </div>
              <div className="col-span-3 text-right">
                <button
                  type="button"
                  onClick={() => toggleDemoSet(s.id)}
                  className={`w-8 h-8 rounded-xl border flex items-center justify-center ml-auto transition-transform active:scale-90 cursor-pointer ${
                    s.completed
                      ? 'bg-emerald-500 border-emerald-500 text-black shadow-md shadow-emerald-500/20'
                      : 'border-zinc-300 dark:border-zinc-700 hover:border-amber-500'
                  }`}
                  aria-label={`Toggle demo set ${s.id}`}
                >
                  {s.completed && <CheckCircle2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between text-xs">
          <span className="font-mono text-amber-500 font-semibold">
            {completedCount === 4 ? '🎉 Double Progression Cleared! Add 2.5kg next session.' : `Completed ${completedCount}/4 sets.`}
          </span>
          <span className="text-zinc-600 dark:text-zinc-400">
            {completedCount === 4 ? 'Ready to Overload' : 'Rest timer triggers on tap'}
          </span>
        </div>
      </div>

      {/* Live Interactive Olympic Plate Math */}
      <div className="lg:col-span-5 bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-500" />
            <h3 className="font-display font-bold uppercase text-lg text-zinc-900 dark:text-white">
              Olympic Barbell Math
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400">20kg Bar</span>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-zinc-600 dark:text-zinc-400 mb-1.5">
            Target Weight: {demoPlateWeight} kg
          </label>
          <input
            type="range"
            min="30"
            max="180"
            step="2.5"
            value={demoPlateWeight}
            onChange={(e) => setDemoPlateWeight(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Visual Plates Display */}
        <div className="space-y-2">
          <div className="text-xs font-mono text-zinc-600 dark:text-zinc-400 uppercase">
            Plates per collar side:
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(plates).map(([plate, count]) => {
              const pNum = Number(plate);
              const colorClass =
                pNum === 25
                  ? 'bg-red-500 text-white'
                  : pNum === 20
                  ? 'bg-blue-600 text-white'
                  : pNum === 15
                  ? 'bg-amber-500 text-black'
                  : pNum === 10
                  ? 'bg-emerald-600 text-white'
                  : pNum === 5
                  ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white'
                  : 'bg-zinc-400 text-black';

              return (
                <div
                  key={plate}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm ${colorClass}`}
                >
                  <span>{plate} kg</span>
                  <span className="text-[10px] bg-black/30 text-white px-1.5 py-0.5 rounded-md">
                    ×{count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <Link
            href="/tools/ppl-tracker"
            className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-display font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/20"
          >
            <span>Open In Full Workout App</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

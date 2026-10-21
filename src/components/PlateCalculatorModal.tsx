'use client';

import React, { useState } from 'react';
import { X, Dumbbell, Info } from 'lucide-react';
import { calculatePlates } from '../utils/helpers';

interface PlateCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialWeight?: number;
  exerciseName?: string;
}

export const PlateCalculatorModal: React.FC<PlateCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialWeight = 80,
  exerciseName = 'Barbell Exercise',
}) => {
  const [targetWeight, setTargetWeight] = useState<number>(initialWeight);
  const [barWeight, setBarWeight] = useState<number>(20);

  if (!isOpen) return null;

  const result = calculatePlates(targetWeight, barWeight);

  const plateColors: Record<number, { bg: string; text: string; border: string }> = {
    25: { bg: 'bg-red-600', text: 'text-white font-bold', border: 'border-red-700' },
    20: { bg: 'bg-blue-600', text: 'text-white font-bold', border: 'border-blue-700' },
    15: { bg: 'bg-amber-400', text: 'text-zinc-950 font-bold', border: 'border-amber-500' },
    10: { bg: 'bg-emerald-600', text: 'text-white font-bold', border: 'border-emerald-700' },
    5: { bg: 'bg-white', text: 'text-zinc-900 font-bold', border: 'border-zinc-300' },
    2.5: { bg: 'bg-zinc-800', text: 'text-white font-bold', border: 'border-zinc-900' },
    1.25: { bg: 'bg-zinc-300', text: 'text-zinc-950 font-bold', border: 'border-zinc-400' },
  };

  const addWeight = (delta: number) => {
    setTargetWeight((prev) => Math.max(barWeight, Math.round((prev + delta) * 10) / 10));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-2xl border border-amber-200">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-zinc-900">Barbell Plate Calculator</h3>
              <p className="text-xs text-zinc-500 font-medium">{exerciseName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition"
            aria-label="Close plate calculator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">
              Target Total Weight (kg)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="2.5"
                min={barWeight}
                value={targetWeight}
                onChange={(e) => setTargetWeight(parseFloat(e.target.value) || barWeight)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-2.5 text-lg font-mono font-bold text-zinc-900 focus:outline-none focus:bg-white focus:border-amber-500"
              />
              <span className="text-sm font-bold text-zinc-500 px-2">KG</span>
            </div>
          </div>

          {/* Quick Increment Buttons */}
          <div className="flex flex-wrap gap-2">
            {[-10, -2.5, +2.5, +5, +10, +20].map((delta) => (
              <button
                key={delta}
                onClick={() => addWeight(delta)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition active:scale-95 ${
                  delta > 0
                    ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                    : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200'
                }`}
              >
                {delta > 0 ? `+${delta} kg` : `${delta} kg`}
              </button>
            ))}
          </div>

          {/* Barbell Weight Selection */}
          <div className="pt-2">
            <span className="block text-xs font-bold text-zinc-600 mb-1.5">Barbell Weight:</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Olympic Bar', weight: 20 },
                { label: "Women's / Tech", weight: 15 },
                { label: 'EZ Curl Bar', weight: 10 },
              ].map((bar) => (
                <button
                  key={bar.weight}
                  onClick={() => setBarWeight(bar.weight)}
                  className={`py-2 px-2 rounded-2xl text-xs font-bold border text-center transition ${
                    barWeight === bar.weight
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                      : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  {bar.label} ({bar.weight}kg)
                </button>
              ))}
            </div>
          </div>

          {/* Visual Barbell Sleeve Breakdown */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-4 mt-4">
            <div className="flex items-center justify-between text-xs mb-3 text-zinc-600">
              <span className="font-bold text-zinc-800">Load Per Sleeve Side:</span>
              <span className="font-mono text-amber-600 font-black text-sm">
                {result.weightPerSide} kg / side
              </span>
            </div>

            {/* Visual Plate Stack */}
            <div className="min-h-[80px] bg-white border border-zinc-200 rounded-2xl p-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar shadow-xs">
              {/* Sleeve Collar */}
              <div className="w-4 h-16 bg-zinc-300 rounded-l-md shrink-0 flex items-center justify-center text-[9px] text-zinc-600 font-mono -rotate-90">
                Collar
              </div>

              {result.platesPerSide.length === 0 ? (
                <div className="text-xs text-zinc-400 italic mx-auto">
                  Only the empty {barWeight}kg barbell
                </div>
              ) : (
                result.platesPerSide.flatMap((p) =>
                  Array.from({ length: p.count }).map((_, idx) => {
                    const style = plateColors[p.weight] || {
                      bg: 'bg-zinc-200',
                      text: 'text-zinc-900',
                      border: 'border-zinc-300',
                    };
                    const heightClass =
                      p.weight >= 20 ? 'h-20 w-8' : p.weight >= 10 ? 'h-16 w-7' : 'h-12 w-6';

                    return (
                      <div
                        key={`${p.weight}-${idx}`}
                        className={`${style.bg} ${style.border} ${style.text} ${heightClass} border rounded-md shrink-0 flex flex-col items-center justify-center font-mono text-[10px] font-bold shadow-xs`}
                      >
                        <span>{p.weight}</span>
                        <span className="text-[8px] opacity-75">kg</span>
                      </div>
                    );
                  })
                )
              )}
            </div>

            {/* Plate Summary List */}
            <div className="mt-3 flex flex-wrap gap-2">
              {result.platesPerSide.map((p) => (
                <span
                  key={p.weight}
                  className="px-2.5 py-1 bg-white border border-zinc-200 rounded-xl text-xs font-mono font-bold text-zinc-700 shadow-2xs"
                >
                  <strong className="text-amber-600">{p.count}×</strong> {p.weight}kg
                </span>
              ))}
            </div>

            {result.remainder > 0 && (
              <div className="mt-2 text-xs text-amber-700 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                <span>
                  Remainder of {result.remainder * 2}kg total cannot be divided with standard plates.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Done Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider transition active:scale-95 shadow-sm"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};

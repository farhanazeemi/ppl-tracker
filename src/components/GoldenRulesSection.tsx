'use client';

import React from 'react';
import { Target, TrendingUp, Compass, ShieldCheck } from 'lucide-react';
import { GOLDEN_RULES } from '../data/workouts';

export const GoldenRulesSection: React.FC = () => {
  const iconMap = {
    '01': <Compass className="w-5 h-5 text-amber-600" />,
    '02': <TrendingUp className="w-5 h-5 text-emerald-600" />,
    '03': <Target className="w-5 h-5 text-sky-600" />,
  };

  const badgeColorMap = {
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    sky: 'bg-sky-50 text-sky-700 border-sky-200',
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-500" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Hypertrophy Principles & Progression Rules
          </h2>
        </div>
        <span className="text-xs text-zinc-400 hidden sm:inline">
          Science-Based Hypertrophy Standards
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {GOLDEN_RULES.map((rule) => {
          const badgeClass = badgeColorMap[rule.color as keyof typeof badgeColorMap];

          return (
            <div
              key={rule.number}
              className="bg-white border border-zinc-200/90 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-zinc-50 border border-zinc-200 rounded-2xl">
                      {iconMap[rule.number as keyof typeof iconMap]}
                    </div>
                    <span className="font-mono text-xs font-bold text-zinc-400">
                      RULE {rule.number}
                    </span>
                  </div>
                  <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full border ${badgeClass}`}>
                    {rule.angleBadge}
                  </span>
                </div>

                <h3 className="text-base font-black text-zinc-900 mb-1.5 tracking-tight">
                  {rule.title}
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                  {rule.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
                  Target Focus:
                </span>
                <span className="text-[11px] font-bold text-zinc-800">
                  {rule.tag}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

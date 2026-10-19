'use client';

import React from 'react';
import { Target, TrendingUp, Compass, ShieldCheck } from 'lucide-react';
import { GOLDEN_RULES } from '../data/workouts';

export const GoldenRulesSection: React.FC = () => {
  const iconMap = {
    '01': <Compass className="w-5 h-5 text-amber-400" />,
    '02': <TrendingUp className="w-5 h-5 text-emerald-400" />,
    '03': <Target className="w-5 h-5 text-sky-400" />,
  };

  const borderGlowMap = {
    amber: 'hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',
    emerald: 'hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    sky: 'hover:border-sky-500/40 hover:shadow-[0_0_20px_rgba(14,165,233,0.15)]',
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
            Hypertrophy Principles & Progression Protocol
          </h2>
        </div>
        <span className="text-xs text-zinc-500 hidden sm:inline">
          Science-Based Hypertrophy Standards
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {GOLDEN_RULES.map((rule) => {
          const glowClass = borderGlowMap[rule.color as keyof typeof borderGlowMap];

          return (
            <div
              key={rule.number}
              className={`bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 sm:p-5 transition-all duration-300 ${glowClass} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-zinc-950 border border-zinc-800 rounded-xl">
                      {iconMap[rule.number as keyof typeof iconMap]}
                    </div>
                    <span className="font-mono text-xs font-bold text-zinc-500">
                      RULE {rule.number}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-zinc-950 border border-zinc-800 text-zinc-300">
                    {rule.angleBadge}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white mb-1.5 tracking-tight">
                  {rule.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {rule.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                  Target:
                </span>
                <span className="text-[11px] font-semibold text-zinc-300">
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

'use client';

import React from 'react';
import { Target, TrendingUp, Compass, ShieldCheck } from 'lucide-react';
import { GOLDEN_RULES } from '../data/workouts';

export const GoldenRulesSection: React.FC = () => {
  const iconMap = {
    '01': <Compass className="w-5 h-5 text-[var(--accent-primary)]" />,
    '02': <TrendingUp className="w-5 h-5 text-emerald-500" />,
    '03': <Target className="w-5 h-5 text-sky-500" />,
  };

  const badgeColorMap = {
    amber: 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/25',
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25',
    sky: 'bg-sky-500/10 text-sky-500 border-sky-500/25',
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[var(--accent-primary)]" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Hypertrophy Principles & Progression Rules
          </h2>
        </div>
        <span className="text-xs text-[var(--text-muted)] hidden sm:inline font-mono">
          Science-Based Hypertrophy Standards
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {GOLDEN_RULES.map((rule) => {
          const badgeClass = badgeColorMap[rule.color as keyof typeof badgeColorMap];

          return (
            <div
              key={rule.number}
              className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-5 shadow-xs hover:shadow-md card-bento transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl">
                      {iconMap[rule.number as keyof typeof iconMap]}
                    </div>
                    <span className="font-mono tabular-nums text-xs font-bold text-[var(--text-muted)]">
                      RULE {rule.number}
                    </span>
                  </div>
                  <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full border ${badgeClass}`}>
                    {rule.angleBadge}
                  </span>
                </div>

                <h3 className="text-base font-display font-black text-[var(--text-primary)] uppercase mb-1.5 tracking-tight">
                  {rule.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                  {rule.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-mono">
                <span className="text-[var(--text-muted)]">Standard</span>
                <span className="text-[var(--accent-primary)] font-bold">{rule.tag}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Dumbbell,
  Scale,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Flame,
  Activity,
  Timer,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { FitnessTool } from '../../config/tools';
import { playClickSound, playTabSound } from '../../utils/audio';

interface ToolsDirectoryListProps {
  tools: FitnessTool[];
  upcoming: Array<{
    name: string;
    badge: string;
    category: string;
    description: string;
    iconName: 'Activity' | 'Flame' | 'Timer';
    eta: string;
  }>;
}

export const ToolsDirectoryList: React.FC<ToolsDirectoryListProps> = ({
  tools,
  upcoming,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'tracking' | 'calculators'>('all');

  const filteredTools = tools.filter((tool) => {
    if (activeCategory === 'all') return true;
    return tool.categorySlug === activeCategory;
  });

  const handleTabChange = (cat: 'all' | 'tracking' | 'calculators') => {
    playTabSound(true);
    setActiveCategory(cat);
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Dumbbell':
        return <Dumbbell className="w-6 h-6 text-[var(--accent-primary)]" />;
      case 'Scale':
        return <Scale className="w-6 h-6 text-[var(--accent-secondary)]" />;
      case 'Flame':
        return <Flame className="w-6 h-6 text-orange-400" />;
      case 'Activity':
        return <Activity className="w-6 h-6 text-sky-400" />;
      case 'Timer':
        return <Timer className="w-6 h-6 text-purple-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-[var(--accent-primary)]" />;
    }
  };

  const flagshipTool = tools.find((t) => t.id === 'ppl-tracker');
  const otherTools = filteredTools.filter((t) => activeCategory !== 'all' || t.id !== 'ppl-tracker');

  return (
    <div className="space-y-12">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border-subtle)] pb-4">
        <button
          type="button"
          onClick={() => handleTabChange('all')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-[var(--accent-primary)] text-black shadow-md shadow-[var(--accent-primary)]/20'
              : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
          }`}
        >
          All Tools ({tools.length})
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('tracking')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeCategory === 'tracking'
              ? 'bg-[var(--accent-primary)] text-black shadow-md shadow-[var(--accent-primary)]/20'
              : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
          }`}
        >
          Workout Tracking
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('calculators')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeCategory === 'calculators'
              ? 'bg-[var(--accent-primary)] text-black shadow-md shadow-[var(--accent-primary)]/20'
              : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
          }`}
        >
          Health & Calculators
        </button>
      </div>

      {/* Flagship App Bento Card (Shown when 'all' is active) */}
      {activeCategory === 'all' && flagshipTool && (
        <div className="relative overflow-hidden rounded-3xl bg-[var(--bg-card)] border-2 border-[var(--accent-primary)]/40 p-7 sm:p-10 shadow-xl shadow-[var(--accent-primary)]/5 space-y-8 group transition-all">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-primary)]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 relative z-10">
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="p-3 rounded-2xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/25 text-[var(--accent-primary)]">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-[var(--accent-primary)] text-black tracking-wider">
                  Flagship Application
                </span>
                <span className="text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                  {flagshipTool.category}
                </span>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                  {flagshipTool.name}
                </h2>
                <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed mt-2 font-sans">
                  {flagshipTool.fullDescription}
                </p>
              </div>

              {/* Stats Highlights Pill */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {flagshipTool.stats.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[var(--bg-elevated)]/80 border border-[var(--border-subtle)] text-center"
                  >
                    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">{s.label}</div>
                    <div className="text-xs sm:text-sm font-mono font-bold text-[var(--text-primary)] tabular-nums mt-0.5">
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions & Launch Button */}
            <div className="lg:w-72 shrink-0 flex flex-col justify-between space-y-6 pt-4 lg:pt-0 lg:border-l lg:border-[var(--border-subtle)] lg:pl-8">
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                  Included Features:
                </span>
                <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                    <span>Auto Double Progression</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                    <span>Olympic Barbell Plate Math</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                    <span>Web Audio Rest Timer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                    <span>100% Offline Local-First</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live & Free Forever
                </div>
                <Link
                  href={flagshipTool.href}
                  onClick={() => playClickSound(true)}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-black font-black uppercase tracking-wider text-xs shadow-lg shadow-[var(--accent-primary)]/20 transition-all btn-tactile flex items-center justify-center gap-2"
                >
                  <span>{flagshipTool.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Other Available Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {(activeCategory === 'all' ? otherTools : filteredTools).map((tool) => (
          <div
            key={tool.id}
            className="card-bento p-7 sm:p-9 space-y-6 flex flex-col justify-between group transition-all"
          >
            <div className="space-y-5">
              {/* Card Header: Icon, Category Badge & Title */}
              <div className="flex items-start justify-between gap-3">
                <div className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] group-hover:scale-105 transition-transform">
                  {renderIcon(tool.iconName)}
                </div>
                <div className="flex flex-wrap items-center gap-2 justify-end">
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                    {tool.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/25">
                    {tool.badge}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans leading-relaxed mt-2">
                  {tool.fullDescription}
                </p>
              </div>

              {/* Key Features Bullet List */}
              <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                  Core Capabilities:
                </span>
                <ul className="space-y-1.5 text-xs text-[var(--text-secondary)] font-sans">
                  {tool.features.slice(0, 4).map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stats Highlights Pill */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                {tool.stats.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[var(--bg-elevated)]/70 border border-[var(--border-subtle)] text-center"
                  >
                    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider truncate">{s.label}</div>
                    <div className="text-xs font-mono font-bold text-[var(--text-primary)] truncate mt-0.5 tabular-nums">
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Open Tool Action Button */}
            <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-500 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live & Free
              </span>
              <Link
                href={tool.href}
                onClick={() => playClickSound(true)}
                className="px-6 py-3 rounded-2xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-black font-black uppercase tracking-wider text-xs shadow-md shadow-[var(--accent-primary)]/20 transition-all btn-tactile inline-flex items-center gap-2 group-hover:translate-x-0.5"
              >
                <span>{tool.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================= */}
      {/* UPCOMING TOOLS ROADMAP SECTION                            */}
      {/* ========================================================= */}
      <section className="space-y-6 pt-8 border-t border-[var(--border-subtle)]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">
              {`// Platform Expansion`}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[var(--text-primary)]">
              Upcoming Fitness Utilities
            </h2>
          </div>
          <span className="text-xs font-mono text-[var(--text-muted)]">Scheduled for Upcoming Releases</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcoming.map((u, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                  {renderIcon(u.iconName)}
                </div>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                  {u.eta}
                </span>
              </div>

              <h4 className="text-base font-bold uppercase text-[var(--text-primary)]">
                {u.name}
              </h4>
              <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                {u.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

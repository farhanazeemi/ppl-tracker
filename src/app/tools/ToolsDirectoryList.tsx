'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Dumbbell,
  Scale,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Flame,
  Activity,
  Timer,
  Layers,
  ChevronRight
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
        return <Dumbbell className="w-6 h-6 text-amber-500" />;
      case 'Scale':
        return <Scale className="w-6 h-6 text-emerald-500" />;
      case 'Flame':
        return <Flame className="w-6 h-6 text-orange-500" />;
      case 'Activity':
        return <Activity className="w-6 h-6 text-sky-500" />;
      case 'Timer':
        return <Timer className="w-6 h-6 text-purple-500" />;
      default:
        return <Sparkles className="w-6 h-6 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-12">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <button
          type="button"
          onClick={() => handleTabChange('all')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-amber-500 text-black shadow-md'
              : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          All Tools ({tools.length})
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('tracking')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeCategory === 'tracking'
              ? 'bg-amber-500 text-black shadow-md'
              : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          Workout Tracking
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('calculators')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeCategory === 'calculators'
              ? 'bg-amber-500 text-black shadow-md'
              : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          Health & Calculators
        </button>
      </div>

      {/* Primary Available Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className="rounded-3xl bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 p-7 sm:p-9 space-y-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-amber-500/40 transition-all group"
          >
            <div className="space-y-5">
              {/* Card Header: Icon, Category Badge & Title */}
              <div className="flex items-start justify-between gap-3">
                <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-850 group-hover:scale-105 transition-transform">
                  {renderIcon(tool.iconName)}
                </div>
                <div className="flex flex-wrap items-center gap-2 justify-end">
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                    {tool.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/25">
                    {tool.badge}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed mt-2">
                  {tool.fullDescription}
                </p>
              </div>

              {/* Key Features Bullet List */}
              <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 block">
                  Core Capabilities:
                </span>
                <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300 font-sans">
                  {tool.features.slice(0, 4).map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
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
                    className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 text-center"
                  >
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">{s.label}</div>
                    <div className="text-xs font-mono font-bold text-zinc-900 dark:text-white truncate">
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Open Tool Action Button */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-500 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live & Free
              </span>
              <Link
                href={tool.href}
                onClick={() => playClickSound(true)}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-black font-display font-black uppercase tracking-wider text-xs shadow-md shadow-amber-500/20 transition-all btn-tactile inline-flex items-center gap-2 group-hover:translate-x-0.5"
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
      <section className="space-y-6 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-bold">
              // Platform Expansion
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-zinc-900 dark:text-white">
              Upcoming Fitness Utilities
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-500">Scheduled for Upcoming Releases</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcoming.map((u, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-zinc-50/60 dark:bg-zinc-900/30 border border-zinc-200/80 dark:border-zinc-800/80 space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-850 text-zinc-400">
                  {renderIcon(u.iconName)}
                </div>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  {u.eta}
                </span>
              </div>

              <h4 className="text-base font-display font-bold uppercase text-zinc-800 dark:text-zinc-200">
                {u.name}
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                {u.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

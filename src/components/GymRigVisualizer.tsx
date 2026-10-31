'use client';

import React, { useState } from 'react';
import { Dumbbell, Activity, RotateCw, Sparkles, Target, Layers } from 'lucide-react';

interface GymRigVisualizerProps {
  splitType: 'push' | 'pull' | 'legs';
  focusText: string;
  themeColorHex: string;
}

export const GymRigVisualizer: React.FC<GymRigVisualizerProps> = ({
  splitType,
  focusText,
  themeColorHex,
}) => {
  const [viewMode, setViewMode] = useState<'rig' | 'kinematic'>('rig');

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'rig' ? 'kinematic' : 'rig'));
  };

  const getSplitAccent = () => {
    switch (splitType) {
      case 'push':
        return {
          glow: 'rgba(249, 115, 22, 0.25)',
          fill: '#f97316',
          label: 'Push Biomechanics',
          primaryMuscle: 'Clavicular Pectorals & Anterior/Lateral Delts',
          cue: 'Scapular retraction with 15°–30° pressing path',
        };
      case 'pull':
        return {
          glow: 'rgba(14, 165, 233, 0.25)',
          fill: '#0ea5e9',
          label: 'Pull Biomechanics',
          primaryMuscle: 'Latissimus Dorsi, Rhomboids & Posterior Delts',
          cue: 'Drive humerus down with neutral spine tension',
        };
      case 'legs':
        return {
          glow: 'rgba(16, 185, 129, 0.25)',
          fill: '#10b981',
          label: 'Legs Biomechanics',
          primaryMuscle: 'Quadriceps, Hamstrings & Gluteus Maximus',
          cue: 'Tripod foot pressure with deep knee flexion',
        };
      default:
        return {
          glow: 'rgba(245, 158, 11, 0.25)',
          fill: '#f59e0b',
          label: 'Compound Biomechanics',
          primaryMuscle: 'Multi-Joint Hypertrophy Chain',
          cue: 'Controlled eccentric cadence (2–3 seconds)',
        };
    }
  };

  const accent = getSplitAccent();

  return (
    <div
      className="relative w-full h-[250px] sm:h-[280px] bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl overflow-hidden shadow-sm group select-none transition-colors duration-200"
      style={{
        boxShadow: `0 4px 24px -6px ${accent.glow}`,
      }}
    >
      {/* Background SVG Grid Pattern */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full stroke-[var(--border-subtle)]/40 [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)] pointer-events-none"
      >
        <defs>
          <pattern id="rig-grid-pat" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#rig-grid-pat)" />
      </svg>

      {/* Top HUD Overlay */}
      <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: themeColorHex }}
          />
          <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">
            Biomechanics Rig
          </span>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border shadow-xs"
            style={{
              borderColor: `${themeColorHex}40`,
              backgroundColor: `${themeColorHex}15`,
              color: themeColorHex,
            }}
          >
            {splitType.toUpperCase()}
          </span>
        </div>

        {/* View Toggle Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleViewMode}
            title={viewMode === 'rig' ? 'Switch to Biomechanics Vectors' : 'Switch to Barbell Rig'}
            className="px-2.5 py-1 bg-[var(--bg-elevated)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)] rounded-xl text-[11px] font-mono font-semibold transition-all shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5"
            aria-label="Toggle visualizer mode"
          >
            {viewMode === 'rig' ? (
              <>
                <Activity className="w-3.5 h-3.5" style={{ color: themeColorHex }} />
                <span>Kinematics</span>
              </>
            ) : (
              <>
                <Dumbbell className="w-3.5 h-3.5" style={{ color: themeColorHex }} />
                <span>Barbell Rig</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Center Dynamic SVG Graphics (Mode 1: Barbell Sleeve Rig, Mode 2: Kinetic Vectors) */}
      <div className="relative w-full h-full flex items-center justify-center pt-2 pb-10 px-4">
        {viewMode === 'rig' ? (
          /* SVG Olympic Barbell Rig Visualization */
          <svg
            viewBox="0 0 600 200"
            className="w-full max-w-[480px] h-auto transition-transform duration-300 hover:scale-[1.02]"
            aria-label="Olympic Barbell and Calibrated Plates Illustration"
          >
            <defs>
              <linearGradient id="barbell-chrome" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="35%" stopColor="#cbd5e1" />
                <stop offset="70%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>
              <linearGradient id="plate-steel" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="50%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <filter id="accent-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Glowing Aura Ring */}
            <circle
              cx="300"
              cy="100"
              r="68"
              fill="none"
              stroke={themeColorHex}
              strokeWidth="2.5"
              strokeDasharray="4 8"
              opacity="0.6"
              filter="url(#accent-glow)"
              className="animate-spin"
              style={{ transformOrigin: '300px 100px', animationDuration: '28s' }}
            />

            {/* Main Barbell Shaft */}
            <rect
              x="50"
              y="94"
              width="500"
              height="12"
              rx="6"
              fill="url(#barbell-chrome)"
              stroke="#475569"
              strokeWidth="1"
            />

            {/* Knurling Grip Patterns */}
            <rect x="180" y="94" width="70" height="12" fill="#94a3b8" opacity="0.4" />
            <rect x="350" y="94" width="70" height="12" fill="#94a3b8" opacity="0.4" />
            <rect x="285" y="94" width="30" height="12" fill="#94a3b8" opacity="0.4" />

            {/* Left Olympic Sleeve Assembly */}
            <rect x="60" y="88" width="16" height="24" rx="3" fill="#cbd5e1" stroke="#475569" />
            {/* Left Outer Plate (10kg) */}
            <rect x="78" y="55" width="12" height="90" rx="4" fill="url(#plate-steel)" stroke="#475569" />
            {/* Left Mid Plate (20kg) */}
            <rect x="92" y="40" width="15" height="120" rx="5" fill="url(#plate-steel)" stroke="#475569" />
            {/* Left Inner Plate (25kg - Accent Ring) */}
            <rect
              x="109"
              y="28"
              width="18"
              height="144"
              rx="6"
              fill={themeColorHex}
              opacity="0.9"
              stroke="#1e293b"
              strokeWidth="1.5"
            />
            {/* Left Sleeve Collar */}
            <rect x="129" y="86" width="10" height="28" rx="2" fill="#e2e8f0" stroke="#64748b" />

            {/* Right Olympic Sleeve Assembly */}
            {/* Right Sleeve Collar */}
            <rect x="461" y="86" width="10" height="28" rx="2" fill="#e2e8f0" stroke="#64748b" />
            {/* Right Inner Plate (25kg - Accent Ring) */}
            <rect
              x="473"
              y="28"
              width="18"
              height="144"
              rx="6"
              fill={themeColorHex}
              opacity="0.9"
              stroke="#1e293b"
              strokeWidth="1.5"
            />
            {/* Right Mid Plate (20kg) */}
            <rect x="493" y="40" width="15" height="120" rx="5" fill="url(#plate-steel)" stroke="#475569" />
            {/* Right Outer Plate (10kg) */}
            <rect x="510" y="55" width="12" height="90" rx="4" fill="url(#plate-steel)" stroke="#475569" />
            <rect x="524" y="88" width="16" height="24" rx="3" fill="#cbd5e1" stroke="#475569" />

            {/* Center Load Target Label */}
            <g transform="translate(300, 100)">
              <rect
                x="-58"
                y="-13"
                width="116"
                height="26"
                rx="13"
                fill="#090a0f"
                stroke={themeColorHex}
                strokeWidth="1.5"
              />
              <text
                x="0"
                y="4"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="11"
                fontFamily="ui-monospace, monospace"
                fontWeight="bold"
                letterSpacing="1px"
              >
                20KG BARBELL
              </text>
            </g>
          </svg>
        ) : (
          /* SVG Kinematic Biomechanics Visualization */
          <svg
            viewBox="0 0 600 200"
            className="w-full max-w-[480px] h-auto transition-transform duration-300"
            aria-label="Kinematic Biomechanics Vector Graphic"
          >
            <defs>
              <marker
                id="arrow-end"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill={themeColorHex} />
              </marker>
            </defs>

            {/* Target Muscle Kinematic Diagram */}
            <g transform="translate(140, 100)">
              {/* Joint fulcrum */}
              <circle cx="0" cy="0" r="14" fill="#1e293b" stroke={themeColorHex} strokeWidth="2.5" />
              <circle cx="0" cy="0" r="5" fill={themeColorHex} />
              {/* Lever arm */}
              <line x1="0" y1="0" x2="110" y2="-45" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
              <circle cx="110" cy="-45" r="9" fill={themeColorHex} />
              {/* Force vector arrow */}
              <line
                x1="110"
                y1="-45"
                x2="110"
                y2="45"
                stroke={themeColorHex}
                strokeWidth="3"
                markerEnd="url(#arrow-end)"
              />
              <text
                x="122"
                y="15"
                fill={themeColorHex}
                fontSize="11"
                fontFamily="ui-monospace, monospace"
                fontWeight="bold"
              >
                Tension Vector
              </text>
            </g>

            {/* Biomechanical Specs Card */}
            <g transform="translate(340, 50)">
              <rect
                x="0"
                y="0"
                width="220"
                height="100"
                rx="16"
                fill="currentColor"
                className="text-zinc-100 dark:text-zinc-900/90"
                stroke={themeColorHex}
                strokeWidth="1.2"
                strokeOpacity="0.4"
              />
              <text
                x="14"
                y="26"
                fill={themeColorHex}
                fontSize="11"
                fontFamily="ui-monospace, monospace"
                fontWeight="bold"
              >
                {"// TARGET MECHANICS"}
              </text>
              <text
                x="14"
                y="48"
                fill="currentColor"
                className="text-[var(--text-primary)]"
                fontSize="12"
                fontWeight="bold"
              >
                {accent.label}
              </text>
              <text
                x="14"
                y="68"
                fill="currentColor"
                className="text-[var(--text-muted)]"
                fontSize="10"
                fontFamily="ui-monospace, monospace"
              >
                Cadence: 2-0-1-0 Tempo
              </text>
              <text
                x="14"
                y="84"
                fill="currentColor"
                className="text-[var(--text-muted)]"
                fontSize="10"
                fontFamily="ui-monospace, monospace"
              >
                Target RIR: 1–2 In Reserve
              </text>
            </g>
          </svg>
        )}
      </div>

      {/* Bottom Focus Spec Overlay */}
      <div className="absolute bottom-3 left-4 right-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pointer-events-none bg-[var(--bg-card)]/95 border border-[var(--border-subtle)] backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" />
          <span className="text-xs text-[var(--text-secondary)] font-medium truncate">
            Target Focus: <strong className="text-[var(--text-primary)] font-bold">{focusText}</strong>
          </span>
        </div>
        <div className="text-[10px] font-mono text-[var(--text-muted)] self-end sm:self-auto shrink-0 flex items-center gap-1">
          <Target className="w-3 h-3 text-emerald-500" />
          <span>{accent.cue}</span>
        </div>
      </div>
    </div>
  );
};

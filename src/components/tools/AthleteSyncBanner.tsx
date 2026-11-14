'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { UserCheck, Users, Save, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UpdateProfileInput } from '@/types/auth';

export interface SharedToolMetrics {
  workingWeightKg?: number;
  reps?: number;
  rpe?: number;
  estimated1RMKg?: number;
  exerciseName?: string;
  bodyFatPct?: number;
  leanBodyMassKg?: number;
  targetCalories?: number;
  updatedAt?: string;
}

const SHARED_METRICS_KEY = 'ppl_shared_tool_metrics';
const SYNC_EVENT_NAME = 'ppl-shared-metrics-updated';

export function getSharedToolMetrics(): SharedToolMetrics {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(SHARED_METRICS_KEY);
    const parsed: SharedToolMetrics = raw ? JSON.parse(raw) : {};

    // Also inspect PPL Tracker logged sets if no working weight is stored yet
    if (!parsed.workingWeightKg) {
      const setsRaw = localStorage.getItem('ppl_sets_v2');
      if (setsRaw) {
        const setsObj = JSON.parse(setsRaw);
        for (const [exId, setsList] of Object.entries(setsObj)) {
          if (Array.isArray(setsList)) {
            const completedSet = setsList.find(
              (s: any) => s && Number(s.weight) > 0 && Number(s.reps) > 0
            );
            if (completedSet) {
              parsed.workingWeightKg = Number(completedSet.weight);
              parsed.reps = Number(completedSet.reps);
              parsed.exerciseName = exId.replace(/-/g, ' ');
              break;
            }
          }
        }
      }
    }
    return parsed;
  } catch {
    return {};
  }
}

export function updateSharedToolMetrics(patch: Partial<SharedToolMetrics>) {
  if (typeof window === 'undefined') return;
  try {
    const current = getSharedToolMetrics();
    const next: SharedToolMetrics = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(SHARED_METRICS_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME, { detail: next }));
  } catch {
    // ignore storage errors
  }
}

export function useSharedToolMetrics() {
  const [metrics, setMetrics] = useState<SharedToolMetrics>({});

  useEffect(() => {
    setMetrics(getSharedToolMetrics());
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<SharedToolMetrics>;
      setMetrics(customEvent.detail || getSharedToolMetrics());
    };
    window.addEventListener(SYNC_EVENT_NAME, handler);
    return () => window.removeEventListener(SYNC_EVENT_NAME, handler);
  }, []);

  const saveMetrics = useCallback((patch: Partial<SharedToolMetrics>) => {
    updateSharedToolMetrics(patch);
    setMetrics((prev) => ({ ...prev, ...patch }));
  }, []);

  return { metrics, saveMetrics };
}

interface AthleteSyncBannerProps {
  toolName: string;
  isForOthers: boolean;
  onToggleMode: (forOthers: boolean) => void;
  profilePayloadToSave?: UpdateProfileInput;
  syncedFieldsSummary?: string;
  quickLinks?: Array<{ label: string; href: string }>;
}

export const AthleteSyncBanner: React.FC<AthleteSyncBannerProps> = ({
  toolName,
  isForOthers,
  onToggleMode,
  profilePayloadToSave,
  syncedFieldsSummary,
  quickLinks,
}) => {
  const { user, updateProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const hasSavedBiometrics = Boolean(
    user && (user.weight || user.height || user.age || user.gender || user.bodyFatPct)
  );

  const handleSaveToProfile = async () => {
    if (!profilePayloadToSave) return;
    setIsSaving(true);
    setSavedToast(false);
    try {
      const res = await updateProfile(profilePayloadToSave);
      if (res.success) {
        setSavedToast(true);
        setTimeout(() => setSavedToast(false), 3000);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mb-6 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--accent-primary)]/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start sm:items-center gap-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
            !isForOthers
              ? 'bg-[var(--accent-primary)]/15 border-[var(--accent-primary)]/40 text-[var(--accent-primary)]'
              : 'bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
          }`}
        >
          {!isForOthers ? <UserCheck className="w-4 h-4" /> : <Users className="w-4 h-4" />}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
              {!isForOthers
                ? `Synced with ${user?.name || 'Athlete'}'s Profile`
                : `Calculating ${toolName} for Someone Else`}
            </span>
            {!isForOthers && hasSavedBiometrics && (
              <span className="px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 text-[10px] font-mono font-bold uppercase">
                Auto-Calculated
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {!isForOthers
              ? syncedFieldsSummary ||
                (hasSavedBiometrics
                  ? 'Biometrics (age, weight, height, gender & units) loaded automatically from your profile.'
                  : 'Enter your metrics below and click "Sync to Profile" so every calculator auto-fills for you.')
              : 'Custom guest calculation mode active — your personal profile metrics remain untouched.'}
          </p>
          {quickLinks && quickLinks.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[var(--accent-primary)]" /> Connected Tools:
              </span>
              {quickLinks.map((lnk) => (
                <Link
                  key={lnk.href}
                  href={lnk.href}
                  className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[var(--accent-primary)] hover:underline"
                >
                  {lnk.label} <ArrowRight className="w-3 h-3" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        {/* Toggle between My Profile vs Calculate for Others */}
        <div
          role="group"
          aria-label="Calculation profile mode"
          className="inline-flex p-1 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-mono"
        >
          <button
            type="button"
            onClick={() => onToggleMode(false)}
            aria-pressed={!isForOthers}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              !isForOthers
                ? 'bg-[var(--accent-primary)] text-[#090B0F] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            My Profile
          </button>
          <button
            type="button"
            onClick={() => onToggleMode(true)}
            aria-pressed={isForOthers}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              isForOthers
                ? 'bg-[var(--accent-primary)] text-[#090B0F] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            For Others
          </button>
        </div>

        {/* Save current inputs back to profile when in My Profile mode */}
        {!isForOthers && profilePayloadToSave && (
          <button
            type="button"
            onClick={handleSaveToProfile}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 text-xs font-mono font-bold text-[var(--text-primary)] transition-all cursor-pointer disabled:opacity-50"
            title="Save these metrics to your Athlete Profile to auto-fill all other calculators"
          >
            {savedToast ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Synced!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span>{isSaving ? 'Syncing...' : 'Sync to Profile'}</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

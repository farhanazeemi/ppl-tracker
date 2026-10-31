'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Scale,
  Ruler,
  Calendar,
  ShieldCheck,
  Save,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Dumbbell,
  Layers,
  Target,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TrainingSplitId } from '../types/auth';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOnboarding?: () => void;
}

const SPLIT_CHOICES: Array<{ id: TrainingSplitId; label: string; days: string }> = [
  { id: 'ppl', label: 'Push-Pull-Legs (PPL)', days: '6 Days' },
  { id: 'bro-split', label: 'Bro Split (Single Muscle Focus)', days: '5 Days' },
  { id: 'upper-lower', label: 'Upper / Lower', days: '4 Days' },
  { id: 'full-body', label: 'Full Body Compound', days: '3 Days' },
];

const WEAK_POINTS_LIST = [
  'Upper Chest',
  'Lateral Delts',
  'Rear Delts',
  'Triceps',
  'Biceps',
  'Hamstrings',
  'Quads',
  'Calves',
  'Lats',
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenOnboarding,
}) => {
  const { user, updateProfile, updateEmail, updatePassword, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'info' | 'split' | 'security'>('info');

  // Personal Info form
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [preferredUnit, setPreferredUnit] = useState<'kg' | 'lbs'>('kg');
  const [fitnessGoal, setFitnessGoal] = useState<'Hypertrophy' | 'Strength' | 'Cutting' | 'Body Recomposition'>('Hypertrophy');

  // Split & Weak Points
  const [selectedSplit, setSelectedSplit] = useState<TrainingSplitId>('ppl');
  const [weakPoints, setWeakPoints] = useState<string[]>([]);
  const [barbellBaseWeight, setBarbellBaseWeight] = useState<number>(20);

  // Email update form
  const [newEmail, setNewEmail] = useState('');

  // Password update form
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Status feedback
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAge(user.age ?? '');
      setHeight(user.height ?? '');
      setWeight(user.weight ?? '');
      setPreferredUnit(user.preferredUnit || 'kg');
      setFitnessGoal(user.fitnessGoal || 'Hypertrophy');
      setSelectedSplit(user.selectedSplit || 'ppl');
      setWeakPoints(user.weakPoints || []);
      setBarbellBaseWeight(user.barbellBaseWeight || 20);
      setNewEmail(user.email || '');
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const showNotification = (success: string, error: string = '') => {
    setSuccessMsg(success);
    setErrorMsg(error);
    if (success) {
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleSavePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await updateProfile({
        name,
        age: typeof age === 'number' ? age : undefined,
        height: typeof height === 'number' ? height : undefined,
        weight: typeof weight === 'number' ? weight : undefined,
        preferredUnit,
        fitnessGoal,
        selectedSplit,
        weakPoints,
        barbellBaseWeight,
      });

      if (res.success) {
        showNotification('Profile & training preferences saved!');
      } else {
        setErrorMsg(res.error || 'Failed to update profile.');
      }
    } catch {
      setErrorMsg('Unexpected error saving profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleWeakPoint = (wp: string) => {
    setWeakPoints((prev) =>
      prev.includes(wp) ? prev.filter((item) => item !== wp) : [...prev, wp]
    );
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await updateEmail({
        newEmail,
      });

      if (res.success) {
        showNotification('Email address updated!');
      } else {
        setErrorMsg(res.error || 'Failed to update email.');
      }
    } catch {
      setErrorMsg('Unexpected error updating email.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirm password do not match.');
      setIsSaving(false);
      return;
    }

    try {
      const res = await updatePassword({
        newPassword,
        confirmPassword,
      });

      if (res.success) {
        setNewPassword('');
        setConfirmPassword('');
        showNotification('Password updated securely!');
      } else {
        setErrorMsg(res.error || 'Failed to update password.');
      }
    } catch {
      setErrorMsg('Unexpected error updating password.');
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (fullName: string) => {
    if (!fullName) return 'U';
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-[var(--text-primary)] card-bento">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-primary)] text-black flex items-center justify-center font-display font-black text-lg shadow-sm">
              {getInitials(user.name)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-display font-bold text-[var(--text-primary)] uppercase tracking-tight">
                  {user.name}
                </h3>
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/25 font-mono">
                  {user.fitnessGoal}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">{user.email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition cursor-pointer btn-tactile"
            aria-label="Close profile modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-3 p-1 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] mt-4 shrink-0 relative z-10 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`py-2 font-bold rounded-xl transition cursor-pointer btn-tactile ${
              activeTab === 'info'
                ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Biometrics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('split')}
            className={`py-2 font-bold rounded-xl transition cursor-pointer btn-tactile ${
              activeTab === 'split'
                ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Split & Priorities
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`py-2 font-bold rounded-xl transition cursor-pointer btn-tactile ${
              activeTab === 'security'
                ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Security
          </button>
        </div>

        {/* Feedback alerts */}
        {successMsg && (
          <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-500 font-medium flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-500 font-medium flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="overflow-y-auto mt-4 space-y-4 pr-1 relative z-10 flex-1">
          {activeTab === 'info' && (
            <form onSubmit={handleSavePersonalInfo} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-700 dark:text-zinc-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition"
                  />
                </div>
              </div>

              {/* Age, Height, Weight row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                    <span>Age</span>
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="110"
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value))}
                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-xs text-[var(--text-primary)] font-mono tabular-nums focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-1 flex items-center gap-1">
                    <Ruler className="w-3.5 h-3.5 text-sky-500" />
                    <span>Height (cm)</span>
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="260"
                    value={height}
                    onChange={(e) => setHeight(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-xs text-[var(--text-primary)] font-mono tabular-nums focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-mono uppercase text-[var(--text-secondary)] flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Weight</span>
                    </label>
                    <div className="flex gap-1 text-[10px] font-mono font-bold">
                      <button
                        type="button"
                        onClick={() => setPreferredUnit('kg')}
                        className={`px-1.5 py-0.5 rounded-md transition-colors ${
                          preferredUnit === 'kg'
                            ? 'bg-[var(--accent-primary)] text-black'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        KG
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreferredUnit('lbs')}
                        className={`px-1.5 py-0.5 rounded-md transition-colors ${
                          preferredUnit === 'lbs'
                            ? 'bg-[var(--accent-primary)] text-black'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        LBS
                      </button>
                    </div>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min="20"
                    max="400"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-xs text-[var(--text-primary)] font-mono tabular-nums focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>
              </div>

              {/* Training Goal */}
              <div>
                <label className="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-1 flex items-center gap-1">
                  <Dumbbell className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                  <span>Primary Hypertrophy Goal</span>
                </label>
                <select
                  value={fitnessGoal}
                  onChange={(e) => setFitnessGoal(e.target.value as any)}
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                >
                  <option value="Hypertrophy">Hypertrophy (Muscle Size & Density)</option>
                  <option value="Strength">Strength & Power Overload</option>
                  <option value="Cutting">Cutting & Muscle Preservation</option>
                  <option value="Body Recomposition">Body Recomposition</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-[var(--accent-primary)] hover:opacity-95 text-black font-display font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition btn-tactile active:scale-95 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Details
                </button>
              </div>
            </form>
          )}

          {activeTab === 'split' && (
            <form onSubmit={handleSavePersonalInfo} className="space-y-5">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-700 dark:text-zinc-300 mb-2">
                  Active Training Split
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SPLIT_CHOICES.map((sc) => (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => setSelectedSplit(sc.id)}
                      className={`p-3 rounded-xl border text-left transition btn-tactile cursor-pointer ${
                        selectedSplit === sc.id
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)]/30'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <div className="text-xs font-bold">{sc.label}</div>
                      <div className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5">{sc.days} / Week</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono uppercase text-[var(--text-secondary)]">
                    Lagging Muscle Weak Points
                  </label>
                  <span className="text-[11px] font-mono tabular-nums text-[var(--accent-primary)] font-bold">
                    {weakPoints.length} selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {WEAK_POINTS_LIST.map((wp) => {
                    const isSelected = weakPoints.includes(wp);
                    return (
                      <button
                        key={wp}
                        type="button"
                        onClick={() => toggleWeakPoint(wp)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition btn-tactile cursor-pointer ${
                          isSelected
                            ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)] font-bold'
                            : 'border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {wp}
                      </button>
                    );
                  })}
                </div>
              </div>

              {onOpenOnboarding && (
                <div className="p-3 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="text-xs text-[var(--text-secondary)]">
                    Want the full guided setup experience?
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenOnboarding();
                    }}
                    className="text-xs font-mono text-[var(--accent-primary)] font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Re-run Setup Wizard
                  </button>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-[var(--accent-primary)] hover:opacity-95 text-black font-display font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition btn-tactile active:scale-95 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Split Settings
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <div className="space-y-5">
              {/* Email update */}
              <form onSubmit={handleUpdateEmail} className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-2">
                  <Mail className="w-4 h-4 text-sky-500" />
                  <h4 className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider">
                    Update Email Address
                  </h4>
                </div>

                <div>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="new-email@domain.com"
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isSaving || !newEmail || newEmail === user.email}
                    className="px-4 py-2 bg-[var(--bg-main)] hover:bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono text-xs font-bold rounded-xl transition disabled:opacity-40 cursor-pointer btn-tactile"
                  >
                    Update Email
                  </button>
                </div>
              </form>

              {/* Password update */}
              <form onSubmit={handleUpdatePassword} className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-2">
                  <Lock className="w-4 h-4 text-[var(--accent-primary)]" />
                  <h4 className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider">
                    Change Password
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                      className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                  </div>
                  <div>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isSaving || !newPassword}
                    className="px-4 py-2 bg-[var(--bg-main)] hover:bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono text-xs font-bold rounded-xl transition disabled:opacity-40 cursor-pointer btn-tactile"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="text-xs font-mono text-rose-500 hover:text-rose-600 flex items-center gap-1.5 font-bold cursor-pointer btn-tactile"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
          <span className="text-[11px] font-mono tabular-nums text-[var(--text-muted)]">
            PPL Hypertrophy Tracker v2.0
          </span>
        </div>
      </div>
    </div>
  );
};

'use client';

import { useModalAccessibility } from '../utils/useModalAccessibility';
import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles,
  Camera,
  AtSign,
  Trash2,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TrainingSplitId } from '../types/auth';
import { compressImage } from '../utils/imageCompression';

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

const POPULAR_EXERCISES = [
  'Barbell Bench Press',
  'Incline Dumbbell Press',
  'Barbell Back Squat',
  'Romanian Deadlift',
  'Conventional Deadlift',
  'Weighted Pull-Up',
  'Barbell Overhead Press (OHP)',
  'Barbell Bent-Over Row',
  'Cable Lateral Raise',
  'Leg Press',
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenOnboarding,
}) => {
  const { user, updateProfile, updateEmail, updatePassword, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useModalAccessibility(isOpen, onClose);
  const [activeTab, setActiveTab] = useState<'info' | 'split' | 'security'>('info');

  // Personal Info form
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [age, setAge] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [preferredUnit, setPreferredUnit] = useState<'kg' | 'lbs'>('kg');
  const [fitnessGoal, setFitnessGoal] = useState<'Hypertrophy' | 'Strength' | 'Cutting' | 'Body Recomposition'>('Hypertrophy');
  const [selectedExercise, setSelectedExercise] = useState('Barbell Bench Press');

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
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionStatus, setCompressionStatus] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setUsername(user.username || '');
      setAvatarUrl(user.avatarUrl);
      setAge(user.age ?? '');
      setHeight(user.height ?? '');
      setWeight(user.weight ?? '');
      setPreferredUnit(user.preferredUnit || 'kg');
      setFitnessGoal(user.fitnessGoal || 'Hypertrophy');
      setSelectedExercise(user.selectedExercise || 'Barbell Bench Press');
      setSelectedSplit(user.selectedSplit || 'ppl');
      setWeakPoints(user.weakPoints || []);
      setBarbellBaseWeight(user.barbellBaseWeight || 20);
      setNewEmail(user.email || '');
      setCompressionStatus(null);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    setIsCompressing(true);
    setErrorMsg('');
    setCompressionStatus('Analyzing image and preparing device compression...');

    try {
      // Execute client-side device compression (guaranteed < 1 MB)
      const result = await compressImage(file, 1024 * 1024);
      setAvatarUrl(result.dataUrl);

      if (result.wasCompressed) {
        setCompressionStatus(`Compressed on device: ${result.fileSizeFormatted} (Strictly under 1 MB limit)`);
      } else {
        setCompressionStatus(`Image ready: ${result.fileSizeFormatted} (Under 1 MB limit)`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process and compress profile image.');
      setCompressionStatus(null);
    } finally {
      setIsCompressing(false);
      // Reset input value so user can re-select same file if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(undefined);
    setCompressionStatus(null);
  };

  const handleSavePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    const cleanUser = username.trim().toLowerCase().replace(/^@/, '');
    if (cleanUser && !/^[a-zA-Z0-9_]{3,24}$/.test(cleanUser)) {
      setErrorMsg('Username must be 3-24 characters containing only letters, numbers, and underscores.');
      setIsSaving(false);
      return;
    }

    try {
      const res = await updateProfile({
        name,
        username: cleanUser,
        avatarUrl,
        age: typeof age === 'number' ? age : undefined,
        height: typeof height === 'number' ? height : undefined,
        weight: typeof weight === 'number' ? weight : undefined,
        preferredUnit,
        fitnessGoal,
        selectedExercise,
        selectedSplit,
        weakPoints,
        barbellBaseWeight,
      });

      if (res.success) {
        showNotification('Profile, biometrics & training preferences saved!');
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
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col bezel-outer">
        <div className="bezel-inner p-6 sm:p-7 flex flex-col flex-1 overflow-hidden space-y-4 text-[var(--text-primary)]">
          {/* Modal Header with Avatar */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] shrink-0 relative z-10">
            <div className="flex items-center gap-3.5">
              {/* Profile Avatar / Camera Trigger */}
              <div className="relative group">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#080C0F] border border-[var(--border-subtle)] flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt={name || user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#B7FF4A] text-[#090B0F] flex items-center justify-center font-display font-black text-lg">
                      {getInitials(name || user.name)}
                    </div>
                  )}
                </div>

                <label
                  title="Upload profile photo (auto-compressed on device < 1 MB)"
                  className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[#B7FF4A] text-[#B7FF4A] hover:bg-[#B7FF4A] hover:text-[#090B0F] transition-all cursor-pointer shadow-md btn-tactile"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-display font-black text-[var(--text-primary)] uppercase tracking-tight">
                    {name || user.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-[#B7FF4A]/10 text-[#B7FF4A] border border-[#B7FF4A]/25 font-mono">
                    {fitnessGoal}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono mt-0.5">
                  <span className="text-[#B7FF4A] font-semibold">
                    @{username || user.username || 'athlete'}
                  </span>
                  <span className="text-[var(--text-muted)]">•</span>
                  <span className="text-[var(--text-muted)] truncate max-w-[150px] sm:max-w-[200px]">
                    {user.email}
                  </span>
                </div>
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
          <div className="grid grid-cols-3 p-1 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] shrink-0 relative z-10 font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('info')}
              className={`py-2 font-bold rounded-xl transition cursor-pointer btn-tactile ${
                activeTab === 'info'
                  ? 'bg-[#B7FF4A] text-[#090B0F] shadow-xs font-black'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Athlete Info
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('split')}
              className={`py-2 font-bold rounded-xl transition cursor-pointer btn-tactile ${
                activeTab === 'split'
                  ? 'bg-[#B7FF4A] text-[#090B0F] shadow-xs font-black'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Split & Focus
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`py-2 font-bold rounded-xl transition cursor-pointer btn-tactile ${
                activeTab === 'security'
                  ? 'bg-[#B7FF4A] text-[#090B0F] shadow-xs font-black'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Security
            </button>
          </div>

          {/* Compression / File Status Notification */}
          {isCompressing && (
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-2xl text-xs text-blue-400 font-medium flex items-center gap-2 animate-in fade-in font-sans">
              <Loader2 className="w-4 h-4 shrink-0 animate-spin text-blue-400" />
              <span>Compressing photo on device to guarantee &lt; 1 MB...</span>
            </div>
          )}

          {compressionStatus && !isCompressing && (
            <div className="p-2.5 bg-[#B7FF4A]/10 border border-[#B7FF4A]/30 rounded-xl text-xs text-[#B7FF4A] font-medium flex items-center justify-between font-mono">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                {compressionStatus}
              </span>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="text-xs text-red-400 hover:text-red-300 transition flex items-center gap-1 font-mono"
                >
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              )}
            </div>
          )}

          {/* Feedback alerts */}
          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 font-medium flex items-center gap-2 animate-in fade-in font-sans">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-500 font-medium flex items-center gap-2 animate-in fade-in font-sans">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Body */}
          <div className="overflow-y-auto space-y-4 pr-1 relative z-10 flex-1">
            {activeTab === 'info' && (
              <form onSubmit={handleSavePersonalInfo} className="space-y-4">
                {/* Photo Upload Card */}
                <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center overflow-hidden flex-shrink-0">
                      {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-4 h-4 text-[var(--text-muted)]" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--text-primary)] font-mono">
                        Profile Image
                      </p>
                      <p className="text-[11px] text-[var(--text-secondary)] font-mono">
                        Max 1 MB (device auto-compression active)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="px-3 py-1.5 rounded-lg bg-[#B7FF4A] hover:bg-[#a8f23d] text-[#090B0F] font-mono text-xs font-bold transition cursor-pointer btn-tactile">
                      {avatarUrl ? 'Change' : 'Upload'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-[var(--bg-card)] transition cursor-pointer"
                        title="Remove photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Name & Username Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Johnson"
                        className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 py-2.5 text-base sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#B7FF4A] focus:ring-1 focus:ring-[#B7FF4A] transition font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-1">
                      Username (Login ID)
                    </label>
                    <div className="relative">
                      <AtSign className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                        placeholder="alex_lifts"
                        minLength={3}
                        maxLength={24}
                        className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 py-2.5 text-base sm:text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[#B7FF4A] focus:ring-1 focus:ring-[#B7FF4A] transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Age, Height, Weight row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#B7FF4A]" />
                      <span>Age (Years)</span>
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="110"
                      value={age}
                      placeholder="26"
                      onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value))}
                      className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-base sm:text-sm text-[var(--text-primary)] font-mono tabular-nums focus:outline-none focus:border-[#B7FF4A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-1 flex items-center gap-1">
                      <Ruler className="w-3.5 h-3.5 text-sky-400" />
                      <span>Height (cm)</span>
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="260"
                      value={height}
                      placeholder="178"
                      onChange={(e) => setHeight(e.target.value === '' ? '' : parseFloat(e.target.value))}
                      className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-base sm:text-sm text-[var(--text-primary)] font-mono tabular-nums focus:outline-none focus:border-[#B7FF4A]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-mono uppercase text-[var(--text-secondary)] flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5 text-[#36D6B0]" />
                        <span>Weight</span>
                      </label>
                      <div className="inline-flex rounded-lg border border-[var(--border-subtle)] overflow-hidden font-mono text-[10px]">
                        <button
                          type="button"
                          onClick={() => setPreferredUnit('kg')}
                          className={`px-1.5 py-0.5 ${preferredUnit === 'kg' ? 'bg-[#B7FF4A] text-[#090B0F] font-bold' : 'text-[var(--text-muted)]'}`}
                        >
                          KG
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreferredUnit('lbs')}
                          className={`px-1.5 py-0.5 ${preferredUnit === 'lbs' ? 'bg-[#B7FF4A] text-[#090B0F] font-bold' : 'text-[var(--text-muted)]'}`}
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
                      placeholder={preferredUnit === 'kg' ? '78.5' : '173'}
                      onChange={(e) => setWeight(e.target.value === '' ? '' : parseFloat(e.target.value))}
                      className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-base sm:text-sm text-[var(--text-primary)] font-mono tabular-nums focus:outline-none focus:border-[#B7FF4A]"
                    />
                  </div>
                </div>

                {/* Primary Training Goal */}
                <div>
                  <label className="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-1.5 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-[#B7FF4A]" />
                    <span>Primary Training Goal</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Hypertrophy', 'Strength', 'Cutting', 'Body Recomposition'] as const).map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => setFitnessGoal(goal)}
                        className={`p-2.5 rounded-xl border text-xs font-mono text-left transition cursor-pointer btn-tactile ${
                          fitnessGoal === goal
                            ? 'bg-[#B7FF4A]/10 border-[#B7FF4A] text-[#B7FF4A] font-bold'
                            : 'bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Key / Focus Exercise */}
                <div>
                  <label className="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-1.5 flex items-center gap-1.5">
                    <Dumbbell className="w-3.5 h-3.5 text-[#B7FF4A]" />
                    <span>Key / Priority Focus Exercise</span>
                  </label>
                  <input
                    type="text"
                    value={selectedExercise}
                    onChange={(e) => setSelectedExercise(e.target.value)}
                    placeholder="e.g. Barbell Bench Press"
                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#B7FF4A] font-mono mb-2"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_EXERCISES.slice(0, 6).map((ex) => (
                      <button
                        key={ex}
                        type="button"
                        onClick={() => setSelectedExercise(ex)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-mono transition cursor-pointer ${
                          selectedExercise === ex
                            ? 'bg-[#B7FF4A] text-[#090B0F] font-bold'
                            : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                        }`}
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSaving || isCompressing}
                    className="w-full py-3 bg-[#B7FF4A] hover:bg-[#a8f23d] text-[#090B0F] font-display font-black uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-md shadow-[#B7FF4A]/20 cursor-pointer disabled:opacity-50 btn-tactile"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving...' : 'Save Profile & Biometrics'}</span>
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'split' && (
              <div className="space-y-4">
                {/* Training Split Choice */}
                <div>
                  <label className="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#B7FF4A]" />
                    <span>Active Training Split</span>
                  </label>
                  <div className="space-y-2">
                    {SPLIT_CHOICES.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedSplit(s.id)}
                        className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer btn-tactile ${
                          selectedSplit === s.id
                            ? 'bg-[#B7FF4A]/10 border-[#B7FF4A] text-[var(--text-primary)]'
                            : 'bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold font-mono">{s.label}</div>
                          <div className="text-[10px] text-[var(--text-muted)] font-mono">{s.days} frequency</div>
                        </div>
                        {selectedSplit === s.id && (
                          <div className="w-2 h-2 rounded-full bg-[#B7FF4A]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weak Points Targets */}
                <div>
                  <label className="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#B7FF4A]" />
                    <span>Priority Weak-Point Focus Areas</span>
                  </label>
                  <p className="text-[11px] text-[var(--text-muted)] font-mono mb-2">
                    Exercises matching these muscle tags will receive priority sequencing and overload attention.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {WEAK_POINTS_LIST.map((wp) => {
                      const isSelected = weakPoints.includes(wp);
                      return (
                        <button
                          key={wp}
                          type="button"
                          onClick={() => toggleWeakPoint(wp)}
                          className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono transition cursor-pointer btn-tactile ${
                            isSelected
                              ? 'bg-[#B7FF4A] border-[#B7FF4A] text-[#090B0F] font-bold shadow-xs'
                              : 'bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          {isSelected && '✓ '}
                          {wp}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Base Barbell Weight */}
                <div>
                  <label className="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-1 flex items-center gap-1.5">
                    <Dumbbell className="w-3.5 h-3.5 text-[#B7FF4A]" />
                    <span>Default Olympic Bar Weight ({preferredUnit})</span>
                  </label>
                  <input
                    type="number"
                    value={barbellBaseWeight}
                    onChange={(e) => setBarbellBaseWeight(parseFloat(e.target.value) || 20)}
                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-base sm:text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[#B7FF4A]"
                  />
                  <span className="text-[10px] text-[var(--text-muted)] font-mono mt-1 block">
                    Standard Olympic men&apos;s bar: 20 kg (45 lbs). Women&apos;s barbell: 15 kg (35 lbs).
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSavePersonalInfo}
                    disabled={isSaving}
                    className="w-full py-3 bg-[#B7FF4A] hover:bg-[#a8f23d] text-[#090B0F] font-display font-black uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-md shadow-[#B7FF4A]/20 cursor-pointer disabled:opacity-50 btn-tactile"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving...' : 'Save Split Preferences'}</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-4">
                {/* Update Email Form */}
                <form onSubmit={handleUpdateEmail} className="space-y-3 p-4 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)]">
                  <h4 className="text-xs font-mono font-bold uppercase text-[var(--text-primary)] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#B7FF4A]" /> Update Email Address
                  </h4>
                  <div>
                    <input
                      type="email"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-base sm:text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[#B7FF4A]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSaving || newEmail === user.email}
                    className="py-2 px-4 bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-mono font-bold rounded-xl transition cursor-pointer disabled:opacity-50 btn-tactile"
                  >
                    Update Email
                  </button>
                </form>

                {/* Update Password Form */}
                <form onSubmit={handleUpdatePassword} className="space-y-3 p-4 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)]">
                  <h4 className="text-xs font-mono font-bold uppercase text-[var(--text-primary)] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#B7FF4A]" /> Change Password
                  </h4>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="New password (min 6 chars)"
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-base sm:text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[#B7FF4A]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-base sm:text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[#B7FF4A]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSaving || !newPassword || newPassword !== confirmPassword}
                    className="py-2 px-4 bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-mono font-bold rounded-xl transition cursor-pointer disabled:opacity-50 btn-tactile"
                  >
                    Save Password
                  </button>
                </form>

                {/* Sign Out Card */}
                <div className="p-4 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono font-bold text-[var(--text-primary)]">Sign Out</div>
                    <div className="text-[11px] text-[var(--text-muted)] font-mono">
                      Log out on this device
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      await logout();
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer btn-tactile"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile, updateEmail, updatePassword, logout } = useAuth();

  // Active tab within profile
  const [activeTab, setActiveTab] = useState<'info' | 'security'>('info');

  // Personal Info form
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [preferredUnit, setPreferredUnit] = useState<'kg' | 'lbs'>('kg');
  const [fitnessGoal, setFitnessGoal] = useState<'Hypertrophy' | 'Strength' | 'Cutting' | 'Body Recomposition'>('Hypertrophy');

  // Email update form
  const [newEmail, setNewEmail] = useState('');
  const [emailCurrentPassword, setEmailCurrentPassword] = useState('');

  // Password update form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Status feedback
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Sync state with user profile
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAge(user.age ?? '');
      setHeight(user.height ?? '');
      setWeight(user.weight ?? '');
      setPreferredUnit(user.preferredUnit || 'kg');
      setFitnessGoal(user.fitnessGoal || 'Hypertrophy');
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
      });

      if (res.success) {
        showNotification('Profile details updated successfully!');
      } else {
        setErrorMsg(res.error || 'Failed to update profile.');
      }
    } catch {
      setErrorMsg('Unexpected error saving profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await updateEmail({
        newEmail,
        currentPassword: emailCurrentPassword,
      });

      if (res.success) {
        setEmailCurrentPassword('');
        showNotification('Email address updated successfully!');
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
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (res.success) {
        setCurrentPassword('');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header with User Card */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
              {getInitials(user.name)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-zinc-900 tracking-tight">{user.name}</h3>
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                  {user.fitnessGoal}
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-medium mt-0.5">{user.email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition"
            aria-label="Close profile modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 p-1 bg-zinc-100 rounded-2xl border border-zinc-200/80 mt-4 shrink-0 relative z-10">
          <button
            type="button"
            onClick={() => {
              setActiveTab('info');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'info'
                ? 'bg-white text-zinc-900 shadow-sm font-black'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Personal Info (Age, Ht, Wt)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('security');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'security'
                ? 'bg-white text-zinc-900 shadow-sm font-black'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Email & Password</span>
          </button>
        </div>

        {/* Feedback alerts */}
        {successMsg && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-700 font-medium flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 font-medium flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto mt-4 space-y-4 pr-1 relative z-10">
          {activeTab === 'info' ? (
            /* Personal Information Form */
            <form onSubmit={handleSavePersonalInfo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-9 pr-3 py-2.5 text-xs text-zinc-900 focus:outline-none focus:bg-white focus:border-amber-500 transition font-medium"
                  />
                </div>
              </div>

              {/* Age, Height, Weight row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Age */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span>Age</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 24"
                    min="10"
                    max="110"
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-2.5 text-xs text-zinc-900 font-mono focus:outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>

                {/* Height */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                    <Ruler className="w-3.5 h-3.5 text-sky-500" />
                    <span>Height (cm)</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 178"
                    min="50"
                    max="260"
                    value={height}
                    onChange={(e) => setHeight(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-2.5 text-xs text-zinc-900 font-mono focus:outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>

                {/* Weight */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-zinc-700 flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Weight</span>
                    </label>
                    <div className="flex gap-1 text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setPreferredUnit('kg')}
                        className={`px-1.5 py-0.5 rounded-md ${
                          preferredUnit === 'kg'
                            ? 'bg-amber-500 text-white shadow-2xs'
                            : 'text-zinc-500 hover:text-zinc-900'
                        }`}
                      >
                        KG
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreferredUnit('lbs')}
                        className={`px-1.5 py-0.5 rounded-md ${
                          preferredUnit === 'lbs'
                            ? 'bg-amber-500 text-white shadow-2xs'
                            : 'text-zinc-500 hover:text-zinc-900'
                        }`}
                      >
                        LBS
                      </button>
                    </div>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    placeholder={`e.g. ${preferredUnit === 'kg' ? '78.5' : '173'}`}
                    min="20"
                    max="400"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-2.5 text-xs text-zinc-900 font-mono focus:outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Fitness Goal */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1">
                  <Dumbbell className="w-3.5 h-3.5 text-amber-500" />
                  <span>Primary Training Goal</span>
                </label>
                <select
                  value={fitnessGoal}
                  onChange={(e) => setFitnessGoal(e.target.value as any)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-2.5 text-xs text-zinc-800 focus:outline-none focus:bg-white focus:border-amber-500"
                >
                  <option value="Hypertrophy">Hypertrophy (Upper Chest & Delts Priority)</option>
                  <option value="Strength">Strength & Power Overload</option>
                  <option value="Cutting">Cutting & Fat Loss</option>
                  <option value="Body Recomposition">Body Recomposition</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-sm flex items-center gap-2 transition active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Personal Details</span>
                </button>
              </div>
            </form>
          ) : (
            /* Security (Email & Password Update) Forms */
            <div className="space-y-5">
              {/* 1. Update Email Form */}
              <form onSubmit={handleUpdateEmail} className="bg-zinc-50 border border-zinc-200 rounded-3xl p-4 space-y-3">
                <div className="flex items-center gap-2 border-b border-zinc-200/80 pb-2">
                  <Mail className="w-4 h-4 text-sky-600" />
                  <h4 className="text-xs font-black text-zinc-900 uppercase tracking-wider">
                    Update Email Address
                  </h4>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                    New Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="new-email@domain.com"
                    className="w-full bg-white border border-zinc-200 rounded-2xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                    Current Password (for verification)
                  </label>
                  <input
                    type="password"
                    required
                    value={emailCurrentPassword}
                    onChange={(e) => setEmailCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-white border border-zinc-200 rounded-2xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-amber-500 transition font-mono"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isSaving || !newEmail || !emailCurrentPassword}
                    className="px-4 py-2 bg-zinc-900 hover:bg-black text-white font-bold text-xs rounded-2xl transition active:scale-95 disabled:opacity-40"
                  >
                    Update Email
                  </button>
                </div>
              </form>

              {/* 2. Update Password Form */}
              <form onSubmit={handleUpdatePassword} className="bg-zinc-50 border border-zinc-200 rounded-3xl p-4 space-y-3">
                <div className="flex items-center gap-2 border-b border-zinc-200/80 pb-2">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-black text-zinc-900 uppercase tracking-wider">
                    Change Password
                  </h4>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Current password"
                      className="w-full bg-white border border-zinc-200 rounded-2xl pl-3 pr-10 py-2 text-xs text-zinc-900 focus:outline-none focus:border-amber-500 transition font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    >
                      {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className="w-full bg-white border border-zinc-200 rounded-2xl pl-3 pr-10 py-2 text-xs text-zinc-900 focus:outline-none focus:border-amber-500 transition font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                      >
                        {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type new password"
                      className="w-full bg-white border border-zinc-200 rounded-2xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-amber-500 transition font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isSaving || !currentPassword || !newPassword || !confirmPassword}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-2xl transition active:scale-95 disabled:opacity-40"
                  >
                    Save New Password
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Modal Footer with Sign Out */}
        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between shrink-0 relative z-10">
          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to sign out?')) {
                logout();
                onClose();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-bold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-2xl text-xs font-bold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

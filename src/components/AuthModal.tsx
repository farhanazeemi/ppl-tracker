'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, User, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extra optional fields for signup
  const [age, setAge] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [fitnessGoal, setFitnessGoal] = useState<'Hypertrophy' | 'Strength' | 'Cutting' | 'Body Recomposition'>('Hypertrophy');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          onClose();
        } else {
          setErrorMsg(res.error || 'Login failed.');
        }
      } else {
        const res = await signup(name, email, password, {
          age: typeof age === 'number' ? age : undefined,
          height: typeof height === 'number' ? height : undefined,
          weight: typeof weight === 'number' ? weight : undefined,
          fitnessGoal,
          preferredUnit: 'kg',
        });
        if (res.success) {
          onClose();
        } else {
          setErrorMsg(res.error || 'Signup failed.');
        }
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoFill = async () => {
    const demoEmail = 'athlete.demo@ppltracker.com';
    const demoPass = 'password123';
    setEmail(demoEmail);
    setPassword(demoPass);
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      let res = await login(demoEmail, demoPass);
      if (!res.success) {
        res = await signup('Demo Athlete', demoEmail, demoPass, {
          age: 24,
          height: 178,
          weight: 78.5,
          preferredUnit: 'kg',
          fitnessGoal: 'Hypertrophy',
        });
      }
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.error || 'Demo login failed.');
      }
    } catch {
      setErrorMsg('Demo login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-2xl border border-amber-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-zinc-900 tracking-tight">
                {mode === 'login' ? 'Welcome Back' : 'Create Hypertrophy Profile'}
              </h3>
              <p className="text-xs text-zinc-500 font-medium">
                {mode === 'login'
                  ? 'Access your PPL workouts, streaks & PRs'
                  : 'Start tracking progressive overload & volume'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-zinc-100 rounded-2xl border border-zinc-200/80 mt-4 relative z-10">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              mode === 'login'
                ? 'bg-white text-zinc-900 shadow-sm font-black'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              mode === 'signup'
                ? 'bg-white text-zinc-900 shadow-sm font-black'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 font-medium leading-relaxed">
            {errorMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 relative z-10">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Farhan Azeemi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-9 pr-3 py-2.5 text-xs text-zinc-900 focus:outline-none focus:bg-white focus:border-amber-500 transition font-medium"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-9 pr-3 py-2.5 text-xs text-zinc-900 focus:outline-none focus:bg-white focus:border-amber-500 transition font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-9 pr-10 py-2.5 text-xs text-zinc-900 focus:outline-none focus:bg-white focus:border-amber-500 transition font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Optional Signup fields: Age, Height, Weight */}
          {mode === 'signup' && (
            <div className="pt-1 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-600 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    placeholder="24"
                    min="12"
                    max="100"
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-2.5 py-2 text-xs text-zinc-900 font-mono focus:outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-600 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    placeholder="178"
                    min="80"
                    max="250"
                    value={height}
                    onChange={(e) => setHeight(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-2.5 py-2 text-xs text-zinc-900 font-mono focus:outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-600 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="78.5"
                    min="30"
                    max="300"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-2.5 py-2 text-xs text-zinc-900 font-mono focus:outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-600 mb-1">
                  Primary Fitness Goal
                </label>
                <select
                  value={fitnessGoal}
                  onChange={(e) => setFitnessGoal(e.target.value as any)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:bg-white focus:border-amber-500"
                >
                  <option value="Hypertrophy">Hypertrophy (Upper Chest & Delts Priority)</option>
                  <option value="Strength">Strength & Power Overload</option>
                  <option value="Cutting">Cutting & Fat Loss</option>
                  <option value="Body Recomposition">Body Recomposition</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 mt-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-sm flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
          >
            <span>{mode === 'login' ? 'Sign In to Tracker' : 'Create & Save Profile'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Login Option */}
        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500 relative z-10">
          <span>Testing the app?</span>
          <button
            type="button"
            onClick={handleDemoFill}
            className="text-amber-600 hover:text-amber-700 font-bold underline decoration-dotted transition"
          >
            One-Click Demo Login
          </button>
        </div>
      </div>
    </div>
  );
};

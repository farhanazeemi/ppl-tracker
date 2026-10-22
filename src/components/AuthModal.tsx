'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, User, Eye, EyeOff, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
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
          setErrorMsg(res.error || 'Login failed. Please check credentials.');
        }
      } else {
        const res = await signup(name, email, password, {
          onboardingCompleted: false, // will trigger onboarding flow right after!
        });
        if (res.success) {
          onClose();
        } else {
          setErrorMsg(res.error || 'Signup failed. Please try again.');
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
          age: 25,
          height: 180,
          weight: 80,
          preferredUnit: 'kg',
          fitnessGoal: 'Hypertrophy',
          onboardingCompleted: true,
          selectedSplit: 'ppl',
          weakPoints: ['Upper Chest', 'Lateral Delts'],
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-zinc-900 dark:text-white uppercase tracking-tight">
                {mode === 'login' ? 'Athlete Sign In' : 'Unlock Workout Tracker'}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                {mode === 'login'
                  ? 'Access your saved workouts & double progressions'
                  : 'Get customized splits and lagging muscle focus'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 mt-4 relative z-10">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              mode === 'login'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm font-black'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
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
            className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              mode === 'signup'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm font-black'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Sign Up Free
          </button>
        </div>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-600 dark:text-red-400 font-medium leading-relaxed">
            {errorMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 relative z-10">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-700 dark:text-zinc-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-700 dark:text-zinc-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="athlete@domain.com"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 transition font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-700 dark:text-zinc-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 transition font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-display font-bold uppercase tracking-wider text-sm rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/20 active:scale-98 disabled:opacity-50 cursor-pointer mt-2"
          >
            {isSubmitting ? (
              'Processing...'
            ) : mode === 'login' ? (
              <>
                Sign In to Tracker <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Create Free Account & Onboard <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login */}
        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center">
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mb-2">Want to test the app instantly?</p>
          <button
            type="button"
            onClick={handleDemoFill}
            disabled={isSubmitting}
            className="w-full py-2 px-3 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold rounded-xl text-zinc-700 dark:text-zinc-300 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Instant Demo Account Fill
          </button>
        </div>
      </div>
    </div>
  );
};

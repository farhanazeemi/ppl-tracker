'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthModalMode } from '../types/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthModalMode;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { login, signup, signInWithGoogle, resetPassword, updatePassword } = useAuth();
  const [mode, setMode] = useState<AuthModalMode>(initialMode);

  // Sync mode whenever modal opens or initialMode changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen, initialMode]);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          onClose();
        } else {
          setErrorMsg(res.error || 'Login failed. Please check credentials.');
        }
      } else if (mode === 'signup') {
        const res = await signup(name, email, password, {
          onboardingCompleted: false, // will trigger onboarding flow right after!
        });
        if (res.success) {
          onClose();
        } else {
          setErrorMsg(res.error || 'Signup failed. Please try again.');
        }
      } else if (mode === 'forgot') {
        const res = await resetPassword(email);
        if (res.success) {
          setSuccessMsg(
            `A password reset link has been dispatched to ${email.trim().toLowerCase()}. Please check your inbox and follow the link.`
          );
        } else {
          setErrorMsg(res.error || 'Failed to send reset link. Please check the email.');
        }
      } else if (mode === 'reset-password') {
        if (!password || password.length < 6) {
          setErrorMsg('New password must be at least 6 characters long.');
          setIsSubmitting(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMsg('Passwords do not match. Please re-enter.');
          setIsSubmitting(false);
          return;
        }

        const res = await updatePassword({
          newPassword: password,
          confirmPassword: confirmPassword,
        });

        if (res.success) {
          setSuccessMsg('Your password has been successfully updated! You can now access your workouts.');
          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          setErrorMsg(res.error || 'Failed to update password.');
        }
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsGoogleLoading(true);
    try {
      const res = await signInWithGoogle();
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to connect to Google.');
        setIsGoogleLoading(false);
      }
      // On success, browser will redirect to Google authentication
    } catch {
      setErrorMsg('An unexpected error occurred connecting with Google.');
      setIsGoogleLoading(false);
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

  const getHeaderTitle = () => {
    switch (mode) {
      case 'signup':
        return 'Unlock Workout Tracker';
      case 'forgot':
        return 'Reset Athlete Password';
      case 'reset-password':
        return 'Set New Password';
      case 'login':
      default:
        return 'Athlete Sign In';
    }
  };

  const getHeaderSubtitle = () => {
    switch (mode) {
      case 'signup':
        return 'Get customized splits and lagging muscle focus';
      case 'forgot':
        return 'Enter your email to receive a secure recovery link';
      case 'reset-password':
        return 'Choose a new password with at least 6 characters';
      case 'login':
      default:
        return 'Access your saved workouts & double progressions';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden text-[var(--text-primary)] card-bento">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] rounded-2xl border border-[var(--accent-primary)]/20">
              {mode === 'forgot' ? (
                <KeyRound className="w-5 h-5" />
              ) : mode === 'reset-password' ? (
                <ShieldCheck className="w-5 h-5" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-[var(--text-primary)] uppercase tracking-tight">
                {getHeaderTitle()}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] font-medium">
                {getHeaderSubtitle()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition cursor-pointer btn-tactile"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Switcher Tabs for Sign In / Sign Up */}
        {(mode === 'login' || mode === 'signup') && (
          <div className="grid grid-cols-2 p-1 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] mt-4 relative z-10">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer btn-tactile ${
                mode === 'login'
                  ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm font-black'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer btn-tactile ${
                mode === 'signup'
                  ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm font-black'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Sign Up Free
            </button>
          </div>
        )}

        {/* Error Feedback */}
        {errorMsg && (
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-500 font-medium leading-relaxed">
            {errorMsg}
          </div>
        )}

        {/* Success Feedback */}
        {successMsg && (
          <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-500 font-medium leading-relaxed flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* GOOGLE ONE-CLICK AUTH (for login & signup modes) */}
        {(mode === 'login' || mode === 'signup') && (
          <div className="mt-4 relative z-10">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isSubmitting || isGoogleLoading}
              className="w-full py-2.5 px-4 bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition btn-tactile shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[var(--text-muted)]" />
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>{mode === 'signup' ? 'Sign up with Google' : 'Continue with Google'}</span>
            </button>

            {/* Aesthetic Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border-subtle)]" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                <span className="bg-[var(--bg-card)] px-3 text-[var(--text-muted)] font-mono">
                  Or continue with email
                </span>
              </div>
            </div>
          </div>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 relative z-10">
            <div>
              <label className="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-1">
                Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="athlete@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[var(--accent-primary)] hover:opacity-95 text-black font-display font-bold uppercase tracking-wider text-sm rounded-xl flex items-center justify-center gap-2 transition btn-tactile shadow-lg shadow-[var(--accent-primary)]/20 active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending Link...
                </>
              ) : (
                <>
                  Send Recovery Link <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="w-full py-2 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition flex items-center justify-center gap-1.5 cursor-pointer btn-tactile"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </button>
          </form>
        )}

        {/* SET NEW PASSWORD FORM (recovery callback) */}
        {mode === 'reset-password' && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 relative z-10">
            <div>
              <label className="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-10 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[var(--accent-primary)] hover:opacity-95 text-black font-display font-bold uppercase tracking-wider text-sm rounded-xl flex items-center justify-center gap-2 transition btn-tactile shadow-lg shadow-[var(--accent-primary)]/20 active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving Password...
                </>
              ) : (
                <>
                  Save New Password & Continue <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* EMAIL & PASSWORD LOGIN / SIGNUP FORM */}
        {(mode === 'login' || mode === 'signup') && (
          <form onSubmit={handleSubmit} className="mt-3 space-y-3.5 relative z-10">
            {mode === 'signup' && (
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
                    placeholder="e.g. Alex Johnson"
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="athlete@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono uppercase text-[var(--text-secondary)]">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-[11px] font-mono text-[var(--accent-primary)] hover:opacity-80 transition cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[var(--accent-primary)] hover:opacity-95 text-black font-display font-bold uppercase tracking-wider text-sm rounded-xl flex items-center justify-center gap-2 transition btn-tactile shadow-lg shadow-[var(--accent-primary)]/20 active:scale-98 disabled:opacity-50 cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                </>
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
        )}

        {/* Demo Fast Login (for login and signup modes) */}
        {(mode === 'login' || mode === 'signup') && (
          <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] text-center">
            <p className="text-[11px] text-[var(--text-muted)] mb-2">Want to test the app instantly?</p>
            <button
              type="button"
              onClick={handleDemoFill}
              disabled={isSubmitting || isGoogleLoading}
              className="w-full py-2 px-3 bg-[var(--bg-elevated)] hover:bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-semibold rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition flex items-center justify-center gap-1.5 cursor-pointer btn-tactile"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" /> Instant Demo Account Fill
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

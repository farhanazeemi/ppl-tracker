'use client';

import { useModalAccessibility } from '../utils/useModalAccessibility';
import React, { useState, useEffect, useMemo } from 'react';
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
  AtSign,
  AlertTriangle,
  SlidersHorizontal,
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
  useModalAccessibility(isOpen, onClose);

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
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Optional Biometric Quick-Setup on Sign Up (interconnects all calculators immediately)
  const [showBiometricSetup, setShowBiometricSetup] = useState(false);
  const [signupGender, setSignupGender] = useState<'male' | 'female'>('male');
  const [signupAge, setSignupAge] = useState<string>('');
  const [signupHeight, setSignupHeight] = useState<string>('');
  const [signupWeight, setSignupWeight] = useState<string>('');

  // Brute-force rate-limit protection
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  // Password strength calculation for Sign-Up & Reset Password
  const passwordMetrics = useMemo(() => {
    const hasMinLength = password.length >= 8;
    const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    const score = [hasMinLength, hasMixedCase, hasNumber, hasSymbol].filter(Boolean).length;
    const label =
      password.length === 0
        ? 'Enter password'
        : score <= 1
        ? 'Weak'
        : score === 2
        ? 'Fair'
        : score === 3
        ? 'Strong'
        : 'Elite Security';
    const colorClass =
      score <= 1
        ? 'bg-red-500'
        : score === 2
        ? 'bg-amber-400'
        : score === 3
        ? 'bg-emerald-400'
        : 'bg-[#B7FF4A]';

    return { hasMinLength, hasMixedCase, hasNumber, hasSymbol, score, label, colorClass };
  }, [password]);

  // Status feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) {
      setErrorMsg(`Too many failed attempts. Please wait ${lockoutSeconds}s before trying again.`);
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          setFailedAttempts(0);
          onClose();
        } else {
          const nextAttempts = failedAttempts + 1;
          setFailedAttempts(nextAttempts);
          if (nextAttempts >= 5) {
            setLockoutSeconds(15);
            setErrorMsg('Too many failed sign-in attempts. Account login paused for 15 seconds for security.');
          } else {
            setErrorMsg(res.error || 'Login failed. Please check your email/username and password.');
          }
        }
      } else if (mode === 'signup') {
        const cleanUser = username.trim().toLowerCase().replace(/^@/, '');
        if (cleanUser && !/^[a-zA-Z0-9_]{3,24}$/.test(cleanUser)) {
          setErrorMsg('Username must be 3-24 characters containing only letters, numbers, and underscores.');
          setIsSubmitting(false);
          return;
        }

        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters long.');
          setIsSubmitting(false);
          return;
        }

        const parsedAge = parseInt(signupAge, 10);
        const parsedHeight = parseFloat(signupHeight);
        const parsedWeight = parseFloat(signupWeight);

        const res = await signup(
          name,
          email,
          password,
          {
            username: cleanUser,
            gender: signupGender,
            age: Number.isFinite(parsedAge) && parsedAge > 0 ? parsedAge : undefined,
            height: Number.isFinite(parsedHeight) && parsedHeight > 0 ? parsedHeight : undefined,
            weight: Number.isFinite(parsedWeight) && parsedWeight > 0 ? parsedWeight : undefined,
            onboardingCompleted: false,
          },
          cleanUser
        );
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
          setErrorMsg('Passwords do not match.');
          setIsSubmitting(false);
          return;
        }

        const res = await updatePassword({ newPassword: password, confirmPassword });
        if (res.success) {
          setSuccessMsg('Your password has been securely updated. You may now continue using PPL Tracker.');
          setTimeout(() => {
            onClose();
          }, 1800);
        } else {
          setErrorMsg(res.error || 'Failed to update password.');
        }
      }
    } catch {
      setErrorMsg('An unexpected authentication error occurred.');
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
        setErrorMsg(res.error || 'Failed to initialize Google authentication.');
      }
    } catch {
      setErrorMsg('Google authentication failed.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleDemoFill = async () => {
    const demoEmail = 'alex.athlete@example.com';
    const demoPass = 'PplHypertrophy2026!';
    setName('Demo Athlete');
    setUsername('alex_demo');
    setEmail(demoEmail);
    setPassword(demoPass);
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      let res = await login(demoEmail, demoPass);
      if (!res.success) {
        res = await signup(
          'Demo Athlete',
          demoEmail,
          demoPass,
          {
            username: 'alex_demo',
            gender: 'male',
            age: 27,
            height: 180,
            weight: 82,
            onboardingCompleted: true,
          },
          'alex_demo'
        );
      }
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.error || 'Demo login failed.');
      }
    } catch {
      setErrorMsg('Failed to run demo fill.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md max-h-[92vh] flex flex-col bezel-outer">
        <div className="bezel-inner p-6 sm:p-7 flex flex-col flex-1 overflow-y-auto space-y-4 text-[var(--text-primary)]">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#B7FF4A]/15 border border-[#B7FF4A]/30 flex items-center justify-center text-[#B7FF4A]">
                {mode === 'login' && <ShieldCheck className="w-4 h-4" />}
                {mode === 'signup' && <Sparkles className="w-4 h-4" />}
                {mode === 'forgot' && <KeyRound className="w-4 h-4" />}
                {mode === 'reset-password' && <ShieldCheck className="w-4 h-4" />}
              </div>
              <div>
                <h3 className="text-base font-display font-black text-[var(--text-primary)] uppercase tracking-tight">
                  {mode === 'login' && 'Secure Sign In'}
                  {mode === 'signup' && 'Create Lifter Account'}
                  {mode === 'forgot' && 'Reset Password'}
                  {mode === 'reset-password' && 'Choose New Password'}
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)] font-mono">
                  {mode === 'login' && 'Sync your hypertrophy logs & all 8 calculators'}
                  {mode === 'signup' && 'Auto-sync biometrics across BMI, TDEE, FFMI & 1RM'}
                  {mode === 'forgot' && 'We will send a recovery token to your email'}
                  {mode === 'reset-password' && 'Enter and confirm your new secure password'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition cursor-pointer btn-tactile"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Switcher Tabs for Sign In / Sign Up */}
          {(mode === 'login' || mode === 'signup') && (
            <div
              role="tablist"
              aria-label="Authentication mode"
              className="grid grid-cols-2 p-1 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] relative z-10"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'login'}
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer btn-tactile font-mono uppercase ${
                  mode === 'login'
                    ? 'bg-[#B7FF4A] text-[#090B0F] shadow-xs font-black'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'signup'}
                onClick={() => {
                  setMode('signup');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer btn-tactile font-mono uppercase ${
                  mode === 'signup'
                    ? 'bg-[#B7FF4A] text-[#090B0F] shadow-xs font-black'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Sign Up Free
              </button>
            </div>
          )}

          {/* Error Feedback */}
          {errorMsg && (
            <div
              role="alert"
              className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-500 font-medium leading-relaxed font-sans flex items-start gap-2"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Feedback */}
          {successMsg && (
            <div
              role="status"
              className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 font-medium leading-relaxed flex items-start gap-2 font-sans"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* GOOGLE ONE-CLICK AUTH */}
          {(mode === 'login' || mode === 'signup') && (
            <div className="relative z-10 space-y-3">
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isSubmitting || isGoogleLoading || lockoutSeconds > 0}
                className="w-full py-2.5 px-4 bg-[var(--bg-elevated)] hover:bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition btn-tactile shadow-xs cursor-pointer disabled:opacity-50"
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

              {/* Divider */}
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--border-subtle)]" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                  <span className="bg-[var(--bg-card)] px-3 text-[var(--text-muted)] font-mono">
                    {mode === 'login' ? 'Or sign in with email/username' : 'Or sign up with email'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === 'forgot' && (
            <form onSubmit={handleSubmit} className="space-y-3.5 relative z-10">
              <div>
                <label
                  htmlFor="auth-forgot-email"
                  className="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-1"
                >
                  Account Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="auth-forgot-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="athlete@domain.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-base sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#B7FF4A] focus:ring-1 focus:ring-[#B7FF4A] transition font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#B7FF4A] hover:bg-[#a8f23d] text-[#090B0F] font-display font-black uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 transition btn-tactile shadow-md shadow-[#B7FF4A]/20 disabled:opacity-50 cursor-pointer"
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

          {/* SET NEW PASSWORD FORM */}
          {mode === 'reset-password' && (
            <form onSubmit={handleSubmit} className="space-y-3.5 relative z-10">
              <div>
                <label
                  htmlFor="auth-reset-password"
                  className="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-1"
                >
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="auth-reset-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 chars recommended"
                    className="w-full pl-10 pr-10 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-base sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#B7FF4A] focus:ring-1 focus:ring-[#B7FF4A] transition font-mono"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="auth-reset-confirm"
                  className="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-1"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="auth-reset-confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-10 pr-10 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-base sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#B7FF4A] focus:ring-1 focus:ring-[#B7FF4A] transition font-mono"
                  />
                  <button
                    type="button"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
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
                className="w-full py-3 bg-[#B7FF4A] hover:bg-[#a8f23d] text-[#090B0F] font-display font-black uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 transition btn-tactile shadow-md shadow-[#B7FF4A]/20 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving Password...
                  </>
                ) : (
                  <>
                    Save New Password &amp; Continue <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* EMAIL & PASSWORD LOGIN / SIGNUP FORM */}
          {(mode === 'login' || mode === 'signup') && (
            <form onSubmit={handleSubmit} className="space-y-3.5 relative z-10">
              {mode === 'signup' && (
                <>
                  <div>
                    <label
                      htmlFor="auth-signup-name"
                      className="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-1"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="auth-signup-name"
                        type="text"
                        autoComplete="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex Johnson"
                        className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-base sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#B7FF4A] focus:ring-1 focus:ring-[#B7FF4A] transition font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="auth-signup-username"
                      className="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-1"
                    >
                      Choose Username
                    </label>
                    <div className="relative">
                      <AtSign className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="auth-signup-username"
                        type="text"
                        autoComplete="username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                        placeholder="alex_lifts"
                        minLength={3}
                        maxLength={24}
                        className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-base sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#B7FF4A] focus:ring-1 focus:ring-[#B7FF4A] transition font-mono"
                      />
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5 block">
                      3-24 characters (letters, numbers, underscore). You can log in with this later.
                    </span>
                  </div>
                </>
              )}

              <div>
                <label
                  htmlFor="auth-identifier-input"
                  className="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-1"
                >
                  {mode === 'login' ? 'Email Address or Username' : 'Email Address'}
                </label>
                <div className="relative">
                  {mode === 'login' && !email.includes('@') ? (
                    <AtSign className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  ) : (
                    <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  )}
                  <input
                    id="auth-identifier-input"
                    type={mode === 'login' ? 'text' : 'email'}
                    autoComplete={mode === 'login' ? 'username' : 'email'}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={mode === 'login' ? 'athlete@domain.com or @alex_lifts' : 'athlete@domain.com'}
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-base sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#B7FF4A] focus:ring-1 focus:ring-[#B7FF4A] transition font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="auth-password-input"
                    className="block text-xs font-mono uppercase text-[var(--text-secondary)]"
                  >
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
                      className="text-[11px] font-mono text-[#B7FF4A] hover:underline transition cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="auth-password-input"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-base sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#B7FF4A] focus:ring-1 focus:ring-[#B7FF4A] transition font-mono"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Live Password Strength Meter on Sign-Up */}
                {mode === 'signup' && password.length > 0 && (
                  <div className="mt-2 p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[var(--text-secondary)] uppercase">Password Security</span>
                      <span className="font-bold text-[var(--text-primary)]">{passwordMetrics.label}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 h-1.5">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`rounded-full transition-colors ${
                            passwordMetrics.score >= step
                              ? passwordMetrics.colorClass
                              : 'bg-[var(--border-subtle)]'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-[var(--text-muted)] pt-0.5">
                      <span className={passwordMetrics.hasMinLength ? 'text-emerald-400' : ''}>
                        {passwordMetrics.hasMinLength ? '✓' : '○'} 8+ characters
                      </span>
                      <span className={passwordMetrics.hasMixedCase ? 'text-emerald-400' : ''}>
                        {passwordMetrics.hasMixedCase ? '✓' : '○'} Upper &amp; lowercase
                      </span>
                      <span className={passwordMetrics.hasNumber ? 'text-emerald-400' : ''}>
                        {passwordMetrics.hasNumber ? '✓' : '○'} Number (0-9)
                      </span>
                      <span className={passwordMetrics.hasSymbol ? 'text-emerald-400' : ''}>
                        {passwordMetrics.hasSymbol ? '✓' : '○'} Symbol (!@#$)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Optional Biometric Quick-Setup on Sign Up */}
              {mode === 'signup' && (
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 p-3 space-y-3">
                  <button
                    type="button"
                    onClick={() => setShowBiometricSetup(!showBiometricSetup)}
                    className="w-full flex items-center justify-between text-left text-xs font-mono font-bold text-[var(--text-primary)] cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#B7FF4A]" />
                      Auto-Sync Biometrics for BMI, TDEE &amp; FFMI (Optional)
                    </span>
                    <span className="text-[10px] text-[#B7FF4A]">{showBiometricSetup ? 'Hide' : 'Expand +'}</span>
                  </button>

                  {showBiometricSetup && (
                    <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[var(--border-subtle)]">
                      <div className="col-span-2">
                        <span className="block text-[10px] font-mono uppercase text-[var(--text-secondary)] mb-1">
                          Gender / Biological Sex
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setSignupGender('male')}
                            className={`py-1.5 rounded-lg text-xs font-mono font-bold border cursor-pointer ${
                              signupGender === 'male'
                                ? 'bg-[#B7FF4A]/15 border-[#B7FF4A] text-[#B7FF4A]'
                                : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'
                            }`}
                          >
                            Male
                          </button>
                          <button
                            type="button"
                            onClick={() => setSignupGender('female')}
                            className={`py-1.5 rounded-lg text-xs font-mono font-bold border cursor-pointer ${
                              signupGender === 'female'
                                ? 'bg-[#B7FF4A]/15 border-[#B7FF4A] text-[#B7FF4A]'
                                : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'
                            }`}
                          >
                            Female
                          </button>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="signup-age" className="block text-[10px] font-mono uppercase text-[var(--text-secondary)] mb-1">
                          Age (yrs)
                        </label>
                        <input
                          id="signup-age"
                          type="number"
                          min={12}
                          max={100}
                          value={signupAge}
                          onChange={(e) => setSignupAge(e.target.value)}
                          placeholder="26"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)]"
                        />
                      </div>
                      <div>
                        <label htmlFor="signup-height" className="block text-[10px] font-mono uppercase text-[var(--text-secondary)] mb-1">
                          Height / Length (cm)
                        </label>
                        <input
                          id="signup-height"
                          type="number"
                          min={100}
                          max={250}
                          value={signupHeight}
                          onChange={(e) => setSignupHeight(e.target.value)}
                          placeholder="178"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)]"
                        />
                      </div>
                      <div className="col-span-2">
                        <label htmlFor="signup-weight" className="block text-[10px] font-mono uppercase text-[var(--text-secondary)] mb-1">
                          Weight (kg)
                        </label>
                        <input
                          id="signup-weight"
                          type="number"
                          step="0.1"
                          min={30}
                          max={300}
                          value={signupWeight}
                          onChange={(e) => setSignupWeight(e.target.value)}
                          placeholder="78.5"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || lockoutSeconds > 0}
                className="w-full py-3.5 bg-[#B7FF4A] hover:bg-[#a8f23d] text-[#090B0F] font-display font-black uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 transition btn-tactile shadow-md shadow-[#B7FF4A]/20 disabled:opacity-50 cursor-pointer mt-2"
              >
                {lockoutSeconds > 0 ? (
                  <span>Locked ({lockoutSeconds}s)</span>
                ) : isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                  </>
                ) : mode === 'login' ? (
                  <>
                    Sign In to Tracker <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Create Free Account &amp; Sync Tools <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Demo Fast Login */}
          {(mode === 'login' || mode === 'signup') && (
            <div className="pt-3 border-t border-[var(--border-subtle)] text-center">
              <p className="text-[11px] text-[var(--text-muted)] font-mono mb-2">Want to test the app instantly?</p>
              <button
                type="button"
                onClick={handleDemoFill}
                disabled={isSubmitting || isGoogleLoading}
                className="w-full py-2.5 px-3 bg-[var(--bg-elevated)] hover:bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-mono font-bold rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition flex items-center justify-center gap-1.5 cursor-pointer btn-tactile"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#B7FF4A]" />
                <span>Instant Demo Account Fill (Pre-Synced Biometrics)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Dumbbell,
  BookOpen,
  Scale,
  Timer,
  History,
  Volume2,
  VolumeX,
  User,
  LogIn,
  Menu,
  X,
  Sparkles,
  Zap,
  ArrowRight,
  Flame,
  LayoutGrid
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { playClickSound, playTabSound } from '../utils/audio';

interface NavbarProps {
  activeView?: 'app' | 'landing';
  onSwitchView?: (view: 'app' | 'landing') => void;
  onOpenPlateCalc?: () => void;
  onOpenHistory?: () => void;
  onOpenProfile?: () => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  totalVolume?: number;
  completedSetsCount?: number;
  totalSetsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView = 'app',
  onSwitchView,
  onOpenPlateCalc,
  onOpenHistory,
  onOpenProfile,
  onOpenAuth,
  soundEnabled = true,
  onToggleSound,
  totalVolume = 0,
  completedSetsCount = 0,
  totalSetsCount = 0,
}) => {
  const pathname = usePathname();
  const { user, isAuthenticated, isGuest } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isBlogPage = pathname?.startsWith('/blog');

  const handleNavClick = (callback?: () => void) => {
    playClickSound(soundEnabled);
    if (callback) callback();
    setMobileMenuOpen(false);
  };

  const handleViewChange = (view: 'app' | 'landing') => {
    playTabSound(soundEnabled);
    if (onSwitchView) onSwitchView(view);
    setMobileMenuOpen(false);
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#090a0f]/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-3">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            onClick={() => handleNavClick()}
            className="flex items-center gap-2.5 group select-none cursor-pointer"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black font-display text-base tracking-wider shadow-md shadow-amber-500/20 group-hover:scale-105 active:scale-95 transition-transform duration-150">
              PPL
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-display font-black text-lg sm:text-xl tracking-tight uppercase text-zinc-900 dark:text-white">
                  HYPERTROPHY<span className="text-amber-500">.</span>
                </span>
                <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                  OS
                </span>
              </div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-600 dark:text-zinc-400 block mt-0.5">
                Progressive Overload
              </span>
            </div>
          </Link>

          {/* Desktop Primary View Tabs */}
          {!isBlogPage && onSwitchView && (
            <div className="hidden md:flex items-center p-1 bg-zinc-100 dark:bg-zinc-900/90 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80">
              <button
                type="button"
                onClick={() => handleViewChange('app')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                  activeView === 'app'
                    ? 'bg-white dark:bg-zinc-800 text-amber-500 shadow-xs border border-zinc-200/60 dark:border-zinc-700/60'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                Tracker App
              </button>

              <button
                type="button"
                onClick={() => handleViewChange('landing')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                  activeView === 'landing'
                    ? 'bg-white dark:bg-zinc-800 text-amber-500 shadow-xs border border-zinc-200/60 dark:border-zinc-700/60'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Platform Guide
              </button>
            </div>
          )}

          {/* Link to Biomechanics Blog */}
          <Link
            href="/blog"
            onClick={() => handleNavClick()}
            className={`hidden lg:flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              isBlogPage
                ? 'text-amber-500 bg-amber-500/10 border border-amber-500/20'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-amber-500'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Journal</span>
          </Link>
        </div>

        {/* Center: Live Quick Stats Ticker (Desktop only on app view) */}
        {!isBlogPage && activeView === 'app' && totalSetsCount > 0 && (
          <div className="hidden xl:flex items-center gap-3 px-3 py-1 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800/70 rounded-full text-xs font-mono">
            <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Progress: <strong className="text-zinc-900 dark:text-white">{completedSetsCount}/{totalSetsCount} sets</strong>
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span className="text-zinc-600 dark:text-zinc-400">
              Volume: <strong className="text-amber-500">{totalVolume.toLocaleString()} {user?.preferredUnit?.toUpperCase() || 'KG'}</strong>
            </span>
          </div>
        )}

        {/* Right: Interactive Action Tools & Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Plate Calculator Button */}
          {onOpenPlateCalc && (
            <button
              type="button"
              onClick={() => handleNavClick(onOpenPlateCalc)}
              className="p-2 sm:px-3 sm:py-1.5 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all btn-tactile cursor-pointer"
              title="Olympic Barbell Plate Math"
              aria-label="Open Plate Calculator"
            >
              <Scale className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Plate Math</span>
            </button>
          )}

          {/* History / Logs Button */}
          {onOpenHistory && (
            <button
              type="button"
              onClick={() => handleNavClick(onOpenHistory)}
              className="p-2 sm:px-3 sm:py-1.5 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all btn-tactile cursor-pointer"
              title="Workout History & PRs"
              aria-label="View Workout Logs"
            >
              <History className="w-4 h-4 text-zinc-500" />
              <span className="hidden sm:inline">Logs</span>
            </button>
          )}

          {/* Sound FX Toggle (Click to Mute/Unmute Audio) */}
          {onToggleSound && (
            <button
              type="button"
              onClick={() => {
                playClickSound(!soundEnabled);
                onToggleSound();
              }}
              className={`p-2 rounded-xl border btn-tactile transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20'
                  : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-600'
              }`}
              title={soundEnabled ? 'Click Sound Effects Enabled (Click to Mute)' : 'Sound Effects Muted (Click to Unmute)'}
              aria-label={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Theme Toggle */}
          <ThemeToggle soundEnabled={soundEnabled} />

          {/* User Auth / Profile */}
          {isAuthenticated && user && !user.isGuest ? (
            <button
              type="button"
              onClick={() => handleNavClick(onOpenProfile)}
              className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all btn-tactile cursor-pointer"
              title="Account Profile"
              aria-label="User profile settings"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-black font-bold text-xs flex items-center justify-center font-display">
                {getInitials(user.name)}
              </div>
              <span className="text-xs font-mono font-semibold hidden md:inline text-zinc-800 dark:text-zinc-200 truncate max-w-[80px]">
                {user.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              {onOpenProfile && (
                <button
                  type="button"
                  onClick={() => handleNavClick(onOpenProfile)}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-mono font-semibold transition-all btn-tactile cursor-pointer"
                  title="Guest Athlete Settings"
                >
                  <User className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Guest</span>
                </button>
              )}

              {onOpenAuth && (
                <button
                  type="button"
                  onClick={() => handleNavClick(() => onOpenAuth('signup'))}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black font-display font-black uppercase tracking-wider text-xs rounded-xl shadow-xs transition-all btn-tactile flex items-center gap-1 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sync Cloud</span>
                </button>
              )}
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => {
              playClickSound(soundEnabled);
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 btn-tactile cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#090a0f]/95 backdrop-blur-xl px-4 py-4 space-y-3 shadow-xl">
          {!isBlogPage && onSwitchView && (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleViewChange('app')}
                className={`py-2 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeView === 'app'
                    ? 'bg-amber-500 text-black'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                Workout Tracker
              </button>
              <button
                type="button"
                onClick={() => handleViewChange('landing')}
                className={`py-2 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeView === 'landing'
                    ? 'bg-amber-500 text-black'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Platform Guide
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href="/blog"
              onClick={() => handleNavClick()}
              className="py-2.5 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-semibold text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span>Biomechanics Blog</span>
            </Link>

            {onOpenPlateCalc && (
              <button
                type="button"
                onClick={() => handleNavClick(onOpenPlateCalc)}
                className="py-2.5 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-semibold text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Scale className="w-4 h-4 text-amber-500" />
                <span>Plate Math</span>
              </button>
            )}

            {onOpenHistory && (
              <button
                type="button"
                onClick={() => handleNavClick(onOpenHistory)}
                className="py-2.5 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-semibold text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <History className="w-4 h-4 text-zinc-400" />
                <span>Logs & PRs</span>
              </button>
            )}

            {onOpenProfile && (
              <button
                type="button"
                onClick={() => handleNavClick(onOpenProfile)}
                className="py-2.5 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-semibold text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <User className="w-4 h-4 text-zinc-400" />
                <span>Athlete Profile</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

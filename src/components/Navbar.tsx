'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Dumbbell,
  Scale,
  LayoutGrid,
  ChevronDown,
  BookOpen,
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
  Activity,
  Timer
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { playClickSound, playTabSound } from '../utils/audio';
import { FITNESS_TOOLS, FitnessTool } from '../config/tools';
import { AuthModal } from './AuthModal';
import { ProfileModal } from './ProfileModal';
import { AuthModalMode } from '../types/auth';

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
  const { user, isAuthenticated } = useAuth();

  // Dropdown & Menu state
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileToolsExpanded, setMobileToolsExpanded] = useState(true);

  // Standalone Auth & Profile Modals when Navbar is used outside PplTrackerApp
  const [standaloneAuthOpen, setStandaloneAuthOpen] = useState(false);
  const [standaloneAuthMode, setStandaloneAuthMode] = useState<AuthModalMode>('signup');
  const [standaloneProfileOpen, setStandaloneProfileOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isHome = pathname === '/';
  const isToolsActive = pathname?.startsWith('/tools');
  const isBlogActive = pathname?.startsWith('/blog');

  // Handle outside clicks to close desktop dropdown
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setToolsDropdownOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setToolsDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setToolsDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleNavClick = (callback?: () => void) => {
    playClickSound(soundEnabled);
    if (callback) callback();
    setToolsDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleTriggerAuth = (mode: 'login' | 'signup') => {
    playClickSound(soundEnabled);
    if (onOpenAuth) {
      onOpenAuth(mode);
    } else {
      setStandaloneAuthMode(mode);
      setStandaloneAuthOpen(true);
    }
    setMobileMenuOpen(false);
  };

  const handleTriggerProfile = () => {
    playClickSound(soundEnabled);
    if (onOpenProfile) {
      onOpenProfile();
    } else {
      setStandaloneProfileOpen(true);
    }
    setMobileMenuOpen(false);
  };

  // Hover handlers with debounce
  const handleMouseEnterTools = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setToolsDropdownOpen(true);
  };

  const handleMouseLeaveTools = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setToolsDropdownOpen(false);
    }, 150);
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const renderToolIcon = (iconName: FitnessTool['iconName']) => {
    switch (iconName) {
      case 'Dumbbell':
        return <Dumbbell className="w-5 h-5 text-amber-500" />;
      case 'Scale':
        return <Scale className="w-5 h-5 text-emerald-500" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-sky-500" />;
      case 'Timer':
        return <Timer className="w-5 h-5 text-purple-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#090a0f]/95 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-3">
          {/* ========================================================= */}
          {/* 1. LEFT SIDE: BRAND LOGO                                  */}
          {/* ========================================================= */}
          <div className="flex items-center gap-3 sm:gap-6">
            <Link
              href="/"
              onClick={() => handleNavClick()}
              className="flex items-center gap-2.5 group select-none cursor-pointer"
              aria-label="PPL Tracker Home"
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
                  Fitness & Overload Tools
                </span>
              </div>
            </Link>
          </div>

          {/* ========================================================= */}
          {/* 2. MIDDLE: MAIN NAVIGATION (Home, Tools, Blog)            */}
          {/* ========================================================= */}
          <nav
            aria-label="Primary Platform Navigation"
            className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-mono uppercase tracking-wider font-semibold"
          >
            {/* Home */}
            <Link
              href="/"
              onClick={() => handleNavClick()}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                isHome
                  ? 'text-amber-500 bg-amber-500/10 font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-850'
              }`}
            >
              Home
            </Link>

            {/* Tools Dropdown Trigger */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnterTools}
              onMouseLeave={handleMouseLeaveTools}
            >
              <button
                type="button"
                onClick={() => {
                  playClickSound(soundEnabled);
                  setToolsDropdownOpen((prev) => !prev);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setToolsDropdownOpen((prev) => !prev);
                  }
                }}
                aria-expanded={toolsDropdownOpen}
                aria-haspopup="true"
                aria-controls="tools-dropdown-menu"
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  isToolsActive
                    ? 'text-amber-500 bg-amber-500/10 font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-850'
                }`}
              >
                <span>Tools</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    toolsDropdownOpen ? 'rotate-180 text-amber-500' : 'text-zinc-400'
                  }`}
                />
              </button>

              {/* DESKTOP TOOLS DROPDOWN / MEGA-MENU */}
              {toolsDropdownOpen && (
                <div
                  id="tools-dropdown-menu"
                  role="menu"
                  aria-orientation="vertical"
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-96 rounded-2xl bg-white dark:bg-[#0e1017] border border-zinc-200 dark:border-zinc-800 shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-850 flex items-center justify-between">
                    <span>Available Fitness Tools</span>
                    <span className="text-amber-500 font-bold">{FITNESS_TOOLS.length} Ready</span>
                  </div>

                  <div className="py-1.5 space-y-1">
                    {FITNESS_TOOLS.map((tool) => {
                      const isActive = pathname === tool.href;
                      return (
                        <Link
                          key={tool.id}
                          href={tool.href}
                          role="menuitem"
                          onClick={() => handleNavClick()}
                          className={`flex items-start gap-3 p-3 rounded-xl transition-all group ${
                            isActive
                              ? 'bg-amber-500/10 border border-amber-500/30'
                              : 'hover:bg-zinc-100 dark:hover:bg-zinc-850/80 border border-transparent'
                          }`}
                        >
                          <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 group-hover:scale-105 transition-transform shrink-0">
                            {renderToolIcon(tool.iconName)}
                          </div>
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-bold text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors uppercase font-display tracking-tight">
                                {tool.name}
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                                {tool.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-1 font-sans normal-case">
                              {tool.shortDescription}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Dropdown Footer: View All Tools */}
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-850">
                    <Link
                      href="/tools"
                      role="menuitem"
                      onClick={() => handleNavClick()}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 hover:bg-amber-500 hover:text-black dark:hover:bg-amber-500 dark:hover:text-black text-zinc-700 dark:text-zinc-300 font-mono text-xs font-bold transition-all group cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <LayoutGrid className="w-4 h-4 text-amber-500 group-hover:text-black transition-colors" />
                        <span>View All Tools</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Blog */}
            <Link
              href="/blog"
              onClick={() => handleNavClick()}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                isBlogActive
                  ? 'text-amber-500 bg-amber-500/10 font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-850'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Blog</span>
            </Link>
          </nav>

          {/* ========================================================= */}
          {/* 3. RIGHT SIDE: ACCOUNT ACTIONS & CONTROLS                 */}
          {/* ========================================================= */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Live Progress Ticker (When on Tracker with active sets) */}
            {totalSetsCount > 0 && (
              <div className="hidden xl:flex items-center gap-2.5 px-3 py-1 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800/70 rounded-full text-xs font-mono">
                <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Sets: <strong className="text-zinc-900 dark:text-white">{completedSetsCount}/{totalSetsCount}</strong>
                </span>
                <span className="text-zinc-300 dark:text-zinc-700">|</span>
                <span className="text-zinc-600 dark:text-zinc-400">
                  <strong className="text-amber-500">{totalVolume.toLocaleString()} {user?.preferredUnit?.toUpperCase() || 'KG'}</strong>
                </span>
              </div>
            )}

            {/* Barbell Plate Math shortcut if provided */}
            {onOpenPlateCalc && (
              <button
                type="button"
                onClick={() => handleNavClick(onOpenPlateCalc)}
                className="hidden sm:flex p-2 sm:px-3 sm:py-1.5 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-mono font-bold items-center gap-1.5 transition-all btn-tactile cursor-pointer"
                title="Barbell Plate Math"
                aria-label="Open Barbell Plate Calculator"
              >
                <Scale className="w-4 h-4 text-amber-500" />
                <span>Plate Math</span>
              </button>
            )}

            {/* Logs & PRs shortcut if provided */}
            {onOpenHistory && (
              <button
                type="button"
                onClick={() => handleNavClick(onOpenHistory)}
                className="hidden sm:flex p-2 sm:px-3 sm:py-1.5 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-mono font-bold items-center gap-1.5 transition-all btn-tactile cursor-pointer"
                title="Workout Logs & PRs"
                aria-label="Open Workout Logs"
              >
                <History className="w-4 h-4 text-zinc-400" />
                <span>Logs</span>
              </button>
            )}

            {/* Audio Cue Toggle */}
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
                title={soundEnabled ? 'Click Audio Effects Enabled (Mute)' : 'Audio Effects Muted (Unmute)'}
                aria-label={soundEnabled ? 'Mute audio cues' : 'Unmute audio cues'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            )}

            {/* Theme Toggle */}
            <ThemeToggle soundEnabled={soundEnabled} />

            {/* Direct Link to Tools Directory (Desktop right action) */}
            <Link
              href="/tools"
              onClick={() => handleNavClick()}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-750 rounded-xl text-xs font-mono font-bold uppercase transition-all btn-tactile"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-amber-500" />
              <span>All Tools</span>
            </Link>

            {/* Authentication / Profile Actions */}
            {isAuthenticated && user && !user.isGuest ? (
              <button
                type="button"
                onClick={handleTriggerProfile}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all btn-tactile cursor-pointer"
                title="Athlete Account Profile"
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
                <button
                  type="button"
                  onClick={() => handleTriggerAuth('signup')}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black font-display font-black uppercase tracking-wider text-xs rounded-xl shadow-xs transition-all btn-tactile flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In / Sign Up</span>
                </button>
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
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE NAVIGATION DRAWER                                   */}
        {/* ========================================================= */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/98 dark:bg-[#090a0f]/98 backdrop-blur-xl px-4 py-4 space-y-3 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Primary Mobile Links */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/"
                onClick={() => handleNavClick()}
                className={`py-2.5 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 ${
                  isHome
                    ? 'bg-amber-500 text-black'
                    : 'bg-zinc-100 dark:bg-zinc-850 text-zinc-800 dark:text-zinc-200'
                }`}
              >
                Home
              </Link>

              <Link
                href="/blog"
                onClick={() => handleNavClick()}
                className={`py-2.5 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 ${
                  isBlogActive
                    ? 'bg-amber-500 text-black'
                    : 'bg-zinc-100 dark:bg-zinc-850 text-zinc-800 dark:text-zinc-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                Blog
              </Link>
            </div>

            {/* Expandable Tools Accordion */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-2.5 space-y-2">
              <button
                type="button"
                onClick={() => setMobileToolsExpanded(!mobileToolsExpanded)}
                className="w-full flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 py-1 px-1.5 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-amber-500" />
                  <span>Fitness Tools ({FITNESS_TOOLS.length})</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform ${
                    mobileToolsExpanded ? 'rotate-180 text-amber-500' : ''
                  }`}
                />
              </button>

              {mobileToolsExpanded && (
                <div className="space-y-1.5 pt-1 border-t border-zinc-200/60 dark:border-zinc-800/60">
                  {FITNESS_TOOLS.map((tool) => (
                    <Link
                      key={tool.id}
                      href={tool.href}
                      onClick={() => handleNavClick()}
                      className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-mono transition-colors ${
                        pathname === tool.href
                          ? 'bg-amber-500/15 text-amber-500 font-bold'
                          : 'bg-white dark:bg-zinc-850 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {renderToolIcon(tool.iconName)}
                        <span>{tool.name}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500">{tool.badge}</span>
                    </Link>
                  ))}

                  <Link
                    href="/tools"
                    onClick={() => handleNavClick()}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 text-amber-500 text-xs font-mono font-bold"
                  >
                    <span>View All Tools</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Account / Auth in Mobile */}
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
              {isAuthenticated && user && !user.isGuest ? (
                <button
                  type="button"
                  onClick={handleTriggerProfile}
                  className="w-full py-2.5 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-850 text-xs font-mono font-bold flex items-center justify-between text-zinc-800 dark:text-zinc-200 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-500" />
                    <span>Athlete Profile ({user.name.split(' ')[0]})</span>
                  </span>
                  <span className="text-amber-500 text-[10px] uppercase font-bold">Manage</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleTriggerAuth('signup')}
                  className="w-full py-3 px-4 rounded-xl bg-amber-500 text-black font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In / Sign Up (Cloud Sync)</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Standalone Modals (Rendered when Navbar handles auth/profile independently) */}
      <AuthModal
        isOpen={standaloneAuthOpen}
        onClose={() => setStandaloneAuthOpen(false)}
        initialMode={standaloneAuthMode}
      />

      <ProfileModal
        isOpen={standaloneProfileOpen}
        onClose={() => setStandaloneProfileOpen(false)}
      />
    </>
  );
};

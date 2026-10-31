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
  ArrowRight,
  Flame,
  Activity,
  Timer,
  Boxes,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import dynamic from 'next/dynamic';
import { playClickSound } from '../utils/audio';
import { FITNESS_TOOLS, FitnessTool } from '../config/tools';
import { AuthModalMode } from '../types/auth';

const AuthModal = dynamic(
  () => import('./AuthModal').then((m) => m.AuthModal),
  { ssr: false }
);
const ProfileModal = dynamic(
  () => import('./ProfileModal').then((m) => m.ProfileModal),
  { ssr: false }
);

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
        return <Dumbbell className="w-5 h-5 text-[#B7FF4A]" />;
      case 'Scale':
        return <Scale className="w-5 h-5 text-[#36D6B0]" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-orange-400" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-sky-400" />;
      case 'Timer':
        return <Timer className="w-5 h-5 text-purple-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#B7FF4A]" />;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-[var(--border-subtle)] transition-colors duration-200">
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
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-[#B7FF4A] text-[#090B0F] flex items-center justify-center font-black font-display text-sm sm:text-base tracking-wider shadow-md shadow-[#B7FF4A]/20 group-hover:scale-105 active:scale-95 transition-transform duration-150">
                PPL
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-display font-black text-lg sm:text-xl tracking-tight uppercase text-[var(--text-primary)]">
                    TRACKER<span className="text-[#B7FF4A]">.</span>
                  </span>
                  <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-full bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-[var(--text-muted)] block mt-0.5">
                  Hypertrophy Engine
                </span>
              </div>
            </Link>
          </div>

          {/* ========================================================= */}
          {/* 2. MIDDLE: DESKTOP NAVIGATION                             */}
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
                  ? 'text-[#B7FF4A] bg-[#B7FF4A]/10 font-bold border border-[#B7FF4A]/25'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              Home
            </Link>

            {/* Tools Mega-Menu Trigger */}
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
                    ? 'text-[#B7FF4A] bg-[#B7FF4A]/10 font-bold border border-[#B7FF4A]/25'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                }`}
              >
                <span>Tools</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    toolsDropdownOpen ? 'rotate-180 text-[#B7FF4A]' : 'text-[var(--text-muted)]'
                  }`}
                />
              </button>

              {/* DESKTOP TOOLS DROPDOWN */}
              {toolsDropdownOpen && (
                <div
                  id="tools-dropdown-menu"
                  role="menu"
                  aria-orientation="vertical"
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-96 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-strong)] shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border-subtle)] flex items-center justify-between">
                    <span>Performance Tools</span>
                    <span className="text-[#B7FF4A] font-bold">{FITNESS_TOOLS.length} Available</span>
                  </div>

                  <div className="py-2 space-y-1">
                    {FITNESS_TOOLS.map((tool) => {
                      const isActive = pathname === tool.href;
                      return (
                        <Link
                          key={tool.id}
                          href={tool.href}
                          role="menuitem"
                          onClick={() => handleNavClick()}
                          className={`flex items-start gap-3 p-3 rounded-2xl transition-all group ${
                            isActive
                              ? 'bg-[#B7FF4A]/10 border border-[#B7FF4A]/30 text-[#B7FF4A]'
                              : 'hover:bg-[var(--bg-elevated)] border border-transparent'
                          }`}
                        >
                          <div className="p-2 rounded-xl bg-[var(--bg-elevated)] group-hover:scale-105 transition-transform shrink-0">
                            {renderToolIcon(tool.iconName)}
                          </div>
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[#B7FF4A] transition-colors uppercase font-display tracking-tight">
                                {tool.name}
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                                {tool.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 font-sans normal-case">
                              {tool.shortDescription}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Dropdown Footer */}
                  <div className="pt-2 border-t border-[var(--border-subtle)]">
                    <Link
                      href="/tools"
                      role="menuitem"
                      onClick={() => handleNavClick()}
                      className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-[var(--bg-elevated)] hover:bg-[#B7FF4A] hover:text-[#090B0F] text-[var(--text-primary)] font-mono text-xs font-bold transition-all group cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Boxes className="w-4 h-4 text-[#B7FF4A] group-hover:text-[#090B0F] transition-colors" />
                        <span>View All Tools</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Blog / Journal */}
            <Link
              href="/blog"
              onClick={() => handleNavClick()}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                isBlogActive
                  ? 'text-[#B7FF4A] bg-[#B7FF4A]/10 font-bold border border-[#B7FF4A]/25'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Journal</span>
            </Link>

            {/* About */}
            <Link
              href="/about"
              onClick={() => handleNavClick()}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                pathname === '/about'
                  ? 'text-[#B7FF4A] bg-[#B7FF4A]/10 font-bold border border-[#B7FF4A]/25'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              About
            </Link>
          </nav>

          {/* ========================================================= */}
          {/* 3. RIGHT SIDE: WORKOUT CONTROLS & AUTH                    */}
          {/* ========================================================= */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Live Progress Ticker (When on Tracker with active sets) */}
            {totalSetsCount > 0 && (
              <div className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-full text-xs font-mono tnum">
                <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <span className="w-2 h-2 rounded-full bg-[#B7FF4A] animate-pulse" />
                  Sets: <strong className="text-[var(--text-primary)]">{completedSetsCount}/{totalSetsCount}</strong>
                </span>
                <span className="text-[var(--border-strong)]">|</span>
                <span className="text-[var(--text-secondary)]">
                  <strong className="text-[#B7FF4A]">{totalVolume.toLocaleString()} {user?.preferredUnit?.toUpperCase() || 'KG'}</strong>
                </span>
              </div>
            )}

            {/* Barbell Plate Math shortcut */}
            {onOpenPlateCalc && (
              <button
                type="button"
                onClick={() => handleNavClick(onOpenPlateCalc)}
                className="hidden sm:flex p-2 sm:px-3 sm:py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] rounded-2xl text-xs font-mono font-bold items-center gap-1.5 transition-all btn-tactile cursor-pointer"
                title="Barbell Plate Math"
                aria-label="Open Barbell Plate Calculator"
              >
                <Scale className="w-4 h-4 text-[#36D6B0]" />
                <span>Plates</span>
              </button>
            )}

            {/* Logs shortcut */}
            {onOpenHistory && (
              <button
                type="button"
                onClick={() => handleNavClick(onOpenHistory)}
                className="hidden sm:flex p-2 sm:px-3 sm:py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] rounded-2xl text-xs font-mono font-bold items-center gap-1.5 transition-all btn-tactile cursor-pointer"
                title="Workout Logs & PRs"
                aria-label="Open Workout Logs"
              >
                <History className="w-4 h-4 text-[var(--text-secondary)]" />
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
                className={`p-2 rounded-2xl border btn-tactile transition-all cursor-pointer ${
                  soundEnabled
                    ? 'bg-[#B7FF4A]/10 border-[#B7FF4A]/30 text-[#B7FF4A] hover:bg-[#B7FF4A]/20'
                    : 'bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                title={soundEnabled ? 'Audio Effects Enabled (Mute)' : 'Audio Effects Muted (Unmute)'}
                aria-label={soundEnabled ? 'Mute audio cues' : 'Unmute audio cues'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            )}

            {/* Theme Toggle */}
            <ThemeToggle soundEnabled={soundEnabled} />

            {/* Authentication / Profile Actions */}
            {isAuthenticated && user && !user.isGuest ? (
              <button
                type="button"
                onClick={handleTriggerProfile}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 bg-[var(--bg-elevated)] hover:bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] rounded-2xl transition-all btn-tactile cursor-pointer"
                title="Athlete Account Profile"
                aria-label="User profile settings"
              >
                <div className="w-7 h-7 rounded-xl bg-[#B7FF4A] text-[#090B0F] font-bold text-xs flex items-center justify-center font-display">
                  {getInitials(user.name)}
                </div>
                <span className="text-xs font-mono font-semibold hidden md:inline text-[var(--text-primary)] truncate max-w-[80px]">
                  {user.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleTriggerAuth('signup')}
                className="hidden sm:inline-flex px-3.5 py-1.5 bg-[#B7FF4A] hover:bg-[#a8f23d] text-[#090B0F] font-display font-black uppercase tracking-wider text-xs rounded-2xl shadow-sm transition-all btn-tactile items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Drawer Trigger (For secondary links) */}
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="md:hidden p-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-primary)] btn-tactile cursor-pointer"
              aria-label="Toggle navigation drawer"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE NAVIGATION DRAWER (Secondary Links)                */}
        {/* ========================================================= */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-4 space-y-3 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/about"
                onClick={() => handleNavClick()}
                className="py-2.5 px-3 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider text-center bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)]"
              >
                About Platform
              </Link>

              <Link
                href="/contact"
                onClick={() => handleNavClick()}
                className="py-2.5 px-3 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider text-center bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)]"
              >
                Feedback
              </Link>
            </div>

            {/* Tools list in mobile drawer */}
            <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3 space-y-2">
              <button
                type="button"
                onClick={() => setMobileToolsExpanded(!mobileToolsExpanded)}
                className="w-full flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] py-1 px-1 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-[#B7FF4A]" />
                  <span>Tools Suite ({FITNESS_TOOLS.length})</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${
                    mobileToolsExpanded ? 'rotate-180 text-[#B7FF4A]' : ''
                  }`}
                />
              </button>

              {mobileToolsExpanded && (
                <div className="space-y-1.5 pt-2 border-t border-[var(--border-subtle)]">
                  {FITNESS_TOOLS.map((tool) => (
                    <Link
                      key={tool.id}
                      href={tool.href}
                      onClick={() => handleNavClick()}
                      className={`flex items-center justify-between p-2.5 rounded-2xl text-xs font-mono transition-colors ${
                        pathname === tool.href
                          ? 'bg-[#B7FF4A]/15 text-[#B7FF4A] font-bold border border-[#B7FF4A]/30'
                          : 'bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {renderToolIcon(tool.iconName)}
                        <span>{tool.name}</span>
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)]">{tool.badge}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Auth CTA */}
            {!isAuthenticated && (
              <div className="pt-2 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => handleTriggerAuth('signup')}
                  className="w-full py-3 px-4 rounded-2xl bg-[#B7FF4A] text-[#090B0F] font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In / Create Account (Cloud Sync)</span>
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Standalone Modals */}
      {standaloneAuthOpen && (
        <AuthModal
          isOpen={standaloneAuthOpen}
          onClose={() => setStandaloneAuthOpen(false)}
          initialMode={standaloneAuthMode}
        />
      )}

      {standaloneProfileOpen && (
        <ProfileModal
          isOpen={standaloneProfileOpen}
          onClose={() => setStandaloneProfileOpen(false)}
        />
      )}
    </>
  );
};

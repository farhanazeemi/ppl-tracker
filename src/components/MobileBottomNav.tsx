'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Dumbbell,
  Boxes,
  BookOpen,
  User,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import dynamic from 'next/dynamic';

const AuthModal = dynamic(
  () => import('./AuthModal').then((m) => m.AuthModal),
  { ssr: false }
);
const ProfileModal = dynamic(
  () => import('./ProfileModal').then((m) => m.ProfileModal),
  { ssr: false }
);

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Exclude internal Sanity Studio routes from showing bottom nav
  if (pathname?.startsWith('/studio')) {
    return null;
  }

  const isHomeActive = pathname === '/';
  const isTrackerActive = pathname?.startsWith('/tools/ppl-tracker');
  const isToolsActive =
    (pathname?.startsWith('/tools') && !isTrackerActive) || pathname === '/tools';
  const isBlogActive = pathname?.startsWith('/blog');

  const handleProfileClick = () => {
    if (isAuthenticated) {
      setProfileModalOpen(true);
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <>
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass-panel border-t border-[var(--border-subtle)] pb-safe transition-colors duration-200"
      >
        <div className="grid grid-cols-5 h-16 items-center px-2 max-w-lg mx-auto">
          {/* 1. Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center h-full min-w-[48px] py-1 select-none transition-colors ${
              isHomeActive
                ? 'text-[#B7FF4A] dark:text-[#B7FF4A]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <div className="relative">
              <LayoutGrid className="w-5 h-5 transition-transform active:scale-90" />
              {isHomeActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#B7FF4A]" />
              )}
            </div>
            <span className="text-[10px] font-sans font-medium mt-1">Home</span>
          </Link>

          {/* 2. Tracker (Primary Engine) */}
          <Link
            href="/tools/ppl-tracker"
            className={`flex flex-col items-center justify-center h-full min-w-[48px] py-1 select-none transition-colors ${
              isTrackerActive
                ? 'text-[#B7FF4A] dark:text-[#B7FF4A]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <div className="relative">
              <Dumbbell className="w-5 h-5 transition-transform active:scale-90" />
              {isTrackerActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#B7FF4A]" />
              )}
            </div>
            <span className="text-[10px] font-sans font-medium mt-1">Tracker</span>
          </Link>

          {/* 3. Tools Hub */}
          <Link
            href="/tools"
            className={`flex flex-col items-center justify-center h-full min-w-[48px] py-1 select-none transition-colors ${
              isToolsActive
                ? 'text-[#B7FF4A] dark:text-[#B7FF4A]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <div className="relative">
              <Boxes className="w-5 h-5 transition-transform active:scale-90" />
              {isToolsActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#B7FF4A]" />
              )}
            </div>
            <span className="text-[10px] font-sans font-medium mt-1">Tools</span>
          </Link>

          {/* 4. Journal / Science Blog */}
          <Link
            href="/blog"
            className={`flex flex-col items-center justify-center h-full min-w-[48px] py-1 select-none transition-colors ${
              isBlogActive
                ? 'text-[#B7FF4A] dark:text-[#B7FF4A]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <div className="relative">
              <BookOpen className="w-5 h-5 transition-transform active:scale-90" />
              {isBlogActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#B7FF4A]" />
              )}
            </div>
            <span className="text-[10px] font-sans font-medium mt-1">Journal</span>
          </Link>

          {/* 5. Profile / Sign In */}
          <button
            onClick={handleProfileClick}
            aria-label={isAuthenticated ? 'Open athlete profile' : 'Sign in to account'}
            className="flex flex-col items-center justify-center h-full min-w-[48px] py-1 select-none text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors active:scale-90"
          >
            {isAuthenticated ? (
              <div className="w-6 h-6 rounded-full bg-[#B7FF4A]/15 border border-[#B7FF4A]/40 text-[#B7FF4A] flex items-center justify-center text-[11px] font-bold font-mono">
                {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
              </div>
            ) : (
              <LogIn className="w-5 h-5" />
            )}
            <span className="text-[10px] font-sans font-medium mt-1">
              {isAuthenticated ? 'Profile' : 'Sign In'}
            </span>
          </button>
        </div>
      </nav>

      {/* Lazy Modals Triggered Directly from Bottom Nav */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode="login"
      />
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </>
  );
};

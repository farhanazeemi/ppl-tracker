'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { playClickSound } from '../utils/audio';

interface ThemeToggleProps {
  className?: string;
  soundEnabled?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  soundEnabled = true,
}) => {
  const { theme, toggleTheme, isDark } = useTheme();

  const handleToggle = () => {
    playClickSound(soundEnabled);
    toggleTheme();
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`relative inline-flex items-center justify-center min-w-[42px] min-h-[42px] p-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-all duration-200 cursor-pointer active:scale-95 ${className}`}
      title={`Toggle theme (currently ${theme})`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-[#B7FF4A] transition-transform duration-300" />
        ) : (
          <Moon className="w-4 h-4 text-[var(--accent-secondary)] transition-transform duration-300" />
        )}
      </div>
    </button>
  );
};

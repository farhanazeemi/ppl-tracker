'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { playClickSound } from '../utils/audio';

interface ThemeToggleProps {
  className?: string;
  soundEnabled?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', soundEnabled = true }) => {
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
      className={`relative inline-flex items-center justify-center min-w-[40px] min-h-[40px] p-2 rounded-xl border btn-tactile transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 active:scale-95 ${
        isDark
          ? 'bg-zinc-900 border-zinc-800 text-amber-400 hover:bg-zinc-800 hover:text-amber-300 shadow-xs'
          : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 shadow-xs'
      } ${className}`}
      title={`Toggle theme (currently ${theme})`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-5 h-5 transition-transform duration-300 rotate-0 scale-100" />
        ) : (
          <Moon className="w-5 h-5 transition-transform duration-300 rotate-0 scale-100 text-indigo-600" />
        )}
      </div>
    </button>
  );
};

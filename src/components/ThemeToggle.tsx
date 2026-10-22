'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`relative inline-flex items-center justify-center min-w-[44px] min-h-[44px] p-2.5 rounded-xl border transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
        isDark
          ? 'bg-zinc-900/80 border-zinc-750 text-amber-400 hover:bg-zinc-800 hover:text-amber-300 shadow-sm'
          : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 shadow-sm'
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

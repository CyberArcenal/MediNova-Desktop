// src/renderer/pages/settings/general/components/ThemeToggleCard.tsx
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';

const ThemeToggleCard: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="bg-[var(--card-bg)] rounded-xl p-6 shadow-sm border border-[var(--border-color)]">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Appearance</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--card-secondary-bg)]">
            {theme === 'light' ? <Sun className="w-5 h-5 text-[var(--text-primary)]" /> : <Moon className="w-5 h-5 text-[var(--text-primary)]" />}
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Theme</p>
            <p className="text-xs text-[var(--text-tertiary)]">
              {theme === 'light' ? 'Light mode' : 'Dark mode'} – Switch between light and dark interface
            </p>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2"
          style={{ backgroundColor: theme === 'dark' ? 'var(--primary-color)' : 'var(--card-secondary-bg)' }}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default ThemeToggleCard;
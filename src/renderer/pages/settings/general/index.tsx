// src/renderer/pages/settings/general/index.tsx
import React from 'react';
import ThemeToggleCard from './components/ThemeToggleCard';
import ChangePasswordForm from './components/ChangePasswordForm';

const GeneralSettingsPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">General Settings</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Manage your account preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChangePasswordForm />
        <ThemeToggleCard />
      </div>

      {/* Clinic Info placeholder (can be added later when API supports) */}
      <div className="bg-[var(--card-bg)] rounded-xl p-6 shadow-sm border border-[var(--border-color)]">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Clinic Information</h3>
        <p className="text-sm text-[var(--text-tertiary)]">Clinic name, logo, and other settings will be available in a future update.</p>
      </div>
    </div>
  );
};

export default GeneralSettingsPage;
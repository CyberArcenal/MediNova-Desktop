// src/renderer/pages/profile/components/ProfileInfoForm.tsx
import React, { useState, useEffect } from 'react';
import { Save, Key } from 'lucide-react';
import Button from '../../../components/UI/Button';

interface ProfileInfoFormProps {
  user: { userId: number; username: string; email: string; fullName: string; roles: string[]; lastLoginAt?: string } | null;
  loading: boolean;
  updating: boolean;
  onUpdateProfile: (data: { email: string; fullName: string }) => Promise<void>;
  onChangePasswordClick: () => void;
}

const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({
  user,
  loading,
  updating,
  onUpdateProfile,
  onChangePasswordClick,
}) => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setFullName(user.fullName || '');
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    onUpdateProfile({ email, fullName });
  };

  if (loading || !user) {
    return <div className="text-center py-8 text-[var(--text-secondary)]">Loading profile...</div>;
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-[var(--card-bg)] rounded-xl p-6 shadow-sm border border-[var(--border-color)]">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Profile Information</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Username</label>
          <input
            type="text"
            value={user.username}
            disabled
            className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] opacity-70 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Roles</label>
          <div className="flex flex-wrap gap-2">
            {user.roles.map((role, idx) => (
              <span key={idx} className="px-2 py-1 text-xs rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)]">
                {role}
              </span>
            ))}
            {user.roles.length === 0 && <span className="text-sm text-[var(--text-tertiary)]">No roles assigned</span>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Last Login</label>
          <p className="text-sm text-[var(--text-secondary)]">{formatDate(user.lastLoginAt)}</p>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="primary" size="md" icon={Save} loading={updating}>
            Save Changes
          </Button>
          <Button type="button" variant="secondary" size="md" icon={Key} onClick={onChangePasswordClick}>
            Change Password
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileInfoForm;
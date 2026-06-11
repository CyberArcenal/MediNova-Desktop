// src/renderer/pages/profile/index.tsx
import React from 'react';
import { useProfile } from './hooks/useProfile';
import ProfileInfoForm from './components/ProfileInfoForm';
import ChangePasswordModal from './components/ChangePasswordModal';

const ProfilePage: React.FC = () => {
  const { user, loading, updating, passwordModal, updateProfile, changePassword } = useProfile();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Profile</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">View and edit your profile information</p>
      </div>

      <ProfileInfoForm
        user={user}
        loading={loading}
        updating={updating}
        onUpdateProfile={updateProfile}
        onChangePasswordClick={passwordModal.open}
      />

      <ChangePasswordModal
        isOpen={passwordModal.isOpen}
        onClose={passwordModal.close}
        onChangePassword={changePassword}
      />
    </div>
  );
};

export default ProfilePage;
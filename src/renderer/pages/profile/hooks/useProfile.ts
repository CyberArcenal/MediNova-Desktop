// src/renderer/pages/profile/hooks/useProfile.ts
import { useState, useEffect, useCallback } from 'react';
import authAPI, { type AuthResponse } from '../../../api/core/auth';
import usersAPI from '../../../api/core/users';
import { useModal } from '../../../hooks/useModal';
import { dialogs } from '../../../utils/dialogs';

export const useProfile = () => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const passwordModal = useModal();

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const data = await authAPI.getCurrentUser();
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user profile', error);
      await dialogs.alert({ title: 'Error', message: 'Failed to load profile.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const updateProfile = async (data: { email: string; fullName: string }) => {
    if (!user) return;
    setUpdating(true);
    try {
      await usersAPI.update(user.userId, {
        email: data.email,
        fullName: data.fullName,
      });
      // Refresh user data from auth/me
      await fetchUser();
      await dialogs.alert({ title: 'Success', message: 'Profile updated successfully.' });
    } catch (error) {
      console.error('Failed to update profile', error);
      await dialogs.alert({ title: 'Error', message: 'Failed to update profile.' });
    } finally {
      setUpdating(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await authAPI.changePassword({ currentPassword, newPassword });
      await dialogs.alert({ title: 'Success', message: 'Password changed successfully.' });
      return true;
    } catch (error: any) {
      await dialogs.alert({ title: 'Error', message: error.message || 'Failed to change password.' });
      return false;
    }
  };

  return {
    user,
    loading,
    updating,
    passwordModal,
    updateProfile,
    changePassword,
    refresh: fetchUser,
  };
};
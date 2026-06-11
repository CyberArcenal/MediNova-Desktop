// src/renderer/pages/settings/backup/hooks/useBackup.ts
import { useState, useEffect, useCallback } from 'react';
import backupAPI, { type BackupFile } from '../../../../api/core/backup';
import { dialogs } from '../../../../utils/dialogs';

export const useBackup = () => {
  const [backups, setBackups] = useState<BackupFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [cleaning, setCleaning] = useState(false);

  const fetchBackups = useCallback(async () => {
    setLoading(true);
    try {
      const files = await backupAPI.list();
      setBackups(files);
    } catch (error) {
      console.error('Failed to fetch backups', error);
      await dialogs.alert({ title: 'Error', message: 'Failed to load backup list.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBackups();
  }, [fetchBackups]);

  const createBackup = async () => {
    setCreating(true);
    try {
      await backupAPI.create();
      await fetchBackups();
      await dialogs.alert({
        title: 'Backup Created',
        message: 'Database backup has been created successfully.',
      });
    } catch (error) {
      console.error('Failed to create backup', error);
      await dialogs.alert({ title: 'Error', message: 'Failed to create backup.' });
    } finally {
      setCreating(false);
    }
  };

  const cleanupBackups = async () => {
    const daysToKeep = await dialogs.prompt({
      title: 'Cleanup Backups',
      message: 'Enter number of days to keep:',
      defaultValue: '30',
    });
    if (daysToKeep === null) return;
    const days = parseInt(daysToKeep, 10);
    if (isNaN(days) || days < 0) {
      await dialogs.alert({ title: 'Invalid', message: 'Please enter a valid number.' });
      return;
    }
    setCleaning(true);
    try {
      await backupAPI.cleanup(days);
      await fetchBackups();
      await dialogs.alert({
        title: 'Cleanup Complete',
        message: `Backups older than ${days} days have been deleted.`,
      });
    } catch (error) {
      console.error('Failed to cleanup backups', error);
      await dialogs.alert({ title: 'Error', message: 'Failed to cleanup backups.' });
    } finally {
      setCleaning(false);
    }
  };

  const downloadBackup = async (fileName: string) => {
    try {
      const blob = await backupAPI.download(fileName);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download backup', error);
      await dialogs.alert({ title: 'Error', message: 'Failed to download backup.' });
    }
  };

  return {
    backups,
    loading,
    creating,
    cleaning,
    createBackup,
    cleanupBackups,
    downloadBackup,
    refresh: fetchBackups,
  };
};
// src/renderer/pages/settings/backup/index.tsx
import React from 'react';
import { Database, Trash2 } from 'lucide-react';
import Button from '../../../components/UI/Button';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import { useBackup } from './hooks/useBackup';
import BackupTable from './components/BackupTable';

const BackupSettingsPage: React.FC = () => {
  const { backups, loading, creating, cleaning, createBackup, cleanupBackups, downloadBackup } = useBackup();

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Backup</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Manage database backups</p>
      </div>

      <div className="flex gap-3">
        <Button variant="primary" size="md" icon={Database} onClick={createBackup} loading={creating}>
          Create New Backup
        </Button>
        <Button variant="secondary" size="md" icon={Trash2} onClick={cleanupBackups} loading={cleaning}>
          Cleanup Old Backups
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="medium" />
        </div>
      ) : (
        <BackupTable backups={backups} onDownload={downloadBackup} />
      )}
    </div>
  );
};

export default BackupSettingsPage;
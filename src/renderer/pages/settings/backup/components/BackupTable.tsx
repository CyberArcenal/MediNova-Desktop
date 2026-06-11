// src/renderer/pages/settings/backup/components/BackupTable.tsx
import React from 'react';
import { Download } from 'lucide-react';
import type { BackupFile } from '../../../../api/core/backup';

interface BackupTableProps {
  backups: BackupFile[];
  onDownload: (fileName: string) => void;
}

const formatDate = (date: Date) => {
  return date.toLocaleString();
};

const BackupTable: React.FC<BackupTableProps> = ({ backups, onDownload }) => {
  if (backups.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--text-tertiary)] border border-[var(--border-color)] rounded-xl bg-[var(--card-bg)]">
        No backup files found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--card-secondary-bg)] border-b border-[var(--border-color)]">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">File Name</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Date</th>
            <th className="text-center py-3 px-4 font-semibold text-[var(--text-secondary)]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {backups.map((backup) => (
            <tr key={backup.fileName} className="border-b border-[var(--border-color)] hover:bg-[var(--card-hover-bg)] transition-colors">
              <td className="py-2.5 px-4 text-[var(--text-primary)] font-mono text-xs">{backup.fileName}</td>
              <td className="py-2.5 px-4 text-[var(--text-secondary)]">{formatDate(backup.date)}</td>
              <td className="py-2.5 px-4 text-center">
                <button
                  onClick={() => onDownload(backup.fileName)}
                  className="p-1 rounded hover:bg-[var(--card-hover-bg)] text-[var(--text-secondary)] hover:text-[var(--primary-color)]"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BackupTable;
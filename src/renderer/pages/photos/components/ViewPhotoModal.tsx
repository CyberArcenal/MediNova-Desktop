// src/renderer/pages/photos/components/ViewPhotoModal.tsx
import React from 'react';
import Modal from '../../../components/UI/Modal';
import Button from '../../../components/UI/Button';
import type { PhotoResponseDto } from '../../../api/core/photos';

interface ViewPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  photo: PhotoResponseDto | null;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ViewPhotoModal: React.FC<ViewPhotoModalProps> = ({ isOpen, onClose, photo }) => {
  if (!photo) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Photo Details"
      size="lg"
      footer={<Button variant="secondary" onClick={onClose}>Close</Button>}
    >
      <div className="space-y-4">
        <div className="flex justify-center">
          <img
            src={photo.filePath}
            alt={photo.description || photo.fileName}
            className="max-w-full max-h-96 rounded-lg object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/800x600?text=Image+Not+Found';
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Client</label>
            <p className="text-[var(--text-primary)]">{photo.clientName}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Type</label>
            <p><span className={`px-2 py-0.5 text-xs rounded-full ${photo.isBefore ? 'bg-blue-500/20 text-blue-600' : 'bg-green-500/20 text-green-600'}`}>
              {photo.isBefore ? 'Before' : 'After'}
            </span></p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">File Name</label>
            <p className="text-[var(--text-primary)]">{photo.fileName}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">File Size</label>
            <p className="text-[var(--text-primary)]">{formatFileSize(photo.fileSize)}</p>
          </div>
          {photo.appointmentId && (
            <div>
              <label className="text-xs font-medium text-[var(--text-tertiary)]">Appointment ID</label>
              <p className="text-[var(--text-primary)]">{photo.appointmentId}</p>
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Uploaded At</label>
            <p className="text-[var(--text-primary)]">{new Date(photo.createdAt).toLocaleString()}</p>
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Description</label>
            <p className="text-[var(--text-primary)] whitespace-pre-wrap">{photo.description || '—'}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewPhotoModal;
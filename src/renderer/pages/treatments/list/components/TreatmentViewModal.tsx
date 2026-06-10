// src/renderer/pages/treatments/list/components/TreatmentViewModal.tsx
import React from 'react';
import Modal from '../../../../components/UI/Modal';
import Button from '../../../../components/UI/Button';
import type { TreatmentResponseDto } from '../../../../api/core/treatments';

interface TreatmentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  treatment: TreatmentResponseDto | null;
}

const TreatmentViewModal: React.FC<TreatmentViewModalProps> = ({ isOpen, onClose, treatment }) => {
  if (!treatment) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Treatment Details"
      size="md"
      footer={<Button variant="secondary" onClick={onClose}>Close</Button>}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Name</label>
            <p className="text-[var(--text-primary)]">{treatment.name}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Category</label>
            <p className="text-[var(--text-primary)]">{treatment.categoryName || '—'}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Duration</label>
            <p className="text-[var(--text-primary)]">{treatment.durationMinutes} minutes</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Price</label>
            <p className="text-[var(--text-primary)]">{formatCurrency(treatment.price)}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Status</label>
            <p>{treatment.isActive ? <span className="text-green-600">Active</span> : <span className="text-gray-500">Inactive</span>}</p>
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Description</label>
            <p className="text-[var(--text-primary)] whitespace-pre-wrap">{treatment.description || '—'}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Created At</label>
            <p className="text-[var(--text-secondary)]">{new Date(treatment.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TreatmentViewModal;
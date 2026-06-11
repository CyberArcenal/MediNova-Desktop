// src/renderer/pages/staff/list/components/StaffViewModal.tsx
import React from 'react';
import Modal from '../../../../components/UI/Modal';
import Button from '../../../../components/UI/Button';
import type { StaffResponseDto } from '../../../../api/core/staff';

interface StaffViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffResponseDto | null;
}

const StaffViewModal: React.FC<StaffViewModalProps> = ({ isOpen, onClose, staff }) => {
  if (!staff) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Staff Details"
      size="md"
      footer={<Button variant="secondary" onClick={onClose}>Close</Button>}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Name</label>
            <p className="text-[var(--text-primary)]">{staff.name}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Status</label>
            <p>{staff.isActive ? <span className="text-green-600">Active</span> : <span className="text-gray-500">Inactive</span>}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Email</label>
            <p className="text-[var(--text-primary)]">{staff.email || '—'}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Phone</label>
            <p className="text-[var(--text-primary)]">{staff.phone || '—'}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Position</label>
            <p className="text-[var(--text-primary)]">{staff.position || '—'}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Created At</label>
            <p className="text-[var(--text-secondary)]">{new Date(staff.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default StaffViewModal;
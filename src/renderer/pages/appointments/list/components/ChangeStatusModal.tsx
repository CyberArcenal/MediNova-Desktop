// src/renderer/pages/appointments/list/components/ChangeStatusModal.tsx
import React, { useState } from 'react';
import Modal from '../../../../components/UI/Modal';
import Button from '../../../../components/UI/Button';

interface ChangeStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newStatus: string) => void;
  currentStatus: string;
}

const statusOptions = [
  { value: 'Scheduled', label: 'Scheduled' },
  { value: 'Confirmed', label: 'Confirmed' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
  { value: 'NoShow', label: 'No Show' },
];

const ChangeStatusModal: React.FC<ChangeStatusModalProps> = ({ isOpen, onClose, onConfirm, currentStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  const handleConfirm = () => {
    if (selectedStatus !== currentStatus) {
      onConfirm(selectedStatus);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Change Appointment Status"
      size="sm"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-[var(--text-secondary)]">Select new status:</p>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
        >
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </Modal>
  );
};

export default ChangeStatusModal;
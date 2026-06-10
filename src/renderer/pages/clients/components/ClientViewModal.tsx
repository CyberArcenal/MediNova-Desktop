// src/renderer/pages/clients/components/ClientViewModal.tsx
import React from 'react';
import Modal from '../../../components/UI/Modal';
import Button from '../../../components/UI/Button';
import type { ClientResponseDto } from '../../../api/core/clients';

interface ClientViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: ClientResponseDto | null;
}

const ClientViewModal: React.FC<ClientViewModalProps> = ({ isOpen, onClose, client }) => {
  if (!client) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Client Details"
      size="md"
      footer={
        <div className="flex justify-end">
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Full Name</label>
            <p className="text-[var(--text-primary)]">{client.fullName}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Email</label>
            <p className="text-[var(--text-primary)]">{client.email}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Phone Number</label>
            <p className="text-[var(--text-primary)]">{client.phoneNumber || '—'}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Date of Birth</label>
            <p className="text-[var(--text-primary)]">{formatDate(client.dateOfBirth)}</p>
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Skin History</label>
            <p className="text-[var(--text-primary)] whitespace-pre-wrap">{client.skinHistory || '—'}</p>
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Allergies</label>
            <p className="text-[var(--text-primary)] whitespace-pre-wrap">{client.allergies || '—'}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Registration Date</label>
            <p className="text-[var(--text-primary)]">{formatDate(client.createdAt)}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ClientViewModal;
// src/renderer/pages/treatments/categories/components/CategoryViewModal.tsx
import React from 'react';
import Modal from '../../../../components/UI/Modal';
import Button from '../../../../components/UI/Button';
import type { CategoryResponseDto } from '../../../../api/core/categories';

interface CategoryViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryResponseDto | null;
}

const CategoryViewModal: React.FC<CategoryViewModalProps> = ({ isOpen, onClose, category }) => {
  if (!category) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Category Details"
      size="md"
      footer={<Button variant="secondary" onClick={onClose}>Close</Button>}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Name</label>
            <p className="text-[var(--text-primary)]">{category.name}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Status</label>
            <p>{category.isActive ? <span className="text-green-600">Active</span> : <span className="text-gray-500">Inactive</span>}</p>
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Description</label>
            <p className="text-[var(--text-primary)] whitespace-pre-wrap">{category.description || '—'}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Number of Treatments</label>
            <p className="text-[var(--text-primary)]">{category.treatmentCount}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Created At</label>
            <p className="text-[var(--text-secondary)]">{new Date(category.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CategoryViewModal;
// src/renderer/pages/treatments/packages/components/PackageViewModal.tsx
import React from 'react';
import Modal from '../../../../components/UI/Modal';
import Button from '../../../../components/UI/Button';
import type { PackageResponseDto } from '../../../../api/core/packages';

interface PackageViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  package: PackageResponseDto | null;
}

const PackageViewModal: React.FC<PackageViewModalProps> = ({ isOpen, onClose, package: pkg }) => {
  if (!pkg) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Package Details"
      size="lg"
      footer={<Button variant="secondary" onClick={onClose}>Close</Button>}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Name</label>
            <p className="text-[var(--text-primary)]">{pkg.name}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Status</label>
            <p>{pkg.isActive ? <span className="text-green-600">Active</span> : <span className="text-gray-500">Inactive</span>}</p>
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Description</label>
            <p className="text-[var(--text-primary)] whitespace-pre-wrap">{pkg.description || '—'}</p>
          </div>
        </div>

        <div className="border-t border-[var(--border-color)] pt-4">
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Pricing Summary</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-[var(--text-tertiary)]">Total Price</label>
              <p className="text-[var(--text-primary)] font-medium">{formatCurrency(pkg.totalPrice)}</p>
            </div>
            <div>
              <label className="text-xs text-[var(--text-tertiary)]">Discounted Price</label>
              <p className="text-[var(--text-primary)] font-medium">{formatCurrency(pkg.discountedPrice)}</p>
            </div>
            <div>
              <label className="text-xs text-[var(--text-tertiary)]">You Save</label>
              <p className="text-green-600 font-bold">{formatCurrency(pkg.savings)}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border-color)] pt-4">
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Included Treatments</h4>
          {pkg.treatments.length === 0 ? (
            <p className="text-sm text-[var(--text-tertiary)]">No treatments in this package.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-1 text-[var(--text-secondary)]">Treatment</th>
                    <th className="text-right py-1 text-[var(--text-secondary)]">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {pkg.treatments.map((t) => (
                    <tr key={t.treatmentId}>
                      <td className="py-1 text-[var(--text-primary)]">{t.treatmentName}</td>
                      <td className="py-1 text-right text-[var(--text-primary)]">{formatCurrency(t.treatmentPrice)}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-[var(--border-color)]">
                    <td className="pt-2 font-semibold text-[var(--text-primary)]">Total</td>
                    <td className="pt-2 text-right font-semibold text-[var(--text-primary)]">{formatCurrency(pkg.totalPrice)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-[var(--text-tertiary)]">Created At</label>
          <p className="text-[var(--text-secondary)]">{new Date(pkg.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </Modal>
  );
};

export default PackageViewModal;
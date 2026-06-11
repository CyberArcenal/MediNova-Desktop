// src/renderer/pages/billing/payments/index.tsx
import React from 'react';
import Pagination from '../../../components/UI/Pagination';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import PaymentMethodSelect from '../../../components/Selects/PaymentMethodSelect';
import { usePayments } from './hooks/usePayments';
import PaymentTable from './components/PaymentTable';
import PaymentViewModal from './components/PaymentViewModal';

const PaymentsPage: React.FC = () => {
  const {
    payments,
    loading,
    page,
    totalPages,
    totalCount,
    invoiceId,
    method,
    selectedPayment,
    viewModal,
    setPage,
    setInvoiceId,
    setMethod,
    handleDelete,
    handleView,
    resetFilters,
  } = usePayments();

  const hasFilters = !!(invoiceId || method);

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Payment History</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">View and manage all payments received</p>
      </div>

      {/* Filters */}
      <div className="bg-[var(--card-bg)] rounded-xl p-4 border border-[var(--border-color)] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1">Invoice ID</label>
            <input
              type="number"
              value={invoiceId || ''}
              onChange={(e) => setInvoiceId(e.target.value ? Number(e.target.value) : null)}
              placeholder="Filter by invoice ID"
              className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1">Payment Method</label>
            <PaymentMethodSelect
              value={method}
              onChange={(val) => setMethod(val)}
            />
          </div>
        </div>
        {hasFilters && (
          <div className="flex justify-end">
            <button onClick={resetFilters} className="text-xs text-[var(--primary-color)] hover:underline">Clear filters</button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="medium" />
        </div>
      ) : (
        <>
          <PaymentTable
            payments={payments}
            onView={handleView}
            onDelete={handleDelete}
          />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          <div className="text-xs text-[var(--text-tertiary)] text-right">
            Total: {totalCount} payment{totalCount !== 1 ? 's' : ''}
          </div>
        </>
      )}

      <PaymentViewModal
        isOpen={viewModal.isOpen}
        onClose={viewModal.close}
        payment={selectedPayment}
      />
    </div>
  );
};

export default PaymentsPage;
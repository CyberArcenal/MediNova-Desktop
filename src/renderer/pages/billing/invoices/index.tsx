// src/renderer/pages/billing/invoices/index.tsx
import React from 'react';
import { Plus } from 'lucide-react';
import Button from '../../../components/UI/Button';
import Pagination from '../../../components/UI/Pagination';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import ClientSelect from '../../../components/Selects/ClientSelect';
import InvoiceStatusSelect from '../../../components/Selects/InvoiceStatusSelect';
import { useInvoices } from './hooks/useInvoices';
import InvoiceTable from './components/InvoiceTable';
import InvoiceViewModal from './components/InvoiceViewModal';
import InvoiceFormModal from './components/InvoiceFormModal';
import AddPaymentModal from './components/AddPaymentModal';

const InvoicesPage: React.FC = () => {
  const {
    invoices,
    loading,
    page,
    totalPages,
    totalCount,
    filters,
    selectedInvoice,
    payments,
    editingInvoice,
    invoiceForPayment,
    viewModal,
    formModal,
    paymentModal,
    setPage,
    setClientId,
    setStatus,
    handleDelete,
    handleChangeStatus,
    handleView,
    handleEdit,
    handleAddPayment,
    handleAddNew,
    handleFormSuccess,
    handlePaymentSuccess,
    resetFilters,
  } = useInvoices();

  const hasFilters = !!(filters.clientId || filters.status);

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Invoices</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Manage client invoices and payments</p>
        </div>
        <Button variant="primary" size="md" icon={Plus} onClick={handleAddNew}>
          Create Invoice
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-[var(--card-bg)] rounded-xl p-4 border border-[var(--border-color)] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ClientSelect
            value={filters.clientId}
            onChange={(id) => { setClientId(id); setPage(1); }}
            placeholder="Filter by client"
          />
          <InvoiceStatusSelect
            value={filters.status}
            onChange={(val) => { setStatus(val); setPage(1); }}
          />
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
          <InvoiceTable
            invoices={invoices}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onChangeStatus={handleChangeStatus}
            onAddPayment={handleAddPayment}
          />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          <div className="text-xs text-[var(--text-tertiary)] text-right">
            Total: {totalCount} invoice{totalCount !== 1 ? 's' : ''}
          </div>
        </>
      )}

      <InvoiceViewModal
        isOpen={viewModal.isOpen}
        onClose={viewModal.close}
        invoice={selectedInvoice}
        payments={payments}
      />
      <InvoiceFormModal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        onSuccess={handleFormSuccess}
        initialData={editingInvoice}
      />
      <AddPaymentModal
        isOpen={paymentModal.isOpen}
        onClose={paymentModal.close}
        onSuccess={handlePaymentSuccess}
        invoice={invoiceForPayment}
      />
    </div>
  );
};

export default InvoicesPage;
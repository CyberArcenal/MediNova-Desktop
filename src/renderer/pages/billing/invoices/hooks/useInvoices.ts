// src/renderer/pages/billing/invoices/hooks/useInvoices.ts
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import invoicesAPI, { type InvoiceResponseDto } from '../../../../api/core/invoices';
import paymentsAPI, { type PaymentResponseDto } from '../../../../api/core/payments';
import { useModal } from '../../../../hooks/useModal';
import { dialogs } from '../../../../utils/dialogs';

export const useInvoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<InvoiceResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [clientId, setClientId] = useState<number | null>(null);
  const [status, setStatus] = useState<string>('');

  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceResponseDto | null>(null);
  const [payments, setPayments] = useState<PaymentResponseDto[]>([]);

  const viewModal = useModal();
  const formModal = useModal();
  const paymentModal = useModal();
  const [editingInvoice, setEditingInvoice] = useState<InvoiceResponseDto | null>(null);
  const [invoiceForPayment, setInvoiceForPayment] = useState<InvoiceResponseDto | null>(null);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const result = await invoicesAPI.getAll(page, pageSize, clientId || undefined, status || undefined);
      setInvoices(result.items);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error('Failed to fetch invoices', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, clientId, status]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const fetchPaymentsForInvoice = async (invoiceId: number) => {
    try {
      const data = await paymentsAPI.getByInvoice(invoiceId);
      setPayments(data);
    } catch (error) {
      console.error('Failed to fetch payments', error);
      setPayments([]);
    }
  };

  const handleDelete = async (id: number, invoiceNumber: string) => {
    const confirmed = await dialogs.confirm({
      title: 'Delete Invoice',
      message: `Are you sure you want to delete invoice ${invoiceNumber}? This action cannot be undone.`,
    });
    if (confirmed) {
      try {
        await invoicesAPI.delete(id);
        await fetchInvoices();
      } catch (error) {
        console.error('Failed to delete invoice', error);
      }
    }
  };

  const handleChangeStatus = async (id: number, newStatus: string) => {
    try {
      await invoicesAPI.updateStatus(id, newStatus);
      await fetchInvoices();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleView = async (invoice: InvoiceResponseDto) => {
    setSelectedInvoice(invoice);
    await fetchPaymentsForInvoice(invoice.id);
    viewModal.open();
  };

  const handleEdit = (invoice: InvoiceResponseDto) => {
    setEditingInvoice(invoice);
    formModal.open();
  };

  const handleAddPayment = (invoice: InvoiceResponseDto) => {
    setInvoiceForPayment(invoice);
    paymentModal.open();
  };

  const handleAddNew = () => {
    setEditingInvoice(null);
    formModal.open();
  };

  const handleFormSuccess = () => {
    formModal.close();
    setEditingInvoice(null);
    fetchInvoices();
  };

  const handlePaymentSuccess = () => {
    paymentModal.close();
    setInvoiceForPayment(null);
    // If view modal is open, refresh payments
    if (viewModal.isOpen && selectedInvoice) {
      fetchPaymentsForInvoice(selectedInvoice.id);
    }
    fetchInvoices(); // refresh list to update balance
  };

  const resetFilters = () => {
    setClientId(null);
    setStatus('');
    setPage(1);
  };

  return {
    invoices,
    loading,
    page,
    totalPages,
    totalCount,
    filters: { clientId, status },
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
  };
};
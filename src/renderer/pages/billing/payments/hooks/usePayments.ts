// src/renderer/pages/billing/payments/hooks/usePayments.ts
import { useState, useEffect, useCallback } from 'react';
import paymentsAPI, { type PaymentResponseDto } from '../../../../api/core/payments';
import { useModal } from '../../../../hooks/useModal';
import { dialogs } from '../../../../utils/dialogs';

export const usePayments = () => {
  const [payments, setPayments] = useState<PaymentResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [invoiceId, setInvoiceId] = useState<number | null>(null);
  const [method, setMethod] = useState<string>('');

  const viewModal = useModal();
  const [selectedPayment, setSelectedPayment] = useState<PaymentResponseDto | null>(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const result = await paymentsAPI.getAll(page, pageSize, invoiceId || undefined, method || undefined);
      setPayments(result.items);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error('Failed to fetch payments', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, invoiceId, method]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleDelete = async (id: number, invoiceNumber: string, amount: number) => {
    const confirmed = await dialogs.confirm({
      title: 'Delete Payment',
      message: `Are you sure you want to delete payment of ${new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount)} for invoice ${invoiceNumber}?`,
    });
    if (confirmed) {
      try {
        await paymentsAPI.delete(id);
        await fetchPayments();
      } catch (error) {
        console.error('Failed to delete payment', error);
      }
    }
  };

  const handleView = (payment: PaymentResponseDto) => {
    setSelectedPayment(payment);
    viewModal.open();
  };

  const resetFilters = () => {
    setInvoiceId(null);
    setMethod('');
    setPage(1);
  };

  return {
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
  };
};
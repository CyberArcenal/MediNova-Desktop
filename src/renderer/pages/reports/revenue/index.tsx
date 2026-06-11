// src/renderer/pages/reports/revenue/index.tsx
import React from 'react';
import DatePicker from '../../../components/UI/DatePicker';
import Button from '../../../components/UI/Button';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import { useRevenueReport } from './hooks/useRevenueReport';
import RevenueKPICard from './components/RevenueKPICard';
import DailyRevenueChart from './components/DailyRevenueChart';
import RevenueByTreatmentChart from './components/RevenueByTreatmentChart';
import RevenueByCategoryChart from './components/RevenueByCategoryChart';
import RevenueByStaffChart from './components/RevenueByStaffChart';
import RevenueByPaymentMethodChart from './components/RevenueByPaymentMethodChart';
import DataTable from './components/DataTable';

const RevenueReportPage: React.FC = () => {
  const { data, loading, startDate, endDate, setStartDate, setEndDate, resetDates, refetch } = useRevenueReport();

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="large" text="Loading revenue report..." />
      </div>
    );
  }

  const { totalRevenue, dailyBreakdown, byTreatment, byCategory, byStaff, byPaymentMethod } = data;

  // Prepare columns for tables
  const treatmentColumns = [
    { key: 'treatmentName', header: 'Treatment' },
    { key: 'count', header: 'Count', align: 'right' as const },
    { key: 'revenue', header: 'Revenue', align: 'right' as const, render: (item: any) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(item.revenue) },
    { key: 'percentage', header: 'Percentage', align: 'right' as const, render: (item: any) => `${item.percentage.toFixed(1)}%` },
  ];

  const categoryColumns = [
    { key: 'categoryName', header: 'Category', render: (item: any) => item.categoryName || 'Uncategorized' },
    { key: 'appointmentCount', header: 'Appointments', align: 'right' as const },
    { key: 'revenue', header: 'Revenue', align: 'right' as const, render: (item: any) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(item.revenue) },
    { key: 'percentage', header: 'Percentage', align: 'right' as const, render: (item: any) => `${item.percentage.toFixed(1)}%` },
  ];

  const staffColumns = [
    { key: 'staffName', header: 'Staff', render: (item: any) => item.staffName || 'Unassigned' },
    { key: 'appointmentCount', header: 'Appointments', align: 'right' as const },
    { key: 'revenue', header: 'Revenue', align: 'right' as const, render: (item: any) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(item.revenue) },
    { key: 'percentage', header: 'Percentage', align: 'right' as const, render: (item: any) => `${item.percentage.toFixed(1)}%` },
  ];

  const paymentColumns = [
    { key: 'method', header: 'Method' },
    { key: 'count', header: 'Count', align: 'right' as const },
    { key: 'amount', header: 'Amount', align: 'right' as const, render: (item: any) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(item.amount) },
    { key: 'percentage', header: 'Percentage', align: 'right' as const, render: (item: any) => `${item.percentage.toFixed(1)}%` },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Revenue Report</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Analyze revenue by period</p>
      </div>

      {/* Date Range Picker */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-secondary)]">From:</span>
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date || new Date())} dateFormat="yyyy-MM-dd" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-secondary)]">To:</span>
          <DatePicker selected={endDate} onChange={(date) => setEndDate(date || new Date())} dateFormat="yyyy-MM-dd" />
        </div>
        <Button variant="primary" size="sm" onClick={refetch}>Apply</Button>
        <Button variant="secondary" size="sm" onClick={resetDates}>Reset to Current Month</Button>
      </div>

      {/* KPI */}
      <RevenueKPICard totalRevenue={totalRevenue} />

      {/* Daily Revenue Chart */}
      <DailyRevenueChart data={dailyBreakdown} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueByTreatmentChart data={byTreatment} />
        <RevenueByCategoryChart data={byCategory} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueByStaffChart data={byStaff} />
        <RevenueByPaymentMethodChart data={byPaymentMethod} />
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataTable title="Revenue by Treatment" data={byTreatment} columns={treatmentColumns} />
        <DataTable title="Revenue by Category" data={byCategory} columns={categoryColumns} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataTable title="Revenue by Staff" data={byStaff} columns={staffColumns} />
        <DataTable title="Revenue by Payment Method" data={byPaymentMethod} columns={paymentColumns} />
      </div>
    </div>
  );
};

export default RevenueReportPage;
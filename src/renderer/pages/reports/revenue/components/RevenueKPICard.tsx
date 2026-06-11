// src/renderer/pages/reports/revenue/components/RevenueKPICard.tsx
import React from 'react';
import { DollarSign } from 'lucide-react';

interface RevenueKPICardProps {
  totalRevenue: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(value);
};

const RevenueKPICard: React.FC<RevenueKPICardProps> = ({ totalRevenue }) => {
  return (
    <div className="bg-[var(--card-bg)] rounded-xl p-6 shadow-sm border border-[var(--border-color)] flex items-center justify-between">
      <div>
        <p className="text-sm text-[var(--text-secondary)]">Total Revenue</p>
        <p className="text-3xl font-bold text-[var(--text-primary)]">{formatCurrency(totalRevenue)}</p>
      </div>
      <div className="p-3 rounded-full bg-[var(--primary-color)]/10">
        <DollarSign className="w-8 h-8 text-[var(--primary-color)]" />
      </div>
    </div>
  );
};

export default RevenueKPICard;
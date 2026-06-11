// src/renderer/pages/reports/revenue/components/DailyRevenueChart.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { RevenueDailyDto } from '../../../../api/core/reports';

interface DailyRevenueChartProps {
  data: RevenueDailyDto[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(value);
};

const DailyRevenueChart: React.FC<DailyRevenueChartProps> = ({ data }) => {
  if (!data.length) {
    return <div className="text-center py-8 text-[var(--text-tertiary)]">No daily data available</div>;
  }

  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    revenue: item.revenue,
    appointments: item.appointmentCount,
  }));

  return (
    <div className="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--border-color)]">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Daily Revenue</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)' }} />
          <YAxis tickFormatter={(val) => `₱${val}`} tick={{ fill: 'var(--text-secondary)' }} />
          <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }} />
          <Bar dataKey="revenue" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyRevenueChart;
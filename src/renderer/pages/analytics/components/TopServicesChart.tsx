// src/renderer/pages/analytics/components/TopServicesChart.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TopServicesChartProps {
  data: Array<{ serviceName: string; revenue: number }>;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(value);
};

const TopServicesChart: React.FC<TopServicesChartProps> = ({ data }) => {
  const chartData = data.slice(0, 5).map(item => ({
    name: item.serviceName.length > 20 ? item.serviceName.substring(0, 17) + '...' : item.serviceName,
    revenue: item.revenue,
  }));

  return (
    <div className="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--border-color)]">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Top Services by Revenue</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis type="number" tickFormatter={(val) => `₱${val}`} tick={{ fill: 'var(--text-secondary)' }} />
          <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text-secondary)' }} width={100} />
          <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }} />
          <Bar dataKey="revenue" fill="var(--primary-color)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopServicesChart;
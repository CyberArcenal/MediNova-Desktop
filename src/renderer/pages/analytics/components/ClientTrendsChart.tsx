// src/renderer/pages/analytics/components/ClientTrendsChart.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { MonthlyTrendDto } from '../../../api/core/clients';

interface ClientTrendsChartProps {
  data: MonthlyTrendDto[];
}

const ClientTrendsChart: React.FC<ClientTrendsChartProps> = ({ data }) => {
  if (!data.length) return <div className="text-center py-8 text-[var(--text-tertiary)]">No trend data available</div>;

  return (
    <div className="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--border-color)]">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Client Trends (Last 12 Months)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)' }} />
          <YAxis tick={{ fill: 'var(--text-secondary)' }} />
          <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }} />
          <Legend />
          <Line type="monotone" dataKey="newClients" name="New Clients" stroke="#3b82f6" strokeWidth={2} />
          <Line type="monotone" dataKey="activeClients" name="Active Clients" stroke="#10b981" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ClientTrendsChart;
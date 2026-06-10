// src/renderer/pages/clients/analytics/components/MonthlyTrendsChart.tsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { MonthlyTrendDto } from '../../../../api/core/clients';

interface MonthlyTrendsChartProps {
  data: MonthlyTrendDto[];
}

const MonthlyTrendsChart: React.FC<MonthlyTrendsChartProps> = ({ data }) => {
  if (!data.length) {
    return <div className="text-center py-8 text-[var(--text-tertiary)]">No trend data available</div>;
  }

  return (
    <div className="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--border-color)]">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Client Trends (Last 12 Months)</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)' }} />
          <YAxis yAxisId="left" tick={{ fill: 'var(--text-secondary)' }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--text-secondary)' }} />
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="newClients"
            name="New Clients"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="activeClients"
            name="Active Clients"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="revenue"
            name="Revenue (PHP)"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrendsChart;
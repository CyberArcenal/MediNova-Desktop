// src/renderer/pages/reports/revenue/components/RevenueByTreatmentChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { RevenueByTreatmentDto } from '../../../../api/core/reports';

interface RevenueByTreatmentChartProps {
  data: RevenueByTreatmentDto[];
}

const COLORS = ['#2c6e9e', '#5a9bc0', '#7c3aed', '#e6a017', '#2e7d64', '#c73e3e', '#4f46e5', '#10b981'];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(value);
};

const RevenueByTreatmentChart: React.FC<RevenueByTreatmentChartProps> = ({ data }) => {
  if (!data.length) {
    return <div className="text-center py-8 text-[var(--text-tertiary)]">No treatment data available</div>;
  }

  // Limit to top 8 for readability
  const chartData = data.slice(0, 8).map(item => ({
    name: item.treatmentName.length > 20 ? item.treatmentName.substring(0, 17) + '...' : item.treatmentName,
    value: item.revenue,
    percentage: item.percentage,
  }));

  return (
    <div className="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--border-color)]">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Revenue by Treatment</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueByTreatmentChart;
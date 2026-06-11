// src/renderer/pages/reports/appointments/components/DailyAppointmentsChart.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { DailyAppointmentCount } from '../hooks/useAppointmentsReport';

interface DailyAppointmentsChartProps {
  data: DailyAppointmentCount[];
}

const DailyAppointmentsChart: React.FC<DailyAppointmentsChartProps> = ({ data }) => {
  if (!data.length) {
    return <div className="text-center py-8 text-[var(--text-tertiary)]">No data available</div>;
  }

  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    count: item.count,
  }));

  return (
    <div className="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--border-color)]">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Appointments per Day</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)' }} />
          <YAxis tick={{ fill: 'var(--text-secondary)' }} allowDecimals={false} />
          <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
          <Bar dataKey="count" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyAppointmentsChart;
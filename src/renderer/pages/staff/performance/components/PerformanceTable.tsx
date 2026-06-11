// src/renderer/pages/staff/performance/components/PerformanceTable.tsx
import React from 'react';
import type { StaffPerformanceData } from '../hooks/useStaffPerformance';

interface PerformanceTableProps {
  data: StaffPerformanceData[];
}

const PerformanceTable: React.FC<PerformanceTableProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(value);
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--text-tertiary)] border border-[var(--border-color)] rounded-xl bg-[var(--card-bg)]">
        No performance data available for the selected period.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--card-secondary-bg)] border-b border-[var(--border-color)]">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Staff Name</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Position</th>
            <th className="text-right py-3 px-4 font-semibold text-[var(--text-secondary)]">Completed Appointments</th>
            <th className="text-right py-3 px-4 font-semibold text-[var(--text-secondary)]">Revenue Generated</th>
            <th className="text-right py-3 px-4 font-semibold text-[var(--text-secondary)]">Utilization Rate</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.staffId} className="border-b border-[var(--border-color)] hover:bg-[var(--card-hover-bg)] transition-colors">
              <td className="py-2.5 px-4 text-[var(--text-primary)] font-medium">{row.staffName}</td>
              <td className="py-2.5 px-4 text-[var(--text-secondary)]">{row.position}</td>
              <td className="py-2.5 px-4 text-right text-[var(--text-primary)]">{row.completedAppointments}</td>
              <td className="py-2.5 px-4 text-right font-medium text-[var(--text-primary)]">{formatCurrency(row.revenue)}</td>
              <td className="py-2.5 px-4 text-right">
                <span className="inline-flex items-center gap-1">
                  <span className="text-[var(--text-primary)]">{row.utilizationRate.toFixed(1)}%</span>
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--primary-color)] rounded-full"
                      style={{ width: `${Math.min(row.utilizationRate, 100)}%` }}
                    />
                  </div>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PerformanceTable;
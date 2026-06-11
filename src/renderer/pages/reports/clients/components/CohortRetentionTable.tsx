// src/renderer/pages/reports/clients/components/CohortRetentionTable.tsx
import React from 'react';
import type { CohortRetentionDto } from '../../../../api/core/clients';

interface CohortRetentionTableProps {
  cohorts: CohortRetentionDto[];
}

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

const CohortRetentionTable: React.FC<CohortRetentionTableProps> = ({ cohorts }) => {
  if (!cohorts.length) {
    return (
      <div className="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--border-color)]">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Cohort Retention</h3>
        <div className="text-center py-8 text-[var(--text-tertiary)]">No cohort data available</div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--border-color)]">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Cohort Retention</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--card-secondary-bg)] border-b border-[var(--border-color)]">
            <tr>
              <th className="text-left py-2 px-3 font-semibold text-[var(--text-secondary)]">Cohort Month</th>
              <th className="text-right py-2 px-3 font-semibold text-[var(--text-secondary)]">Total Clients</th>
              <th className="text-right py-2 px-3 font-semibold text-[var(--text-secondary)]">Month 1</th>
              <th className="text-right py-2 px-3 font-semibold text-[var(--text-secondary)]">Month 3</th>
              <th className="text-right py-2 px-3 font-semibold text-[var(--text-secondary)]">Month 6</th>
            </tr>
          </thead>
          <tbody>
            {cohorts.map((cohort, idx) => (
              <tr key={idx} className="border-b border-[var(--border-color)] hover:bg-[var(--card-hover-bg)]">
                <td className="py-2 px-3 text-[var(--text-primary)] font-medium">{cohort.cohortMonth}</td>
                <td className="py-2 px-3 text-right text-[var(--text-primary)]">{cohort.totalClients}</td>
                <td className="py-2 px-3 text-right text-[var(--text-primary)]">{formatPercent(cohort.retentionRate1Month)}</td>
                <td className="py-2 px-3 text-right text-[var(--text-primary)]">{formatPercent(cohort.retentionRate3Month)}</td>
                <td className="py-2 px-3 text-right text-[var(--text-primary)]">{formatPercent(cohort.retentionRate6Month)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CohortRetentionTable;
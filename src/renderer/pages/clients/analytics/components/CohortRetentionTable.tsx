// src/renderer/pages/clients/analytics/components/CohortRetentionTable.tsx
import React from 'react';
import type { CohortRetentionDto } from '../../../../api/core/clients';

interface CohortRetentionTableProps {
  cohorts: CohortRetentionDto[];
  overallRetentionRate?: number;
}

const CohortRetentionTable: React.FC<CohortRetentionTableProps> = ({ cohorts, overallRetentionRate }) => {
  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

  return (
    <div className="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--border-color)]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Cohort Retention</h3>
        {overallRetentionRate !== undefined && (
          <div className="text-sm bg-[var(--card-secondary-bg)] px-3 py-1 rounded-full">
            Overall Retention: <span className="font-bold text-[var(--primary-color)]">{formatPercent(overallRetentionRate)}</span>
          </div>
        )}
      </div>
      {!cohorts.length ? (
        <div className="text-center py-8 text-[var(--text-tertiary)]">No cohort data available</div>
      ) : (
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
      )}
    </div>
  );
};

export default CohortRetentionTable;
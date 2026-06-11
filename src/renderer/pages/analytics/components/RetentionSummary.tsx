// src/renderer/pages/analytics/components/RetentionSummary.tsx
import React from 'react';
import { TrendingUp } from 'lucide-react';

interface RetentionSummaryProps {
  retentionRate: number;
  overallRetentionRate?: number; // from client analytics
}

const RetentionSummary: React.FC<RetentionSummaryProps> = ({ retentionRate, overallRetentionRate }) => {
  return (
    <div className="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--border-color)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-orange-500/10">
          <TrendingUp className="w-5 h-5 text-orange-500" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Client Retention</h3>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-[var(--text-primary)]">{retentionRate.toFixed(1)}%</span>
        <span className="text-sm text-[var(--text-secondary)]">retention rate</span>
      </div>
      <p className="text-xs text-[var(--text-tertiary)] mt-2">
        Percentage of clients who returned for at least one additional appointment.
      </p>
    </div>
  );
};

export default RetentionSummary;
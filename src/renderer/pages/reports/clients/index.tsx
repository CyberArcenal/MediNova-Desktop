// src/renderer/pages/reports/clients/index.tsx
import React from 'react';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import { useClientRetention } from './hooks/useClientRetention';
import RetentionKPICards from './components/RetentionKPICards';
import CohortRetentionTable from './components/CohortRetentionTable';

const ClientRetentionPage: React.FC = () => {
  const { data, loading } = useClientRetention();

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="large" text="Loading retention data..." />
      </div>
    );
  }

  const { kpis, retentionData } = data;
  const { totalClients, activeClients, retentionRate, averageLifetimeValue } = kpis;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Client Retention</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Monitor client loyalty and cohort behavior</p>
      </div>

      <RetentionKPICards
        totalClients={totalClients}
        activeClients={activeClients}
        retentionRate={retentionRate}
        averageLifetimeValue={averageLifetimeValue}
      />

      <CohortRetentionTable cohorts={retentionData.cohorts} />
    </div>
  );
};

export default ClientRetentionPage;
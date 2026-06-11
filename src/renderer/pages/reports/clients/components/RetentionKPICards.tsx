// src/renderer/pages/reports/clients/components/RetentionKPICards.tsx
import React from 'react';
import { Users, UserCheck, TrendingUp, DollarSign } from 'lucide-react';

interface RetentionKPICardsProps {
  totalClients: number;
  activeClients: number;
  retentionRate: number;
  averageLifetimeValue: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(value);
};

const RetentionKPICards: React.FC<RetentionKPICardsProps> = ({
  totalClients,
  activeClients,
  retentionRate,
  averageLifetimeValue,
}) => {
  const cards = [
    {
      title: 'Total Clients',
      value: totalClients,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Active Clients',
      value: activeClients,
      icon: UserCheck,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      title: 'Retention Rate',
      value: `${retentionRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
    {
      title: 'Avg. Lifetime Value',
      value: formatCurrency(averageLifetimeValue),
      icon: DollarSign,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--border-color)] flex items-center justify-between"
        >
          <div>
            <p className="text-sm text-[var(--text-secondary)]">{card.title}</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{card.value}</p>
          </div>
          <div className={`p-3 rounded-full ${card.bg}`}>
            <card.icon className={`w-6 h-6 ${card.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default RetentionKPICards;
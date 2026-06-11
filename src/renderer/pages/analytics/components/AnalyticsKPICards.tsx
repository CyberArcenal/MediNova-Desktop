// src/renderer/pages/analytics/components/AnalyticsKPICards.tsx
import React from 'react';
import { DollarSign, Calendar, UserPlus, TrendingUp } from 'lucide-react';

interface AnalyticsKPICardsProps {
  revenueThisMonth: number;
  appointmentsThisMonth: number;
  newClientsThisMonth: number;
  retentionRate: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(value);
};

const AnalyticsKPICards: React.FC<AnalyticsKPICardsProps> = ({
  revenueThisMonth,
  appointmentsThisMonth,
  newClientsThisMonth,
  retentionRate,
}) => {
  const cards = [
    {
      title: 'Revenue (This Month)',
      value: formatCurrency(revenueThisMonth),
      icon: DollarSign,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      title: 'Appointments (This Month)',
      value: appointmentsThisMonth,
      icon: Calendar,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'New Clients (This Month)',
      value: newClientsThisMonth,
      icon: UserPlus,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      title: 'Retention Rate',
      value: `${retentionRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
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

export default AnalyticsKPICards;
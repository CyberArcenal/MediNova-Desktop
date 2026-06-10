// src/renderer/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Calendar, Users, DollarSign, Activity } from 'lucide-react';
import type { DashboardStatsDto } from '../../api/core/dashboard';
import type { AppointmentResponseDto } from '../../api/core/appointments';
import dashboardAPI from '../../api/core/dashboard';
import appointmentsAPI from '../../api/core/appointments';
import LoadingSpinner from '../../components/Shared/LoadingSpinner';

// Helper to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(value);
};

// Helper to format number with +/-
const formatChange = (value: number) => {
  if (value > 0) return `+${value.toFixed(1)}%`;
  if (value < 0) return `${value.toFixed(1)}%`;
  return '0%';
};

// Colors for charts
const COLORS = {
  primary: '#2c6e9e',
  secondary: '#5a9bc0',
  success: '#2e7d64',
  warning: '#e6a017',
  danger: '#c73e3e',
  purple: '#7c3aed',
  indigo: '#4f46e5',
  teal: '#10b981',
};

const DONUT_COLORS = [COLORS.primary, COLORS.secondary, COLORS.success, COLORS.warning, COLORS.danger];

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStatsDto | null>(null);
  const [recentAppointments, setRecentAppointments] = useState<AppointmentResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartDays, setChartDays] = useState<7 | 30>(7);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, appointmentsData] = await Promise.all([
          dashboardAPI.getStats(),
          appointmentsAPI.getAll({ page: 1, pageSize: 5 }),
        ]);
        setStats(statsData);
        setRecentAppointments(appointmentsData.items || []);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="large" text="Loading dashboard..." />
      </div>
    );
  }

  // Prepare daily revenue data (filter by chartDays)
  const dailyRevenueData = (stats.dailyRevenue || [])
    .slice(-chartDays)
    .map((item) => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: item.revenue,
      appointments: item.appointments,
    }));

  // Prepare top services data (limit to 5)
  const topServicesData = (stats.topServices || []).slice(0, 5).map((service) => ({
    name: service.serviceName.length > 20 ? service.serviceName.substring(0, 17) + '...' : service.serviceName,
    revenue: service.revenue,
  }));

  // Prepare funnel data for donut chart
  const funnelData = [
    { name: 'Scheduled', value: stats.appointmentFunnel.scheduled },
    { name: 'Confirmed', value: stats.appointmentFunnel.confirmed },
    { name: 'Completed', value: stats.appointmentFunnel.completed },
    { name: 'Cancelled', value: stats.appointmentFunnel.cancelled },
    { name: 'No Show', value: stats.appointmentFunnel.noShow },
  ].filter((item) => item.value > 0);

  // Status badge styling
  const getStatusBadge = (status: string) => {
    const base = 'px-2 py-1 text-xs rounded-full font-medium';
    switch (status.toLowerCase()) {
      case 'scheduled':
        return `${base} bg-blue-100 text-blue-800`;
      case 'confirmed':
        return `${base} bg-green-100 text-green-800`;
      case 'completed':
        return `${base} bg-emerald-100 text-emerald-800`;
      case 'cancelled':
        return `${base} bg-red-100 text-red-800`;
      case 'noshow':
        return `${base} bg-gray-100 text-gray-800`;
      default:
        return `${base} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Revenue This Month</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{formatCurrency(stats.kpis.revenueThisMonth)}</p>
            </div>
            <div className="p-3 rounded-full bg-[var(--primary-color)]/10">
              <DollarSign className="w-6 h-6 text-[var(--primary-color)]" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-sm">
            <TrendingUp className={`w-4 h-4 ${stats.kpis.revenueChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={stats.kpis.revenueChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}>
              {formatChange(stats.kpis.revenueChangePercent)}
            </span>
            <span className="text-[var(--text-tertiary)]">vs last month</span>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Appointments This Month</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.kpis.appointmentsThisMonth}</p>
            </div>
            <div className="p-3 rounded-full bg-[var(--primary-color)]/10">
              <Calendar className="w-6 h-6 text-[var(--primary-color)]" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-sm">
            <TrendingUp className={`w-4 h-4 ${stats.kpis.appointmentsChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={stats.kpis.appointmentsChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}>
              {formatChange(stats.kpis.appointmentsChangePercent)}
            </span>
            <span className="text-[var(--text-tertiary)]">vs last month</span>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">New Clients</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.kpis.newClientsThisMonth}</p>
            </div>
            <div className="p-3 rounded-full bg-[var(--primary-color)]/10">
              <Users className="w-6 h-6 text-[var(--primary-color)]" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-sm">
            <TrendingUp className={`w-4 h-4 ${stats.kpis.newClientsChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={stats.kpis.newClientsChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}>
              {formatChange(stats.kpis.newClientsChangePercent)}
            </span>
            <span className="text-[var(--text-tertiary)]">vs last month</span>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Average Ticket</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{formatCurrency(stats.kpis.averageTicket)}</p>
            </div>
            <div className="p-3 rounded-full bg-[var(--primary-color)]/10">
              <Activity className="w-6 h-6 text-[var(--primary-color)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Revenue Line Chart */}
        <div className="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--border-color)]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Daily Revenue</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setChartDays(7)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  chartDays === 7
                    ? 'bg-[var(--primary-color)] text-white'
                    : 'bg-[var(--card-secondary-bg)] text-[var(--text-secondary)] hover:bg-[var(--card-hover-bg)]'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setChartDays(30)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  chartDays === 30
                    ? 'bg-[var(--primary-color)] text-white'
                    : 'bg-[var(--card-secondary-bg)] text-[var(--text-secondary)] hover:bg-[var(--card-hover-bg)]'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)' }} />
              <YAxis tickFormatter={(val) => `₱${val}`} tick={{ fill: 'var(--text-secondary)' }} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke={COLORS.primary} strokeWidth={2} dot={{ r: 4 }} name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Services Bar Chart */}
        <div className="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--border-color)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Top Services (Revenue)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topServicesData} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis type="number" tickFormatter={(val) => `₱${val}`} tick={{ fill: 'var(--text-secondary)' }} />
              <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text-secondary)' }} width={80} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }} />
              <Bar dataKey="revenue" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Row: Donut Chart + Recent Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Funnel (Donut Chart) */}
        <div className="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--border-color)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Appointment Funnel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={funnelData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => value} contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {funnelData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: DONUT_COLORS[idx % DONUT_COLORS.length] }} />
                <span className="text-xs text-[var(--text-secondary)]">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Appointments Table */}
        <div className="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--border-color)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Recent Appointments</h3>
          {recentAppointments.length === 0 ? (
            <div className="text-center py-8 text-[var(--text-tertiary)]">No appointments found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-[var(--text-secondary)] border-b border-[var(--border-color)]">
                  <tr>
                    <th className="text-left py-2 px-2">Client</th>
                    <th className="text-left py-2 px-2">Treatment</th>
                    <th className="text-left py-2 px-2">Date & Time</th>
                    <th className="text-left py-2 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAppointments.map((apt) => (
                    <tr key={apt.id} className="border-b border-[var(--border-color)] hover:bg-[var(--card-hover-bg)] transition-colors">
                      <td className="py-2 px-2 text-[var(--text-primary)]">{apt.clientName}</td>
                      <td className="py-2 px-2 text-[var(--text-secondary)]">{apt.treatmentName}</td>
                      <td className="py-2 px-2 text-[var(--text-secondary)]">
                        {new Date(apt.appointmentDateTime).toLocaleString()}
                      </td>
                      <td className="py-2 px-2">
                        <span className={getStatusBadge(apt.status)}>{apt.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
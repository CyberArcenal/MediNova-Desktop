// src/renderer/pages/reports/revenue/components/DataTable.tsx
import React from 'react';

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (item: T) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(value);
};

const formatPercent = (value: number) => {
  return `${value.toFixed(1)}%`;
};

function DataTable<T>({ data, columns, title }: DataTableProps<T>) {
  if (!data.length) {
    return (
      <div className="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--border-color)]">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">{title}</h3>
        <div className="text-center py-8 text-[var(--text-tertiary)]">No data available</div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--border-color)]">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--card-secondary-bg)] border-b border-[var(--border-color)]">
            <tr>
              {columns.map(col => (
                <th key={String(col.key)} className={`py-2 px-3 text-${col.align || 'left'} font-semibold text-[var(--text-secondary)]`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx} className="border-b border-[var(--border-color)] hover:bg-[var(--card-hover-bg)]">
                {columns.map(col => (
                  <td key={String(col.key)} className={`py-2 px-3 text-${col.align || 'left'} text-[var(--text-primary)]`}>
                    {col.render ? col.render(item) : (item[col.key] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
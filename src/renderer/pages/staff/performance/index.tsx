// src/renderer/pages/staff/performance/index.tsx
import React from "react";

import { useStaffPerformance } from "./hooks/useStaffPerformance";
import PerformanceTable from "./components/PerformanceTable";
import DatePicker from "react-datepicker";
import Button from "../../../components/UI/Button";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";

const StaffPerformancePage: React.FC = () => {
  const {
    performanceData,
    loading,
    fromDate,
    toDate,
    setFromDate,
    setToDate,
    resetDates,
    refetch,
  } = useStaffPerformance();

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Staff Performance
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Completed appointments, revenue, and utilization rate by staff member
        </p>
      </div>

      {/* Date Range Filter */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-secondary)]">From:</span>
          <DatePicker
            selected={fromDate}
            onChange={(date: any) => setFromDate(date || new Date())}
            dateFormat="yyyy-MM-dd"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-secondary)]">To:</span>
          <DatePicker
            selected={toDate}
            onChange={(date: any) => setToDate(date || new Date())}
            dateFormat="yyyy-MM-dd"
          />
        </div>
        <Button variant="primary" size="sm" onClick={refetch}>
          Apply
        </Button>
        <Button variant="secondary" size="sm" onClick={resetDates}>
          Reset to Current Month
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="medium" />
        </div>
      ) : (
        <PerformanceTable data={performanceData} />
      )}
    </div>
  );
};

export default StaffPerformancePage;

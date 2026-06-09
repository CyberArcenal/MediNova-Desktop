import React from "react";

interface ReportTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

const reportOptions = [
  { value: "revenue", label: "Revenue Report" },
  { value: "appointments", label: "Appointments Report" },
  { value: "clients", label: "Client Retention Report" },
];

const ReportTypeSelect: React.FC<ReportTypeSelectProps> = ({
  value,
  onChange,
  disabled = false,
  className = "",
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] ${className}`}
      style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text-primary)" }}
    >
      {reportOptions.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
};

export default ReportTypeSelect;
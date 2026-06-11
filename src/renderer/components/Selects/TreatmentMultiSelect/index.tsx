// src/renderer/components/Selects/TreatmentMultiSelect/index.tsx
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import treatmentsAPI, { type TreatmentResponseDto } from '../../../api/core/treatments';

interface TreatmentOption {
  value: number;
  label: string;
  price: number;
}

interface TreatmentMultiSelectProps {
  value: number[];
  onChange: (treatmentIds: number[]) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const TreatmentMultiSelect: React.FC<TreatmentMultiSelectProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = 'Select treatments...',
  className = '',
}) => {
  const [options, setOptions] = useState<TreatmentOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTreatments = async () => {
      setLoading(true);
      try {
        const result = await treatmentsAPI.getAll(1, 1000); // load all active treatments
        const opts = result.items
          .filter(t => t.isActive)
          .map(t => ({ value: t.id, label: `${t.name} (₱${t.price})`, price: t.price }));
        setOptions(opts);
      } catch (error) {
        console.error('Failed to load treatments', error);
      } finally {
        setLoading(false);
      }
    };
    loadTreatments();
  }, []);

  const selectedOptions = options.filter(opt => value.includes(opt.value));

  const handleChange = (selected: readonly TreatmentOption[] | null) => {
    onChange(selected ? selected.map(s => s.value) : []);
  };

  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: 'var(--input-bg)',
      borderColor: 'var(--input-border)',
      boxShadow: state.isFocused ? '0 0 0 1px var(--primary-color)' : 'none',
      '&:hover': { borderColor: 'var(--primary-color)' },
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: 'var(--card-bg)',
      zIndex: 9999,
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? 'var(--card-hover-bg)' : 'var(--card-bg)',
      color: 'var(--text-primary)',
      cursor: 'pointer',
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: 'var(--primary-color)',
      borderRadius: '4px',
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: 'white',
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: 'white',
      ':hover': { backgroundColor: 'var(--primary-hover)', color: 'white' },
    }),
    placeholder: (base: any) => ({ ...base, color: 'var(--text-tertiary)' }),
    input: (base: any) => ({ ...base, color: 'var(--text-primary)' }),
  };

  return (
    <Select
      isMulti
      options={options}
      value={selectedOptions}
      onChange={handleChange as any}
      isLoading={loading}
      isDisabled={disabled}
      placeholder={placeholder}
      styles={customStyles}
      className={className}
      classNamePrefix="react-select"
    />
  );
};

export default TreatmentMultiSelect;
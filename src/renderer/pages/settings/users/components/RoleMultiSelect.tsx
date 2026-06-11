// src/renderer/pages/settings/users/components/RoleMultiSelect.tsx
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import rolesAPI from '../../../../api/core/roles';

interface RoleOption {
  value: number;
  label: string;
}

interface RoleMultiSelectProps {
  value: number[];
  onChange: (roleIds: number[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

const RoleMultiSelect: React.FC<RoleMultiSelectProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = 'Select roles...',
}) => {
  const [options, setOptions] = useState<RoleOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadRoles = async () => {
      setLoading(true);
      try {
        const roles = await rolesAPI.getAll();
        setOptions(roles.map(r => ({ value: r.id, label: r.name })));
      } catch (error) {
        console.error('Failed to load roles', error);
      } finally {
        setLoading(false);
      }
    };
    loadRoles();
  }, []);

  const selectedOptions = options.filter(opt => value.includes(opt.value));

  const handleChange = (selected: readonly RoleOption[] | null) => {
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
      classNamePrefix="react-select"
    />
  );
};

export default RoleMultiSelect;
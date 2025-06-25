"use client";

import * as React from "react";
import Select from "react-select";

export interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  defaultValue?: string[];
  placeholder?: string;
  maxCount?: number;
  className?: string;
  disabled?: boolean;
  error?: boolean;
}

export function MultiSelectDropdown({ 
  options,
  value = [],
  onValueChange,
  defaultValue = [],
  placeholder = "Select options...",
  maxCount = 3,
  className = "",
  disabled = false,
  error = false
}: MultiSelectProps) {
  
  // Convert string array to react-select format
  const selectedOptions = options.filter(option => 
    value.includes(option.value)
  );

  // Convert react-select format back to string array
  const handleChange = (selected: any) => {
    const selectedValues = selected ? selected.map((option: Option) => option.value) : [];
    onValueChange?.(selectedValues);
  };

  // Custom styles to match your theme
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: '44px',
      border: error ? '1px solid #ef4444' : state.isFocused ? '1px solid var(--base)' : '1px solid #d1d5db',
      borderRadius: '8px',
      boxShadow: state.isFocused ? '0 0 0 1px var(--base)' : 'none',
      backgroundColor: disabled ? '#f3f4f6' : '#ffffff',
      '&:hover': {
        border: error ? '1px solid #ef4444' : '1px solid var(--base)',
      },
      transition: 'all 0.2s ease',
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: '#f3f4f6',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      padding: '2px',
      margin: '2px',
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: '#374151',
      fontSize: '14px',
      fontWeight: '500',
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: '#6b7280',
      '&:hover': {
        backgroundColor: '#d1d5db',
        color: '#374151',
      },
      borderRadius: '50%',
      padding: '2px',
    }),
    menu: (provided: any) => ({
      ...provided,
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      zIndex: 9999,
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? 'var(--base)' 
        : state.isFocused 
        ? '#f3f4f6' 
        : '#ffffff',
      color: state.isSelected ? '#ffffff' : '#374151',
      padding: '8px 12px',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: state.isSelected ? 'var(--base)' : '#f3f4f6',
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#6b7280',
      fontSize: '14px',
    }),
    input: (provided: any) => ({
      ...provided,
      color: '#000000',
      fontSize: '14px',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#000000',
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '8px 12px',
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      color: '#6b7280',
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      backgroundColor: '#e5e7eb',
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: '#6b7280',
      '&:hover': {
        color: '#374151',
      },
    }),
    clearIndicator: (provided: any) => ({
      ...provided,
      color: '#6b7280',
      '&:hover': {
        color: '#374151',
      },
    }),
  };

  return (
    <div className={className}>
      <Select
        isMulti
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        placeholder={placeholder}
        isDisabled={disabled}
        styles={customStyles}
        className="react-select-container"
        classNamePrefix="react-select"
        menuPlacement="bottom"
        menuPosition="absolute"
        maxMenuHeight={200}
        closeMenuOnSelect={false}
        hideSelectedOptions={true}
        isClearable={true}
        isSearchable={true}
        noOptionsMessage={() => "No options available"}
        loadingMessage={() => "Loading..."}
      />
    </div>
  );
} 
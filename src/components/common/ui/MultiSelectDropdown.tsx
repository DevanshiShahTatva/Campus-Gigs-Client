import React from "react";
import Select from "react-select";

export type MultiSelectOption = { id: string | number; label: string };

interface MultiSelectDropdownProps {
  options: MultiSelectOption[];
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

const toReactSelectOptions = (options: MultiSelectOption[]) =>
  options.map((opt) => ({ value: opt.id, label: opt.label }));

const fromReactSelectValue = (selected: any[]): (string | number)[] =>
  selected ? selected.map((item) => item.value) : [];

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = "Select...",
  disabled = false,
}) => {
  const reactSelectOptions = toReactSelectOptions(options);
  const selectedOptions = reactSelectOptions.filter((opt) => value.includes(opt.value));

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <Select
        isMulti
        isDisabled={disabled}
        options={reactSelectOptions}
        value={selectedOptions}
        onChange={(selected) => onChange(fromReactSelectValue(selected as any[]))}
        placeholder={placeholder}
        classNamePrefix="react-select"
        className="react-select-container"
        menuPortalTarget={typeof window !== "undefined" ? document.body : null}
        menuPosition="fixed"
        closeMenuOnSelect={false}
        styles={{
          control: (base) => ({
            ...base,
            minHeight: '43px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            boxShadow: 'none',
            '&:hover': { borderColor: '#3b82f6' },
          }),
          menuList: (base) => ({
            ...base,
            maxHeight: '150px',
            overflowY: 'auto',
            borderRadius: '8px',
          }),
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
            pointerEvents: 'auto',
          }),
          option: (base, state) => ({
            ...base,
            padding: '5px 8px',
            color: '#111827',
            cursor: 'pointer',
            backgroundColor: state.isFocused ? '#f3f4f6' : 'white',
          }),
          placeholder: (base) => ({
            ...base,
            color: '#9ca3af',
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: '#e0e7ef',
            borderRadius: '6px',
            padding: '2px 6px',
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: '#1e293b',
            fontWeight: 500,
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: '#64748b',
            ':hover': { backgroundColor: '#f87171', color: 'white' },
          }),
        }}
      />
    </div>
  );
};

export default MultiSelectDropdown; 
import { Field } from 'formik';
import { FaCheckCircle } from 'react-icons/fa';

interface BaseCheckboxCardProps {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  name?: string;
  value?: string;
}

// For single checkbox (like isPro, canGetBadges, mostPopular)
interface SingleCheckboxCardProps extends Omit<BaseCheckboxCardProps, 'value'> {
  name: string;
  value?: never;
}

// For multiple checkboxes (like rolesAllowed)
interface MultipleCheckboxCardProps extends BaseCheckboxCardProps {
  name: string;
  value: string;
}

type CheckboxCardProps = SingleCheckboxCardProps | MultipleCheckboxCardProps;

const CheckboxCard: React.FC<CheckboxCardProps> = ({
  name,
  value,
  label,
  checked,
  onChange,
  className = '',
}) => {
  const isMultiple = value !== undefined;
  
  return (
    <label
      className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer
        transition-all duration-200 ease-in-out
        ${
          checked
            ? 'border-[var(--base)] bg-[var(--base)]/10'
            : 'border-gray-200 hover:border-[var(--base-hover)]/50 hover:bg-gray-50/50'
        } ${className}`}
    >
      <Field
        type={isMultiple ? 'checkbox' : 'checkbox'}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div
        className={`w-5 h-5 border rounded-md flex items-center justify-center transition-all duration-200
          ${checked ? 'border-[var(--base)] bg-[var(--base)]' : 'border-gray-300 bg-white'}`}
      >
        {checked && <FaCheckCircle className="w-3 h-3 text-white" />}
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </label>
  );
};

export default CheckboxCard;

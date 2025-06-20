import { Field } from "formik";
import { cn } from "@/utils/constant";

interface RadioCardProps {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  description?: string;
}

const RadioCard: React.FC<RadioCardProps> = ({ name, value, label, checked, onChange, className = "", description }) => {
  return (
    <label
      className={cn(
        `flex items-start gap-3 p-4 border rounded-xl cursor-pointer
        transition-all duration-200 ease-in-out
        ${checked ? "border-[var(--base)] bg-[var(--base)]/10" : "border-gray-200 hover:border-[var(--base-hover)]/50 hover:bg-gray-50/50"}`,
        className
      )}
    >
      <div className="flex items-start gap-3 w-full">
        <div className="flex-shrink-0 mt-0.5">
          <Field type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
          <div
            className={`w-5 h-5 border rounded-full flex items-center justify-center transition-all duration-200
              ${checked ? "border-[var(--base)] bg-[var(--base)]" : "border-gray-300 bg-white"}`}
          >
            {checked && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
          </div>
        </div>
        <div className="flex-1">
          <span className="block text-sm font-medium text-gray-900">{label}</span>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
      </div>
    </label>
  );
};

export default RadioCard;

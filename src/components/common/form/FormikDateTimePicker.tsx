import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useField } from "formik";
import { CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";

interface Props {
  name: string;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  enableTimeSelect?: boolean;
}

const FormikDateTimePicker: React.FC<Props> = ({
  name,
  label,
  disabled,
  placeholder,
  enableTimeSelect = false,
}) => {
  const [field, meta, helpers] = useField(name);
  const { setValue } = helpers;

  return (
    <div className="space-y-2">
      {label && (
        <Label>
          {label}
          <span className="text-destructive ml-1">*</span>
        </Label>
      )}
      <div className="relative">
        <DatePicker
          selected={field.value ? new Date(field.value) : null}
          onChange={(date) => setValue(date)}
          showTimeSelect={enableTimeSelect}
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="Time"
          dateFormat={
            enableTimeSelect ? "MMMM d, yyyy h:mm aa" : "MMMM d, yyyy"
          }
          placeholderText={placeholder}
          disabled={disabled}
          className={`w-full pr-10 px-4 border text-black disabled:bg-gray-100 disabled:text-gray-500 border-gray-300 rounded-lg h-11 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--base)] focus:border-[var(--base)] ${
            meta.touched && meta.error ? "border-destructive" : ""
          }`}
        />
        <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
      </div>
      {meta.touched && meta.error && (
        <div className="text-sm text-destructive">{meta.error}</div>
      )}
    </div>
  );
};

export default FormikDateTimePicker;

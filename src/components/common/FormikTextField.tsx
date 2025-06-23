"use client";
import React from "react";
import { Field, ErrorMessage, useField } from "formik";
import { cn } from "@/utils/constant";

interface FormikTextFieldProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  endIcon?: React.ReactNode;
  readOnly?: boolean;
  disabled?: boolean;
  rows?: number;
  min?: number;
  step?: number;
  className?: string;
  onChange?: (e: React.ChangeEvent<any>) => void;
}

const FormikTextField: React.FC<FormikTextFieldProps> = ({
  name,
  label = "",
  type = "text",
  placeholder = "",
  maxLength,
  endIcon,
  readOnly = false,
  disabled = false,
  rows,
  min,
  step,
  className,
  onChange
}) => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <Field
          {...field}
          id={name}
          type={type}
          name={name}
          rows={rows}
          readOnly={readOnly}
          disabled={disabled}
          maxLength={maxLength}
          min={type === "number" ? min : undefined}
          step={type === "number" ? step : undefined}
          placeholder={placeholder}
          as={type === "textarea" ? "textarea" : undefined}
          onChange={(e: React.ChangeEvent<any>) => {
            field.onChange(e);
            if (onChange) onChange(e);
          }}
          className={cn(
            `
            w-full px-4 border text-black disabled:bg-gray-100 disabled:text-gray-500
            ${
              hasError
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-[var(--base)] focus:border-[var(--base)]"
            }
            rounded-lg focus:outline-none focus:ring-1 outline-none transition-all no-spinner
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
            ${type === "textarea" ? "min-h-[44px] py-2 resize-vertical" : "h-11 py-2"}
            `,
            className
          )}
        />
        {endIcon && <div className="absolute right-3 top-[60%] transform -translate-y-[60%]">{endIcon}</div>}
      </div>
      <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1 whitespace-pre-line" />
    </div>
  );
};

export default FormikTextField;

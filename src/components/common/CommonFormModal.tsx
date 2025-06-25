import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/common/ui/Button";
import FormikTextField from "./FormikTextField";
import RadioCard from "./RadioCard";
import CheckboxCard from "./CheckboxCard";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelectDropdown } from "./ui/MultiSelectDropdown";

export type FieldOption = { id: string | number; label: string };
type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "multiselect"
  | "checkbox"
  | "radio";

export interface CommonFormField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: FieldOption[];
  placeholder?: string;
  defaultValue?: any;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  minItems?: number;
  maxItems?: number;
}

export interface CommonFormModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  fields: CommonFormField[];
  onSubmit: (values: Record<string, any>) => void | Promise<void>;
  submitLabel?: string;
  initialValues?: Record<string, any>;
  width?: string | number;
}

function getYupSchema(fields: CommonFormField[]) {
  const shape: Record<string, any> = {};
  fields.forEach((field) => {
    let validator: any;
    const label = field.label || field.name;
    switch (field.type) {
      case "text":
      case "textarea": {
        validator = Yup.string();
        if (field.required) {
          validator = validator.required(`${label} is required`);
        }
        if (field.minLength) {
          validator = validator.min(
            field.minLength,
            `${label} must be at least ${field.minLength} characters`
          );
        }
        if (field.maxLength) {
          validator = validator.max(
            field.maxLength,
            `${label} must be at most ${field.maxLength} characters`
          );
        }
        break;
      }
      case "number": {
        validator = Yup.number().typeError(`${label} must be a number`);
        if (field.required) {
          validator = validator.required(`${label} is required`);
        }
        if (field.min !== undefined) {
          validator = validator.min(
            field.min,
            `${label} must be at least ${field.min}`
          );
        }
        if (field.max !== undefined) {
          validator = validator.max(
            field.max,
            `${label} must be at most ${field.max}`
          );
        }
        break;
      }
      case "select":
      case "radio": {
        validator = Yup.string();
        if (field.required) {
          validator = validator.required(`Please select a ${label}`);
        }
        break;
      }
      case "multiselect": {
        validator = Yup.array().of(Yup.string());
        if (field.required) {
          validator = validator.min(1, `Please select at least one ${label}`);
        }
        if (field.minItems) {
          validator = validator.min(
            field.minItems,
            `Select at least ${field.minItems} ${label}`
          );
        }
        if (field.maxItems) {
          validator = validator.max(
            field.maxItems,
            `Select at most ${field.maxItems} ${label}`
          );
        }
        break;
      }
      case "checkbox": {
        validator = Yup.boolean();
        if (field.required) {
          validator = validator.oneOf([true], `You must check ${label}`);
        }
        break;
      }
      default:
        validator = Yup.mixed();
    }
    shape[field.name] = validator;
  });
  return Yup.object().shape(shape);
}

const CommonFormModal: React.FC<CommonFormModalProps> = ({
  open,
  setOpen,
  title = "Form",
  fields,
  onSubmit,
  submitLabel = "Submit",
  initialValues,
  width = "32rem",
}) => {
  const defaultInitials: Record<string, any> = {};
  fields.forEach((f) => {
    if (initialValues && initialValues[f.name] !== undefined) {
      defaultInitials[f.name] = initialValues[f.name];
    } else if (f.defaultValue !== undefined) {
      defaultInitials[f.name] = f.defaultValue;
    } else if (f.type === "checkbox") {
      defaultInitials[f.name] = false;
    } else if (f.type === "multiselect") {
      defaultInitials[f.name] = [];
    } else {
      defaultInitials[f.name] = "";
    }
  });

  const validationSchema = getYupSchema(fields);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          maxWidth: "90vw",
          minHeight: 360,
          maxHeight: "90vh",
          padding: 0,
          display: "flex",
          flexDirection: "column",
          borderRadius: "0.75rem",
        }}
        className="p-0"
      >
        <div className="px-6 py-5 border-b bg-background rounded-t-[0.75rem]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        </div>
        <div className="flex-1 overflow-y-auto px-6">
          <Formik
            initialValues={defaultInitials}
            validationSchema={validationSchema}
            onSubmit={async (values, actions) => {
              await onSubmit(values);
              setOpen(false);
              actions.setSubmitting(false);
            }}
          >
            {({ values, setFieldValue, errors, touched }) => (
              <Form className="space-y-4" id="form-modal">
                {fields.map((field) => {
                  const options: FieldOption[] = field.options || [];
                  const error = errors[field.name];
                  const isTouched = touched[field.name];
                  switch (field.type) {
                    case "text":
                    case "number":
                    case "textarea":
                      return (
                        <FormikTextField
                          key={field.name}
                          name={field.name}
                          label={field.label}
                          type={
                            field.type === "textarea" ? "textarea" : field.type
                          }
                          placeholder={field.placeholder}
                          rows={field.type === "textarea" ? 4 : undefined}
                        />
                      );
                    case "select":
                      return (
                        <div key={field.name} className="w-full">
                          <label
                            className="block text-sm font-medium mb-1"
                            htmlFor={field.name}
                          >
                            {field.label}
                          </label>
                          <Select
                            value={values[field.name]}
                            onValueChange={(val) =>
                              setFieldValue(field.name, val)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={
                                  field.placeholder || `Select ${field.label}`
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {options.map((opt) => (
                                <SelectItem key={opt.id} value={String(opt.id)}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    case "multiselect":
                      return (
                        <div key={field.name} className="w-full">
                          <label className="block text-sm font-medium mb-1">
                            {field.label}
                            {field.required && (
                              <span className="text-red-500">*</span>
                            )}
                          </label>
                          <MultiSelectDropdown
                            options={
                              field.options?.map((opt) => ({
                                value: String(opt.id),
                                label: opt.label,
                              })) || []
                            }
                            value={(values[field.name] || []).map(String)}
                            onValueChange={(val) => setFieldValue(field.name, val)}
                            placeholder={field.placeholder}
                            className="mt-1"
                            error={Boolean(isTouched && error)}
                          />
                          {isTouched && error && (
                            <div className="text-red-500 text-xs mt-1">{String(error)}</div>
                          )}
                        </div>
                      );
                    case "checkbox":
                      return (
                        <CheckboxCard
                          key={field.name}
                          name={field.name}
                          label={field.label}
                          checked={!!values[field.name]}
                          onChange={(e) =>
                            setFieldValue(field.name, e.target.checked)
                          }
                        />
                      );
                    case "radio":
                      return (
                        <div key={field.name} className="w-full">
                          <label
                            className="block text-sm font-medium mb-1"
                            htmlFor={field.name}
                          >
                            {field.label}
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {options.map((opt) => (
                              <RadioCard
                                key={opt.id}
                                name={field.name}
                                value={String(opt.id)}
                                label={opt.label}
                                checked={values[field.name] === String(opt.id)}
                                onChange={() =>
                                  setFieldValue(field.name, String(opt.id))
                                }
                              />
                            ))}
                          </div>
                        </div>
                      );
                    default:
                      return null;
                  }
                })}
              </Form>
            )}
          </Formik>
        </div>
        <div className="p-4 border-t bg-background rounded-b-[0.75rem]">
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" form="form-modal">
              {submitLabel}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommonFormModal;

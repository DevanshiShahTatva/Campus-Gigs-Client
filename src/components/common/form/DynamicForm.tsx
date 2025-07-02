"use client";
import React, { useState } from "react";
import { Formik, Form, FormikValues } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import FormikTextField from "../FormikTextField";
import { MultiSelectDropdown } from "../ui/MultiSelectDropdown";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import CircularProgress from "../Loader";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import FileUpload from "./FileUpload";
import FormikDateTimePicker from "./FormikDateTimePicker";

export type FormSubFieldConfig = {
  id: string;
  name: string;
  label?: string;
  required?: boolean;
  type:
    | "text"
    | "number"
    | "textarea"
    | "select"
    | "multiselect"
    | "checkbox"
    | "array"
    | "tags"
    | "fileupload"
    | "datetime";
  placeholder?: string;
  errorMessage?: string;
  options?: { id: string; label: string }[];
  minItems?: number;
  maxItems?: number;
  disabled?: boolean;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  enableTimeSelect?: boolean;
  minDate?: Date;
  maxDate?: Date;
  isMultiselectDataLoading?: boolean;
};

export type FormFieldConfig = {
  title: string;
  description?: string;
  groupSize: 1 | 2;
  section: boolean;
  subfields: FormSubFieldConfig[];
};

interface DynamicFormProps {
  formConfig: FormFieldConfig[];
  onSubmit: (values: any) => void;
  initialValues: FormikValues;
  isViewMode?: boolean;
  onFieldChange?: (fieldName: string, value: any) => void;
}

interface InnerFormProps {
  formik: any;
  formConfig: FormFieldConfig[];
  isViewMode?: boolean;
  onFieldChange?: (fieldName: string, value: any) => void;
}

const DynamicForm = ({
  formConfig,
  onSubmit,
  initialValues,
  isViewMode,
  onFieldChange,
}: DynamicFormProps) => {
  const validationSchema = formConfig.reduce((acc: any, field) => {
    field.subfields.forEach((subfield) => {
      if (subfield.required) {
        let validator;
        const label = subfield.label || subfield.name;

        switch (subfield.type) {
          case "number":
            validator = Yup.number()
              .typeError(`${label} must be a number`)
              .min(1);
            break;
          case "checkbox":
            validator = Yup.boolean();
            break;
          case "array":
            validator = Yup.array().of(Yup.string());
            if (subfield.minItems) {
              validator = validator.min(
                subfield.minItems,
                `At least ${subfield.minItems} items required`
              );
            }
            if (subfield.maxItems) {
              validator = validator.max(
                subfield.maxItems,
                `Maximum ${subfield.maxItems} items allowed`
              );
            }
            break;
          case "tags":
            validator = Yup.array();
            if (subfield.required) {
              validator = validator.min(1, `At least one tag is required`);
            }
            if (subfield.minItems) {
              validator = validator.min(
                subfield.minItems,
                `At least ${subfield.minItems} tags required`
              );
            }
            if (subfield.maxItems) {
              validator = validator.max(
                subfield.maxItems,
                `Maximum ${subfield.maxItems} tags allowed`
              );
            }
            break;
          case "multiselect":
            validator = Yup.array().of(Yup.string());
            if (subfield.required) {
              validator = validator.min(
                1,
                `Please select at least one ${label}`
              );
            }
            break;
          case "fileupload":
            validator = Yup.array();
            if (subfield.required) {
              validator = validator.min(1, `At least one file is required`);
            }
            if (subfield.minItems) {
              validator = validator.min(
                subfield.minItems,
                `At least ${subfield.minItems} files required`
              );
            }
            if (subfield.maxItems) {
              validator = validator.max(
                subfield.maxItems,
                `Maximum ${subfield.maxItems} files allowed`
              );
            }
            break;
          case "datetime":
            validator = Yup.date().typeError(`${label} must be a valid date`);
            break;
          default:
            validator = Yup.string();
        }

        if (subfield.required) {
          validator = validator.required(
            subfield.errorMessage || `${label} is required`
          );
        }

        acc[subfield.name] = validator;
      }
    });
    return acc;
  }, {});

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object().shape(validationSchema)}
      onSubmit={async (values, formikHelpers) => {
        formikHelpers.setSubmitting(true);
        const errors = await formikHelpers.validateForm();
        if (Object.keys(errors).length > 0) {
          formikHelpers.setTouched(
            Object.keys(errors).reduce(
              (acc, key) => ({ ...acc, [key]: true }),
              {}
            )
          );
          formikHelpers.setSubmitting(false);
          return;
        }

        await onSubmit(values);
        formikHelpers.setSubmitting(false);
      }}
      enableReinitialize
    >
      {(formik) => (
        <InnerForm
          formik={formik}
          formConfig={formConfig}
          isViewMode={isViewMode}
          onFieldChange={onFieldChange}
        />
      )}
    </Formik>
  );
};

const InnerForm = ({
  formik,
  formConfig,
  isViewMode,
  onFieldChange,
}: InnerFormProps) => {
  const [tagInputs, setTagInputs] = useState<Record<string, string>>({});
  const { values, errors, touched, setFieldValue, handleSubmit } = formik;

  const wrappedSetFieldValue = (name: string, value: any) => {
    formik.setFieldValue(name, value);
    if (onFieldChange) {
      onFieldChange(name, value);
    }
  };

  const handleAddTag = (fieldName: string) => {
    const inputValue = tagInputs[fieldName]?.trim() || "";
    if (inputValue) {
      const currentTags = values[fieldName] || [];
      if (!currentTags.includes(inputValue)) {
        const newTags = [...currentTags, inputValue];
        setFieldValue(fieldName, newTags);
        setTagInputs((prev) => ({ ...prev, [fieldName]: "" }));
      }
    }
  };

  const handleRemoveTag = (fieldName: string, tagToRemove: string) => {
    const currentTags = values[fieldName] || [];
    const newTags = currentTags.filter((tag: string) => tag !== tagToRemove);
    setFieldValue(fieldName, newTags);
  };

  const renderField = (field: FormSubFieldConfig) => {
    const isDisabled = field.disabled || isViewMode;
    const value = values[field.name];

    switch (field.type) {
      case "text":
      case "number":
      case "textarea":
        return (
          <FormikTextField
            key={field.id}
            name={field.name}
            label={field.label || ""}
            isRequired={field.required}
            type={field.type}
            placeholder={field.placeholder}
            disabled={isDisabled}
          />
        );

      case "select":
        return (
          <div key={field.id} className="space-y-2">
            {field.label && (
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </label>
            )}
            <Select
              value={value}
              onValueChange={(val) => wrappedSetFieldValue(field.name, val)}
              disabled={isDisabled}
            >
              <SelectTrigger
                className={
                  formik.submitCount > 0 && errors[field.name]
                    ? "border-destructive"
                    : ""
                }
              >
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.submitCount > 0 && errors[field.name] && (
              <div className="text-sm text-destructive">
                {String(errors[field.name])}
              </div>
            )}
          </div>
        );

      case "multiselect":
        return (
          <div key={field.id} className="space-y-2">
            {field.label && (
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </label>
            )}
            <MultiSelectDropdown
              options={(field.options || []).map((opt) => ({
                id: opt.id,
                label: opt.label,
              }))}
              value={value || []}
              onValueChange={(val) => wrappedSetFieldValue(field.name, val)}
              placeholder={field.placeholder}
              disabled={isDisabled}
              loading={field.isMultiselectDataLoading}
              error={!!(formik.submitCount > 0 && errors[field.name])}
            />
            {formik.submitCount > 0 && errors[field.name] && (
              <div className="text-sm text-destructive">
                {String(errors[field.name])}
              </div>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div key={field.id} className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              name={field.name}
              checked={value}
              onCheckedChange={(checked) => setFieldValue(field.name, checked)}
              disabled={isDisabled}
            />
            {field.label && (
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </label>
            )}
          </div>
        );

      case "array":
        return (
          <div key={field.id} className="space-y-3">
            {field.label && (
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </label>
            )}

            {(value || []).map((item: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  value={item}
                  onChange={(e) => {
                    const newItems = [...value];
                    newItems[index] = e.target.value;
                    setFieldValue(field.name, newItems);
                  }}
                  placeholder={field.placeholder}
                  disabled={isDisabled}
                  className="w-full px-4 border text-black disabled:bg-gray-100 disabled:text-gray-500 border-gray-300 rounded-lg h-11 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--base)] focus:border-[var(--base)]"
                />
                {value.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newItems = value.filter(
                        (_: any, i: number) => i !== index
                      );
                      setFieldValue(field.name, newItems);
                    }}
                    disabled={isDisabled}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setFieldValue(field.name, [...(value || []), ""]);
              }}
              className="flex items-center space-x-2"
              disabled={isDisabled}
            >
              <Plus className="w-4 h-4" />
              <span>Add {field.label || "Item"}</span>
            </Button>
          </div>
        );

      case "tags":
        return (
          <div key={field.id} className="space-y-2">
            {field.label && (
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </label>
            )}

            <div className="flex items-center space-x-2">
              <input
                value={tagInputs[field.name] || ""}
                onChange={(e) =>
                  setTagInputs((prev) => ({
                    ...prev,
                    [field.name]: e.target.value,
                  }))
                }
                placeholder={field.placeholder}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag(field.name);
                  }
                }}
                disabled={isDisabled}
                className="w-full px-4 border text-black disabled:bg-gray-100 disabled:text-gray-500 border-gray-300 rounded-lg h-11 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--base)] focus:border-[var(--base)]"
              />
              <Button
                type="button"
                onClick={() => handleAddTag(field.name)}
                disabled={isDisabled}
              >
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {(value || []).map((tag: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(field.name, tag)}
                    className="ml-1 hover:text-destructive"
                    disabled={isDisabled}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        );

      case "fileupload":
        return (
          <div key={field.id} className="space-y-2">
            {field.label && (
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </label>
            )}
            <FileUpload
              value={value || []}
              onChange={(files) => setFieldValue(field.name, files)}
              multiple={field.multiple}
              accept={field.accept}
              maxSize={field.maxSize}
              disabled={isDisabled}
              placeholder={field.placeholder}
            />
            {formik.submitCount > 0 && errors[field.name] && (
              <div className="text-sm text-destructive">
                {String(errors[field.name])}
              </div>
            )}
          </div>
        );

      case "datetime":
        return (
          <FormikDateTimePicker
            key={field.id}
            name={field.name}
            label={field.label}
            disabled={isDisabled}
            placeholder={field.placeholder}
            enableTimeSelect={field.enableTimeSelect}
            minDate={field.minDate}
            maxDate={field.maxDate}
            onChange={(value) => {
              formik.setFieldValue(field.name, value);
              if (onFieldChange) {
                onFieldChange(field.name, value);
              }
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="space-y-6">
      {formConfig.map((group, index) =>
        group.section ? (
          <Card key={`group-${index}`}>
            <CardHeader>
              <CardTitle className="text-2xl">{group.title}</CardTitle>
              {group.description && (
                <CardDescription>{group.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div
                className={
                  group.groupSize === 2
                    ? "grid md:grid-cols-2 gap-4"
                    : "space-y-4"
                }
              >
                {group.subfields.map((field) => renderField(field))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div key={`group-${index}`} className="space-y-4">
            {group.title && (
              <h4 className="text-lg font-medium">{group.title}</h4>
            )}
            <div
              className={
                group.groupSize === 2
                  ? "grid md:grid-cols-2 gap-4"
                  : "space-y-4"
              }
            >
              {group.subfields.map((field) => renderField(field))}
            </div>
          </div>
        )
      )}

      <div className="flex justify-end">
        <Button
          size={"lg"}
          type="submit"
          disabled={formik.isSubmitting || isViewMode}
          className="mt-4"
        >
          {formik.isSubmitting ? <CircularProgress size={20} /> : "Submit"}
        </Button>
      </div>
    </Form>
  );
};

export default DynamicForm;

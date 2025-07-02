"use client";

import * as React from "react";
import { X, Loader2 } from "lucide-react"; // Import Loader2 for spinner

import { Badge } from "@/components/ui/badge";

type Framework = Record<"id" | "label", string>;

interface MultiSelectProps {
  options: Framework[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  defaultValue?: string[];
  placeholder?: string;
  maxCount?: number;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  loading?: boolean;
}

export function MultiSelectDropdown({
  options,
  value,
  onValueChange,
  defaultValue = [],
  placeholder = "Select options...",
  maxCount = 3,
  className = "",
  disabled = false,
  error = false,
  loading = false, // Default to false
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Framework[]>(() => {
    if (value) {
      return options.filter((option) => value.includes(option.id));
    }
    return defaultValue.length > 0
      ? options.filter((option) => defaultValue.includes(option.id))
      : [];
  });
  const [inputValue, setInputValue] = React.useState("");

  React.useEffect(() => {
    if (value) {
      setSelected(options.filter((option) => value.includes(option.id)));
    }
  }, [value, options]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open]);

  const handleUnselect = React.useCallback(
    (framework: Framework) => {
      const newSelected = selected.filter((s) => s.id !== framework.id);
      setSelected(newSelected);
      onValueChange?.(newSelected.map((s) => s.id));
    },
    [selected, onValueChange]
  );

  const handleSelect = React.useCallback(
    (framework: Framework) => {
      setInputValue("");
      const newSelected = [...selected, framework];
      setSelected(newSelected);
      onValueChange?.(newSelected.map((s) => s.id));
      inputRef.current?.focus();
    },
    [selected, onValueChange]
  );

  const selectables = options.filter(
    (framework) => !selected.some((s) => s.id === framework.id)
  );

  const filteredSelectables = selectables.filter((framework) =>
    framework.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleInputFocus = () => {
    if (!disabled) {
      setOpen(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (!open) {
      setOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && inputValue === "" && selected.length > 0) {
      const lastSelected = selected[selected.length - 1];
      handleUnselect(lastSelected);
    }
  };

  const handleBadgeRemove = (framework: Framework, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleUnselect(framework);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Changed from button to div to avoid nested button issue */}
      <div
        className={`w-full group rounded-lg border bg-background px-4 py-3 text-sm focus-within:outline-none focus-within:ring-1 focus-within:ring-[var(--base)] focus-within:border-[var(--base)] transition-all cursor-text ${
          error ? "border-red-500" : "border-gray-300"
        } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} ${
          open ? "ring-1 ring-[var(--base)] border-[var(--base)]" : ""
        }`}
        onClick={() => {
          if (!disabled) {
            inputRef.current?.focus();
            setOpen(true);
          }
        }}
      >
        <div className="flex flex-wrap items-center gap-1 min-h-[20px]">
          {selected.slice(0, maxCount).map((framework) => (
            <Badge
              key={framework.id}
              variant="secondary"
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
            >
              {framework.label}
              {/* Now this button is not nested inside another button */}
              <button
                type="button"
                className="ml-1 p-[2px] rounded-full outline-none hover:bg-gray-300 transition-colors"
                onClick={(e) => handleBadgeRemove(framework, e)}
                disabled={disabled}
              >
                <X className="h-3 w-3 text-gray-500 hover:text-gray-700 transition-colors" />
              </button>
            </Badge>
          ))}
          {selected.length > maxCount && (
            <Badge
              variant="secondary"
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
            >
              +{selected.length - maxCount} more
              <button
                type="button"
                className="ml-1 rounded-full outline-none hover:bg-gray-300 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const newSelected = selected.slice(0, maxCount);
                  setSelected(newSelected);
                  onValueChange?.(newSelected.map((s) => s.id));
                }}
                disabled={disabled}
              >
                <X className="h-3 w-3 text-gray-500 hover:text-gray-700 transition-colors" />
              </button>
            </Badge>
          )}
          <div className="flex-1 min-w-[120px] relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onKeyDown={handleKeyDown}
              placeholder={selected.length === 0 ? placeholder : ""}
              disabled={disabled}
              className="w-full bg-transparent outline-none placeholder:text-gray-500 text-black border-none shadow-none focus:ring-0 px-0 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              autoComplete="off"
            />
            {loading && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
              </div>
            )}
          </div>
        </div>
      </div>
      {open && !disabled && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
              <span className="ml-2 text-sm text-gray-500">Loading...</span>
            </div>
          ) : filteredSelectables.length > 0 ? (
            <div className="max-h-[200px] overflow-y-auto py-1">
              {filteredSelectables.map((framework) => (
                <button
                  key={framework.id}
                  type="button"
                  className="w-full flex justify-start cursor-pointer hover:bg-gray-100 px-3 py-2 text-sm transition-colors"
                  onClick={() => handleSelect(framework)}
                >
                  {framework.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-3 py-3 text-sm text-gray-500">
              {inputValue ? "No options found" : "No more options available"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import { X } from "lucide-react";
import ReactDOM from "react-dom";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from "@/components/ui/command";

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
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
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
  const [dropdownPosition, setDropdownPosition] = React.useState({
    top: 0,
    left: 0,
    width: 0,
  });

  React.useEffect(() => {
    if (value) {
      setSelected(options.filter((option) => value.includes(option.id)));
    }
  }, [value, options]);

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
    },
    [selected, onValueChange]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setSelected((prev) => {
              const newSelected = [...prev];
              newSelected.pop();
              const newIds = newSelected.map((s) => s.id);
              onValueChange?.(newIds);
              return newSelected;
            });
          }
        }
        if (e.key === "Escape") {
          input.blur();
          setOpen(false);
        }
      }
    },
    [onValueChange]
  );

  const selectables = options.filter(
    (framework) => !selected.some((s) => s.id === framework.id)
  );

  const filteredSelectables = selectables.filter((framework) =>
    framework.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  React.useLayoutEffect(() => {
    if (open && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [open]);

  const dropdownContainer =
    (typeof document !== "undefined" &&
      wrapperRef.current?.closest(".dialog-content")) ||
    (typeof window !== "undefined" && document.body);

  return (
    <div className={className}>
      <div
        ref={wrapperRef}
        className={`group rounded-lg border bg-background px-4 py-3 text-sm focus-within:outline-none focus-within:ring-1 focus-within:ring-[var(--base)] focus-within:border-[var(--base)] transition-all ${
          error ? "border-red-500" : "border-gray-300"
        } ${disabled ? "bg-gray-100" : ""}`}
      >
        <div className="flex flex-wrap items-center gap-1 min-h-[20px]">
          {selected.slice(0, maxCount).map((framework) => (
            <Badge
              key={framework.id}
              variant="secondary"
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
            >
              {framework.label}
              <button
                className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-[var(--base)] focus:ring-offset-1 hover:bg-gray-300 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleUnselect(framework);
                }}
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
                className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-[var(--base)] focus:ring-offset-1 hover:bg-gray-300 transition-colors"
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

          <div className="flex-1 min-w-[120px]">
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              placeholder={selected.length === 0 ? placeholder : ""}
              disabled={disabled}
              className="w-full bg-transparent outline-none placeholder:text-gray-500 text-black border-none shadow-none focus:ring-0 px-0 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {open && filteredSelectables.length > 0 && typeof window !== "undefined"
        ? ReactDOM.createPortal(
            <div
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                position: "absolute",
                zIndex: 9999,
                pointerEvents: "auto",
              }}
              className="rounded-lg border border-gray-200 bg-white text-gray-900 shadow-lg"
            >
              <div className="max-h-[200px] overflow-y-auto">
                {filteredSelectables.map((framework) => (
                  <div
                    key={framework.id}
                    className="cursor-pointer hover:bg-gray-100 px-3 py-2 text-sm transition-colors"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleSelect(framework)}
                  >
                    {framework.label}
                  </div>
                ))}
              </div>
            </div>,
            dropdownContainer as Element
          )
        : null}
    </div>
  );
}

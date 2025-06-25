"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

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

  return (
    <Command
      onKeyDown={handleKeyDown}
      className={`overflow-visible bg-transparent ${className}`}
    >
      <div
        className={`group rounded-lg border bg-background px-4 py-3 text-sm focus-within:outline-none focus-within:ring-1 focus-within:ring-[var(--base)] focus-within:border-[var(--base)] transition-all ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <div className="flex flex-wrap gap-1">
          {selected.slice(0, maxCount).map((framework) => {
            return (
              <Badge
                key={framework.id}
                variant="secondary"
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              >
                {framework.label}
                <button
                  className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-[var(--base)] focus:ring-offset-1 hover:bg-gray-300 transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(framework);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
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
            );
          })}
          {selected.length > maxCount && (
            <Badge
              variant="secondary"
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
            >
              +{selected.length - maxCount} more
              <button
                className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-[var(--base)] focus:ring-offset-1 hover:bg-gray-300 transition-colors"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
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
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={selected.length === 0 ? placeholder : ""}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-gray-500 text-black disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-500"
            disabled={disabled}
          />
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          {open && filteredSelectables.length > 0 ? (
            <div className="absolute top-0 z-[9999] w-full rounded-lg border border-gray-200 bg-white text-gray-900 shadow-lg outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
              <CommandGroup className="max-h-[200px] overflow-y-auto">
                {filteredSelectables.map((framework) => {
                  return (
                    <CommandItem
                      key={framework.id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => handleSelect(framework)}
                      className="cursor-pointer hover:bg-gray-100 hover:text-gray-900 aria-selected:bg-[var(--base)] aria-selected:text-white transition-colors px-3 py-2"
                    >
                      {framework.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}

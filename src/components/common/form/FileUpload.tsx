"use client";
import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  FiX,
  FiUpload,
  FiFile,
  FiImage,
  FiFileText,
  FiMusic,
  FiVideo,
  FiArchive,
} from "react-icons/fi";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  value?: File[];
  onChange?: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  value = [],
  onChange,
  multiple = false,
  accept = "*/*",
  maxSize = 10,
  disabled = false,
  placeholder = "Drop files here or click to browse",
  className,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (file: File) => {
    const type = file.type.split("/")[0];
    switch (type) {
      case "image":
        return <FiImage className="w-5 h-5 text-blue-500" />;
      case "video":
        return <FiVideo className="w-5 h-5 text-purple-500" />;
      case "audio":
        return <FiMusic className="w-5 h-5 text-green-500" />;
      case "application":
        if (
          file.type.includes("pdf") ||
          file.type.includes("document") ||
          file.type.includes("msword")
        ) {
          return <FiFileText className="w-5 h-5 text-red-500" />;
        }
        if (
          file.type.includes("zip") ||
          file.type.includes("rar") ||
          file.type.includes("tar")
        ) {
          return <FiArchive className="w-5 h-5 text-orange-500" />;
        }
        return <FiFile className="w-5 h-5 text-gray-500" />;
      default:
        return <FiFile className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }
    if (accept !== "*/*") {
      const acceptedTypes = accept.split(",").map((type) => type.trim());
      const isValidType = acceptedTypes.some((type) => {
        if (type.endsWith("/*")) {
          return file.type.startsWith(type.replace("/*", ""));
        }
        if (type.startsWith(".")) {
          return file.name.toLowerCase().endsWith(type);
        }
        return file.type === type;
      });
      if (!isValidType) {
        return `File type not allowed. Accepted types: ${accept}`;
      }
    }
    return null;
  };

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);
      const validFiles: File[] = [];
      const errors: string[] = [];

      fileArray.forEach((file) => {
        const error = validateFile(file);
        if (error) {
          errors.push(`${file.name}: ${error}`);
        } else {
          validFiles.push(file);
        }
      });

      if (errors.length > 0) {
        alert(errors.join("\n"));
      }

      if (validFiles.length > 0) {
        const newFiles = multiple ? [...value, ...validFiles] : validFiles;
        onChange?.(newFiles);
      }
    },
    [value, multiple, onChange, maxSize, accept]
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev + 1);
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragCounter((prev) => prev - 1);
      if (dragCounter <= 1) {
        // Fixed logic here
        setIsDragOver(false);
        setDragCounter(0);
      }
    },
    [dragCounter]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        e.dataTransfer.dropEffect = "copy";
      }
    },
    [disabled]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      setDragCounter(0);

      if (disabled) return;

      const files = e.dataTransfer.files;
      handleFiles(files);
    },
    [handleFiles, disabled]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange?.(newFiles);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-all duration-200",
          isDragOver && !disabled
            ? "border-primary bg-primary/5"
            : "border-gray-300",
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:border-gray-400"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <FiUpload
            className={cn(
              "w-8 h-8 mb-2",
              isDragOver && !disabled ? "text-primary" : "text-gray-400"
            )}
          />
          <p className="text-sm text-gray-600 mb-1">{placeholder}</p>
          <p className="text-xs text-gray-500">
            {accept !== "*/*"
              ? `Accepted formats: ${accept}`
              : "All file types accepted"}
            {maxSize && ` • Max size: ${maxSize}MB`}
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* File List */}
      {value.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Selected Files ({value.length})
          </h4>
          <div className="space-y-2">
            {value.map((file, index) => (
              <div
                key={`${file.name}-${file.size}-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {getFileIcon(file)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                {!disabled && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <FiX className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

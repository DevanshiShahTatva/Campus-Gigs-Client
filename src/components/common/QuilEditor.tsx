"use client";
import React from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { IQuillEditorProps } from "./types";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const QuillEditor: React.FC<IQuillEditorProps> = ({
  label,
  value,
  name,
  onChange,
  errorKey,
  errorMsg,
  placeholder,
  handleGenerateDescription,
  isDescriptionGenerating,
  iSGenerateButtonDisabled = false,
  required = false,
}) => {
  return (
    <div className="mb-4 h-full">
      <div
        className="flex flex-row justify-between items-end"
      >
        <label
          htmlFor={name}
          className="block text-sm font-bold text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>

      <div className="flex flex-col w-full items-end h-full">
        <div className="w-full h-full">
          <ReactQuill
            theme="snow"
            placeholder={placeholder}
            className={name === "tc" ? "custom-tc-quill" : "custom-quill"}
            value={value}
            onChange={onChange}
          />

          {errorKey && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
        </div>
        {/* {handleGenerateDescription && (
          <CommonAIButton
            handleButtonClick={() => handleGenerateDescription()}
            isDisabled={iSGenerateButtonDisabled}
            isSubmitting={isDescriptionGenerating}
          />
        )} */}
      </div>
    </div>
  );
};

export default QuillEditor;

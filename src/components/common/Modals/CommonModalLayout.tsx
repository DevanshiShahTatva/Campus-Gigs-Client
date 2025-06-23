"use client";

import React from "react";

import clsx from "clsx";
import { XCircleIcon } from "lucide-react";
import Button from "../Button";

type TModalFooterActions = {
  label: string;
  variant: "primary" | "secondary" | "delete" | "outlined" | "disabled";
  onClick?: () => void;
  type?: "button" | "submit"; // optional
  disabled?: boolean;
};

interface ICustomModalProps {
  onClose: () => void;
  modalTitle: string;
  children: React.ReactNode;
  footerActions?: TModalFooterActions[];
  maxHeight?: string;
  maxWidth?: string;
}

const ModalLayout: React.FC<ICustomModalProps> = ({
  onClose,
  modalTitle,
  children,
  footerActions = [],
  maxHeight,
  maxWidth,
}) => {
  const gridCols = footerActions.length === 1 ? "grid-cols-1" : "grid-cols-2";
  const contentMaxHeigh = maxHeight ? `max-h-[${maxHeight}]` : "max-h-96";
  const modalMaxWidth = maxWidth ? maxWidth : `max-w-xl`;

  return (
    <div className="fixed inset-0 z-45 flex items-center justify-center bg-black/60 bg-opacity-40 px-8 md:px-0">
      <div
        className={`bg-white w-full ${modalMaxWidth} rounded-lg shadow-xl relative`}
      >
        <div className="flex justify-between items-center border-b-1 px-6 py-5 border-b-gray-300">
          <p className="font-bold text-2xl text-[var(--text-dark)]">
            {modalTitle}
          </p>
          <XCircleIcon
            onClick={onClose}
            className="h-6 w-6 cursor-pointer text-[var(--text-semi-dark)]"
          />
        </div>
        <div
          className={clsx(
            `${contentMaxHeigh} overflow-auto scrollbar-none ${
              footerActions.length > 0 ? "border-b-1" : "border-none"
            } px-6 py-0 border-b-gray-300`
          )}
        >
          {children}
        </div>

        {footerActions.length > 0 && (
          <div className={`grid ${gridCols} gap-4 p-6`}>
            {footerActions.map((btn, idx) => (
              <Button
                key={idx}
                type={btn.type || "button"}
                onClick={btn.onClick}
                variant={btn.variant}
                className={
                  btn.disabled
                    ? "bg-gray-300 cursor-not-allowed"
                    : "w-full normal-case first-letter:uppercase"
                }
                disabled={btn.disabled}
              >
                {btn.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalLayout;

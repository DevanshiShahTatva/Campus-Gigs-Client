"use client";

import React from "react";
import ModalLayout from "./CommonModalLayout";
import { IDeleteFaqModalProps } from "@/app/admin/faqs/types";
import { MESSAGES } from "@/utils/constant";

const DeleteFaqModal: React.FC<IDeleteFaqModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  faqsValues,
}) => {
  if (!isOpen) return null;

  return (
    <ModalLayout
      onClose={onClose}
      modalTitle="Delete FAQ"
      footerActions={[
        {
          label: "Cancel",
          onClick: onClose,
          variant: "outlined",
        },
        {
          label: "Delete",
          onClick: () => onDelete(faqsValues),
          variant: "delete",
        },
      ]}
    >
      <div className="w-full my-6">
        <p className="mb-4 text-lg text-[var(--text-dark)]">
          {MESSAGES.FAQ_DELETE_CONFIRMATION}
        </p>
        <div className="mb-2 text-[var(--text-dark)]">
          <span className="font-semibold">Question:</span> {faqsValues.question}
        </div>
        <div className="text-[var(--text-dark)]">
          <span className="font-semibold">Answer:</span> {faqsValues.answer}
        </div>
      </div>
    </ModalLayout>
  );
};

export default DeleteFaqModal;

"use client";

import React, { useState } from "react";

// library support
import { Formik, Form, FormikHelpers } from "formik";
import ModalLayout from "./CommonModalLayout";
import FormikTextField from "../FormikTextField";
import { IEditFaqsModalProps, IFAQItem } from "@/app/admin/faqs/types";
import { FaqsEditValidationSchema } from "@/app/admin/faqs/create/helper";

// Custom Components

// types support

// helpers imports

const EditFaqModal: React.FC<IEditFaqsModalProps> = ({
  isOpen,
  onClose,
  saveChanges,
  faqsValues,
}) => {
  if (!isOpen) return null;

  const handleSubmit = async (
    values: IFAQItem,
    actions: FormikHelpers<IFAQItem>
  ) => {
    saveChanges(values);
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={faqsValues}
      validationSchema={FaqsEditValidationSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form className="flex gap-8 items-start md:flex-row flex-col">
          <ModalLayout
            onClose={onClose}
            modalTitle="Edit FAQ"
            footerActions={[
              {
                label: "Cancel",
                onClick: () => onClose(),
                variant: "outlined",
              },
              { label: "Update", type: "submit", variant: "primary" },
            ]}
          >
            <div className="w-full">
              {/* Content UI Start */}
              <div className="w-full space-y-5 my-6">
                <FormikTextField
                  name="question"
                  label="Question"
                  placeholder="Enter question here"
                />

                <div className="w-full flex flex-col items-end">
                  <FormikTextField
                    name="answer"
                    label="Answer"
                    type="textarea"
                    rows={5}
                    placeholder="Enter answer here"
                  />
                </div>
              </div>
              {/* Content UI End*/}
            </div>
          </ModalLayout>
        </Form>
      )}
    </Formik>
  );
};

export default EditFaqModal;

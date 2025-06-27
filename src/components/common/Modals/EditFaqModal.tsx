"use client";

import React, { useState } from "react";

// library support
import { Formik, Form, FormikHelpers } from "formik";
import ModalLayout from "./CommonModalLayout";
import FormikTextField from "../FormikTextField";
import { IEditFaqsModalProps, IFAQItem } from "@/app/admin/faqs/types";
import { FaqsEditValidationSchema } from "@/app/admin/faqs/create/helper";
import { AIButton } from "../AiButton";
import { apiCall } from "@/utils/apiCall";
import { API_ROUTES } from "@/utils/constant";
import { toast } from "react-toastify";

// Custom Components

// types support

// helpers imports

const EditFaqModal: React.FC<IEditFaqsModalProps> = ({
  isOpen,
  onClose,
  saveChanges,
  faqsValues,
}) => {
  const [isGeneratingAns, setIsGeneratingAns] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (
    values: IFAQItem,
    actions: FormikHelpers<IFAQItem>
  ) => {
    saveChanges(values);
    actions.resetForm();
  };

  const handleGenerateAiAnswer = async (
    question: string,
    setFieldValue: (field: string, value: string) => void
  ) => {
    try {
      setIsGeneratingAns(true);
      const res = await apiCall({
        method: "POST",
        endPoint: API_ROUTES.ADMIN.AI_GENERATE_FAQ_ANSWER,
        body: {
          question: question,
        },
      });

      if (res.success) {
        const markdown = res.data.answer.replace(/\\n/g, "\n");
        setFieldValue("answer", markdown);
        setIsGeneratingAns(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
      setIsGeneratingAns(false);
    }
  };

  return (
    <Formik
      initialValues={faqsValues}
      validationSchema={FaqsEditValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => (
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
                  <AIButton
                    disabled={!values.question}
                    loading={isGeneratingAns}
                    onClick={() =>
                      handleGenerateAiAnswer(
                        values.question,
                        setFieldValue
                      )
                    }
                  >
                    Generate with AI ✨
                  </AIButton>
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

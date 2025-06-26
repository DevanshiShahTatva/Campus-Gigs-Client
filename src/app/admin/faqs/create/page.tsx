"use client";
import AdminTitle from "@/components/common/AdminTitle";
import { Formik, Form, FieldArray, FormikHelpers } from "formik";
import React, { useState } from "react";
import { FaqsValidationSchema, InitialFaqsValues } from "./helper";
import { IFAQFormValues } from "../types";
import { apiCall } from "@/utils/apiCall";
import { API_ROUTES, MESSAGES, ROUTES } from "@/utils/constant";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Trash2Icon } from "lucide-react";
import FormikTextField from "@/components/common/FormikTextField";
// import { AIButton } from "@/components/common/Button";
import Loader from "@/components/common/Loader";
import { AIButton } from "@/components/common/AiButton";
import Button from "@/components/common/Button";

const FaqCreate = () => {
  const router = useRouter();

  const [isGeneratingAns, setIsGeneratingAns] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleSubmit = async (
    values: IFAQFormValues,
    actions: FormikHelpers<IFAQFormValues>
  ) => {
    actions.setSubmitting(true);
    try {
      const result = await apiCall({
        endPoint: API_ROUTES.ADMIN.BULK_FAQS,
        method: "POST",
        body: { ...values },
        withToken: true,
      });
      if (result && result.success) {
        actions.resetForm();
        router.push(ROUTES.ADMIN.FAQS);
        toast.success(MESSAGES.FAQ_CREATE_SUCCESS);
      }
    } catch (error) {
      console.error(error);
      toast.error(MESSAGES.FAQ_CREATE_ERROR);
    } finally {
      actions.setSubmitting(false);
    }
  };

  const handleGenerateAiAnswer = async (
    question: string,
    setFieldValue: (field: string, value: string) => void,
    index: number
  ) => {
    try {
      setCurrentIndex(index);
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

        setFieldValue(`faqs[${index}].answer`, markdown);
        setIsGeneratingAns(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
      setCurrentIndex(0);
      setIsGeneratingAns(false);
    }
  };

  return (
    <div className="relative">
      <AdminTitle title="Create FAQs" />
      <Formik
        initialValues={InitialFaqsValues}
        validationSchema={FaqsValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting, setFieldValue }) => (
          <>
            {isSubmitting && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <Loader size={48} colorClass="text-[var(--base)]" />
              </div>
            )}
            <Form className="space-y-6">
              <FieldArray name="faqs">
                {({ push, remove }) => (
                  <>
                    {values.faqs.map((faq, index) => (
                      <div key={index} className="px-5">
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-bold text-[var(--text-dark)]">
                            Qustion-{index + 1}
                          </div>

                          {index === 0 ? (
                            <button
                              type="button"
                              onClick={() => push({ question: "", answer: "" })}
                              className="underline text-[var(--base)] hover:text-[var(--base-hover)] font-bold cursor-pointer"
                            >
                              Add Question
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="cursor-pointer"
                            >
                              <Trash2Icon className="h-5 w-5 text-gray-800" />{" "}
                              {""}
                            </button>
                          )}
                        </div>
                        <div className="flex flex-col gap-3 my-5">
                          <FormikTextField
                            name={`faqs[${index}].question`}
                            placeholder="Enter your question"
                            label="Question"
                          />

                          <div className="w-full flex flex-col items-end">
                            <FormikTextField
                              name={`faqs[${index}].answer`}
                              placeholder="Enter your answer"
                              label="Answer"
                              type="textarea"
                              rows={5}
                            />
                            <AIButton
                              disabled={!faq.question}
                              loading={currentIndex === index && isGeneratingAns}
                              onClick={() =>
                                handleGenerateAiAnswer(
                                  faq.question,
                                  setFieldValue,
                                  index
                                )
                              }
                            >
                              Generate with AI ✨
                            </AIButton>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </FieldArray>

              <div className="text-end my-6">
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  variant="primary"
                  className="sm:w-max rounded-[12px] w-full py-3 px-6 disabled:opacity-50 transition disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default FaqCreate;

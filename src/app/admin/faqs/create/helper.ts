import * as Yup from "yup";
import { IFAQFormValues, IFAQItem } from "../types";

export const InitialFaqsValues: IFAQFormValues = {
  faqs: [{ _id: "" ,question: "", answer: "" }],
};

export const FaqsValidationSchema = Yup.object({
  faqs: Yup.array().of(
    Yup.object().shape({
      question: Yup.string().trim().required("Question is required"),
      answer: Yup.string().trim().required("Answer is required"),
    })
  ),
});


export const InitialEditFaqsValues : IFAQItem = {
    question: '', answer: '', _id: '' 
 };

export const FaqsEditValidationSchema = Yup.object({
   question: Yup.string().trim().required('Question is required'),
   answer: Yup.string().trim().required('Answer is required'),
})
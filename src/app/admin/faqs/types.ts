export interface IFAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface IFAQFormValues {
  faqs: IFAQItem[];
}

export interface IEditFaqsModalProps {
  isOpen: boolean;
  onClose: () => void;
  saveChanges: (values: IFAQItem) => void;
  faqsValues: IFAQItem;
}

export interface IDeleteFaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (faq: IFAQItem) => void;
  faqsValues: IFAQItem;
}

export interface IFaqsApiResponse {
  status: number;
  message: string;
  data: IFAQItem[];
  meta: IFaqsPagination;
}

export interface IFaqsPagination {
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
}

export interface IFAQItem {
    _id: string;
    question: string;
    answer: string;
  }
  
  export interface IFAQFormValues {
    faqs: IFAQItem[];
  }
  
  export interface IEditFaqsModalProps {
    isOpen: boolean;
    onClose: () => void;
    saveChanges : (values : IFAQItem) => void
    faqsValues: IFAQItem
}

export interface IDeleteFaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (faq: IFAQItem) => void;
  faqsValues: IFAQItem;
}
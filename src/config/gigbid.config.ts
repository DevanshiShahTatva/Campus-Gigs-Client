import { CommonFormField } from "@/components/common/form/CommonFormModal";

export const gigBidFields: CommonFormField[] = [
  {
    name: "bid_type",
    label: "Bid Type",
    type: "select",
    options: [
      { id: "fixed", label: "Fixed" },
      { id: "hourly", label: "Hourly" },
    ],
    placeholder: "Select bid type",
    required: true,
  },
  {
    name: "bid_amount",
    label: "Your Bid Amount",
    type: "number",
    placeholder: "Enter your bid amount",
    required: true
  },
  {
    name: "description",
    label: "Cover letter",
    type: "textarea",
    placeholder: "Explain why you're the perfect fit for this project...",
    required: true
  }
];

export interface GigBidFields {
  bidType: string;
  yourBidAmount: string;
  coverLetter: string;
}

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { apiCall } from '@/utils/apiCall';
import { Button } from '@/components/ui/button';
import { CentralLoader } from '@/components/common/Loader';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import moment from 'moment';

interface DisputeData {
  responseToIssue: string;
  sincerityAgreement: boolean;
}

interface ComplaintDetails {
  complaintId: number;
  userRating: number;
  userFeedback: string;
  userIssue: string;
  userExpectation: string;
  gigTitle: string;
  customerName: string;
  complaintDate: string;
}

const ReviewComplaintModal = ({
  complaintDetails,
  onClose
}: {
  complaintDetails: ComplaintDetails;
  onClose: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [step, setStep] = useState('review');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<DisputeData>({
    responseToIssue: '',
    sincerityAgreement: false
  });

  const submitDispute = async () => {
    try {
      setLoading(true);

      const response = await apiCall({
        endPoint: '/rating/challenge-complaint',
        method: 'POST',
        body: {
          complaint_id: complaintDetails.complaintId,
          provider_response: formData.responseToIssue
        },
      });

      if (response?.success) {
        setStep('submitted');
      } else if (response?.message) {
        toast.error(response.message);
      }
    } catch (err) {
      console.error('Dispute submission error:', err);
      toast.error('Failed to submit dispute. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDispute = () => {
    if (!formData.responseToIssue || !formData.sincerityAgreement) {
      toast.error('Please fill in all required fields and accept the agreement');
      return;
    }
    submitDispute();
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      {loading && <CentralLoader loading={loading} />}
      <DialogContent
        style={{
          padding: 0,
          margin: "auto",
          display: "flex",
          minHeight: "auto",
          maxHeight: "90vh",
          flexDirection: "column",
          borderRadius: "0.75rem",
        }}
        className="gap-0 p-0 sm:w-[95vw] md:w-[85vw] lg:w-[70vw]"
      >
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b bg-background rounded-t-[0.75rem] flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {step === 'review' ? 'Review Complaint' : step === 'dispute' ? 'Challenge Complaint' : 'Dispute Submitted'}
            </DialogTitle>
          </DialogHeader>
        </div>
        <div className="flex-1 overflow-y-auto">
          {step === 'review' && (
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="text-teal-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Customer Complaint Review
                </h3>
                <p className="text-gray-600">
                  A customer has filed a complaint about your service
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="font-medium text-gray-700">Gig:</span>
                    <p className="text-gray-600">{complaintDetails.gigTitle}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Customer:</span>
                    <p className="text-gray-600">{complaintDetails.customerName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Rating:</span>
                    <p className="text-gray-600">{complaintDetails.userRating}/5 stars</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Date:</span>
                    <p className="text-gray-600">{moment(complaintDetails.complaintDate).format("DD/MM/YYYY hh:mm A")}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="font-medium text-gray-700">Customer Feedback:</span>
                    <p className="text-gray-600 bg-white p-3 rounded border">{complaintDetails.userFeedback}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Issue Described:</span>
                    <p className="text-gray-600 bg-white p-3 rounded border">{complaintDetails.userIssue}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">What Customer Expected:</span>
                    <p className="text-gray-600 bg-white p-3 rounded border">{complaintDetails.userExpectation}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setStep('dispute')}
                  className="flex-1 py-3 px-4 bg-[var(--base)] text-white rounded-lg hover:bg-[var(--base-hover)] transition-colors font-medium"
                >
                  Challenge This Complaint
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Accept & Close
                </button>
              </div>
            </div>
          )}
          {step === 'dispute' && (
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-teal-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Challenge Customer Complaint
                </h3>
                <p className="text-gray-600">
                  Provide your side of the story with supporting evidence
                </p>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your response to the customer's issue <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.responseToIssue}
                    onChange={(e) => setFormData({ ...formData, responseToIssue: e.target.value })}
                    placeholder="Explain your perspective on the issue the customer described..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[var(--base)] focus:border-[var(--base)] transition-colors resize-none text-black"
                  />
                </div>
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <div className="flex">
                    <div>
                      <input
                        type="checkbox"
                        checked={formData.sincerityAgreement}
                        onChange={(e) => setFormData({ ...formData, sincerityAgreement: e.target.checked })}
                        className="appearance-none w-6 h-6 border-[1.5px] border-gray-300 rounded-sm
                        bg-white checked:bg-[var(--base)] checked:border-[var(--base)] cursor-pointer
                          relative transition-colors duration-200  checked:after:content-['✓']
                          checked:after:font-bold checked:after:left-[5px] checked:after:absolute 
                        checked:after:text-white checked:after:text-sm checked:after:top-[0px]"
                      />
                    </div>
                    <label className="ml-3 text-sm text-red-800">
                      <strong>Truth and Accuracy Agreement:</strong> I confirm that all information provided is truthful and accurate. I understand that any false statements or misleading information will result in penalties including potential suspension from the platform.
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
          {step === 'submitted' && (
            <div className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Dispute Submitted Successfully
                </h3>
                <p className="text-gray-600 mb-6">
                  Your dispute has been submitted and will be reviewed by our team. We will investigate both sides of the complaint and contact you within 3-5 business days with our decision.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800">
                    <strong>What happens next:</strong><br />
                    • Our team will review your dispute and the original complaint<br />
                    • We may contact you or the customer for additional information<br />
                    • A decision will be made within 5 business days<br />
                    • You will be notified of the outcome via email
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-full py-3 px-4 bg-[var(--base)] text-white rounded-lg hover:bg-[var(--base-hover)] transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
        {step === 'dispute' && (
          <div className="p-3 sm:p-4 border-t bg-background rounded-b-[0.75rem] flex-shrink-0">
            <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('review')}
                className="w-full sm:w-auto text-sm sm:text-base h-9 sm:h-10"
              >
                Back to Review
              </Button>
              <Button
                type="submit"
                onClick={handleSubmitDispute}
                disabled={!formData.responseToIssue || !formData.sincerityAgreement}
                className={`w-full sm:w-auto text-sm sm:text-base h-9 sm:h-10 ${!formData.responseToIssue || !formData.sincerityAgreement
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
                  }`}
              >
                Submit Dispute
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReviewComplaintModal;
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment';
import { Star, AlertTriangle, CheckCircle, ThumbsUp, MessageSquare } from 'lucide-react';
import { apiCall } from '@/utils/apiCall';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CentralLoader } from '@/components/common/Loader';

const getRatingText = (rating: number) => {
  const texts: any = {
    1: 'Very Poor',
    2: 'Poor',
    3: 'Fair',
    4: 'Good',
    5: 'Excellent'
  };
  return texts[rating] || 'Rate the service';
};

interface ExistingRatingData {
  userRating: number;
  userFeedback: string;
  userIssue?: string;
  userExpectation?: string;
  providerResponse?: string;
  providerChallengeDate?: string;
}

interface GigRatingModalProps {
  gigId: number;
  isReadonly?: boolean;
  existingRating?: ExistingRatingData | null;
  onClose: (step: string) => void;
}

const GigRatingModal = ({ gigId, existingRating, isReadonly = false, onClose }: GigRatingModalProps) => {
  const [step, setStep] = useState('rating');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    issue: '',
    shouldHaveDone: '',
    sincerityAgreement: false
  });

  useEffect(() => {
    if (existingRating) {
      setRating(existingRating.userRating);
      setFeedback(existingRating.userFeedback || '');
      setFormData({
        issue: existingRating.userIssue || '',
        shouldHaveDone: existingRating.userExpectation || '',
        sincerityAgreement: true
      });

      if (isReadonly) {
        setStep('rating');
      } else {
        if (existingRating.userRating < 3 && existingRating.userIssue) {
          setStep('unsatisfied');
        } else {
          setStep('rating');
        }
      }
    }
  }, [existingRating, isReadonly]);

  const submitRating = async () => {
    if (isReadonly) return;

    try {
      setLoading(true);
      const response = await apiCall({
        endPoint: '/rating/create',
        method: 'POST',
        body: {
          gig_id: gigId,
          rating: rating,
          rating_feedback: feedback,
          issue_text: rating < 3 ? formData.issue : undefined,
          what_provider_done: rating < 3 ? formData.shouldHaveDone : undefined,
        }
      });

      if (response?.success) {
        setStep('submitted');
      } else if (response?.message) {
        toast.error(response.message);
      }
    } catch (err) {
      console.error('Err:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    if (isReadonly) return;
    setRating(rating);
    if (rating >= 3) {
      setFormData({
        issue: '',
        shouldHaveDone: '',
        sincerityAgreement: false
      })
    }
  };

  const handleRatingSubmit = () => {
    if (isReadonly) return;
    if (rating < 1) return;

    if (rating >= 3) {
      submitRating();
    } else {
      setStep('unsatisfied');
    }
  };

  const handleUnsatisfiedSubmit = () => {
    if (isReadonly) return;
    if (!formData.issue || !formData.shouldHaveDone || !formData.sincerityAgreement) {
      return;
    }

    submitRating();
  };

  if (!gigId) return null;

  return (
    <Dialog open={!!gigId} onOpenChange={() => onClose(step)}>
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
        className="gap-0 p-0 sm:w-[90vw] md:w-[80vw] lg:w-[60vw]"
      >
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b bg-background rounded-t-[0.75rem] flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {isReadonly ? 'Review Details' : 'Gig Review'}
            </DialogTitle>
          </DialogHeader>
        </div>
        <div className="flex-1 overflow-y-auto">
          {step === 'rating' && (
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="text-[var(--base)]" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {isReadonly ? 'Service Rating' : 'How was your experience?'}
                </h3>
                <p className="text-gray-600">
                  {isReadonly ? 'Your rating and feedback for this service' : 'Please rate the provider\'s service'}
                </p>
              </div>
              <div className="flex justify-center mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => !isReadonly && setHoveredRating(star)}
                    onMouseLeave={() => !isReadonly && setHoveredRating(0)}
                    disabled={isReadonly}
                    className={`mx-1 transition-all duration-200 ${isReadonly ? 'cursor-default' : 'hover:scale-130 cursor-pointer'} border-none outline-none`}
                  >
                    <Star
                      size={32}
                      className={`${star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                        } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-center mb-6">
                <p className="text-lg font-medium text-gray-700">
                  {getRatingText(hoveredRating || rating)}
                </p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isReadonly ? 'Your Feedback' : 'Your Feedback'} <span className="text-destructive ml-1">*</span>
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => !isReadonly && setFeedback(e.target.value)}
                  placeholder="Describe your experience with the service..."
                  readOnly={isReadonly}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[var(--base)] focus:border-[var(--base)] transition-colors resize-none text-black ${isReadonly ? 'bg-gray-50 cursor-default' : ''}`}
                />
              </div>
              {isReadonly && rating < 3 && (existingRating?.userIssue || existingRating?.userExpectation) && (
                <div className="mb-6 space-y-4">
                  {existingRating?.userIssue && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Issue Reported
                      </label>
                      <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-black">
                        {existingRating.userIssue}
                      </div>
                    </div>
                  )}
                  {existingRating?.userExpectation && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What Should Have Been Done
                      </label>
                      <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-black">
                        {existingRating.userExpectation}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {isReadonly && existingRating?.providerResponse && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <MessageSquare className="mr-2" size={16} />
                    Provider's Response
                  </label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-black">
                    <p className="mb-2">{existingRating.providerResponse}</p>
                    {existingRating.providerChallengeDate && (
                      <p className="text-sm text-gray-600">
                        Responded on: {moment(existingRating.providerChallengeDate).format('DD-MM-YYYY hh:mm A')}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {!isReadonly && (
                <button
                  onClick={handleRatingSubmit}
                  disabled={!rating || !feedback}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${(rating && feedback)
                    ? 'bg-[var(--base)] text-white hover:bg-[var(--base-hover)] shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  {rating >= 3 ? 'Submit Review' : 'Next'}
                </button>
              )}
            </div>
          )}
          {step === 'unsatisfied' && (
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="text-teal-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  We're sorry to hear that
                </h3>
                <p className="text-gray-600">
                  Please help us understand what went wrong
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What was the issue? <span className="text-destructive ml-1">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.issue}
                    onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                    placeholder="Please describe the problem you experienced..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[var(--base)] focus:border-[var(--base)] transition-colors resize-none text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What should the provider have done? <span className="text-destructive ml-1">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.shouldHaveDone}
                    onChange={(e) => setFormData({ ...formData, shouldHaveDone: e.target.value })}
                    placeholder="Describe what you expected or what should have been done differently..."
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
                    <label htmlFor="sincerity" className="ml-3 text-sm text-red-800">
                      <strong>Agreement of Sincerity:</strong> I confirm that the information provided is truthful and accurate. I understand that any dishonesty or false reporting will result in a permanent ban from the platform.
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
          {step === 'submitted' && (
            <div className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {rating >= 3 ? (
                    <ThumbsUp className="text-teal-600" size={24} />
                  ) : (
                    <CheckCircle className="text-teal-600" size={24} />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {rating >= 3 ? 'Thank you for your feedback!' : 'Report submitted successfully'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {rating >= 3
                    ? 'Your positive review helps other users find quality service providers.'
                    : 'We have received your report and will review it promptly. Thank you for helping us maintain service quality.'
                  }
                </p>
                <button
                  onClick={() => onClose(step)}
                  className="w-full py-3 px-4 bg-[var(--base)] text-white rounded-lg hover:bg-[var(--base-hover)] transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
        {step === 'unsatisfied' && !isReadonly && (
          <div className="p-3 sm:p-4 border-t bg-background rounded-b-[0.75rem] flex-shrink-0">
            <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('rating')}
                className="w-full sm:w-auto text-sm sm:text-base h-9 sm:h-10"
              >
                Back
              </Button>
              <Button
                type="submit"
                onClick={handleUnsatisfiedSubmit}
                disabled={!formData.issue || !formData.shouldHaveDone || !formData.sincerityAgreement}
                className={`w-full sm:w-auto text-sm sm:text-base h-9 sm:h-10 ${!formData.issue || !formData.shouldHaveDone || !formData.sincerityAgreement
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
                  }`}
              >
                Submit Report
              </Button>
            </DialogFooter>
          </div>
        )}
        {isReadonly && (
          <div className="p-3 sm:p-4 border-t bg-background rounded-b-[0.75rem] flex-shrink-0">
            <DialogFooter>
              <Button
                type="button"
                onClick={() => onClose(step)}
                className="w-full sm:w-auto text-sm sm:text-base h-9 sm:h-10"
              >
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GigRatingModal;
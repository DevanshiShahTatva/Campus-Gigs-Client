"use client";
import Button from "@/components/common/Button";
import QuillEditor from "@/components/common/QuilEditor";
import React, { useCallback, useEffect, useState } from "react";
import { Trash2, Sparkles } from "lucide-react";
import { apiCall } from "@/utils/apiCall";
import { toast } from "react-toastify";
import Loader from "@/components/common/Loader";
import { IPrivacyPolicyResponse } from "./types";
import { API_ROUTES } from "@/utils/constant";
import TagsModal from "@/components/common/Modals/TagsModal";
import { marked } from "marked";
import ModalLayout from "@/components/common/Modals/CommonModalLayout";

const AdminPrivacyPolicy = () => {
  const [loader, setLoader] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState(false);
  const [policyId, setPolicyId] = useState(0);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleChange = (value: string) => {
    if (value.length !== 11) {
      setError(true);
    } else {
      setError(false);
    }
    setContent(value);
  };

  const PRIVACY_POLICY_API = API_ROUTES.ADMIN.PRIVACY_POLICY;
  const INITIAL_PRIVACY_POLICY = "<p>Initial Privacy Policy</p>";
  const PRIVACY_POLICY_SUCCESS = "Privacy Policy updated successfully";
  const PRIVACY_POLICY_ERROR = "Failed to update Privacy Policy";
  const PRIVACY_POLICY_RESET_SUCCESS = "Privacy Policy reset successfully";
  const PRIVACY_POLICY_RESET_ERROR = "Failed to reset Privacy Policy";

  const updatePrivacyPolicy = async (reset?: boolean) => {
    if (content.length < 20) {
      setError(true);
      return false;
    }
    setLoader(true);
    try {
      const httpBody = {
        content: reset ? INITIAL_PRIVACY_POLICY : content,
      };
      const response = await apiCall({
        endPoint: PRIVACY_POLICY_API + "/" + policyId,
        method: "PUT",
        body: httpBody,
      });
      if (response && response.success) {
        await getPrivacyPolicy();
        toast.success(reset ? PRIVACY_POLICY_RESET_SUCCESS : PRIVACY_POLICY_SUCCESS);
      }
    } catch (err) {
      console.error("Error updating privacy policy", err);
      toast.error(reset ? PRIVACY_POLICY_RESET_ERROR : PRIVACY_POLICY_ERROR);
    } finally {
      setLoader(false);
    }
  };

  const handleGenerateAiPolicy = async (keywords: string[]) => {
    setIsGeneratingAi(true);
    try {
      const response = await apiCall({
        endPoint: API_ROUTES.ADMIN.AI_GENERATE_PRIVACY_POLICY,
        method: "POST",
        body: { keywords },
        withToken: true,
      });
      if (response && response.success) {
        const contentText = typeof response.data.content === "string" ? response.data.content : "";
        const cleanText = contentText.replace(/```/g, "");
        const html = await marked(cleanText);
        setContent(html);
        setIsAiModalOpen(false);
        toast.success("Privacy Policy generated successfully!");
      } else {
        toast.error("Failed to generate Privacy Policy");
      }
    } catch (err) {
      console.error("Error generating privacy policy", err);
      toast.error("Failed to generate Privacy Policy");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const getPrivacyPolicy = useCallback(async () => {
    setLoader(true);
    try {
      const response: IPrivacyPolicyResponse = await apiCall({
        endPoint: PRIVACY_POLICY_API,
        method: "GET",
        withToken: false,
      });
      if (response && response.success) {
        const receivedObject = response.data[0];
        setContent(receivedObject.content);
        setPolicyId(receivedObject.id);
      }
    } catch (err) {
      console.error("Error fetching privacy policy", err);
    } finally {
      setLoader(false);
    }
  }, []);

  useEffect(() => {
    getPrivacyPolicy();
  }, [getPrivacyPolicy]);

  return (
    <div className="h-full relative">
      {loader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Loader size={48} colorClass="text-[var(--base)]" />
        </div>
      )}
      {showResetConfirm && (
        <ModalLayout
          onClose={() => setShowResetConfirm(false)}
          modalTitle="Reset Privacy Policy?"
          footerActions={[
            {
              label: "Cancel",
              variant: "outlined",
              onClick: () => setShowResetConfirm(false),
            },
            {
              label: "Reset",
              variant: "delete",
              onClick: () => {
                setShowResetConfirm(false);
                updatePrivacyPolicy(true);
              },
            },
          ]}
        >
          <div className="py-6 text-center text-[var(--text-dark)]">
            Are you sure you want to reset the Privacy Policy? This action cannot be undone.
          </div>
        </ModalLayout>
      )}
      <div className="mb-2 flex w-full justify-between">
        <p className="text-2xl font-bold text-[var(--base)]">Privacy Policy</p>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsAiModalOpen(true)}
            variant="primary"
            startIcon={<Sparkles className="w-5 h-5 font-bold" />}
            className="disabled:bg-blue-300 disabled:cursor-not-allowed md:flex gap-2 items-center cursor-pointer"
          >
            <p className="hidden md:block">Generate with AI</p>
          </Button>
          <Button
            onClick={() => setShowResetConfirm(true)}
            variant="delete"
            startIcon={<Trash2 className="w-5 h-5 font-bold" />}
            className="disabled:bg-red-300 disabled:cursor-not-allowed md:flex gap-2 items-center cursor-pointer"
          >
            <p className="hidden md:block">Reset</p>
          </Button>
        </div>
      </div>
      <QuillEditor
        name="tc"
        value={content}
        onChange={(value) => handleChange(value)}
        label=""
        errorKey={error}
        errorMsg={content?.length > 20 ? "" : "Enter valid privacy policy content"}
        placeholder="Enter Privacy Policy"
      />
      <div className="flex justify-end">
        <button className="relative group cursor-pointer" onClick={() => updatePrivacyPolicy()} disabled={loader}>
          <div className="absolute -inset-0.5  rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-[var(--base)] text-[color:var(--text-light)] px-8 py-3 rounded-lg font-semibold hover:bg-[var(--base-hover)] transition-colors flex items-center justify-center min-h-[24px] min-w-[80px]">
            {loader ? <Loader size={24} colorClass="text-[var(--text-light)]" /> : "Save"}
          </div>
        </button>
      </div>
      <TagsModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onSave={handleGenerateAiPolicy}
        loading={isGeneratingAi}
        maxTags={15}
        placeholder="Add keywords for AI generation"
        modalTitle="Generate Privacy Policy with AI"
      />
    </div>
  );
};

export default AdminPrivacyPolicy;

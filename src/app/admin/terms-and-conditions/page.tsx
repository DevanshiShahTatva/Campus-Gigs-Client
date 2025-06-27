"use client";
import Button from "@/components/common/Button";
import QuillEditor from "@/components/common/QuilEditor";
import React, { useCallback, useEffect, useState } from "react";
import {marked} from 'marked';
import { Trash2, Sparkles } from "lucide-react";
import { apiCall } from "@/utils/apiCall";
import { API_ROUTES, MESSAGES } from "@/utils/constant";
import { toast } from "react-toastify";
import Loader from "@/components/common/Loader";
import { ITCResponse } from "./types";
import TagsModal from "@/components/common/Modals/TagsModal";
// import TermsTagModal from "@/components/common/Modals/TermsTagModal";

const TermsAndConditions = () => {
  const [loader, setLoader] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState(false);
  const [tcId, setTcId] = useState("");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleChange = (value: string) => {
    if (value.length !== 11) {
      setError(true);
    } else {
      setError(false);
    }
    setContent(value);
  };

  const updateTermsContent = async (reset?: boolean) => {
    if (content.length < 20) {
      setError(true);
      return false;
    }

    setLoader(true);
    try {
      const httpBody = {
        content: reset ? MESSAGES.INITIAL_TERMS_CONDITIONS : content,
      };
      const response = await apiCall({
        endPoint: API_ROUTES.ADMIN.TERMS_CONDITIONS + "/" + tcId,
        method: "PUT",
        body: httpBody,
      });

      if (response && response.success) {
        await getTermsContent();
        toast.success(
          reset
            ? MESSAGES.TERMS_CONDITIONS_RESET_SUCCESS
            : MESSAGES.TERMS_CONDITIONS_SUCCESS
        );
      }
    } catch (err) {
      console.error("Error fetching chart data", err);
      toast.error(
        reset
          ? MESSAGES.TERMS_CONDITIONS_RESET_ERROR
          : MESSAGES.TERMS_CONDITIONS_ERROR
      );
    } finally {
      setLoader(false);
    }
  };

  const handleGenerateAiTerms = async (keywords: string[]) => {
    setIsGeneratingAi(true);
    try {
      const response = await apiCall({
        endPoint: API_ROUTES.ADMIN.AI_GENERATE_TERMS_CONDITIONS,
        method: "POST",
        body: {
          keywords: keywords,
        },
        withToken: true,
      });

      if (response && response.success) {
        const contentText = typeof response.data.content === "string" ? response.data.content : "";
        const cleanText = contentText.replace(/```/g, "");
        const html = await marked(cleanText);
        setContent(html);
        setIsAiModalOpen(false);
        toast.success("Terms & Conditions generated successfully!");
      } else {
        toast.error("Failed to generate Terms & Conditions");
      }
    } catch (err) {
      console.error("Error generating terms", err);
      toast.error("Failed to generate Terms & Conditions");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const getTermsContent = useCallback(async () => {
    setLoader(true);
    try {
      const response: ITCResponse = await apiCall({
        endPoint: API_ROUTES.ADMIN.TERMS_CONDITIONS,
        method: "GET",
        withToken: false,
      });

      if (response && response.success) {
        const receivedObject = response.data[0];
        setContent(receivedObject.content);
        setTcId(response.data[0]._id);
      }
    } catch (err) {
      console.error("Error fetching chart data", err);
    } finally {
      setLoader(false);
    }
  }, []);

  useEffect(() => {
    getTermsContent();
  }, [getTermsContent]);

  return (
    <div className=" h-full relative">
      {loader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Loader size={48} colorClass="text-[var(--base)]" />
        </div>
      )}
      <div className="mb-2 flex w-full justify-between">
        <p className="text-2xl font-bold text-[var(--base)]">
          Terms & Conditions
        </p>
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
            onClick={() => updateTermsContent(true)}
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
        errorMsg={content?.length > 20 ? "" : "Enter valid terms content"}
        placeholder="Enter Terms & Conditions"
      />
      <div className="flex justify-end">
        <button
          className="relative group cursor-pointer"
          onClick={() => updateTermsContent()}
          disabled={loader}
        >
          <div className="absolute -inset-0.5  rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-[var(--base)] text-[color:var(--text-light)] px-8 py-3 rounded-lg font-semibold hover:bg-[var(--base-hover)] transition-colors flex items-center justify-center min-h-[24px] min-w-[80px]">
            {loader ? (
              <Loader size={24} colorClass="text-[var(--text-light)]" />
            ) : (
              "Save"
            )}
          </div>
        </button>
      </div>

      <TagsModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onSave={handleGenerateAiTerms}
        loading={isGeneratingAi}
        maxTags={15}
        placeholder="Add keywords for AI generation"
        modalTitle="Generate Terms & Conditions with AI"
      />
    </div>
  );
};

export default TermsAndConditions;

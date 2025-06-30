"use client";
import { ROUTES } from "@/utils/constant";
import { Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { apiCall } from "@/utils/apiCall";
import { API_ROUTES, MESSAGES } from "@/utils/constant";
import { IFAQItem, IFaqsApiResponse, IFaqsPagination } from "./types";
import { toast } from "react-toastify";
import EditFaqModal from "@/components/common/Modals/EditFaqModal";
import DeleteFaqModal from "@/components/common/Modals/DeleteFaqModal";
import { DynamicTable } from "@/components/common/DynamicTables";

const AdminFAQs = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState<IFaqsPagination>({ page: 1, pageSize: 10, total: 1, totalPages: 1 });
  const [faqs, setFaqs] = useState<IFAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [faqInfo, setFaqInfo] = useState<IFAQItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteFaqInfo, setDeleteFaqInfo] = useState<IFAQItem | null>(null);

  // State for search, sort, and page
  const [sortKey, setSortKey] = useState<keyof (IFAQItem & { id: string }) | string>("question");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Combined search/sort handler for DynamicTable
  const handleSearchSort = (search: string, sortKeyParam: keyof (IFAQItem & { id: string }), sortOrderParam: "asc" | "desc", page: number) => {
    fetchFaqs(search, sortKeyParam, sortOrderParam, page);
  };

  const handleCloseEditModal = () => setIsEditModalOpen(false);

  const fetchFaqs = async (searchTerm = "", sortKey = "question", sortOrder = "desc", page = 1, pageSizeOverride?: number) => {
    setLoading(true);
    const pageSize = pageSizeOverride ?? pagination.pageSize;
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(searchTerm && { search: searchTerm }),
      ...(sortKey && { sortBy: sortKey }),
      ...(sortKey && sortOrder && { sortOrder }),
    });
    try {
      const res: IFaqsApiResponse = await apiCall({
        endPoint: `${API_ROUTES.ADMIN.FAQS}?${params.toString()}`,
        method: "GET",
        withToken: true,
      });
      if (res && res.status === 200) {
        setFaqs(res.data);
        setPagination(res.meta);
      } else {
        setFaqs([]);
      }
    } catch (err) {
      toast.error(MESSAGES.ERROR);
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    const selectedFaq = faqs.find((faq) => faq.id === id);
    if (selectedFaq) {
      setFaqInfo(selectedFaq);
      setIsEditModalOpen(true);
    }
  };

  const updateFAQs = async (values: IFAQItem) => {
    if (!values.id) return;
    setLoading(true);
    try {
      const res = await apiCall({
        endPoint: `${API_ROUTES.ADMIN.FAQS}/${values.id}`,
        method: "PUT",
        body: { question: values.question, answer: values.answer },
        withToken: true,
      });
      if (res && res.success) {
        toast.success("FAQ updated successfully");
        setIsEditModalOpen(false);
        fetchFaqs();
      } else {
        toast.error(MESSAGES.ERROR);
      }
    } catch (err) {
      toast.error(MESSAGES.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteModal = (faq: IFAQItem) => {
    setDeleteFaqInfo(faq);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

  const handleDeleteFaq = async (faq: IFAQItem) => {
    if (!faq.id) return;
    setLoading(true);
    try {
      const res = await apiCall({
        endPoint: `${API_ROUTES.ADMIN.FAQS}/${faq.id}`,
        method: "DELETE",
        withToken: true,
      });
      if (res && res.success) {
        toast.success(MESSAGES.FAQ_DELETE_SUCCESS);
        setIsDeleteModalOpen(false);
        fetchFaqs();
      } else {
        toast.error(MESSAGES.ERROR);
      }
    } catch (err) {
      toast.error(MESSAGES.ERROR);
    } finally {
      setLoading(false);
    }
  };

  // For DynamicTable: map _id to id for compatibility
  const faqsWithId = faqs.map((faq) => ({ ...faq, id: faq.id }));

  // Columns for DynamicTable
  const columns: import("@/utils/interface").ColumnConfig<IFAQItem & { id: number }>[] = [
    {
      key: "question",
      label: "Question",
      sortable: true,
      textAlign: "left",
      render: (value) => (
        <div className="max-w-[300px] truncate" title={String(value)}>
          {String(value) || "---"}
        </div>
      ),
    },
    {
      key: "answer",
      label: "Answer",
      sortable: false,
      textAlign: "left",
      render: (value) => (
        <div className="max-w-[300px] truncate" title={String(value)}>
          {String(value) || "---"}
        </div>
      ),
    },
  ];

  const navigateToCreate = () => router.push(ROUTES.ADMIN.CREATE_FAQs);

  return (
    <div className="relative">
      <DynamicTable
        data={faqsWithId}
        columns={columns}
        actions={(row) => (
          <div className="flex gap-2 justify-center">
            <button title="edit" className="text-[var(--base)] hover:text-[var(--base-hover)]" onClick={() => handleEdit(row.id)}>
              <Edit size={16} />
            </button>
            <button title="delete" className="text-red-500 hover:text-red-700" onClick={() => handleOpenDeleteModal(row)}>
              <Trash size={16} />
            </button>
          </div>
        )}
        totalPages={pagination.totalPages}
        handlePageChange={(page) => fetchFaqs(searchQuery, sortKey, sortOrder, page)}
        currentPage={pagination.page}
        onSearchSort={handleSearchSort}
        title="All FAQs"
        searchPlaceholder="Search FAQs"
        onClickCreateButton={navigateToCreate}
        pageSize={pagination.pageSize}
        onPageSizeChange={(size) => {
          setPagination((prev) => ({ ...prev, pageSize: size, page: 1 }));
          fetchFaqs(searchQuery, sortKey, sortOrder, 1, size);
        }}
        loading={loading}
      />
      <EditFaqModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} saveChanges={updateFAQs} faqsValues={faqInfo as IFAQItem} />
      <DeleteFaqModal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} onDelete={handleDeleteFaq} faqsValues={deleteFaqInfo as IFAQItem} />
    </div>
  );
};

export default AdminFAQs;

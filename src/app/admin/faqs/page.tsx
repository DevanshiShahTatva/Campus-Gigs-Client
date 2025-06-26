"use client";
import { ROUTES } from "@/utils/constant";
import { Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { apiCall } from "@/utils/apiCall";
import { API_ROUTES, MESSAGES } from "@/utils/constant";
import { IFAQItem, IFaqsApiResponse, IFaqsPagination } from "./types";
import Loader from "@/components/common/Loader";
import { toast } from "react-toastify";
import EditFaqModal from "@/components/common/Modals/EditFaqModal";
import DeleteFaqModal from "@/components/common/Modals/DeleteFaqModal";
import { DynamicTable } from "@/components/common/DynamicTables";

const AdminFAQs = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState<IFaqsPagination>({ page: 1, pageSize: 10, total: 1, totalPages: 1 });
  const [faqs, setFaqs] = useState<IFAQItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [faqInfo, setFaqInfo] = useState<IFAQItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteFaqInfo, setDeleteFaqInfo] = useState<IFAQItem | null>(null);

  // State for search, sort, and page
  const [sortKey, setSortKey] = useState<keyof (IFAQItem & { id: string }) | string>("question");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>("asc");

  // Combined search/sort handler for DynamicTable
  const handleSearchSort = (
    search: string,
    sortKeyParam: keyof (IFAQItem & { id: string }),
    sortOrderParam: 'asc' | 'desc',
    page: number
  ) => {
    fetchFaqs(search, sortKeyParam, sortOrderParam, page);
  };

  const handleCloseEditModal = () => setIsEditModalOpen(false);

  const fetchFaqs = async (
    searchTerm = "",
    sortKey = "question",
    sortOrder = "asc",
    page = 1,
    pageSizeOverride?: number
  ) => {
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

  useEffect(() => {
    fetchFaqs();
  }, []);



  const handleEdit = (id: string) => {
    const selectedFaq = faqs.find((faq) => faq._id === id);
    if (selectedFaq) {
      setFaqInfo(selectedFaq);
      setIsEditModalOpen(true);
    }
  };

  const updateFAQs = async (values: IFAQItem) => {
    if (!values._id) return;
    setLoading(true);
    try {
      const res = await apiCall({
        endPoint: `${API_ROUTES.ADMIN.FAQS}/${values._id}`,
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
    if (!faq._id) return;
    setLoading(true);
    try {
      const res = await apiCall({
        endPoint: `${API_ROUTES.ADMIN.FAQS}/${faq._id}`,
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
  const faqsWithId = faqs.map((faq) => ({ ...faq, id: faq._id || "" }));

  // Columns for DynamicTable
  const columns: import("@/utils/interface").ColumnConfig<
    IFAQItem & { id: string }
  >[] = [
    {
      key: "question",
      label: "Question",
      sortable: true,
      textAlign: "left",
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

  const navigateToCreate = () => router.push(ROUTES.ADMIN.CREATE_FAQs)

  return (
    <div className="relative">
      {(loading || deletingId) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Loader size={48} colorClass="text-[var(--base)]" />
        </div>
      )}
      <DynamicTable
        data={faqsWithId}
        columns={columns}
        actions={(row) => (
          <div className="flex gap-2 justify-end">
            <button
              title="edit"
              className="text-[var(--base)] hover:text-[var(--base-hover)]"
              onClick={() => handleEdit(row._id as string)}
            >
              <Edit size={16} />
            </button>
            <button
              title="delete"
              className="text-red-500 hover:text-red-700"
              onClick={() => handleOpenDeleteModal(row)}
            >
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
      />
      <EditFaqModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        saveChanges={updateFAQs}
        faqsValues={faqInfo as IFAQItem}
      />
      <DeleteFaqModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onDelete={handleDeleteFaq}
        faqsValues={deleteFaqInfo as IFAQItem}
      />
    </div>
  );
};

export default AdminFAQs;

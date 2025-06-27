"use client";
import { useEffect, useState, useMemo } from "react";
import { apiCall } from "@/utils/apiCall";
import { DynamicTable } from "@/components/common/DynamicTables";
import { ColumnConfig } from "@/utils/interface";
import ModalLayout from "@/components/common/Modals/CommonModalLayout";
import { FiEye } from "react-icons/fi";
import { Mail, CheckCircle, Sparkles } from "lucide-react";
import Loader from "@/components/common/Loader";
import { toast } from "react-toastify";
import { API_ROUTES } from "@/utils/constant";
import { ISupportRequest, ISupportRequestApiResponse } from "./types";

const SupportRequestsPage = () => {
  const [requests, setRequests] = useState<ISupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRequest, setModalRequest] = useState<ISupportRequest | null>(null);
  const [statusLoading, setStatusLoading] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 1, totalPages: 1 });
  const [sortKey, setSortKey] = useState<keyof ISupportRequest | string>("name");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [aiMailLoadingId, setAiMailLoadingId] = useState<string | null>(null);

  const fetchRequests = async (
    searchTerm = "",
    sortKeyParam = "name",
    sortOrderParam = "asc",
    page = 1,
    pageSizeOverride?: number
  ) => {
    setLoading(true);
    const pageSize = pageSizeOverride ?? pagination.pageSize;
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(searchTerm && { search: searchTerm }),
      ...(sortKeyParam && { sortBy: sortKeyParam }),
      ...(sortKeyParam && sortOrderParam && { sortOrder: sortOrderParam }),
    });
    try {
      const res: ISupportRequestApiResponse = await apiCall({
        endPoint: `${API_ROUTES.CONTACT_US}?${params.toString()}`,
        method: "GET",
        withToken: true,
      });
      if (res && res.status === 200) {
        setRequests(res.data.map((r: any) => ({ ...r, id: r._id, responded: r.status === 'responded' })));
        setPagination(res.meta);
      } else {
        setError(res?.message || "Failed to fetch support requests.");
      }
    } catch (err) {
      setError("Failed to fetch support requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Selection logic
  const allVisibleIds = useMemo(() => requests.map((r) => r.id), [requests]);
  const allSelected = useMemo(() => allVisibleIds.length > 0 && allVisibleIds.every((id) => selected.includes(id)), [selected, allVisibleIds]);
  const isSelected = (id: string) => selected.includes(id);
  const toggleSelect = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]);
  };
  const toggleSelectAll = () => {
    if (allSelected) setSelected((prev) => prev.filter((id) => !allVisibleIds.includes(id)));
    else setSelected((prev) => Array.from(new Set([...prev, ...allVisibleIds])));
  };

  // Table columns
  const columns: ColumnConfig<ISupportRequest>[] = [
    {
      key: "id",
      label: (
        <div className="flex justify-center items-center">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
            aria-label="Select all requests"
            className="w-4 h-4 accent-[var(--base)] border-2 border-[var(--base)] rounded focus:outline-none focus:ring-0"
            style={{ minWidth: 16, minHeight: 16 }}
          />
        </div>
      ) as any,
      render: (_v, row) => (
        <div className="flex justify-center items-center">
          <input
            type="checkbox"
            checked={isSelected(row.id)}
            onChange={() => toggleSelect(row.id)}
            aria-label={`Select request from ${row.name}`}
            className="w-4 h-4 accent-[var(--base)] border-2 border-[var(--base)] rounded focus:outline-none focus:ring-0"
            style={{ minWidth: 16, minHeight: 16 }}
          />
        </div>
      ),
      textAlign: "center",
    },
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "subject", label: "Subject", sortable: true },
    {
      key: "status",
      label: "Status",
      render: (_v, row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${row.responded ? "bg-green-100 text-green" : "bg-yellow-100 text-yellow-700"}`}>
          {row.responded ? "Responded" : "Pending"}
        </span>
      ),
      textAlign: "center",
      sortable: true,
    },
    {
      key: "actions" as any,
      label: "Actions",
      render: (_v, row) => (
        <div className="flex gap-1 items-center justify-center">
          <a
            href={`mailto:${row.email}?subject=${encodeURIComponent(row.subject)}&body=${encodeURIComponent(row.message)}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Send Email"
            className="p-2 rounded hover:bg-[var(--base)]/10 text-[var(--base)]"
          >
            <Mail size={18} />
          </a>
          <button
            onClick={async () => {
              setAiMailLoadingId(row.id);
              try {
                const response = await apiCall({
                  endPoint: API_ROUTES.ADMIN.AI_GENERATE_MAIL,
                  method: "POST",
                  body: { subject: row.subject, message: row.message },
                  withToken: true,
                });
                if (response && response.success) {
                  const aiSubject = response.data.responseSubject;
                  const aiBody = response.data.responseMessage;
                  const mailto = `mailto:${row.email}?subject=${encodeURIComponent(aiSubject)}&body=${encodeURIComponent(aiBody)}`;
                  window.location.href = mailto;
                } else {
                  toast.error("Failed to generate AI mail reply");
                }
              } catch (err) {
                toast.error("Failed to generate AI mail reply");
              } finally {
                setAiMailLoadingId(null);
              }
            }}
            title="AI Mail Reply"
            className="p-2 rounded hover:bg-[var(--base)]/10 text-[var(--base)]"
            disabled={aiMailLoadingId === row.id}
          >
            {aiMailLoadingId === row.id ? (
              <span className="animate-spin"><Sparkles size={18} /></span>
            ) : (
              <Sparkles size={18} />
            )}
          </button>
          <button
            onClick={() => {
              setModalRequest(row);
              setModalOpen(true);
            }}
            title="View Details"
            className="p-2 rounded hover:bg-[var(--base)]/10 text-[var(--base)]"
          >
            <FiEye size={18} />
          </button>
          <button
            onClick={async () => {
              if (!row.responded && !statusLoading) {
                setStatusLoading(row.id);
                try {
                  const response = await apiCall({
                    endPoint: `${API_ROUTES.CONTACT_US}/${row.id}/status`,
                    method: "PATCH",
                    body: { status: "responded" },
                    withToken: true,
                  });
                  if (response && response.success) {
                    setRequests((prev) => prev.map((r) => r.id === row.id ? { ...r, responded: true } : r));
                    toast.success("Support request marked as responded");
                  } else {
                    toast.error(response?.message || "Failed to update status");
                    console.error("API error:", response);
                  }
                } catch (err: any) {
                  toast.error("Failed to update status");
                  console.error("API exception:", err);
                } finally {
                  setStatusLoading(null);
                }
              }
            }}
            disabled={row.responded || statusLoading === row.id}
            title={row.responded ? "Already Responded" : "Mark as Responded"}
            className={`p-2 rounded ${row.responded ? "text-[var(--base)] !cursor-not-allowed" : "hover:bg-[var(--base)]/10 text-[var(--text-semi-dark)]/90"}`}
          >
            {statusLoading === row.id ? (
              <Loader size={18} colorClass="text-[var(--base)]" />
            ) : (
              <CheckCircle size={18} />
            )}
          </button>
        </div>
      ),
      textAlign: "center",
    },
  ];

  // Bulk delete handler
  const handleBulkDelete = async () => {
    // Only delete selected IDs that are currently visible (filtered)
    const toDelete = selected.filter((id) => allVisibleIds.includes(id));
    if (toDelete.length === 0) return;
    setDeleting(true);
    try {
      const response = await apiCall({
        endPoint: API_ROUTES.ADMIN.CONTACT_US_BULK,
        method: "POST",
        body: { ids: toDelete },
        withToken: true,
      });
      if (response && response.success) {
        setRequests((prev) => prev.filter((r) => !toDelete.includes(r.id)));
        setSelected((prev) => prev.filter((id) => !toDelete.includes(id)));
        toast.success("Support requests deleted successfully");
      } else {
        toast.error(response?.message || "Failed to delete support requests.");
      }
    } catch (err) {
      toast.error("Failed to delete support requests.");
    } finally {
      setDeleting(false);
    }
  };

  // Search/sort handler for DynamicTable
  const handleSearchSort = (
    search: string,
    sortKeyParam: keyof ISupportRequest,
    sortOrderParam: 'asc' | 'desc',
    page: number
  ) => {
    setSearchQuery(search);
    setSortKey(sortKeyParam);
    setSortOrder(sortOrderParam);
    fetchRequests(search, sortKeyParam, sortOrderParam, page);
  };

  return (
    <section className="">
      <div className="max-w-7xl mx-auto">
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <Loader size={48} colorClass="text-[var(--base)]" />
          </div>
        )}
        {error ? (
          <div className="text-center text-red-600 font-medium py-8">{error}</div>
        ) : (
          <DynamicTable<ISupportRequest>
            data={requests}
            columns={columns}
            actions={undefined}
            totalPages={pagination.totalPages}
            handlePageChange={(page) => fetchRequests(searchQuery, sortKey, sortOrder, page)}
            currentPage={pagination.page}
            title="Support Requests"
            onClickCreateButton={handleBulkDelete}
            hasDeleteButton
            isCreateButtonDisabled={!(selected.length > 0 && !deleting)}
            searchPlaceholder="Search requests..."
            onSearchSort={handleSearchSort}
            pageSize={pagination.pageSize}
            onPageSizeChange={(size) => {
              setPagination((prev) => ({ ...prev, pageSize: size, page: 1 }));
              fetchRequests(searchQuery, sortKey, sortOrder, 1, size);
            }}
          />
        )}
      </div>
      {modalOpen && modalRequest && (
        <ModalLayout
          onClose={() => setModalOpen(false)}
          modalTitle="Support Request Details"
        >
          <div className="py-6 space-y-4">
            <div>
              <span className="font-semibold text-[var(--text-dark)]">Name: </span>
              <span>{modalRequest.name}</span>
            </div>
            <div>
              <span className="font-semibold text-[var(--text-dark)]">Email: </span>
              <span>{modalRequest.email}</span>
            </div>
            <div>
              <span className="font-semibold text-[var(--text-dark)]">Subject: </span>
              <span>{modalRequest.subject}</span>
            </div>
            <div>
              <span className="font-semibold text-[var(--text-dark)]">Message: </span>
              <span className="block whitespace-pre-line break-words mt-1 text-[var(--text-semi-dark)]">{modalRequest.message}</span>
            </div>
          </div>
        </ModalLayout>
      )}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Loader size={48} colorClass="text-[var(--base)]" />
        </div>
      )}
    </section>
  );
};

export default SupportRequestsPage; 
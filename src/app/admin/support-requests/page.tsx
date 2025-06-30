"use client";
import { useEffect, useState, useMemo } from "react";
import { apiCall } from "@/utils/apiCall";
import { DynamicTable } from "@/components/common/DynamicTables";
import { ColumnConfig } from "@/utils/interface";
import { FiEye } from "react-icons/fi";
import { Mail, CheckCircle, Sparkles } from "lucide-react";
import Loader from "@/components/common/Loader";
import { toast } from "react-toastify";
import { API_ROUTES } from "@/utils/constant";
import { ISupportRequest, ISupportRequestApiResponse } from "./types";
import ModalLayout from "@/components/common/Modals/CommonModalLayout";

const SupportRequestsPage = () => {
  const [requests, setRequests] = useState<ISupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRequest, setModalRequest] = useState<ISupportRequest | null>(null);
  const [statusLoading, setStatusLoading] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 1,
    totalPages: 1,
  });
  const [sortKey, setSortKey] = useState<keyof ISupportRequest | string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [aiMailLoadingId, setAiMailLoadingId] = useState<number | null>(null);

  const fetchRequests = async (searchTerm = "", sortKeyParam = "name", sortOrderParam = "asc", page = 1, pageSizeOverride?: number) => {
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
        const formatted = res.data.map((r) => ({
          ...r,
          responded: r.status === "responded",
        }));
        setRequests(formatted);
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

  const allVisibleIds = useMemo(() => requests.map((r) => r.id), [requests]);
  const allSelected = useMemo(() => allVisibleIds.length > 0 && allVisibleIds.every((id) => selected.includes(id)), [selected, allVisibleIds]);
  const isSelected = (id: number) => selected.includes(id);
  const toggleSelect = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]));
  };
  const toggleSelectAll = () => {
    if (allSelected) setSelected((prev) => prev.filter((id) => !allVisibleIds.includes(id)));
    else setSelected((prev) => Array.from(new Set([...prev, ...allVisibleIds])));
  };

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
    {
      key: "email",
      label: "Email",
      sortable: true,
      render: (value) => (
        <div className="max-w-[200px] truncate" title={String(value)}>
          {String(value) || "---"}
        </div>
      ),
    },
    {
      key: "subject",
      label: "Subject",
      sortable: true,
      render: (value) => (
        <div className="max-w-[250px] truncate" title={String(value)}>
          {String(value) || "---"}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (_v, row) => (
        <div className="flex justify-center">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${row.responded ? "bg-green-100 text-green" : "bg-yellow-100 text-yellow-700"}`}
          >
            {row.responded ? "Responded" : "Pending"}
          </span>
        </div>
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
              <span className="animate-spin">
                <Sparkles size={18} />
              </span>
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
                    method: "PUT",
                    body: { status: "responded" },
                    withToken: true,
                  });
                  if (response && response.success) {
                    setRequests((prev) => prev.map((r) => (r.id === row.id ? { ...r, responded: true } : r)));
                    toast.success("Support request marked as responded");
                  } else {
                    toast.error(response?.message || "Failed to update status");
                  }
                } catch (err: any) {
                  toast.error("Failed to update status");
                } finally {
                  setStatusLoading(null);
                }
              }
            }}
            disabled={row.responded || statusLoading === row.id}
            title={row.responded ? "Already Responded" : "Mark as Responded"}
            className={`p-2 rounded ${
              row.responded ? "text-[var(--base)] !cursor-not-allowed" : "hover:bg-[var(--base)]/10 text-[var(--text-semi-dark)]/90"
            }`}
          >
            <div className="flex items-center justify-center w-6 h-6">
              {statusLoading === row.id ? <Loader size={18} colorClass="text-[var(--base)]" /> : <CheckCircle size={18} />}
            </div>
          </button>
        </div>
      ),
      textAlign: "center",
    },
  ];

  const handleBulkDelete = async () => {
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

  const handleSearchSort = (search: string, sortKeyParam: keyof ISupportRequest, sortOrderParam: "asc" | "desc", page: number) => {
    setSearchQuery(search);
    setSortKey(sortKeyParam);
    setSortOrder(sortOrderParam);
    fetchRequests(search, sortKeyParam, sortOrderParam, page);
  };

  return (
    <section>
      <div className="max-w-7xl mx-auto">
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
            loading={loading}
          />
        )}
      </div>

      {modalOpen && modalRequest && (
        <ModalLayout onClose={() => setModalOpen(false)} modalTitle="Support Request Details" maxWidth="max-w-2xl">
          <div className="sm:px-1 px-1 sm:pb-8 pb-6 sm:pt-2 pt-2 space-y-6">
            <div className="flex flex-col sm:flex-row gap-2">
              <span className="font-semibold text-[var(--base)] w-24 shrink-0">Name:</span>
              <span className="text-[var(--text-dark)] text-base flex-1 break-words">{modalRequest.name}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <span className="font-semibold text-[var(--base)] w-24 shrink-0">Email:</span>
              <span className="text-[var(--text-dark)] text-base flex-1 break-words">{modalRequest.email}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <span className="font-semibold text-[var(--base)] w-24 shrink-0">Subject:</span>
              <span className="text-[var(--text-dark)] text-base flex-1 break-words">{modalRequest.subject}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <span className="font-semibold text-[var(--base)] w-24 shrink-0">Message:</span>
              <span className="text-[var(--text-dark)] text-base flex-1 break-words whitespace-pre-line">{modalRequest.message}</span>
            </div>
            <button
              className="mt-4 w-full py-2 rounded bg-[var(--base)] text-white font-semibold hover:bg-[var(--base-hover)] transition"
              onClick={() => setModalOpen(false)}
            >
              Close
            </button>
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

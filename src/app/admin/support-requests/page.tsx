"use client";
import { useEffect, useState, useMemo } from "react";
import { apiCall } from "@/utils/apiCall";
import { DynamicTable } from "@/components/common/DynamicTables";
import { ColumnConfig } from "@/utils/interface";
import ModalLayout from "@/components/common/Modals/CommonModalLayout";
import { FiEye } from "react-icons/fi";
import { Mail, CheckCircle } from "lucide-react";
import Loader from "@/components/common/Loader";
import { getAuthToken } from "@/utils/helper";
import { toast } from "react-toastify";
import { API_ROUTES, MESSAGES } from "@/utils/constant";

interface SupportRequest {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  responded?: boolean;
  _id: string;
}

const SupportRequestsPage = () => {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRequest, setModalRequest] = useState<SupportRequest | null>(null);
  const [statusLoading, setStatusLoading] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [filteredRequests, setFilteredRequests] = useState<SupportRequest[]>([]);

  // Pagination (for now, just page 1)
  const [currentPage] = useState(1);
  const [totalPages] = useState(1);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await apiCall({
          endPoint: API_ROUTES.CONTACT_US,
          method: "GET",
          withToken: true,
        });
        if (res && res.success && Array.isArray(res.data)) {
          setRequests(res.data.map((r: any) => ({
            ...r,
            id: r._id,
            responded: r.status === 'responded',
          })));
        } else {
          setError(res?.message || "Failed to fetch support requests.");
        }
      } catch (err) {
        setError("Failed to fetch support requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  useEffect(() => {
    // When requests change, reset filteredRequests
    setFilteredRequests(requests);
  }, [requests]);

  // Selection logic
  const allVisibleIds = useMemo(() => filteredRequests.map((r) => r.id), [filteredRequests]);
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
  const columns: ColumnConfig<SupportRequest>[] = [
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
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "subject", label: "Subject" },
    {
      key: "status",
      label: "Status",
      render: (_v, row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${row.responded ? "bg-green-100 text-green" : "bg-yellow-100 text-yellow-700"}`}>
          {row.responded ? "Responded" : "Pending"}
        </span>
      ),
      textAlign: "center",
    },
    {
      key: "actions" as any,
      label: "Actions",
      render: (_v, row) => (
        <div className="flex gap-1 items-center justify-center">
          <a
            href={`mailto:${row.email}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Send Email"
            className="p-2 rounded hover:bg-[var(--base)]/10 text-[var(--base)]"
          >
            <Mail size={18} />
          </a>
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
                    toast.success(MESSAGES.CONTACT_US.STATUS_UPDATE_SUCCESS)
                  } else {
                    toast.error(response?.message || MESSAGES.CONTACT_US.STATUS_UPDATE_ERROR);
                    console.error("API error:", response);
                  }
                } catch (err: any) {
                  toast.error(MESSAGES.CONTACT_US.STATUS_UPDATE_ERROR);
                  console.error("API exception:", err);
                } finally {
                  setStatusLoading(null);
                }
              }
            }}
            disabled={row.responded || statusLoading === row.id}
            title={row.responded ? "Already Responded" : "Mark as Responded"}
            className={`p-2 rounded ${row.responded ? "text-[var(--base)] !cursor-not-allowed" : "hover:bg-[var(--base)]/10 text-[var(--text-semi-dark)]/50"}`}
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
        toast.success(MESSAGES.CONTACT_US.BULK_DELETE_SUCCESS);
      } else {
        toast.error(response?.message || MESSAGES.CONTACT_US.BULK_DELETE_ERROR);
      }
    } catch (err) {
      toast.error(MESSAGES.CONTACT_US.BULK_DELETE_ERROR);
    } finally {
      setDeleting(false);
    }
  };

  // Search/sort handler for DynamicTable
  const handleSearchSort = (search: string) => {
    if (!search) {
      setFilteredRequests(requests);
      return;
    }
    const lower = search.toLowerCase();
    setFilteredRequests(
      requests.filter(
        (r) =>
          r.name?.toLowerCase().includes(lower) ||
          r.email?.toLowerCase().includes(lower) ||
          r.subject?.toLowerCase().includes(lower) ||
          r.message?.toLowerCase().includes(lower)
      )
    );
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
          <DynamicTable<SupportRequest>
            data={filteredRequests}
            columns={columns}
            actions={undefined}
            totalPages={totalPages}
            handlePageChange={() => {}}
            currentPage={currentPage}
            title="Support Requests"
            onClickCreateButton={handleBulkDelete}
            hasDeleteButton
            isCreateButtonDisabled={!(selected.length > 0 && !deleting)}
            searchPlaceholder="Search requests..."
            onSearchSort={handleSearchSort}
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
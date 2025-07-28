'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import moment from 'moment';
import { MessageCircle, Eye, CheckCircle, Clock, Star, User, Briefcase, ArrowLeft, XCircle } from 'lucide-react';
import { apiCall } from '@/utils/apiCall';
import { Button } from '@/components/ui/button';
import { FiEye } from 'react-icons/fi';
import { DynamicTable } from '@/components/common/DynamicTables';

type DisputeStatus = 'pending' | 'under_review' | 'resolved';
type DisputeDecision = 'user_won' | 'provider_won' | null;

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T, index: number) => React.ReactNode;
  textAlign?: "left" | "center" | "right";
}

interface IDispute {
  id: number;
  gigId: string;
  gigTitle: string;
  userId: string;
  userImage: string;
  userName: string;
  providerId: string;
  providerName: string;
  providerImage: string;
  rating: number;
  status: DisputeStatus;
  complaintDate: string;
  userFeedback: string;
  userIssue: string;
  userExpectation: string;
  providerResponse: string;
  lastActivity: string;
  decision?: DisputeDecision;
  resolvedAt?: string;
  adminNotes?: string;
}

interface IPagination {
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
}

const tabs = ["All", "Pending", "Under Review", "Resolved"];

export default function AdminDisputeDashboard() {
  const router = useRouter();

  const [disputes, setDisputes] = useState<IDispute[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<IDispute | null>(null);
  const [tab, setTab] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    search: "",
    sortBy: "created_at",
    sortOrder: "desc",
  });

  const queryParamsRef = useRef(queryParams);
  queryParamsRef.current = queryParams;

  const fetchDisputes = async (tab: string) => {
    setLoading(true);

    const { page, pageSize, search, sortBy, sortOrder } = queryParamsRef.current;
    try {
      const response = await apiCall({
        method: "GET",
        endPoint: `/rating/get-depute-gigs?status=${tab.toLowerCase().replace(/\s+/g, '_')}&page=${page}&pageSize=${pageSize}&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      });
      if (response?.data) {
        setDisputes(response.data);
        setTotalPages(response.meta.totalPages);
      } else if (!response?.success) {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error("Failed to fetch disputes. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDisputes('all');
  }, [queryParams]);

  const handleStartChat = async (otherUserId: string) => {
    try {
      const response = await apiCall({
        endPoint: "/chats",
        method: "POST",
        body: { userId: Number(otherUserId) },
      });
      if (response?.success) {
        router.push(`/admin/chat?userId=${otherUserId}`);
      } else {
        toast.error(response.message || "Failed to start chat. Please try again.");
      }
    } catch (err) {
      toast.error("Failed to start chat. Please try again.");
    }
  };

  const markUnderReview = async (complaintId: number) => {
    try {
      const response = await apiCall({
        method: "POST",
        endPoint: `/rating/mark-under-review/${complaintId}`,
      });
      if (response?.success) {
        toast.success("Marked under review successfully!");
        setSelectedDispute(prev => ({
          ...prev!,
          status: 'under_review'
        }));
      } else if (!response?.success) {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error("Failed to mark under review. Please try again.");
    }
  };

  const markResolvedDispute = async (complaintId: number) => {
    try {
      const response = await apiCall({
        method: "POST",
        body: {
          admin_notes: selectedDispute?.adminNotes,
          outcome: selectedDispute?.decision
        },
        endPoint: `/rating/mark-dispute-resolved/${complaintId}`,
      });
      if (response?.success) {
        toast.success("Marked resolved successfully!");
        setSelectedDispute(prev => ({
          ...prev!,
          status: 'resolved'
        }));
      } else if (!response?.success) {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error("Failed to mark resolved. Please try again.");
    }
  };

  const handleSearchSort = (searchTerm: string, key: string, order: string) => {
    setQueryParams((prev) => ({
      ...prev,
      page: 1,
      sortOrder: order,
      search: searchTerm,
      sortBy: key ? key : "created_at",
    }));
  };

  const handlePageChange = (page: number) => {
    setQueryParams((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setQueryParams((prev) => ({ ...prev, pageSize, page: 1 }));
  };

  const handleTabChange = (tab: string) => {
    setTab(tab);
    fetchDisputes(tab);
  };

  const handleDecision = (decision: DisputeDecision) => {
    setSelectedDispute(prev => ({
      ...prev!,
      decision
    }));
  };

  const getStatusColor = (status: DisputeStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: DisputeStatus) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'under_review': return <Eye className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return moment(dateString).format('DD/MM/YYYY hh:mm A');
  };

  const renderTabUI = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white w-full border-b border-gray-300">
          <div className="relative flex w-full">
            {tabs.map((tabItem, index) => (
              <button
                key={index}
                onClick={() => handleTabChange(tabItem)}
                className={`relative pb-3 px-3 sm:px-4 text-sm sm:text-base font-medium transition-all duration-200 cursor-pointer whitespace-nowrap flex-shrink-0 ${tab === tabItem
                  ? "text-[var(--base)] after:content-[''] after:absolute after:-bottom-[1px] after:left-0 after:w-full after:h-[2px] after:bg-[var(--base)]"
                  : "text-gray-600 hover:text-[var(--base)]"
                  }`}
              >
                {tabItem}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderHeaderSection = (selectedDispute: IDispute) => {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedDispute(null)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dispute Details</h1>
              <p className="text-gray-600">Case ID: {selectedDispute.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(selectedDispute.status)}`}>
              {getStatusIcon(selectedDispute.status)}
              <span className="capitalize">{selectedDispute.status.replace('_', ' ')}</span>
            </span>
            {selectedDispute.status === 'pending' && (
              <button
                onClick={() => markUnderReview(selectedDispute.id)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Mark Under Review
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const renderGigInfoSection = (selectedDispute: IDispute) => {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 pt-4 pb-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Gig Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Gig Title</p>
            <p className="font-medium">{selectedDispute.gigTitle}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Rating Given</p>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < selectedDispute.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">({selectedDispute.rating}/5)</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">User Complaint</p>
            <p className="font-medium">{formatDate(selectedDispute.complaintDate)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Last Activity</p>
            <p className="font-medium">{formatDate(selectedDispute.lastActivity)}</p>
          </div>
        </div>
      </div>
    );
  }

  const renderUserProviderDetails = (selectedDispute: IDispute) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {renderUserDetails(selectedDispute)}
        {renderProviderDetails(selectedDispute)}
      </div>
    );
  }

  const AvatarWithFallback = ({ src, alt, className, name }: { src?: string; alt: string; className: string; name: string }) => {
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
      setHasError(true);
    };

    if (hasError || !src) {
      return (
        <div className={`${className} bg-[var(--base)] text-white rounded-full flex items-center justify-center font-semibold text-lg sm:text-2xl flex-shrink-0`}>
          {name.charAt(0).toUpperCase()}
        </div>
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={handleError}
      />
    );
  };

  const renderUserDetails = (selectedDispute: IDispute) => {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <AvatarWithFallback
              className="w-12 h-12 rounded-full"
              src={selectedDispute.userImage}
              alt={selectedDispute.userName}
              name={selectedDispute.userName}
            />
            <div>
              <h3 className="font-semibold text-gray-900">User (Complainant)</h3>
              <p className="text-gray-600">{selectedDispute.userName}</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => handleStartChat(selectedDispute.userId)}
          >
            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Message
          </Button>
        </div>
        <div className='mb-4'>
          <p className="text-sm text-gray-500 mb-2">User feedback</p>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedDispute.userFeedback}</p>
        </div>
        <div className='mb-4'>
          <p className="text-sm text-gray-500 mb-2">Issue reported</p>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedDispute.userIssue}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2">What should have been done by provider</p>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedDispute.userExpectation}</p>
        </div>
      </div>
    );
  }

  const renderProviderDetails = (selectedDispute: IDispute) => {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <AvatarWithFallback
              className="w-12 h-12 rounded-full"
              src={selectedDispute.providerImage}
              alt={selectedDispute.providerName}
              name={selectedDispute.providerName}
            />
            <div>
              <h3 className="font-semibold text-gray-900">Provider (Defendant)</h3>
              <p className="text-gray-600">{selectedDispute.providerName}</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => handleStartChat(selectedDispute.providerId)}
          >
            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Message
          </Button>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2">Response</p>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedDispute.providerResponse}</p>
        </div>
      </div>
    );
  }

  const renderResolutionSection = (selectedDispute: IDispute) => {
    if (selectedDispute.status === 'resolved') {
      return (
        <div className="bg-white rounded-lg shadow-sm border p-6 pt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resolution</h3>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">
                Resolved in favor of {selectedDispute.decision === 'user_won' ? 'User' : 'Provider'}
              </span>
            </div>
            <p className="text-green-800">Resolved on {formatDate(selectedDispute.resolvedAt!)}</p>
            {selectedDispute.adminNotes && (
              <p className="text-green-700 mt-2">{selectedDispute.adminNotes}</p>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-white rounded-lg shadow-sm border p-6 pt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Make Decision</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => handleDecision('user_won')}
              className={`justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-gray-100 hover:bg-gray-200 hover:text-gray-900 h-10 px-4 py-2 flex items-center gap-2
                ${selectedDispute.decision === "user_won" && "text-white hover:text-white bg-teal-600 hover:bg-teal-700"}
              `}
            >
              <CheckCircle className="w-5 h-5" />
              <span>Favor User</span>
            </button>
            <button
              onClick={() => handleDecision('provider_won')}
              className={`justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-gray-100 hover:bg-gray-200 hover:text-gray-900 h-10 px-4 py-2 flex items-center gap-2
                ${selectedDispute.decision === "provider_won" && "text-white hover:text-white bg-teal-600 hover:bg-teal-700"}
              `}
            >
              <CheckCircle className="w-5 h-5" />
              <span>Favor Provider</span>
            </button>
          </div>
          <div className='mt-4'>
            <div className="text-sm font-medium mb-2">Resolution Notes (Required)</div>
            <textarea
              rows={3}
              name="adminNotes"
              value={selectedDispute?.adminNotes}
              onChange={(e) => setSelectedDispute({ ...selectedDispute!, adminNotes: e.target.value })}
              className="w-full bg-gray-50 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[var(--base)] focus:border-[var(--base)] transition-colors resize-none text-black"
              placeholder="Explain your decision and any action taken..."
            />
          </div>
          <div className='flex gap-2 mt-4'>
            <button
              disabled={!(selectedDispute.decision === "user_won" || selectedDispute.decision === "provider_won") || !selectedDispute.adminNotes?.trim()}
              onClick={() => markResolvedDispute(selectedDispute.id)}
              className="justify-center whitespace-nowrap rounded-md text-white text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input h-10 px-4 py-2 flex items-center gap-2 bg-green-500 hover:bg-green-600"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Resolve Dispute</span>
            </button>
          </div>
        </div>
      );
    }
  }

  if (selectedDispute) {
    return (
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto">
          {renderHeaderSection(selectedDispute)}
          {renderGigInfoSection(selectedDispute)}
          {renderUserProviderDetails(selectedDispute)}
          {renderResolutionSection(selectedDispute)}
        </div>
      </div>
    );
  }

  const tableHeaders = [
    {
      label: 'Case ID',
      key: 'id',
      sortable: true
    },
    {
      label: 'Gig',
      key: 'gigTitle',
      sortable: true
    },
    {
      label: 'User',
      key: 'userName',
      sortable: true
    },
    {
      label: 'Provider',
      key: 'providerName',
      sortable: true
    },
    {
      label: 'Rating',
      key: 'rating',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < row.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
          ))}
        </div>
      )
    },
    {
      label: 'Status',
      key: 'status',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center">
          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(row.status)}`}>
            {getStatusIcon(row.status)}
            <span className="capitalize">{row.status.replace('_', ' ')}</span>
          </span>
        </div>
      )
    },
    {
      label: 'Complaint Date',
      key: 'complaintDate',
      sortable: true,
      render: (_, row) => (
        <div className="text-sm text-gray-600">
          {formatDate(row.complaintDate)}
        </div>
      )
    },
  ] as Column<IDispute>[];

  return (
    <div>
      {renderTabUI()}
      <DynamicTable<IDispute>
        title=""
        data={disputes.map((dispute) => ({ ...dispute, id: Number(dispute.id) }))}
        columns={tableHeaders}
        searchPlaceholder='Search...'
        loading={loading}
        totalPages={totalPages}
        currentPage={queryParams.page}
        pageSize={queryParams.pageSize}
        onSearchSort={handleSearchSort}
        handlePageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        actions={(row) => (
          <div className="whitespace-nowrap text-sm font-medium text-center">
            <button
              title="View Details"
              onClick={() => setSelectedDispute(row)}
              className="p-2 rounded hover:bg-[var(--base)]/10 text-[var(--base)]"
            >
              <FiEye size={18} />
            </button>
          </div>
        )}
      />
    </div>
  );
}
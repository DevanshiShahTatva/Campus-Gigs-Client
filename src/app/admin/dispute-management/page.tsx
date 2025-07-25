'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import moment from 'moment';
import { MessageCircle, Eye, CheckCircle, Clock, Star, User, Briefcase, ArrowLeft } from 'lucide-react';
import { CustomTable } from '@/components/common/CustomTable';
import { apiCall } from '@/utils/apiCall';
import { Button } from '@/components/ui/button';
import { FiEye } from 'react-icons/fi';

type DisputeStatus = 'pending' | 'in_review' | 'resolved';
type DisputeDecision = 'favor_user' | 'favor_provider' | null;
type Column<T> = {
  key: keyof T;
  label: string;
  sortable?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, index: number) => React.ReactNode;
}

interface IDispute {
  id: string;
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

const tabs = ["All", "Pending", "In Review", "Resolved"];

export default function AdminDisputeDashboard() {
  const router = useRouter();

  const [disputes, setDisputes] = useState<IDispute[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<IDispute | null>(null);
  const [tab, setTab] = useState<string>("All");

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const response = await apiCall({
          method: "GET",
          endPoint: "/rating/get-all",
        });
        if (response?.data) {
          setDisputes(response.data);
        }
      } catch (err) {
        toast.error("Failed to fetch disputes. Please try again.");
      }
    };

    fetchDisputes();
  }, []);

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

  const getStatusColor = (status: DisputeStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_review': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: DisputeStatus) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in_review': return <Eye className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return moment(dateString).format('DD/MM/YYYY hh:mm A');
  };

  const resolveDispute = (decision: DisputeDecision) => {
    if (!selectedDispute) return;

    setDisputes(prev => prev.map(dispute =>
      dispute.id === selectedDispute.id
        ? {
          ...dispute,
          status: 'resolved',
          decision,
          resolvedAt: new Date().toISOString(),
          adminNotes: `Resolved in favor of ${decision === 'favor_user' ? 'user' : 'provider'}`
        }
        : dispute
    ));

    setSelectedDispute(prev => ({
      ...prev!,
      status: 'resolved',
      decision,
      resolvedAt: new Date().toISOString()
    }));
  };

  const markInReview = (disputeId: string) => {
    setDisputes(prev => prev.map(dispute =>
      dispute.id === disputeId
        ? { ...dispute, status: 'in_review' }
        : dispute
    ));
  };

  const renderTabUI = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white w-full border-b border-gray-300">
          <div className="relative flex w-full">
            {tabs.map((tabItem, index) => (
              <button
                key={index}
                onClick={() => setTab(tabItem)}
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
            {selectedDispute.status !== 'resolved' && (
              <button
                onClick={() => markInReview(selectedDispute.id)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Mark In Review
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const renderGigInfoSection = (selectedDispute: IDispute) => {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
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

  const renderUserDetails = (selectedDispute: IDispute) => {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
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
          <p className="text-sm text-gray-500 mb-2">User Feedback</p>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedDispute.userFeedback}</p>
        </div>
        <div className='mb-4'>
          <p className="text-sm text-gray-500 mb-2">Issue Reported</p>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedDispute.userIssue}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2">What Should Have Been Done By Provider</p>
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
            <div className="p-2 bg-green-100 rounded-lg">
              <Briefcase className="w-5 h-5 text-green-600" />
            </div>
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
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resolution</h3>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">
                Resolved in favor of {selectedDispute.decision === 'favor_user' ? 'User' : 'Provider'}
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
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Make Decision</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => resolveDispute('favor_user')}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Favor User</span>
            </button>
            <button
              onClick={() => resolveDispute('favor_provider')}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Favor Provider</span>
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            This decision will be final and will determine payment release and gig visibility.
          </p>
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
      <CustomTable<IDispute>
        searchPlaceholder='Search by Dispute Name'
        data={disputes}
        columns={tableHeaders}
        actions={(row) => (
          <div className="whitespace-nowrap text-sm font-medium">
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
'use client';

import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

type Call = {
  _id: string;
  stock: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  target: number;
  stopLoss: number;
  entryDate: string;
  expiryDate: string;
  creator: { name: string; email: string };
  createdAt: string;
  status: string;
  attachments?: { name: string; url: string }[];
};

export default function AdminDashboard() {
  const [pendingCalls, setPendingCalls] = useState<Call[]>([]);
  const [approvedCalls, setApprovedCalls] = useState<Call[]>([]);
  const [rejectedCalls, setRejectedCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllCalls();
  }, []);

  async function fetchAllCalls() {
    setLoading(true);
    setError('');
    try {
      // Fetch pending
      const pendingRes = await fetch(`${API_BASE}/api/calls/pending`, { credentials: 'include' });
      const pendingData = await pendingRes.json();
      setPendingCalls(pendingData.data.calls || []);
      // Fetch all non-pending
      const allRes = await fetch(`${API_BASE}/api/calls`, { credentials: 'include' });
      const allData = await allRes.json();
      setApprovedCalls((allData.data.calls || []).filter((c: Call) => c.status === 'APPROVED'));
      setRejectedCalls((allData.data.calls || []).filter((c: Call) => c.status === 'REJECTED'));
    } catch (err) {
      setError('Failed to load calls.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(callId: string, action: 'approve' | 'reject') {
    setActionLoading(callId + action);
    try {
      const res = await fetch(`${API_BASE}/api/calls/${callId}/${action}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to update call status');
      await fetchAllCalls();
    } catch (err) {
      alert('Failed to update call status.');
    } finally {
      setActionLoading(null);
    }
  }

  function getTabCalls() {
    if (activeTab === 'pending') return pendingCalls;
    if (activeTab === 'approved') return approvedCalls;
    if (activeTab === 'rejected') return rejectedCalls;
    return [];
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('pending')}
            className={`${
              activeTab === 'pending'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Pending Calls
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`${
              activeTab === 'approved'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Approved Calls
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`${
              activeTab === 'rejected'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Rejected Calls
          </button>
        </nav>
      </div>

      {/* Calls List */}
      <div className="bg-white shadow rounded-lg">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading calls...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : getTabCalls().length === 0 ? (
          <div className="p-6 text-center text-gray-500">No calls to review</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {getTabCalls().map((call) => (
              <div key={call._id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {call.stock}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Submitted by {call.creator?.name || call.creator?.email || 'N/A'} on{' '}
                      {dayjs(call.createdAt).format('YYYY-MM-DD')}
                    </p>
                  </div>
                  {activeTab === 'pending' && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {}}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleAction(call._id, 'reject')}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        disabled={actionLoading === call._id + 'reject'}
                      >
                        {actionLoading === call._id + 'reject' ? 'Rejecting...' : 'Reject'}
                      </button>
                      <button
                        onClick={() => handleAction(call._id, 'approve')}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        disabled={actionLoading === call._id + 'approve'}
                      >
                        {actionLoading === call._id + 'approve' ? 'Approving...' : 'Approve'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Action</p>
                    <p className="mt-1 text-sm text-gray-900">{call.action}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Target Price</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">₹{call.target}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Stop Loss</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">₹{call.stopLoss}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Expiry Date</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">{call.expiryDate}</p>
                  </div>
                </div>
                {/* Attachments section */}
                {call.attachments && call.attachments.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500 mb-1">Attachments</p>
                    <ul className="space-y-1">
                      {call.attachments.map((file: any, idx: number) => (
                        <li key={idx}>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            {file.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
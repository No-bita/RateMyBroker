'use client';

import { useState, useEffect } from 'react';

type PendingCall = {
  id: string;
  stockSymbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  targetPrice: number;
  stopLoss: number;
  entryDate: string;
  expiryDate: string;
  submittedBy: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
};

export default function AdminDashboard() {
  const [pendingCalls, setPendingCalls] = useState<PendingCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    const fetchPendingCalls = async () => {
      try {
        // TODO: Replace with actual API call
        // Mock data for demonstration
        const mockCalls: PendingCall[] = [
          {
            id: '1',
            stockSymbol: 'RELIANCE',
            action: 'BUY',
            targetPrice: 2500,
            stopLoss: 2200,
            entryDate: '2024-03-01',
            expiryDate: '2024-04-01',
            submittedBy: 'user1',
            submittedAt: '2024-03-01T10:00:00Z',
            status: 'PENDING'
          },
          {
            id: '2',
            stockSymbol: 'TCS',
            action: 'SELL',
            targetPrice: 3800,
            stopLoss: 4000,
            entryDate: '2024-03-05',
            expiryDate: '2024-04-05',
            submittedBy: 'user2',
            submittedAt: '2024-03-05T14:30:00Z',
            status: 'PENDING'
          },
        ];

        setPendingCalls(mockCalls);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pending calls:', error);
        setLoading(false);
      }
    };

    fetchPendingCalls();
  }, []);

  const handleApprove = async (callId: string) => {
    try {
      // TODO: Implement API call to approve the call
      setPendingCalls(prev => prev.filter(call => call.id !== callId));
    } catch (error) {
      console.error('Error approving call:', error);
    }
  };

  const handleReject = async (callId: string) => {
    try {
      // TODO: Implement API call to reject the call
      setPendingCalls(prev => prev.filter(call => call.id !== callId));
    } catch (error) {
      console.error('Error rejecting call:', error);
    }
  };

  const handleEdit = async (callId: string) => {
    // TODO: Implement edit functionality
    console.log('Edit call:', callId);
  };

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
        ) : pendingCalls.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No calls to review</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {pendingCalls.map((call) => (
              <div key={call.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {call.stockSymbol}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Submitted by {call.submittedBy} on{' '}
                      {new Date(call.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEdit(call.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleReject(call.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(call.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Approve
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Action</p>
                    <p className="mt-1 text-sm text-gray-900">{call.action}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Target Price</p>
                    <p className="mt-1 text-sm text-gray-900">₹{call.targetPrice}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Stop Loss</p>
                    <p className="mt-1 text-sm text-gray-900">₹{call.stopLoss}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Expiry Date</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(call.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
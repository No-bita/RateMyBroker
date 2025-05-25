"use client";
import { useEffect, useState } from "react";

interface Call {
  _id: string;
  stock: string;
  broker: string;
  creator: { name: string; email: string };
  action: "BUY" | "SELL";
  status: string;
  target: number;
  stopLoss: number;
  entryDate: string;
  expiryDate: string;
  currentPrice: number;
  rationale: string;
  riskReward: string;
  tags: string[];
  priceHistory: number[];
  outcomeHistory: Array<{ date: string; status: string }>;
  news: Array<{ title: string; url: string }>;
  comments: Array<{ user: string; text: string }>;
  attachments: Array<{ name: string; url: string }>;
}

export default function AdminCallsPage() {
  const [pendingCalls, setPendingCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingCalls();
  }, []);

  async function fetchPendingCalls() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/calls/pending`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error("Failed to fetch pending calls");
      const data = await res.json();
      setPendingCalls(data.data.calls);
    } catch (err) {
      setError("Could not load pending calls.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(callId: string, action: "approve" | "reject") {
    setActionLoading(callId + action);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/calls/${callId}/${action}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error("Failed to update call status");
      // Remove the call from the list
      setPendingCalls((prev) => prev.filter((c) => c._id !== callId));
    } catch (err) {
      alert("Failed to update call status.");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Pending Calls (Admin Review)</h1>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : pendingCalls.length === 0 ? (
        <div className="text-gray-400">No pending calls to review.</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Broker</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">User</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Action</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Target</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Stop Loss</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Entry Date</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Approve/Reject</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {pendingCalls.map((call) => (
              <tr key={call._id}>
                <td className="px-4 py-2 font-medium text-gray-900">{call.stock}</td>
                <td className="px-4 py-2 text-gray-700">{call.broker}</td>
                <td className="px-4 py-2 text-gray-700">{call.creator?.name || call.creator?.email || 'N/A'}</td>
                <td className={`px-4 py-2 font-semibold ${call.action === 'BUY' ? 'text-green-700' : 'text-red-700'}`}>{call.action}</td>
                <td className="px-4 py-2 text-blue-700 font-semibold">₹{call.target}</td>
                <td className="px-4 py-2 text-blue-700 font-semibold">₹{call.stopLoss}</td>
                <td className="px-4 py-2 text-gray-500">{call.entryDate}</td>
                <td className="px-4 py-2">
                  <button
                    className="px-3 py-1 rounded bg-green-600 text-white font-semibold text-xs mr-2 disabled:opacity-50"
                    disabled={actionLoading === call._id + 'approve'}
                    onClick={() => handleAction(call._id, 'approve')}
                  >
                    {actionLoading === call._id + 'approve' ? 'Approving...' : 'Approve'}
                  </button>
                  <button
                    className="px-3 py-1 rounded bg-red-600 text-white font-semibold text-xs disabled:opacity-50"
                    disabled={actionLoading === call._id + 'reject'}
                    onClick={() => handleAction(call._id, 'reject')}
                  >
                    {actionLoading === call._id + 'reject' ? 'Rejecting...' : 'Reject'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 
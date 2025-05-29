'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CallSubmissionForm from "@/components/CallSubmissionForm";

type Call = {
  id: string;
  stockSymbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  targetPrice: number;
  stopLoss: number;
  entryDate: string;
  status: 'ACTIVE' | 'TARGET_HIT' | 'STOP_LOSS_HIT' | 'EXPIRED';
  score: number;
};

export default function CallsPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCallForm, setShowCallForm] = useState(false);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        // TODO: Replace with actual API call
        // Mock data for demonstration
        const mockCalls: Call[] = [
          {
            id: '1',
            stockSymbol: 'RELIANCE',
            action: 'BUY',
            targetPrice: 2500,
            stopLoss: 2200,
            entryDate: '2024-03-01',
            status: 'ACTIVE',
            score: 0
          },
          {
            id: '2',
            stockSymbol: 'TCS',
            action: 'SELL',
            targetPrice: 3800,
            stopLoss: 4000,
            entryDate: '2024-03-05',
            status: 'ACTIVE',
            score: 0
          },
        ];

        setCalls(mockCalls);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching calls:', error);
        setLoading(false);
      }
    };

    fetchCalls();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Investment Calls</h1>
      <div className="mb-6">
        <button
          className="px-7 py-3 rounded-2xl font-bold text-lg shadow transition bg-[#393B41] text-white hover:bg-[#23242A]"
          onClick={() => setShowCallForm(true)}
        >
          + New Call
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Call Submission Form (now in modal) */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Calls</h2>
            {loading ? (
              <p className="text-gray-600">Loading recent calls...</p>
            ) : (
              <div className="space-y-4">
                {calls.map((call) => (
                  <Link
                    key={call.id}
                    href={`/calls/${call.id}`}
                    className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{call.stockSymbol}</h3>
                        <p className="text-sm text-gray-600">
                          {call.action} • Entry: {new Date(call.entryDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          Target: ₹{call.targetPrice}
                        </p>
                        <p className="text-sm text-gray-600">
                          SL: ₹{call.stopLoss}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className={`px-2 py-1 rounded text-sm ${
                        call.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        call.status === 'TARGET_HIT' ? 'bg-blue-100 text-blue-800' :
                        call.status === 'STOP_LOSS_HIT' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {call.status}
                      </span>
                      <span className="text-sm font-medium">
                        Score: {call.score}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {showCallForm && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowCallForm(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-xl shadow-lg relative"
            onClick={e => e.stopPropagation()}
          >
            <CallSubmissionForm onCancel={() => setShowCallForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
} 
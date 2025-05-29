'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Call } from '@/types/call'; // Adjust import path as needed

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';

export default function BrokerPage() {
  const { brokerName } = useParams();
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchBrokerCalls() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE}/api/calls?broker=${brokerName}`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch broker calls');
        const data = await res.json();
        setCalls(data.calls);
      } catch (error) {
        console.error('Error fetching broker calls:', error);
        setError('Could not load broker calls.');
      } finally {
        setLoading(false);
      }
    }
    fetchBrokerCalls();
  }, [brokerName]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>{brokerName} Calls</h1>
      <table>
        <thead>
          <tr>
            <th>Stock</th>
            <th>Action</th>
            <th>Status</th>
            <th>Entry Date</th>
            <th>Current Price</th>
          </tr>
        </thead>
        <tbody>
          {calls.map(call => (
            <tr key={call._id}>
              <td>{call.stock}</td>
              <td>{call.action}</td>
              <td>{call.status}</td>
              <td>{call.entryDate}</td>
              <td>₹{call.currentPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 
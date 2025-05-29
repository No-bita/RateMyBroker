'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaUserTie, FaStar, FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa';

const mockBrokers = [
  {
    id: '1',
    name: 'Motilal Oswal',
    website: 'https://www.motilaloswal.com/',
    description: 'Motilal Oswal is a leading Indian brokerage with a strong research team and a long track record.'
  },
  {
    id: '2',
    name: 'ICICI Securities',
    website: 'https://www.icicidirect.com/',
    description: 'ICICI Securities is a top full-service broker in India, known for its robust platform and research.'
  },
  {
    id: '3',
    name: 'HDFC Securities',
    website: 'https://www.hdfcsec.com/',
    description: 'HDFC Securities offers a wide range of investment products and insightful research.'
  },
];

const mockCalls = [
  { id: '101', stock: 'RELIANCE', action: 'BUY', status: 'ACTIVE', date: '2024-05-18', target: 2500, stopLoss: 2200 },
  { id: '102', stock: 'TCS', action: 'SELL', status: 'TARGET_HIT', date: '2024-05-17', target: 3800, stopLoss: 4000 },
  { id: '103', stock: 'INFY', action: 'BUY', status: 'STOP_LOSS_HIT', date: '2024-05-16', target: 1600, stopLoss: 1500 },
];

export default function BrokerProfilePage() {
  const params = useParams();
  const broker = mockBrokers.find(b => b.id === params.id);

  if (!broker) {
    return <div className="container mx-auto px-4 py-8">Broker not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/brokers" className="inline-flex items-center text-sm text-indigo-600 hover:underline mb-4">
        <FaArrowLeft className="mr-1" /> Back to Brokers
      </Link>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center gap-4 mb-2">
          <FaUserTie className="text-indigo-400 text-2xl" />
          <h1 className="text-2xl font-bold text-gray-900">{broker.name}</h1>
          <a href={broker.website} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline flex items-center gap-1 text-sm">
            Website <FaExternalLinkAlt />
          </a>
        </div>
        <p className="text-gray-700 mt-2 text-sm">{broker.description}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-indigo-700">Recent Calls</h2>
        <ul className="space-y-3">
          {mockCalls.map((call) => (
            <li key={call.id}>
              <Link
                href={`/calls/${call.id}`}
                className="flex items-center justify-between p-2 rounded hover:bg-indigo-50 focus:bg-indigo-100 transition cursor-pointer"
              >
                <span className="font-medium text-gray-800">{call.stock}</span>
                <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                  call.action === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {call.action}
                </span>
                <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
                  call.status === 'ACTIVE' ? 'bg-yellow-100 text-yellow-800' :
                  call.status === 'TARGET_HIT' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {call.status.replace('_', ' ')}
                </span>
                <span className="ml-2 text-gray-400 text-xs">{call.date}</span>
                <span className="ml-2 text-xs text-gray-500">Target: ₹{call.target}</span>
                <span className="ml-2 text-xs text-gray-500">SL: ₹{call.stopLoss}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 
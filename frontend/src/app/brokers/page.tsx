import { FaUserTie, FaStar } from 'react-icons/fa';
import Link from 'next/link';

const mockBrokers = [
  { id: '1', name: 'Motilal Oswal', website: 'https://www.motilaloswal.com/' },
  { id: '2', name: 'ICICI Securities', website: 'https://www.icicidirect.com/' },
  { id: '3', name: 'HDFC Securities', website: 'https://www.hdfcsec.com/' },
];

export default function BrokersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900">Brokers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockBrokers.map((broker) => (
          <div key={broker.id} className="bg-white rounded-lg shadow p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FaUserTie className="text-indigo-400" />
                <span className="text-lg font-bold text-gray-800">{broker.name}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Link
                href={broker.website}
                target="_blank"
                className="text-xs px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition"
              >
                Website
              </Link>
              <Link
                href={`/brokers/${broker.id}`}
                className="text-xs px-3 py-1 rounded bg-indigo-100 text-indigo-700 font-semibold hover:bg-indigo-200 transition"
              >
                View Profile
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
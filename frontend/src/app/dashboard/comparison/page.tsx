import { FaRegClock } from 'react-icons/fa';

export default function ComparisonComingSoon() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFB]">
      <div className="bg-white rounded-2xl border-2 border-[#F0F1F3] px-10 py-16 flex flex-col items-center shadow-sm">
        <FaRegClock className="text-5xl text-[#A3A3A3] mb-4" />
        <h1 className="text-3xl font-bold text-[#22223B] mb-2">Broker Comparison</h1>
        <p className="text-lg text-gray-500 mb-1">Coming Soon</p>
        <p className="text-sm text-gray-400">We're working hard to bring you this feature. Stay tuned!</p>
      </div>
    </div>
  );
} 
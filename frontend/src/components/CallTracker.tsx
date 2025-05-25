'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type CallData = {
  id: string;
  stockSymbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  targetPrice: number;
  stopLoss: number;
  entryDate: string;
  expiryDate: string;
  currentPrice: number;
  status: 'ACTIVE' | 'TARGET_HIT' | 'STOP_LOSS_HIT' | 'EXPIRED';
  score: number;
};

type PriceData = {
  date: string;
  price: number;
};

export default function CallTracker({ callId }: { callId: string }) {
  const [callData, setCallData] = useState<CallData | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCallData = async () => {
      try {
        // TODO: Replace with actual API call
        // Mock data for demonstration
        const mockCallData: CallData = {
          id: callId,
          stockSymbol: 'RELIANCE',
          action: 'BUY',
          targetPrice: 2500,
          stopLoss: 2200,
          entryDate: '2024-03-01',
          expiryDate: '2024-04-01',
          currentPrice: 2350,
          status: 'ACTIVE',
          score: 0
        };

        const mockPriceHistory: PriceData[] = [
          { date: '2024-03-01', price: 2300 },
          { date: '2024-03-05', price: 2320 },
          { date: '2024-03-10', price: 2350 },
          { date: '2024-03-15', price: 2330 },
          { date: '2024-03-20', price: 2340 },
        ];

        setCallData(mockCallData);
        setPriceHistory(mockPriceHistory);
        setLoading(false);
      } catch (err) {
        setError('Failed to load call data');
        setLoading(false);
      }
    };

    fetchCallData();
  }, [callId]);

  if (loading) {
    return <div className="text-center py-8">Loading call data...</div>;
  }

  if (error || !callData) {
    return <div className="text-center py-8 text-red-600">{error || 'Call not found'}</div>;
  }

  const chartData = {
    labels: priceHistory.map(data => data.date),
    datasets: [
      {
        label: 'Stock Price',
        data: priceHistory.map(data => data.price),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Target Price',
        data: priceHistory.map(() => callData.targetPrice),
        borderColor: 'rgb(34, 197, 94)',
        borderDash: [5, 5],
        tension: 0,
      },
      {
        label: 'Stop Loss',
        data: priceHistory.map(() => callData.stopLoss),
        borderColor: 'rgb(239, 68, 68)',
        borderDash: [5, 5],
        tension: 0,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${callData.stockSymbol} Price Movement`,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Call Details Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Stock</h3>
            <p className="mt-1 text-lg font-semibold">{callData.stockSymbol}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Action</h3>
            <p className="mt-1 text-lg font-semibold">{callData.action}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <p className="mt-1 text-lg font-semibold">{callData.status}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Score</h3>
            <p className="mt-1 text-lg font-semibold">{callData.score}</p>
          </div>
        </div>
      </div>

      {/* Price Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Price Levels */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Current Price</h3>
            <p className="mt-1 text-lg font-semibold">₹{callData.currentPrice}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Target Price</h3>
            <p className="mt-1 text-lg font-semibold text-green-600">₹{callData.targetPrice}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Stop Loss</h3>
            <p className="mt-1 text-lg font-semibold text-red-600">₹{callData.stopLoss}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
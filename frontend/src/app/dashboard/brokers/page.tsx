"use client"
import React, { useState, useEffect } from 'react';
import { FaStar, FaChartLine, FaUserTie, FaExchangeAlt, FaTimes, FaCalendarAlt, FaChartBar, FaHistory } from 'react-icons/fa';
import Image from 'next/image';

interface Broker {
  name: string;
  logo: string;
  totalCallsEquity: number;
  winRateEquity: number;
  totalCallsDerivative: number;
  winRateDerivative: number;
  recentCalls: Array<{
    stock: string;
    action: 'BUY' | 'SELL';
    status: 'ACTIVE' | 'TARGET HIT' | 'STOP LOSS HIT';
    date: string;
    type: 'Equity' | 'Derivative';
  }>;
  equityCalls: number;
  derivativeCalls: number;
  bgColor: string;
  performance: { monthly: number; quarterly: number; yearly: number };
  specialties: string[];
  teamSize: number;
  experience: string;
}

const mockBrokers: Broker[] = [
  {
    name: 'Angel One',
    logo: '/angel.png',
    totalCallsEquity: 30,
    winRateEquity: 68,
    totalCallsDerivative: 15,
    winRateDerivative: 61,
    equityCalls: 30,
    derivativeCalls: 15,
    bgColor: 'bg-[#FF6B6B]',
    performance: { monthly: 0, quarterly: 0, yearly: 0 },
    specialties: [],
    teamSize: 0,
    experience: '',
    recentCalls: [
      { stock: 'RELIANCE', action: 'BUY', status: 'ACTIVE', date: '2024-05-18', type: 'Equity' },
      { stock: 'TCS', action: 'SELL', status: 'TARGET HIT', date: '2024-05-17', type: 'Equity' },
      { stock: 'INFY', action: 'BUY', status: 'ACTIVE', date: '2024-05-14', type: 'Equity' },
      { stock: 'NIFTY FUT', action: 'BUY', status: 'ACTIVE', date: '2024-05-16', type: 'Derivative' },
      { stock: 'BANKNIFTY', action: 'SELL', status: 'TARGET HIT', date: '2024-05-15', type: 'Derivative' },
      { stock: 'FINNIFTY', action: 'SELL', status: 'ACTIVE', date: '2024-05-13', type: 'Derivative' },
    ]
  },
  {
    name: 'HDFC Securities',
    logo: '/hdfc.png',
    totalCallsEquity: 25,
    winRateEquity: 65,
    totalCallsDerivative: 13,
    winRateDerivative: 59,
    equityCalls: 25,
    derivativeCalls: 13,
    bgColor: 'bg-[#4CAF50]',
    performance: { monthly: 0, quarterly: 0, yearly: 0 },
    specialties: [],
    teamSize: 0,
    experience: '',
    recentCalls: [
      { stock: 'HDFCBANK', action: 'BUY', status: 'TARGET HIT', date: '2024-05-16', type: 'Equity' },
      { stock: 'ITC', action: 'BUY', status: 'ACTIVE', date: '2024-05-14', type: 'Equity' },
      { stock: 'SBILIFE', action: 'SELL', status: 'ACTIVE', date: '2024-05-13', type: 'Equity' },
      { stock: 'NIFTY FUT', action: 'SELL', status: 'ACTIVE', date: '2024-05-15', type: 'Derivative' },
      { stock: 'BANKNIFTY', action: 'BUY', status: 'TARGET HIT', date: '2024-05-12', type: 'Derivative' },
      { stock: 'FINNIFTY', action: 'SELL', status: 'ACTIVE', date: '2024-05-11', type: 'Derivative' },
    ]
  },
  {
    name: 'ICICI Securities',
    logo: '/icici.png',
    totalCallsEquity: 28,
    winRateEquity: 62,
    totalCallsDerivative: 14,
    winRateDerivative: 55,
    equityCalls: 28,
    derivativeCalls: 14,
    bgColor: 'bg-[#FFA726]',
    performance: { monthly: 0, quarterly: 0, yearly: 0 },
    specialties: [],
    teamSize: 0,
    experience: '',
    recentCalls: [
      { stock: 'ICICIBANK', action: 'BUY', status: 'ACTIVE', date: '2024-05-18', type: 'Equity' },
      { stock: 'TITAN', action: 'BUY', status: 'STOP LOSS HIT', date: '2024-05-15', type: 'Equity' },
      { stock: 'HUL', action: 'SELL', status: 'ACTIVE', date: '2024-05-14', type: 'Equity' },
      { stock: 'NIFTY FUT', action: 'SELL', status: 'TARGET HIT', date: '2024-05-17', type: 'Derivative' },
      { stock: 'BANKNIFTY', action: 'BUY', status: 'ACTIVE', date: '2024-05-16', type: 'Derivative' },
      { stock: 'FINNIFTY', action: 'SELL', status: 'ACTIVE', date: '2024-05-13', type: 'Derivative' },
    ]
  },
  {
    name: 'IIFL Securities',
    logo: '/iifl.png',
    totalCallsEquity: 22,
    winRateEquity: 64,
    totalCallsDerivative: 18,
    winRateDerivative: 58,
    equityCalls: 22,
    derivativeCalls: 18,
    bgColor: 'bg-[#26A69A]',
    performance: { monthly: 0, quarterly: 0, yearly: 0 },
    specialties: [],
    teamSize: 0,
    experience: '',
    recentCalls: [
      { stock: 'BAJFINANCE', action: 'BUY', status: 'ACTIVE', date: '2024-05-18', type: 'Equity' },
      { stock: 'ASIANPAINT', action: 'SELL', status: 'TARGET HIT', date: '2024-05-15', type: 'Equity' },
      { stock: 'TATAMOTORS', action: 'BUY', status: 'ACTIVE', date: '2024-05-13', type: 'Equity' },
      { stock: 'BANKNIFTY', action: 'SELL', status: 'TARGET HIT', date: '2024-05-16', type: 'Derivative' },
      { stock: 'NIFTY FUT', action: 'BUY', status: 'ACTIVE', date: '2024-05-12', type: 'Derivative' },
      { stock: 'FINNIFTY', action: 'SELL', status: 'ACTIVE', date: '2024-05-11', type: 'Derivative' },
    ]
  },
  {
    name: 'Kotak Securities',
    logo: '/kotak.png',
    totalCallsEquity: 29,
    winRateEquity: 67,
    totalCallsDerivative: 15,
    winRateDerivative: 60,
    equityCalls: 29,
    derivativeCalls: 15,
    bgColor: 'bg-[#EC407A]',
    performance: { monthly: 0, quarterly: 0, yearly: 0 },
    specialties: [],
    teamSize: 0,
    experience: '',
    recentCalls: [
      { stock: 'HUL', action: 'BUY', status: 'ACTIVE', date: '2024-05-18', type: 'Equity' },
      { stock: 'MARUTI', action: 'BUY', status: 'TARGET HIT', date: '2024-05-16', type: 'Equity' },
      { stock: 'ITC', action: 'SELL', status: 'ACTIVE', date: '2024-05-14', type: 'Equity' },
      { stock: 'BANKNIFTY', action: 'BUY', status: 'TARGET HIT', date: '2024-05-17', type: 'Derivative' },
      { stock: 'NIFTY FUT', action: 'SELL', status: 'ACTIVE', date: '2024-05-12', type: 'Derivative' },
      { stock: 'FINNIFTY', action: 'SELL', status: 'ACTIVE', date: '2024-05-11', type: 'Derivative' },
    ]
  },
  {
    name: 'Motilal Oswal',
    logo: '/mo.png',
    totalCallsEquity: 27,
    winRateEquity: 66,
    totalCallsDerivative: 16,
    winRateDerivative: 59,
    equityCalls: 27,
    derivativeCalls: 16,
    bgColor: 'bg-[#5C6BC0]',
    performance: { monthly: 0, quarterly: 0, yearly: 0 },
    specialties: [],
    teamSize: 0,
    experience: '',
    recentCalls: [
      { stock: 'SBIN', action: 'BUY', status: 'ACTIVE', date: '2024-05-18', type: 'Equity' },
      { stock: 'TECHM', action: 'SELL', status: 'TARGET HIT', date: '2024-05-17', type: 'Equity' },
      { stock: 'TCS', action: 'BUY', status: 'ACTIVE', date: '2024-05-14', type: 'Equity' },
      { stock: 'NIFTY FUT', action: 'SELL', status: 'TARGET HIT', date: '2024-05-17', type: 'Derivative' },
      { stock: 'BANKNIFTY', action: 'BUY', status: 'ACTIVE', date: '2024-05-16', type: 'Derivative' },
      { stock: 'FINNIFTY', action: 'SELL', status: 'ACTIVE', date: '2024-05-13', type: 'Derivative' },
    ]
  },
  {
    name: 'SBI Securities',
    logo: '/sbi.png',
    totalCallsEquity: 24,
    winRateEquity: 63,
    totalCallsDerivative: 17,
    winRateDerivative: 57,
    equityCalls: 24,
    derivativeCalls: 17,
    bgColor: 'bg-[#66BB6A]',
    performance: { monthly: 0, quarterly: 0, yearly: 0 },
    specialties: [],
    teamSize: 0,
    experience: '',
    recentCalls: [
      { stock: 'LT', action: 'BUY', status: 'TARGET HIT', date: '2024-05-16', type: 'Equity' },
      { stock: 'SBIN', action: 'BUY', status: 'ACTIVE', date: '2024-05-14', type: 'Equity' },
      { stock: 'HDFCBANK', action: 'SELL', status: 'ACTIVE', date: '2024-05-13', type: 'Equity' },
      { stock: 'NIFTY FUT', action: 'SELL', status: 'ACTIVE', date: '2024-05-15', type: 'Derivative' },
      { stock: 'BANKNIFTY', action: 'BUY', status: 'TARGET HIT', date: '2024-05-12', type: 'Derivative' },
      { stock: 'FINNIFTY', action: 'SELL', status: 'ACTIVE', date: '2024-05-11', type: 'Derivative' },
    ]
  }
];

export default function MyBrokersPage() {
  const [selectedBroker, setSelectedBroker] = useState<any | null>(null);
  const [sortBy, setSortBy] = useState<'trustScore' | 'accuracy' | 'winRate'>('trustScore');
  const [activeTab, setActiveTab] = useState<'Equity' | 'Derivative'>('Equity');
  const [brokerLoading, setBrokerLoading] = useState(false);
  const [brokerError, setBrokerError] = useState('');

  // Fetch broker stats from backend when selectedBroker is set (by name)
  useEffect(() => {
    if (selectedBroker && typeof selectedBroker === 'string') {
      setBrokerLoading(true);
      setBrokerError('');
      fetch(`/api/calls/broker/${encodeURIComponent(selectedBroker)}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch broker stats');
          return res.json();
        })
        .then(data => {
          setSelectedBroker(data);
          setBrokerLoading(false);
        })
        .catch(err => {
          setBrokerError('Could not load broker data.');
          setBrokerLoading(false);
        });
    }
  }, [selectedBroker]);

  const sortedBrokers = [...mockBrokers].sort((a, b) => {
    if (activeTab === 'Equity') {
      if (sortBy === 'winRate') return b.winRateEquity - a.winRateEquity;
    } else {
      if (sortBy === 'winRate') return b.winRateDerivative - a.winRateDerivative;
    }
    return 0;
  });

  return (
    <div style={{ background: '#F8FAFB', minHeight: '100vh' }} className="p-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold" style={{ color: '#222B45' }}>Brokers</h2>

      </div>

      {/* Broker Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedBrokers.map((broker) => {
          const isSBI = broker.name === 'SBI Securities';
          const cardContent = (
            <div
              key={broker.name}
              className={`group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden
                ${broker.name === 'Kotak Securities' ? 'border-2 border-red-500' : ''}
                ${broker.name === 'Motilal Oswal' ? 'border-2 border-yellow-400' : ''}
                ${broker.name === 'HDFC Securities' ? 'border-2 border-blue-500' : ''}`}
              style={
                broker.name === 'ICICI Securities'
                  ? { border: '2px solid #A52A2A' }
                  : broker.name === 'Angel One'
                  ? { border: '2px solid #00B386' }
                  : broker.name === 'IIFL Securities'
                  ? { border: '2px solid #E87A2B' }
                  : {}
              }
              onClick={() => setSelectedBroker(broker.name)}
            >
              <div className="p-5 flex items-center gap-4">
                <Image
                  src={broker.logo}
                  alt={broker.name}
                  width={96}
                  height={96}
                  className="object-contain flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{broker.name}</h3>
                </div>
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          );
          return isSBI ? (
            <div key={broker.name} className="rounded-xl p-1" style={{ background: 'linear-gradient(135deg, #2B2C83, #B13B6B)' }}>
              {React.cloneElement(cardContent, {
                className: 'group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden',
                style: {},
              })}
            </div>
          ) : cardContent;
        })}
      </div>

      {/* Modal */}
      {selectedBroker && (
        <div
          className="fixed inset-0 bg-transparent backdrop-blur-lg flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedBroker(null)}
        >
          <div
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {brokerLoading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : brokerError ? (
              <div className="p-8 text-center text-red-500">{brokerError}</div>
            ) : (
              <>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <Image
                        src={selectedBroker.logo}
                        alt={selectedBroker.name}
                        width={128}
                        height={128}
                        className="object-contain flex-shrink-0"
                      />
                      <div>
                        <h3 className="text-2xl text-gray-900">{selectedBroker.name}</h3>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedBroker(null)}
                      className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                      <FaTimes className="text-gray-500" />
                    </button>
                  </div>
                </div>
                {/* Tabs for Equity/Derivatives Split - after separator line */}
                <div className="px-6 pt-4 flex gap-2 border-b border-gray-100">
                  <button
                    className={`px-4 py-2 rounded-t-lg font-medium transition border-b-2 focus:outline-none
                      ${activeTab === 'Equity' ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-500 bg-transparent hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('Equity')}
                  >
                    Equity ({selectedBroker.equityCalls})
                  </button>
                  <button
                    className={`px-4 py-2 rounded-t-lg font-medium transition border-b-2 focus:outline-none
                      ${activeTab === 'Derivative' ? 'border-orange-500 text-orange-700 bg-orange-50' : 'border-transparent text-gray-500 bg-transparent hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('Derivative')}
                  >
                    Derivatives ({selectedBroker.derivativeCalls})
                  </button>
                </div>

                <div className="p-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Trust Score</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {activeTab === 'Equity' ? selectedBroker.trustScoreEquity : selectedBroker.trustScoreDerivative}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Accuracy</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {activeTab === 'Equity'
                          ? Math.round(selectedBroker.accuracyEquity * 100)
                          : Math.round(selectedBroker.accuracyDerivative * 100)}%
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Win Rate</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {activeTab === 'Equity' ? selectedBroker.winRateEquity : selectedBroker.winRateDerivative}%
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Total Calls</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {activeTab === 'Equity' ? selectedBroker.totalCallsEquity : selectedBroker.totalCallsDerivative}
                      </p>
                    </div>
                  </div>

                  {/* Recent Calls */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FaHistory className="text-indigo-600" /> Recent Calls
                    </h4>
                    <div className="space-y-3">
                      {selectedBroker.recentCalls && Array.isArray(selectedBroker.recentCalls)
                        ? selectedBroker.recentCalls.filter((call: any) => call.type === activeTab).slice(0, 3).map((call: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center gap-3">
                                <span className="font-medium text-gray-900">{call.stock}</span>
                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                  call.action === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {call.action}
                                </span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                  call.status === 'ACTIVE'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-200 text-gray-700'
                                }`}>
                                  {call.status === 'ACTIVE' ? 'Active' : 'Closed'}
                                </span>
                                <span className="text-gray-500 flex items-center gap-1">
                                  <FaCalendarAlt className="text-gray-400" />
                                  {call.date}
                                </span>
                              </div>
                            </div>
                          ))
                        : null}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 
'use client';
import 'chart.js/auto';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FaEye, FaPlus, FaArrowUp, FaChartLine, FaSearch, FaFilter, FaTimes, FaCalendarAlt, FaBell, FaUserCircle, FaUsers, FaCog, FaSignOutAlt, FaHome, FaExchangeAlt, FaStar, FaWallet, FaClipboardList } from 'react-icons/fa';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Line } from 'react-chartjs-2';
import CallSubmissionForm from '@/components/CallSubmissionForm';
// const Joyride = dynamic(() => import('react-joyride'), { ssr: false });

interface Stock {
  symbol: string;
  name: string;
}

interface Broker {
  name: string;
}

interface Call {
  _id: string;
  stock: string;
  broker: string;
  creator: string;
  action: 'BUY' | 'SELL';
  status: 'ACTIVE' | 'TARGET HIT' | 'STOP LOSS HIT' | 'PENDING VERIFICATION' | 'APPROVED' | 'REJECTED';
  target: number;
  stopLoss: number;
  entryDate: string;
  expiryDate: string;
  currentPrice: number;
  rationale: string;
  riskReward: number;
  tags: string[];
  priceHistory: number[];
  outcomeHistory: Array<{ date: string; status: string }>;
  news: Array<{ title: string; url: string }>;
  comments: Array<{ user: string; text: string }>;
  attachments: Array<{ name: string; url: string }>;
  type?: 'Equity' | 'Derivative';
}

interface CallFormProps {
  onSubmit: (call: Call) => void;
  onCancel: () => void;
}

const allBrokers = [
  { name: 'Motilal Oswal', logo: '/mo.png' },
  { name: 'ICICI Securities', logo: '/icici.png' },
  { name: 'HDFC Securities', logo: '/hdfc.png' },
  { name: 'Angel One', logo: '/angel.png' },
  { name: 'IIFL Securities', logo: '/iifl.png' },
  { name: 'Kotak Securities', logo: '/kotak.png' },
  { name: 'SBI Securities', logo: '/sbi.png' },
];

const mockCalls = [
  { stock: 'RELIANCE', action: 'BUY', status: 'ACTIVE', date: '2024-05-18' },
  { stock: 'TCS', action: 'SELL', status: 'TARGET_HIT', date: '2024-05-17' },
  { stock: 'INFY', action: 'BUY', status: 'STOP_LOSS_HIT', date: '2024-05-16' },
];

const mockStats = {
  totalCalls: 128,
  avgScore: 0.42,
  winRate: 0.61,
};

const mockCallTracker: Call[] = [
  {
    _id: '1',
    stock: 'AAPL',
    broker: 'Morgan Stanley',
    creator: 'user1',
    action: 'BUY',
    status: 'ACTIVE',
    target: 200,
    stopLoss: 150,
    entryDate: '2024-03-01',
    expiryDate: '2024-06-01',
    currentPrice: 175,
    rationale: 'Strong earnings and new product launch',
    riskReward: 2.5,
    tags: ['tech', 'long-term'],
    priceHistory: [],
    outcomeHistory: [],
    news: [],
    comments: [],
    attachments: [{ name: 'analysis.pdf', url: '#' }]
  },
  {
    _id: '2',
    stock: 'TSLA',
    broker: 'Goldman Sachs',
    creator: 'user2',
    action: 'SELL',
    status: 'TARGET HIT',
    target: 800,
    stopLoss: 1000,
    entryDate: '2024-02-15',
    expiryDate: '2024-05-15',
    currentPrice: 850,
    rationale: 'Overvalued based on current metrics',
    riskReward: 1.5,
    tags: ['automotive', 'short-term'],
    priceHistory: [],
    outcomeHistory: [],
    news: [],
    comments: [],
    attachments: []
  },
  {
    _id: '3',
    stock: 'MSFT',
    broker: 'JP Morgan',
    creator: 'user3',
    action: 'BUY',
    status: 'STOP LOSS HIT',
    target: 400,
    stopLoss: 300,
    entryDate: '2024-01-20',
    expiryDate: '2024-04-20',
    currentPrice: 280,
    rationale: 'Cloud growth and AI initiatives',
    riskReward: 3.0,
    tags: ['tech', 'cloud'],
    priceHistory: [],
    outcomeHistory: [],
    news: [],
    comments: [],
    attachments: []
  }
];

const maxCompare = 3;

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';

// Utility to get auth-token from cookies
function getAuthToken() {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|; )auth-token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [filterOpen, setFilterOpen] = useState<'action' | 'status' | 'entry' | 'expiry' | null>(null);
  const [actionFilter, setActionFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [entryDateFilter, setEntryDateFilter] = useState('');
  const [expiryDateFilter, setExpiryDateFilter] = useState('');
  const [search, setSearch] = useState('');
  const filterRef = useRef<HTMLDivElement>(null);
  const [selectedCall, setSelectedCall] = useState<{ _id: string; stock: string; action: string } | null>(null);
  const [showCallForm, setShowCallForm] = useState(false);
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBroker, setSelectedBroker] = useState<string | null>(null);
  const [brokersToCompare, setBrokersToCompare] = useState<(string | null)[]>([null, null, null]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBrokerModal, setShowBrokerModal] = useState(false);
  const [trackedBrokers, setTrackedBrokers] = useState<string[]>([]);
  const [userCalls, setUserCalls] = useState<Call[]>([]);
  const [userCallsLoading, setUserCallsLoading] = useState(true);
  const [userCallsError, setUserCallsError] = useState('');
  const [isBrokerDropdownOpen, setIsBrokerDropdownOpen] = useState(false);
  const [showRequestBrokerModal, setShowRequestBrokerModal] = useState(false);
  const [requestedBrokerName, setRequestedBrokerName] = useState('');
  const [requestError, setRequestError] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [callTrackerBroker, setCallTrackerBroker] = useState<string>('');
  const [showBrokerFilterDropdown, setShowBrokerFilterDropdown] = useState(false);
  const brokerFilterRef = useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState<Array<{ date: string; close: number }>>([]);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'Equity' | 'Derivative'>('Equity');
  const [callType, setCallType] = useState<'Equity' | 'Derivative'>('Equity');
  const [showSubmittedCallsModal, setShowSubmittedCallsModal] = useState(false);
  // const [runTour, setRunTour] = useState(false);
  // const tourSteps = [
  //   {
  //     target: '#dashboard-title',
  //     content: "Welcome to your RateMyBroker Dashboard! Here you can track, analyze, and submit stock calls.",
  //   },
  //   {
  //     target: '#broker-watchlist',
  //     content: "Add and track your favorite brokers here. Use the search bar to find brokers and add them to your watchlist.",
  //   },
  //   {
  //     target: '#call-tracker',
  //     content: "See all active, target hit, and stop loss hit calls from your tracked brokers. Filter by Equity or Derivative.",
  //   },
  //   {
  //     target: '#performance-chart',
  //     content: "Analyze the performance of selected calls over time with interactive charts.",
  //   },
  //   {
  //     target: '#my-submitted-calls',
  //     content: "View the status of all calls you\'ve submitted for verification and tracking.",
  //   },
  //   {
  //     target: '#new-call-btn',
  //     content: "Submit a new call for verification. Attach a document to verify the call\'s authenticity.",
  //   },
  // ];

  // Sidebar links
  const sidebarLinks = [
    { label: 'Dashboard', icon: <FaHome />, active: true },
    { label: 'Brokers', icon: <FaStar /> },
    { label: 'Broker Comparison', icon: <FaChartLine /> },
    { label: 'Settings', icon: <FaCog /> },
  ];

  const filteredCalls = calls.filter(call => {
    const matchesBroker = !selectedBroker || call.broker === selectedBroker;
    const matchesAction = actionFilter === 'ALL' || call.action === actionFilter;
    const matchesStatus = statusFilter === 'ALL' || call.status === statusFilter;
    const matchesEntry = !entryDateFilter || call.entryDate === entryDateFilter;
    const matchesExpiry = !expiryDateFilter || call.expiryDate === expiryDateFilter;
    const matchesSearch = call.stock.toLowerCase().includes(search.toLowerCase());
    return matchesBroker && matchesAction && matchesStatus && matchesEntry && matchesExpiry && matchesSearch;
  });

  const filteredBrokers = allBrokers
    .map(b => b.name)
    .filter(
      b => !trackedBrokers.includes(b) && b.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Calculate dynamic stats based on filteredCalls
  const dynamicStats = {
    totalCalls: filteredCalls.length,
    winRate:
      filteredCalls.length > 0
        ? Math.round(
            (filteredCalls.filter(call => call.status === 'TARGET HIT').length / filteredCalls.length) * 100
          )
        : 0,
  };

  // Helper to get stats for a broker
  function getBrokerStats(brokerName: string) {
    const brokerCalls = calls.filter(call => call.broker === brokerName);
    const broker = allBrokers.find(b => b.name === brokerName);
    return {
      totalCalls: brokerCalls.length,
      winRate:
        brokerCalls.length > 0
          ? Math.round(
              (brokerCalls.filter(call => call.status === 'TARGET HIT').length / brokerCalls.length) * 100
            )
          : 0,
    };
  }

  function handleRemoveBroker(idx: number) {
    setBrokersToCompare(prev => prev.map((b, i) => (i === idx ? null : b)));
  }

  function handleAddBroker(broker: string) {
    const firstEmpty = brokersToCompare.findIndex(b => !b);
    if (firstEmpty !== -1) {
      setBrokersToCompare(prev => prev.map((b, i) => (i === firstEmpty ? broker : b)));
      setSearchQuery('');
    }
  }

  useEffect(() => {
    async function fetchUserCalls() {
      setUserCallsLoading(true);
      setUserCallsError('');
      try {
        const token = getAuthToken();
        const res = await fetch(`${API_BASE}/api/calls/my`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error('Failed to fetch your calls');
        const data = await res.json();
        setUserCalls(data.data.calls);
      } catch (err) {
        setUserCallsError('Could not load your submitted calls.');
      } finally {
        setUserCallsLoading(false);
      }
    }
    fetchUserCalls();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('trackedBrokers');
    if (saved) setTrackedBrokers(JSON.parse(saved));
  }, []);

  // Add effect to close dropdown on outside click
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (brokerFilterRef.current && !brokerFilterRef.current.contains(event.target as Node)) {
        setShowBrokerFilterDropdown(false);
      }
    }
    if (showBrokerFilterDropdown) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [showBrokerFilterDropdown]);

  useEffect(() => {
    if (selectedCall) {
      setIsLoadingChart(true);
      fetch(`${API_BASE}/api/calls/${selectedCall._id}/performance`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          setChartData(data.priceHistory);
          setIsLoadingChart(false);
        })
        .catch(error => {
          console.error('Error fetching chart data:', error);
          setIsLoadingChart(false);
        });
    } else {
      setChartData([]);
    }
  }, [selectedCall]);

  useEffect(() => {
    async function fetchCalls() {
      setLoading(true);
      setError('');
      try {
        const token = getAuthToken();
        const res = await fetch(`${API_BASE}/api/calls`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error('Failed to fetch calls');
        const data = await res.json();
        setCalls(data.data.calls);
      } catch (err) {
        setError('Could not load calls.');
      } finally {
        setLoading(false);
      }
    }
    fetchCalls();
  }, []);

  // Only show approved calls in the table
  const approvedUserCalls = userCalls.filter(call => call.status === 'APPROVED');

  const displayedUserCalls = userCalls.slice(0, 3);
  const hasMoreUserCalls = userCalls.length > 3;

  useEffect(() => {
    if (!localStorage.getItem('onboardingShown')) {
      // setRunTour(true);
    }
  }, []);

  return (
    <div className="flex min-h-screen" style={{ background: '#F8FAFB' }}>
      {/* <Joyride
        steps={tourSteps}
        run={runTour}
        continuous
        showSkipButton
        showProgress
        styles={{ options: { zIndex: 10000 } }}
        callback={data => {
          if (data.status === 'finished' || data.status === 'skipped') {
            setRunTour(false);
            localStorage.setItem('onboardingShown', 'true');
          }
        }}
      /> */}
      {/* Main content */}
      <div className="flex-1 flex flex-col bg-white">
        <header className="flex items-center justify-between px-10 py-8" style={{ background: 'transparent', border: 'none' }}>
          <h1 id="dashboard-title" className="font-semibold text-4xl text-[#22223B] tracking-tight font-inter">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button
              id="new-call-btn"
              className="px-7 py-3 rounded-2xl font-bold text-lg shadow transition"
              style={{ background: '#393B41', color: '#fff' }}
              onMouseOver={e => (e.currentTarget.style.background = '#23242A')}
              onMouseOut={e => (e.currentTarget.style.background = '#393B41')}
              onClick={() => setShowCallForm(true)}
            >
              + New Call
            </button>
          </div>
        </header>
        <div className="px-10 pt-0">
          {/* Top Brokers and Performance Stats */}
          <div className="mb-8" id="broker-watchlist">
            {/* Broker Watchlist Card Only */}
            <div className="bg-white border-2 border-[#F0F1F3] rounded-2xl p-8 mb-8 shadow-none">
              <div className="flex items-center gap-4 w-full justify-between">
                <h2 className="font-medium text-[1.25rem] text-[#22223B] tracking-tight font-inter flex items-center gap-2">
                  <FaEye className="w-5 h-5" style={{ color: '#A3A3A3' }} />
                  Broker Watchlist
                </h2>
                <div className="flex-1 flex justify-center relative">
                  <div className="flex items-center w-full max-w-xs bg-[#F5F5F5] rounded-full px-4 py-2">
                    <FaSearch className="w-5 h-5 mr-2" style={{ color: '#000' }} />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search your broker"
                      className="bg-transparent border-none outline-none text-sm text-[#22223B] flex-1 placeholder-[#6B7280]"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onFocus={() => setIsBrokerDropdownOpen(true)}
                      onBlur={e => {
                        setTimeout(() => setIsBrokerDropdownOpen(false), 100);
                      }}
                    />
                  </div>
                  {isBrokerDropdownOpen && filteredBrokers.length > 0 && (
                    <ul
                      className="absolute left-0 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-72 overflow-y-auto"
                      onMouseDown={e => e.preventDefault()}
                    >
                      {filteredBrokers.map((brokerName, idx) => {
                        const brokerObj = allBrokers.find(b => b.name === brokerName);
                        return (
                          <li
                            key={brokerName}
                            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-indigo-100 transition text-base text-gray-900 rounded-lg"
                            style={{ fontWeight: 500 }}
                            onMouseDown={e => {
                              e.preventDefault();
                              setTrackedBrokers(prev => prev.includes(brokerName) ? prev : [...prev, brokerName]);
                              setIsBrokerDropdownOpen(false);
                              setSearchQuery('');
                              searchInputRef.current?.blur();
                            }}
                          >
                            {brokerObj && (
                              <Image src={brokerObj.logo} alt={brokerObj.name} width={48} height={48} className="object-contain rounded-full border border-gray-200" />
                            )}
                            <span>{brokerName}</span>
                            {idx < filteredBrokers.length - 1 && <div className="w-full h-px bg-gray-100 absolute left-0 bottom-0" />}
                          </li>
                        );
                      })}
                      {/* Request a broker option */}
                      <li
                        className="flex items-center gap-2 px-4 py-3 cursor-pointer text-indigo-700 hover:bg-indigo-50 transition text-base font-semibold border-t border-gray-100 mt-1"
                        style={{ justifyContent: 'center' }}
                        onMouseDown={e => {
                          e.preventDefault();
                          setShowRequestBrokerModal(true);
                          setIsBrokerDropdownOpen(false);
                        }}
                      >
                        <span>+ Request a broker to be added</span>
                      </li>
                    </ul>
                  )}
                </div>
                <div className="relative group ml-2">
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full transition"
                    style={{ background: 'transparent', color: '#4BA586' }}
                    onClick={() => setShowBrokerModal(true)}
                    aria-label="Add Broker"
                  >
                    <FaPlus className="w-4 h-4" />
                  </button>
                  <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition whitespace-nowrap z-10">
                    Add Broker
                  </span>
                </div>
              </div>
              <ul className="space-y-4 mt-4">
                {trackedBrokers
                  .filter(name => name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((name, idx) => {
                    const broker = allBrokers.find(b => b.name === name);
                    if (!broker) return null;
                    return (
                      <li
                        key={broker.name}
                        className={`flex items-center justify-between cursor-pointer rounded-xl px-4 py-4 shadow-sm bg-gray-50`}
                      >
                        <div className="flex items-center gap-4">
                          <Image src={broker.logo} alt={broker.name} width={72} height={72} className="object-contain rounded-full" />
                          <span className="font-medium text-gray-800 text-sm">{idx + 1}. {broker.name}</span>
                        </div>
                        <button
                          className="ml-4 p-2 rounded-full hover:bg-red-100 transition text-red-500"
                          title="Remove from watchlist"
                          onClick={e => {
                            e.stopPropagation();
                            setTrackedBrokers(prev => prev.filter(n => n !== broker.name));
                          }}
                        >
                          <FaTimes />
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
          {/* Recent Calls Table */}
          <div className="bg-white border-2 border-[#F0F1F3] rounded-2xl p-6 w-full mb-8" id="call-tracker">
            <div className="flex flex-row items-center justify-between mb-4">
              <h2 className="font-medium text-[1.25rem] text-[#22223B] tracking-tight font-inter flex items-center gap-2">
                <FaSearch className="w-5 h-5" style={{ color: '#A3A3A3' }} />
                Call Tracker
              </h2>
              <a href="/dashboard/calls" className="text-sm text-green-600 underline hover:underline font-medium">View all</a>
            </div>
            {/* Tabs for Equity/Derivatives */}
            <div className="flex gap-2 mb-4">
              <button
                className={`px-4 py-2 rounded-t-lg font-medium transition border-b-2 focus:outline-none ${activeTab === 'Equity' ? 'border-[#F6F97B] text-[#22223B] bg-[#F6F97B]' : 'border-transparent text-gray-500 bg-transparent hover:bg-gray-100'}`}
                onClick={() => setActiveTab('Equity')}
              >
                Equity
              </button>
              <button
                className={`px-4 py-2 rounded-t-lg font-medium transition border-b-2 focus:outline-none ${activeTab === 'Derivative' ? 'border-[#F6F97B] text-[#22223B] bg-[#F6F97B]' : 'border-transparent text-gray-500 bg-transparent hover:bg-gray-100'}`}
                onClick={() => setActiveTab('Derivative')}
              >
                Derivatives
              </button>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="text-gray-400 text-center py-6">Loading calls...</div>
              ) : error ? (
                <div className="text-red-500 text-center py-6">{error}</div>
              ) : calls.length === 0 ? (
                <div className="text-gray-400 text-center py-6">No calls available for your watchlist brokers.</div>
              ) : (
                <table className="min-w-full bg-white text-sm mb-8">
                  <thead>
                    <tr>
                      <th className="px-6 py-4 text-left font-medium text-[#A3A3A3] uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-4 text-left font-medium text-[#A3A3A3] uppercase tracking-wider">Broker</th>
                      <th className="px-6 py-4 text-left font-medium text-[#A3A3A3] uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-left font-medium text-[#A3A3A3] uppercase tracking-wider">Action</th>
                      <th className="px-6 py-4 text-left font-medium text-[#A3A3A3] uppercase tracking-wider">Entry Date</th>
                      <th className="px-6 py-4 text-left font-medium text-[#A3A3A3] uppercase tracking-wider">Expiry Date</th>
                      <th className="px-6 py-4 text-left font-medium text-[#A3A3A3] uppercase tracking-wider">Target</th>
                      <th className="px-6 py-4 text-left font-medium text-[#A3A3A3] uppercase tracking-wider">CMP</th>
                      <th className="px-6 py-4 text-left font-medium text-[#A3A3A3] uppercase tracking-wider">Stop Loss</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calls
                      .filter(call => call.status === 'APPROVED')
                      .filter(call => (call.type ? call.type === activeTab : activeTab === 'Equity'))
                      .map((call, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-[#F0F1F3] hover:bg-[#FAFAFA] transition cursor-pointer"
                          onClick={() => setSelectedCall(call)}
                        >
                          <td className="px-6 py-4 text-[#22223B]">{call.stock}</td>
                          <td className="px-6 py-4 text-[#22223B]">{call.broker}</td>
                          <td className="px-6 py-4 text-[#22223B]">{call.type || '-'}</td>
                          <td className={`px-6 py-4 font-bold ${call.action === 'BUY' ? 'text-green-700' : 'text-red-700'}`}>{call.action}</td>
                          <td className="px-6 py-4 text-[#8B909A]">{call.entryDate}</td>
                          <td className="px-6 py-4 text-[#8B909A]">{call.expiryDate}</td>
                          <td className="px-6 py-4 text-[#22C55E] font-semibold">₹{call.target}</td>
                          <td className="px-6 py-4 font-bold text-[#000]">{call.currentPrice === 0 ? 'unable to fetch price' : `₹${call.currentPrice}`}</td>
                          <td className="px-6 py-4 text-[#E11D48] font-semibold">₹{call.stopLoss}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          {/* Performance Chart Card (restyle) */}
          <div className="bg-white border-2 border-[#F0F1F3] rounded-2xl p-8 mb-8 shadow-none mt-8" id="performance-chart">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-[1.25rem] text-[#22223B] tracking-tight font-inter flex items-center gap-2">
                <FaChartLine className="w-5 h-5" style={{ color: '#A3A3A3' }} />
                Price
              </h2>
            </div>
            <div className="flex items-center justify-center text-[#A3A3A3]">
              {isLoadingChart ? (
                <span className="text-gray-400 text-xs">Loading chart data...</span>
              ) : selectedCall ? (
                <div className="w-full max-w-full overflow-x-auto mt-8" style={{ minHeight: 300 }}>
                  {chartData.length > 0 ? (
                    <div className="w-full max-w-full overflow-x-auto" style={{ minHeight: 300 }}>
                      <Line
                        data={{
                          labels: chartData.map(d => new Date(d.date).toLocaleDateString()),
                          datasets: [
                            {
                              label: 'Close Price',
                              data: chartData.map(d => d.close),
                              borderColor: 'rgb(75, 192, 192)',
                              backgroundColor: 'rgba(75, 192, 192, 0.2)',
                              tension: 0.1,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { position: 'bottom' },
                          },
                          scales: {
                            x: {
                              ticks: {
                                autoSkip: true,
                                maxTicksLimit: 10,
                                maxRotation: 45,
                                minRotation: 30,
                              },
                            },
                            y: { beginAtZero: false },
                          },
                        }}
                        height={300}
                      />
                    </div>
                  ) : (
                    <div className="mt-2 text-gray-400 text-xs">No data available</div>
                  )}
                </div>
              ) : (
                <span className="text-gray-400 text-xs">Select a call to view performance</span>
              )}
            </div>
          </div>
          {/* User's Submitted Calls Section (moved to bottom) */}
          <div className="bg-white border-2 border-[#F0F1F3] rounded-2xl p-6 w-full mb-8" id="my-submitted-calls" style={{ maxHeight: '340px', overflowY: 'auto' }}>
            <div className="flex flex-row items-center justify-between mb-4">
              <h2 className="font-medium text-[1.25rem] text-[#22223B] tracking-tight font-inter mb-0 flex items-center gap-2">
                <FaClipboardList className="w-5 h-5" style={{ color: '#A3A3A3' }} />
                My Submitted Calls
              </h2>
              {hasMoreUserCalls && (
                <button
                  type="button"
                  className="text-sm text-green-600 underline hover:underline font-medium"
                  onClick={() => setShowSubmittedCallsModal(true)}
                >
                  View all
                </button>
              )}
            </div>
            {userCallsLoading ? (
              <div className="text-gray-500">Loading...</div>
            ) : userCallsError ? (
              <div className="text-red-500">{userCallsError}</div>
            ) : displayedUserCalls.length === 0 ? (
              <div className="text-gray-400">You have not submitted any calls yet.</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Broker</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Expiry Date</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Target</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">CMP</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Stop Loss</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {displayedUserCalls.map((call, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 font-medium text-gray-900">{call.stock}</td>
                      <td className="px-4 py-2 text-gray-700">{call.broker}</td>
                      <td className="px-4 py-2 text-gray-700">{call.type || '-'}</td>
                      <td className={`px-4 py-2 font-semibold ${call.action === 'BUY' ? 'text-green-700' : 'text-red-700'}`}>{call.action}</td>
                      <td className="px-4 py-2 text-gray-500">{call.expiryDate}</td>
                      <td className="px-4 py-2 text-[#22C55E] font-semibold">₹{call.target}</td>
                      <td className="px-4 py-2 text-[#000] font-semibold">{call.currentPrice === 0 ? 'unable to fetch price' : `₹${call.currentPrice}`}</td>
                      <td className="px-4 py-2 text-[#E11D48] font-semibold">₹{call.stopLoss}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${call.status === 'APPROVED' ? 'bg-green-100 text-green-700' : call.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-800'}`}>
                          {call.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {/* Broker Selection Modal */}
      {showBrokerModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4 text-black">Select Brokers to Track</h3>
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {allBrokers.map(broker => (
                <label key={broker.name} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={trackedBrokers.includes(broker.name)}
                    onChange={e => {
                      if (e.target.checked) {
                        setTrackedBrokers(prev => [...prev, broker.name]);
                      } else {
                        setTrackedBrokers(prev => prev.filter(n => n !== broker.name));
                      }
                    }}
                  />
                  <Image src={broker.logo} alt={broker.name} width={56} height={56} className="object-contain rounded-full" />
                  <span className="text-gray-800 font-medium">{broker.name}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                onClick={() => setShowBrokerModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                onClick={() => setShowBrokerModal(false)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {showRequestBrokerModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4 text-black">Request a Broker</h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                if (!requestedBrokerName.trim()) {
                  setRequestError('Please enter a broker name.');
                  return;
                }
                // Here you would send the request to your backend or service
                alert('Thank you! Your broker request has been submitted.');
                setShowRequestBrokerModal(false);
                setRequestedBrokerName('');
                setRequestError('');
              }}
              className="space-y-4"
            >
              <input
                type="text"
                className="w-full border rounded px-3 py-2 text-[#22223B] placeholder-[#6B7280]"
                placeholder="Enter broker name"
                value={requestedBrokerName}
                onChange={e => {
                  setRequestedBrokerName(e.target.value);
                  setRequestError('');
                }}
                autoFocus
              />
              {requestError && <div className="text-red-600 text-xs text-center">{requestError}</div>}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                  onClick={() => {
                    setShowRequestBrokerModal(false);
                    setRequestedBrokerName('');
                    setRequestError('');
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
      {successMessage && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 text-lg font-semibold animate-fade-in">
          {successMessage}
        </div>
      )}
      {showSubmittedCallsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto shadow-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setShowSubmittedCallsModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4 text-black flex items-center gap-2">
              <FaClipboardList className="w-5 h-5" style={{ color: '#A3A3A3' }} />
              All Submitted Calls
            </h3>
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Broker</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Expiry Date</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Target</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">CMP</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Stop Loss</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {userCalls.map((call, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2 font-medium text-gray-900">{call.stock}</td>
                    <td className="px-4 py-2 text-gray-700">{call.broker}</td>
                    <td className="px-4 py-2 text-gray-700">{call.type || '-'}</td>
                    <td className={`px-4 py-2 font-semibold ${call.action === 'BUY' ? 'text-green-700' : 'text-red-700'}`}>{call.action}</td>
                    <td className="px-4 py-2 text-gray-500">{call.expiryDate}</td>
                    <td className="px-4 py-2 text-[#22C55E] font-semibold">₹{call.target}</td>
                    <td className="px-4 py-2 text-[#000] font-semibold">{call.currentPrice === 0 ? 'unable to fetch price' : `₹${call.currentPrice}`}</td>
                    <td className="px-4 py-2 text-[#E11D48] font-semibold">₹{call.stopLoss}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700`}>
                        {call.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function CallForm({ onSubmit, onCancel }: CallFormProps) {
  const [query, setQuery] = useState('');
  const [dropdown, setDropdown] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [broker, setBroker] = useState(allBrokers[0].name);
  const [action, setAction] = useState<'BUY' | 'SELL'>('BUY');
  const [target, setTarget] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [rationale, setRationale] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [callType, setCallType] = useState<'Equity' | 'Derivative'>('Equity');

  // Fetch stock suggestions as user types (debounced)
  useEffect(() => {
    if (query.length < 2) {
      setDropdown([]);
      return;
    }
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => {
      fetch(`${API_BASE}/api/stocks/search?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(setDropdown)
        .catch(() => setDropdown([]));
    }, 300);
    setSearchTimeout(timeout);
    // Cleanup
    return () => clearTimeout(timeout);
  }, [query]);

  // Fetch price when a stock is selected
  useEffect(() => {
    if (selectedStock) {
      setLoadingPrice(true);
      fetch(`${API_BASE}/api/stocks/price/${selectedStock.symbol}`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          setCurrentPrice(data.price);
          setLoadingPrice(false);
        })
        .catch(() => setLoadingPrice(false));
    }
  }, [selectedStock]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedStock || !broker || !action || !target || !stopLoss || !entryDate || !expiryDate) {
      setError('Please fill all required fields.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('stock', selectedStock.symbol);
      formData.append('broker', broker);
      formData.append('action', action);
      formData.append('target', target);
      formData.append('stopLoss', stopLoss);
      formData.append('entryDate', entryDate);
      formData.append('expiryDate', expiryDate);
      formData.append('currentPrice', String(currentPrice || 0));
      formData.append('rationale', rationale);
      formData.append('riskReward', '');
      formData.append('tags', tags);
      formData.append('priceHistory', JSON.stringify([]));
      formData.append('outcomeHistory', JSON.stringify([{ date: entryDate, status: 'ACTIVE' }]));
      formData.append('news', JSON.stringify([]));
      formData.append('comments', JSON.stringify([]));
      formData.append('type', callType);
      files.forEach(file => formData.append('attachments', file));
      const response = await fetch(`${API_BASE}/api/calls`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Failed to submit call.');
        setSubmitting(false);
        return;
      }
      const data = await response.json();
      onSubmit(data.data.call);
      setSubmitting(false);
    } catch (err) {
      setError('Failed to submit call.');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
      <div style={{ position: 'relative' }}>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Stock Symbol *</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 text-[#22223B] placeholder-[#6B7280]"
          value={selectedStock ? selectedStock.symbol : query}
          onChange={e => {
            setQuery(e.target.value);
            setSelectedStock(null);
            setCurrentPrice(null);
          }}
          autoComplete="off"
          required
        />
        {dropdown.length > 0 && !selectedStock && (
          <ul style={{
            position: 'absolute', zIndex: 10, background: 'white', border: '1px solid #eee', width: '100%', maxHeight: 200, overflowY: 'auto', listStyle: 'none', margin: 0, padding: 0
          }}>
            {(() => {
              const indianStocks = dropdown.filter(s => typeof s.symbol === 'string' && (s.symbol.endsWith('.NS') || s.symbol.endsWith('.BO')));
              const otherStocks = dropdown.filter(s => typeof s.symbol === 'string' && !s.symbol.endsWith('.NS') && !s.symbol.endsWith('.BO'));
              const sortedDropdown = [...indianStocks, ...otherStocks];
              return sortedDropdown.map(stock => (
                <li
                  key={stock.symbol}
                  style={{ padding: 8, cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedStock(stock);
                    setQuery(stock.symbol);
                    setDropdown([]);
                  }}
                >
                  <strong>{stock.symbol}</strong>
                  {typeof stock.symbol === 'string' && stock.symbol.endsWith('.NS') && <span className="ml-2 text-xs text-green-600">NSE</span>}
                  {typeof stock.symbol === 'string' && stock.symbol.endsWith('.BO') && <span className="ml-2 text-xs text-blue-600">BSE</span>}
                  {' — '}{stock.name}
                </li>
              ));
            })()}
          </ul>
        )}
      </div>
      {selectedStock && (
        <div className="mb-2">
          <div className="text-xs text-gray-500">Company: {selectedStock.name}</div>
          <div className="text-xs text-gray-500">
            Current Market Price: {loadingPrice ? <span>Loading...</span> : currentPrice ? `₹${currentPrice}` : 'N/A'}
          </div>
        </div>
      )}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Broker *</label>
        <select
          className="w-full border rounded px-3 py-2 text-[#22223B] placeholder-[#6B7280]"
          value={broker}
          onChange={e => setBroker(e.target.value)}
        >
          {allBrokers.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
        </select>
      </div>
      <div className="flex gap-2 bg-[#FAFAFA] border border-[#F0F1F3] rounded-xl p-4 mb-2">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Action *</label>
          <select
            className="w-full border rounded px-3 py-2 text-[#22223B] placeholder-[#6B7280]"
            value={action}
            onChange={e => setAction(e.target.value as 'BUY' | 'SELL')}>
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Target Price *</label>
          <input type="number" className="w-full border rounded px-3 py-2 text-[#22223B] placeholder-[#6B7280]" value={target} onChange={e => setTarget(e.target.value)} required />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Stop Loss *</label>
          <input type="number" className="w-full border rounded px-3 py-2 text-[#22223B] placeholder-[#6B7280]" value={stopLoss} onChange={e => setStopLoss(e.target.value)} required />
        </div>
      </div>
      <div className="flex gap-2 bg-[#FAFAFA] border border-[#F0F1F3] rounded-xl p-4 mb-2">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Entry Date *</label>
          <input type="date" className="w-full border rounded px-3 py-2 text-[#22223B] placeholder-[#6B7280]" value={entryDate} onChange={e => setEntryDate(e.target.value)} required />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Expiry Date *</label>
          <input type="date" className="w-full border rounded px-3 py-2 text-[#22223B] placeholder-[#6B7280]" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} required />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Rationale / Notes</label>
        <textarea
          className="w-full border rounded px-3 py-2 text-[#22223B] placeholder-[#6B7280]"
          value={rationale}
          onChange={e => setRationale(e.target.value)}
          rows={2}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Type *</label>
        <div className="flex gap-2">
          <button
            type="button"
            className={`px-4 py-2 rounded-lg font-medium border-2 transition focus:outline-none ${callType === 'Equity' ? 'border-[#F6F97B] bg-[#F6F97B] text-[#22223B]' : 'border-gray-200 bg-white text-gray-500'}`}
            onClick={() => setCallType('Equity')}
          >
            Equity
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-lg font-medium border-2 transition focus:outline-none ${callType === 'Derivative' ? 'border-[#F6F97B] bg-[#F6F97B] text-[#22223B]' : 'border-gray-200 bg-white text-gray-500'}`}
            onClick={() => setCallType('Derivative')}
          >
            Derivative
          </button>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center justify-between">
          <span>Attachments (PDF, DOCX, etc.)</span>
          <span className="relative group cursor-pointer">
            <span className="inline-block w-4 h-4 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center font-bold">i</span>
            <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition whitespace-nowrap z-10">
              Please upload a document that verifies this call has been initiated by this broker.
            </span>
          </span>
        </label>
        <input
          type="file"
          multiple
          required
          onChange={e => setFiles(e.target.files ? Array.from(e.target.files) : [])}
          className="w-full border rounded px-3 py-2"
        />
        {files.length > 0 && (
          <ul className="mt-2 text-xs text-gray-500">
            {files.map(file => <li key={file.name}>{file.name}</li>)}
          </ul>
        )}
      </div>
      {error && <div className="text-red-600 text-xs text-center">{error}</div>}
      <div className="flex gap-2 justify-end mt-4">
        <button type="button" className="px-4 py-2 rounded bg-gray-100 text-gray-700 font-semibold text-xs hover:bg-gray-200" onClick={onCancel}>Cancel</button>
        <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</button>
      </div>
    </form>
  );
} 
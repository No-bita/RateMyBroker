'use client';

import { useState, useRef } from 'react';
import { FaCalendarAlt, FaInfoCircle, FaFileUpload, FaTimes, FaTag, FaRupeeSign, FaUserTie, FaSearch } from 'react-icons/fa';

const allBrokers = [
  { name: 'Motilal Oswal' },
  { name: 'ICICI Securities' },
  { name: 'HDFC Securities' },
  { name: 'Angel One' },
  { name: 'IIFL Securities' },
  { name: 'Kotak Securities' },
  { name: 'SBI Securities' },
];

// const YAHOO_SEARCH_API = 'https://query1.finance.yahoo.com/v1/finance/search?q=';
const LOCAL_SEARCH_API = '/api/yahoo-search?q=';
const LOCAL_QUOTE_API = '/api/yahoo-quote?symbol=';

type FormData = {
  stockSymbol: string;
  broker: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  targetPrice: number;
  stopLoss: number;
  entryDate: string;
  expiryDate: string;
  type: 'Equity' | 'Derivative';
};

export default function CallSubmissionForm({ onCancel }: { onCancel: () => void }) {
  const [formData, setFormData] = useState<FormData>({
    stockSymbol: '',
    broker: allBrokers[0].name,
    action: 'BUY',
    targetPrice: 0,
    stopLoss: 0,
    entryDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    type: 'Equity',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [warning, setWarning] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const infoRef = useRef<HTMLSpanElement>(null);
  const [symbolDropdown, setSymbolDropdown] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const symbolInputRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    setWarning('');

    if (!formData.stockSymbol.trim()) {
      newErrors.stockSymbol = 'Stock symbol is required';
    }
    if (formData.targetPrice <= 0) {
      newErrors.targetPrice = 'Target price must be greater than 0';
    }
    if (formData.stopLoss <= 0) {
      newErrors.stopLoss = 'Stop loss must be greater than 0';
    }
    if (formData.action === 'BUY' && formData.targetPrice <= formData.stopLoss) {
      newErrors.targetPrice = 'Target price must be greater than stop loss for BUY calls';
    }
    if (formData.action === 'SELL' && formData.targetPrice >= formData.stopLoss) {
      newErrors.targetPrice = 'Target price must be less than stop loss for SELL calls';
    }
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else {
      const expiry = new Date(formData.expiryDate);
      const entry = new Date(formData.entryDate);
      if (expiry <= entry) {
        newErrors.expiryDate = 'Expiry date must be after entry date';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWarning('');
    if (!validateForm()) {
      return;
    }
    try {
      
      console.log('Submitting call:', formData);
      
      setFormData({
        stockSymbol: '',
        broker: allBrokers[0].name,
        action: 'BUY',
        targetPrice: 0,
        stopLoss: 0,
        entryDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        type: 'Equity',
      });
    } catch (error) {
      console.error('Error submitting call:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'targetPrice' || name === 'stopLoss' ? parseFloat(value) : value
    }));
  };

  const handleTypeChange = (type: 'Equity' | 'Derivative') => {
    setFormData(prev => ({ ...prev, type }));
  };

  // Watch stockSymbol and fetch CMP
  const lastSymbol = useRef('');
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const fetchSymbolSuggestions = async (query: string) => {
    try {
      const res = await fetch(`${LOCAL_SEARCH_API}${encodeURIComponent(query)}`);
      const data = await res.json();
      let quotes = data.quotes || [];
      // Prefer NSE and BSE stocks at the top
      const nse = quotes.filter((item: any) => typeof item.symbol === 'string' && item.symbol.endsWith('.NS'));
      const bse = quotes.filter((item: any) => typeof item.symbol === 'string' && item.symbol.endsWith('.BO'));
      const others = quotes.filter((item: any) => typeof item.symbol === 'string' && !item.symbol.endsWith('.NS') && !item.symbol.endsWith('.BO'));
      quotes = [...nse, ...bse, ...others];
      setSymbolDropdown(quotes);
      setShowDropdown(true);
    } catch {
      setSymbolDropdown([]);
      setShowDropdown(false);
    }
  };

  const handleStockSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, stockSymbol: value }));
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    if (value.trim().length >= 3) {
      debounceTimeout.current = setTimeout(() => {
        fetchSymbolSuggestions(value.trim());
      }, 300);
    } else {
      setSymbolDropdown([]);
      setShowDropdown(false);
    }
  };

  const handleSymbolSelect = (symbol: string) => {
    setFormData(prev => ({ ...prev, stockSymbol: symbol }));
    setShowDropdown(false);
    setSymbolDropdown([]);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[#22223B] flex items-center gap-2">
          <FaTag className="text-[#A3A3A3]" /> Submit New Call
        </h2>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-700 text-2xl p-1 rounded transition"
          onClick={onCancel}
          aria-label="Close"
        >
          <FaTimes />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
        {/* Stock Symbol & Broker */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          <div className="relative">
            <label htmlFor="stockSymbol" className="block text-sm font-semibold text-gray-600 mb-1 flex items-center gap-1">
              <FaTag className="text-[#A3A3A3]" /> Stock Symbol
            </label>
            <input
              type="text"
              id="stockSymbol"
              name="stockSymbol"
              value={formData.stockSymbol}
              onChange={handleStockSymbolChange}
              className={`w-full rounded-xl border border-[#F0F1F3] bg-[#FAFAFA] px-3 py-2 text-[#22223B] placeholder-[#6B7280] focus:border-[#393B41] focus:ring-2 focus:ring-[#F6F97B] transition ${errors.stockSymbol ? 'border-red-500' : ''}`}
              placeholder="e.g., RELIANCE"
              autoComplete="off"
              ref={symbolInputRef}
              onFocus={() => {
                if (symbolDropdown.length > 0) setShowDropdown(true);
              }}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            />
            {showDropdown && symbolDropdown.length > 0 && (
              <ul className="absolute z-20 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto mt-1 min-w-[28rem] max-w-[40rem]">
                {symbolDropdown.map((item, idx) => (
                  <li
                    key={item.symbol + idx}
                    className="px-4 py-2 cursor-pointer hover:bg-indigo-50 flex items-center gap-3"
                    onMouseDown={() => handleSymbolSelect(item.symbol)}
                  >
                    <FaSearch className="text-gray-400 w-4 h-4" />
                    <span className="font-semibold text-base text-[#22223B]">{item.symbol}</span>
                    <span className="text-xs text-gray-500 ml-3 truncate">{item.shortname || item.longname || ''}</span>
                  </li>
                ))}
              </ul>
            )}
            {errors.stockSymbol && <p className="mt-1 text-xs text-red-600">{errors.stockSymbol}</p>}
          </div>
          <div>
            <label htmlFor="broker" className="block text-sm font-semibold text-gray-600 mb-1 flex items-center gap-1">
              <FaUserTie className="text-[#A3A3A3]" /> Broker
            </label>
            <select
              id="broker"
              name="broker"
              value={formData.broker}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#F0F1F3] bg-[#FAFAFA] px-3 py-2 text-[#22223B] focus:border-[#393B41] focus:ring-2 focus:ring-[#F6F97B] transition"
              required
            >
              {allBrokers.map(b => (
                <option key={b.name} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>
        {/* NSE/BSE Note */}
        <div className="mb-1 mt-2">
          <span className="text-xs text-gray-500">Note: <span className="font-mono">.NS</span> refers to NSE and <span className="font-mono">.BO</span> refers to BSE.</span>
        </div>
        {/* Action, Target, Stop Loss */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#FAFAFA] border border-[#F0F1F3] rounded-xl p-4">
          <div>
            <label htmlFor="action" className="block text-xs font-semibold text-gray-600 mb-1">Action</label>
            <select
              id="action"
              name="action"
              value={formData.action}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#F0F1F3] bg-white px-3 py-2 text-[#22223B] focus:border-[#393B41] focus:ring-2 focus:ring-[#F6F97B] transition"
            >
              <option value="BUY">Buy</option>
              <option value="SELL">Sell</option>
            </select>
          </div>
          <div>
            <label htmlFor="targetPrice" className="block text-xs font-semibold text-gray-600 mb-1">Target Price</label>
            <input
              type="number"
              id="targetPrice"
              name="targetPrice"
              value={formData.targetPrice}
              onChange={handleChange}
              className={`w-full rounded-xl border border-[#F0F1F3] bg-white px-3 py-2 text-[#22223B] focus:border-[#393B41] focus:ring-2 focus:ring-[#F6F97B] transition ${errors.targetPrice ? 'border-red-500' : ''}`}
              step="0.01"
              min="0"
            />
            {errors.targetPrice && <p className="mt-1 text-xs text-red-600">{errors.targetPrice}</p>}
          </div>
          <div>
            <label htmlFor="stopLoss" className="block text-xs font-semibold text-gray-600 mb-1">Stop Loss</label>
            <input
              type="number"
              id="stopLoss"
              name="stopLoss"
              value={formData.stopLoss}
              onChange={handleChange}
              className={`w-full rounded-xl border border-[#F0F1F3] bg-white px-3 py-2 text-[#22223B] focus:border-[#393B41] focus:ring-2 focus:ring-[#F6F97B] transition ${errors.stopLoss ? 'border-red-500' : ''}`}
              step="0.01"
              min="0"
            />
            {errors.stopLoss && <p className="mt-1 text-xs text-red-600">{errors.stopLoss}</p>}
          </div>
        </div>
        {/* Entry/Expiry Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FAFAFA] border border-[#F0F1F3] rounded-xl p-4">
          <div>
            <label htmlFor="entryDate" className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
              <FaCalendarAlt className="text-[#A3A3A3]" /> Entry Date
            </label>
            <input
              type="date"
              id="entryDate"
              name="entryDate"
              value={formData.entryDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#F0F1F3] bg-white px-3 py-2 text-[#22223B] focus:border-[#393B41] focus:ring-2 focus:ring-[#F6F97B] transition"
            />
          </div>
          <div>
            <label htmlFor="expiryDate" className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
              <FaCalendarAlt className="text-[#A3A3A3]" /> Expiry Date
            </label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className={`w-full rounded-xl border border-[#F0F1F3] bg-white px-3 py-2 text-[#22223B] focus:border-[#393B41] focus:ring-2 focus:ring-[#F6F97B] transition ${errors.expiryDate ? 'border-red-500' : ''}`}
            />
            {errors.expiryDate && <p className="mt-1 text-xs text-red-600">{errors.expiryDate}</p>}
          </div>
        </div>
        {/* Type toggle */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Type</label>
          <div className="flex gap-2">
            <button
              type="button"
              className={`px-4 py-2 rounded-lg font-medium border-2 transition focus:outline-none ${formData.type === 'Equity' ? 'border-[#F6F97B] bg-[#F6F97B] text-[#22223B]' : 'border-gray-200 bg-white text-gray-500'}`}
              onClick={() => handleTypeChange('Equity')}
            >
              Equity
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-lg font-medium border-2 transition focus:outline-none ${formData.type === 'Derivative' ? 'border-[#F6F97B] bg-[#F6F97B] text-[#22223B]' : 'border-gray-200 bg-white text-gray-500'}`}
              onClick={() => handleTypeChange('Derivative')}
            >
              Derivative
            </button>
          </div>
        </div>
        {/* Attachments */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1"><FaFileUpload className="text-[#A3A3A3]" /> Attachments</span>
            <span className="relative group cursor-pointer" ref={infoRef}>
              <FaInfoCircle className="inline-block w-4 h-4 text-gray-400" />
              <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition whitespace-nowrap z-10">
                Please upload a document that verifies this call has been initiated by this broker.
              </span>
            </span>
          </label>
          <label className="block w-full">
            <span className="sr-only">Upload attachments</span>
            <input
              type="file"
              multiple
              onChange={e => setFiles(e.target.files ? Array.from(e.target.files) : [])}
              className="hidden"
              id="attachments-input"
            />
            <div
              className="w-full border border-[#F0F1F3] rounded-xl px-3 py-2 bg-[#FAFAFA] flex items-center cursor-pointer hover:bg-gray-50 transition text-gray-700"
              onClick={() => document.getElementById('attachments-input')?.click()}
              tabIndex={0}
              role="button"
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('attachments-input')?.click(); }}
            >
              <FaFileUpload className="mr-2 text-gray-400 w-5 h-5" />
              <span className={files.length === 0 ? 'text-gray-500' : ''}>
                {files.length === 0 ? 'Upload attachments (PDF, DOCX, etc.)' : `${files.length} file${files.length > 1 ? 's' : ''} selected`}
              </span>
            </div>
          </label>
          {files.length > 0 && (
            <ul className="mt-2 text-xs text-gray-500">
              {files.map(file => <li key={file.name}>{file.name}</li>)}
            </ul>
          )}
        </div>
        {/* Error/Warning */}
        {warning && <div className="text-yellow-600 text-xs font-medium text-center">{warning}</div>}
        {/* Buttons */}
        <div className="flex gap-2 justify-end mt-4">
          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#393B41] text-white font-semibold text-sm hover:bg-[#23242A] transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
} 
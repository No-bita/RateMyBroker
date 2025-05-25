'use client';

import { useState } from 'react';

type FormData = {
  stockSymbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  targetPrice: number;
  stopLoss: number;
  entryDate: string;
  expiryDate: string;
};

export default function CallSubmissionForm() {
  const [formData, setFormData] = useState<FormData>({
    stockSymbol: '',
    action: 'BUY',
    targetPrice: 0,
    stopLoss: 0,
    entryDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

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
    
    if (!validateForm()) {
      return;
    }

    try {
      // TODO: Implement API call to submit the call
      console.log('Submitting call:', formData);
      // Reset form after successful submission
      setFormData({
        stockSymbol: '',
        action: 'BUY',
        targetPrice: 0,
        stopLoss: 0,
        entryDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="stockSymbol" className="block text-sm font-medium text-gray-700">
          Stock Symbol
        </label>
        <input
          type="text"
          id="stockSymbol"
          name="stockSymbol"
          value={formData.stockSymbol}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.stockSymbol ? 'border-red-500' : ''
          }`}
          placeholder="e.g., RELIANCE"
        />
        {errors.stockSymbol && (
          <p className="mt-1 text-sm text-red-600">{errors.stockSymbol}</p>
        )}
      </div>

      <div>
        <label htmlFor="action" className="block text-sm font-medium text-gray-700">
          Action
        </label>
        <select
          id="action"
          name="action"
          value={formData.action}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="BUY">Buy</option>
          <option value="SELL">Sell</option>
          <option value="HOLD">Hold</option>
        </select>
      </div>

      <div>
        <label htmlFor="targetPrice" className="block text-sm font-medium text-gray-700">
          Target Price
        </label>
        <input
          type="number"
          id="targetPrice"
          name="targetPrice"
          value={formData.targetPrice}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.targetPrice ? 'border-red-500' : ''
          }`}
          step="0.01"
          min="0"
        />
        {errors.targetPrice && (
          <p className="mt-1 text-sm text-red-600">{errors.targetPrice}</p>
        )}
      </div>

      <div>
        <label htmlFor="stopLoss" className="block text-sm font-medium text-gray-700">
          Stop Loss
        </label>
        <input
          type="number"
          id="stopLoss"
          name="stopLoss"
          value={formData.stopLoss}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.stopLoss ? 'border-red-500' : ''
          }`}
          step="0.01"
          min="0"
        />
        {errors.stopLoss && (
          <p className="mt-1 text-sm text-red-600">{errors.stopLoss}</p>
        )}
      </div>

      <div>
        <label htmlFor="entryDate" className="block text-sm font-medium text-gray-700">
          Entry Date
        </label>
        <input
          type="date"
          id="entryDate"
          name="entryDate"
          value={formData.entryDate}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
          Expiry Date
        </label>
        <input
          type="date"
          id="expiryDate"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.expiryDate ? 'border-red-500' : ''
          }`}
        />
        {errors.expiryDate && (
          <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Submit Call
      </button>
    </form>
  );
} 
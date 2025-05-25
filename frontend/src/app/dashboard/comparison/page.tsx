"use client"
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface FundData {
  id: number;
  name: string;
  logo: string;
  category: string;
  fundAge: string;
  fundSize: string;
  returns: {
    threeMonths: string;
    sixMonths: string;
    oneYear: string;
    threeYear: string;
    fiveYear: string;
  };
  risk: {
    standardDeviation: string;
    sharpe: string;
  };
}

const fundData: FundData[] = [
  {
    id: 1,
    name: 'SBI Bluechip Fund',
    logo: 'SBI',
    category: 'Large Cap, Equity',
    fundAge: '12 yrs 4 m',
    fundSize: '₹51,010 Crs',
    returns: {
      threeMonths: '8.7%',
      sixMonths: '4.93%',
      oneYear: '11.13%',
      threeYear: '18.1%',
      fiveYear: '24.46%'
    },
    risk: {
      standardDeviation: '12.87',
      sharpe: '0.69'
    }
  },
  {
    id: 2,
    name: 'Motilal Oswal Midcap Fund',
    logo: 'MO',
    category: 'Mid Cap, Equity',
    fundAge: '11 yrs 3 m',
    fundSize: '₹27,780 Crs',
    returns: {
      threeMonths: '7.07%',
      sixMonths: '-5.01%',
      oneYear: '18.07%',
      threeYear: '33.6%',
      fiveYear: '39.88%'
    },
    risk: {
      standardDeviation: '18.75',
      sharpe: '1.1'
    }
  }
];

const ComparisonTable: React.FC = () => {
  const [expanded, setExpanded] = useState({
    overview: true,
    return: true,
    riskMeasures: true
  });

  const toggleSection = (section: keyof typeof expanded) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="px-4 lg:px-8 pb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Compare Mutual Funds</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Add more schemes to compare"
            className="pl-4 pr-10 py-2 rounded-full border border-gray-300 w-64 focus:outline-none focus:ring-1 focus:ring-etmoney-green focus:border-etmoney-green"
          />
          <svg className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="border border-gray-200 rounded-md bg-white mb-4">
        <div className="p-4 border-b border-gray-200">
          <p className="text-base font-bold text-gray-900">
            Comparing SBI Bluechip Fund vs Motilal Oswal Midcap Fund
          </p>
        </div>
        
        <div className="grid grid-cols-4">
          <div className="border-r border-gray-200 bg-white">
            {/* Empty cell for the fund titles */}
          </div>
          
          {/* Fund 1 */}
          <div className="border-r border-gray-200 p-4 bg-white">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-700 font-bold">SBI</span>
                </div>
                <p className="font-semibold text-gray-900">SBI Bluechip Fund</p>
              </div>
              <button>
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <button className="invest-btn text-center mt-2">
              Invest
            </button>
          </div>
          
          {/* Fund 2 */}
          <div className="border-r border-gray-200 p-4 bg-white">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-yellow-700 font-bold">MO</span>
                </div>
                <p className="font-semibold text-gray-900">Motilal Oswal Midcap Fund</p>
              </div>
              <button>
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <button className="invest-btn text-center mt-2">
              Invest
            </button>
          </div>
          
          {/* Add Fund */}
          <div className="p-4 bg-white">
            <div className="flex justify-center items-center mb-4">
              <div className="w-10 h-10 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                <Plus size={20} className="text-gray-400" />
              </div>
            </div>
            <button className="add-fund-btn text-center mt-2">
              Add Fund
            </button>
          </div>
        </div>

        {/* Fund Overview Section */}
        <button
          className="accordion-button text-gray-900 font-bold"
          onClick={() => toggleSection('overview')}
        >
          <span className="font-semibold">FUND OVERVIEW</span>
          <svg 
            className={`h-5 w-5 transform ${expanded.overview ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {expanded.overview && (
          <div className="accordion-content">
            <div className="grid grid-cols-4 bg-white">
              <div className="border-r border-gray-200 py-3 px-4">
                <p className="font-medium text-gray-700">Category,<br />Sub-Category</p>
              </div>
              <div className="border-r border-gray-200 py-3 px-4 text-gray-900">{fundData[0].category}</div>
              <div className="border-r border-gray-200 py-3 px-4 text-gray-900">{fundData[1].category}</div>
              <div className="py-3 px-4"></div>
            </div>
            
            <div className="grid grid-cols-4 bg-gray-50">
              <div className="border-r border-gray-200 py-3 px-4">
                <p className="font-medium text-gray-700">Fund Age</p>
              </div>
              <div className="border-r border-gray-200 py-3 px-4 text-gray-900">{fundData[0].fundAge}</div>
              <div className="border-r border-gray-200 py-3 px-4 text-gray-900">{fundData[1].fundAge}</div>
              <div className="py-3 px-4"></div>
            </div>
            
            <div className="grid grid-cols-4 bg-white">
              <div className="border-r border-gray-200 py-3 px-4">
                <p className="font-medium text-gray-700">Fund Size</p>
              </div>
              <div className="border-r border-gray-200 py-3 px-4 text-gray-900">{fundData[0].fundSize}</div>
              <div className="border-r border-gray-200 py-3 px-4 text-gray-900">{fundData[1].fundSize}</div>
              <div className="py-3 px-4"></div>
            </div>
          </div>
        )}

        {/* Return Section */}
        <button
          className="accordion-button text-gray-900 font-bold"
          onClick={() => toggleSection('return')}
        >
          <span className="font-semibold">RETURN</span>
          <svg 
            className={`h-5 w-5 transform ${expanded.return ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {expanded.return && (
          <div className="accordion-content">
            <div className="grid grid-cols-4 bg-white">
              <div className="border-r border-gray-200 py-3 px-4">
                <p className="font-medium text-gray-700">3 months</p>
              </div>
              <div className="border-r border-gray-200 py-3 px-4 text-gray-900">{fundData[0].returns.threeMonths}</div>
              <div className="border-r border-gray-200 py-3 px-4 text-gray-900">{fundData[1].returns.threeMonths}</div>
              <div className="py-3 px-4"></div>
            </div>
            
            <div className="grid grid-cols-4 bg-gray-50">
              <div className="border-r border-gray-200 py-3 px-4">
                <p className="font-medium text-gray-700">6 months</p>
              </div>
              <div className="border-r border-gray-200 py-3 px-4 text-gray-900">{fundData[0].returns.sixMonths}</div>
              <div className="border-r border-gray-200 py-3 px-4 {parseFloat(fundData[1].returns.sixMonths) < 0 ? 'text-red-600' : 'text-gray-900'}">{fundData[1].returns.sixMonths}</div>
              <div className="py-3 px-4"></div>
            </div>
            
            <div className="grid grid-cols-4 bg-white">
              <div className="border-r border-gray-200 py-3 px-4">
                <p className="font-medium text-gray-700">1 year</p>
              </div>
              <div className="border-r border-gray-200 py-3 px-4 text-gray-900">{fundData[0].returns.oneYear}</div>
              <div className="border-r border-gray-200 py-3 px-4 text-gray-900">{fundData[1].returns.oneYear}</div>
              <div className="py-3 px-4"></div>
            </div>
            
            <div className="grid grid-cols-4 bg-gray-50">
              <div className="border-r border-gray-200 py-3 px-4">
                <p className="font-medium text-gray-700">3 year</p>
              </div>
              <div className="border-r border-gray-200 py-3 px-4 text-gray-900">{fundData[0].returns.threeYear}</div>
              <div className="border-r border-gray-200 py-3 px-4 text-gray-900">{fundData[1].returns.threeYear}</div>
              <div className="py-3 px-4"></div>
            </div>
            
            <div className="grid grid-cols-4 bg-white">
              <div className="border-r border-gray-200 py-3 px-4">
                <p className="font-medium text-gray-700">5 year</p>
              </div>
              <div className="border-r border-gray-200 py-3 px-4 text-gray-900">{fundData[0].returns.fiveYear}</div>
              <div className="border-r border-gray-200 py-3 px-4 text-gray-900">{fundData[1].returns.fiveYear}</div>
              <div className="py-3 px-4"></div>
            </div>
          </div>
        )}

        {/* Risk Measures Section */}
        <button
          className="accordion-button text-gray-900 font-bold"
          onClick={() => toggleSection('riskMeasures')}
        >
          <span className="font-semibold">RISK MEASURES</span>
          <svg 
            className={`h-5 w-5 transform ${expanded.riskMeasures ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {expanded.riskMeasures && (
          <div className="accordion-content">
            <div className="grid grid-cols-4 bg-white">
              <div className="border-r border-gray-200 py-3 px-4 flex items-center">
                <p className="font-medium text-gray-700 mr-1">Standard Deviation</p>
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="border-r border-gray-200 py-3 px-4 text-gray-900">{fundData[0].risk.standardDeviation}</div>
              <div className="border-r border-gray-200 py-3 px-4 text-gray-900">{fundData[1].risk.standardDeviation}</div>
              <div className="py-3 px-4"></div>
            </div>
            
            <div className="grid grid-cols-4 bg-gray-50">
              <div className="border-r border-gray-200 py-3 px-4 flex items-center">
                <p className="font-medium text-gray-700 mr-1">Sharpe</p>
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="border-r border-gray-200 py-3 px-4 text-gray-900">{fundData[0].risk.sharpe}</div>
              <div className="border-r border-gray-200 py-3 px-4 text-gray-900">{fundData[1].risk.sharpe}</div>
              <div className="py-3 px-4"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonTable;
#!/usr/bin/env python3
"""
Complete Trading Signal Analyzer
Combines signal analysis and price analysis functionality
"""

import argparse
import json
import sys
from datetime import datetime
from typing import List, Dict
import os

from signal_analyzer import TradingSignalAnalyzer
from simple_price_analyzer import SimplePriceAnalyzer


class CompleteAnalyzer:
    """Complete trading signal analysis system"""
    
    def __init__(self, api_key: str = None):
        """
        Initialize complete analyzer
        
        Args:
            api_key: API key for stock data provider (optional)
        """
        self.signal_analyzer = TradingSignalAnalyzer()
        self.price_analyzer = SimplePriceAnalyzer(api_key)
        
    def analyze_from_json(self, json_file: str, analyze_prices: bool = True) -> Dict:
        """
        Analyze trading signals from JSON file
        
        Args:
            json_file: Path to JSON file with trading signals
            analyze_prices: Whether to perform price analysis for expired signals
            
        Returns:
            Analysis results dictionary
        """
        print(f"Loading signals from {json_file}...")
        self.signal_analyzer.load_signals_from_json(json_file)
        
        print("Analyzing signal timeframes and cutoff dates...")
        analyzed_signals = self.signal_analyzer.analyze_signals()
        
        # Print signal analysis summary
        self.signal_analyzer.print_summary()
        
        # Output file naming
        base = os.path.splitext(os.path.basename(json_file))[0]
        analyzed_csv = f"analyzed_signals_{base}.csv"
        perf_csv = f"performance_report_{base}.csv"
        # Export signal analysis
        self.signal_analyzer.export_analysis_to_csv(analyzed_csv)
        
        results = {
            'total_signals': len(analyzed_signals),
            'expired_signals': len(self.signal_analyzer.get_expired_signals()),
            'active_signals': len(self.signal_analyzer.get_active_signals()),
            'signals': analyzed_signals
        }
        
        # Perform price analysis if requested and there are expired signals
        expired_signals = self.signal_analyzer.get_expired_signals()
        if analyze_prices and expired_signals:
            print(f"\nPerforming price analysis for {len(expired_signals)} expired signals...")
            
            performance_results = self.price_analyzer.analyze_multiple_signals(expired_signals)
            
            # Print performance summary
            self.price_analyzer.print_performance_summary(performance_results)
            
            # Export performance report
            self.price_analyzer.export_performance_report(performance_results, perf_csv)
            
            results['performance_analysis'] = performance_results
        elif expired_signals:
            print(f"\nSkipping price analysis for {len(expired_signals)} expired signals (--no-price-analysis flag used)")
        else:
            print("\nNo expired signals found for price analysis")
        
        return results
    
    def analyze_from_csv(self, csv_file: str, analyze_prices: bool = True) -> Dict:
        """
        Analyze trading signals from CSV file
        
        Args:
            csv_file: Path to CSV file with trading signals
            analyze_prices: Whether to perform price analysis for expired signals
            
        Returns:
            Analysis results dictionary
        """
        print(f"Loading signals from {csv_file}...")
        self.signal_analyzer.load_signals_from_csv(csv_file)
        
        print("Analyzing signal timeframes and cutoff dates...")
        analyzed_signals = self.signal_analyzer.analyze_signals()
        
        # Print signal analysis summary
        self.signal_analyzer.print_summary()
        
        # Output file naming
        base = os.path.splitext(os.path.basename(csv_file))[0]
        analyzed_csv = f"analyzed_signals_{base}.csv"
        perf_csv = f"performance_report_{base}.csv"
        # Export signal analysis
        self.signal_analyzer.export_analysis_to_csv(analyzed_csv)
        
        results = {
            'total_signals': len(analyzed_signals),
            'expired_signals': len(self.signal_analyzer.get_expired_signals()),
            'active_signals': len(self.signal_analyzer.get_active_signals()),
            'signals': analyzed_signals
        }
        
        # Perform price analysis if requested and there are expired signals
        expired_signals = self.signal_analyzer.get_expired_signals()
        if analyze_prices and expired_signals:
            print(f"\nPerforming price analysis for {len(expired_signals)} expired signals...")
            
            performance_results = self.price_analyzer.analyze_multiple_signals(expired_signals)
            
            # Print performance summary
            self.price_analyzer.print_performance_summary(performance_results)
            
            # Export performance report
            self.price_analyzer.export_performance_report(performance_results, perf_csv)
            
            results['performance_analysis'] = performance_results
        elif expired_signals:
            print(f"\nSkipping price analysis for {len(expired_signals)} expired signals (--no-price-analysis flag used)")
        else:
            print("\nNo expired signals found for price analysis")
        
        return results
    
    def get_signal_statistics(self) -> Dict:
        """Get comprehensive statistics about analyzed signals"""
        if not self.signal_analyzer.analyzed_signals:
            return {"error": "No signals analyzed yet"}
        
        signals = self.signal_analyzer.analyzed_signals
        expired_signals = self.signal_analyzer.get_expired_signals()
        
        # Basic statistics
        stats = {
            'total_signals': len(signals),
            'expired_signals': len(expired_signals),
            'active_signals': len(self.signal_analyzer.get_active_signals()),
            'signals_with_timeframe': len([s for s in signals if s.get('time_frame')]),
            'signals_without_timeframe': len([s for s in signals if not s.get('time_frame')]),
        }
        
        # Time frame distribution
        timeframes = {}
        for signal in signals:
            tf = signal.get('time_frame', 'No Timeframe')
            timeframes[tf] = timeframes.get(tf, 0) + 1
        
        stats['timeframe_distribution'] = timeframes
        
        # Stock distribution
        stocks = {}
        for signal in signals:
            stock = signal.get('stock', 'Unknown')
            stocks[stock] = stocks.get(stock, 0) + 1
        
        stats['stock_distribution'] = stocks
        
        # Date range
        if signals:
            dates = [s.get('listing_date') for s in signals if s.get('listing_date')]
            if dates:
                stats['date_range'] = {
                    'earliest': min(dates),
                    'latest': max(dates)
                }
        
        return stats
    
    def export_complete_report(self, output_file: str = 'complete_analysis_report.json'):
        """Export complete analysis report to JSON - DEPRECATED"""
        print("Note: Complete report export is deprecated. Use analyzed_signals.csv and performance_report.csv instead.")
        return False


def main():
    """Main function with command line interface"""
    parser = argparse.ArgumentParser(
        description="Complete Trading Signal Analyzer",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Analyze signals from JSON file with price analysis
  python complete_analyzer.py trading_signals.json
  
  # Analyze signals from CSV file without price analysis
  python complete_analyzer.py signals.csv --no-price-analysis
  
  # Analyze with API key for real price data
  python complete_analyzer.py trading_signals.json --api-key YOUR_API_KEY
        """
    )
    
    parser.add_argument(
        'input_file',
        help='Input file (JSON or CSV) containing trading signals'
    )
    
    parser.add_argument(
        '--no-price-analysis',
        action='store_true',
        help='Skip price analysis for expired signals'
    )
    
    parser.add_argument(
        '--api-key',
        help='API key for stock data provider (Alpha Vantage)'
    )
    
    parser.add_argument(
        '--statistics-only',
        action='store_true',
        help='Show only statistics without detailed analysis'
    )
    
    args = parser.parse_args()
    
    # Initialize analyzer
    analyzer = CompleteAnalyzer(api_key=args.api_key)
    
    try:
        # Determine file type and analyze
        if args.input_file.endswith('.json'):
            results = analyzer.analyze_from_json(args.input_file, not args.no_price_analysis)
            base = os.path.splitext(os.path.basename(args.input_file))[0]
        elif args.input_file.endswith('.csv'):
            results = analyzer.analyze_from_csv(args.input_file, not args.no_price_analysis)
            base = os.path.splitext(os.path.basename(args.input_file))[0]
        else:
            print("Error: Input file must be JSON or CSV")
            sys.exit(1)
        
        # Show statistics if requested
        if args.statistics_only:
            print("\n" + "="*60)
            print("SIGNAL STATISTICS")
            print("="*60)
            stats = analyzer.get_signal_statistics()
            for key, value in stats.items():
                if isinstance(value, dict):
                    print(f"\n{key.replace('_', ' ').title()}:")
                    for k, v in value.items():
                        print(f"  {k}: {v}")
                else:
                    print(f"{key.replace('_', ' ').title()}: {value}")
        
        print(f"\nAnalysis completed successfully!")
        print(f"Files generated:")
        print(f"  - analyzed_signals_{base}.csv (signal analysis)")
        if results.get('performance_analysis'):
            print(f"  - performance_report_{base}.csv (price analysis)")
        
    except Exception as e:
        print(f"Error during analysis: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main() 
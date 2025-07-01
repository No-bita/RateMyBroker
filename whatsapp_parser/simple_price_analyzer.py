#!/usr/bin/env python3
"""
Simple Price Analyzer for Trading Signals
Analyze trading signals without pandas dependency
"""

import json
import csv
import requests
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
import logging
import time

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SimplePriceAnalyzer:
    """Analyze trading signals against price data without pandas"""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize price analyzer
        
        Args:
            api_key: API key for stock data provider (optional)
        """
        self.api_key = api_key
        self.price_cache = {}  # Cache for price data
        
    def fetch_stock_price_data(self, symbol: str, start_date: str, end_date: str) -> Optional[List[Dict]]:
        """
        Fetch historical price data for a stock from Yahoo Finance
        
        Args:
            symbol: Stock symbol
            start_date: Start date (YYYY-MM-DD)
            end_date: End date (YYYY-MM-DD)
            
        Returns:
            List of price data dictionaries or None if failed
        """
        try:
            # Try Yahoo Finance first
            data = self._fetch_from_yahoo_finance(symbol, start_date, end_date)
            if data is not None:
                return data
            
            # Try Alpha Vantage as backup
            if self.api_key:
                data = self._fetch_from_alpha_vantage(symbol, start_date, end_date)
                if data is not None:
                    return data
            
            # If no data available, return None
            logger.error(f"No price data available for {symbol}")
            return None
            
        except Exception as e:
            logger.error(f"Failed to fetch price data for {symbol}: {e}")
            return None
    
    def _fetch_from_alpha_vantage(self, symbol: str, start_date: str, end_date: str) -> Optional[List[Dict]]:
        """Fetch data from Alpha Vantage API"""
        if not self.api_key:
            return None
        
        try:
            url = "https://www.alphavantage.co/query"
            params = {
                "function": "TIME_SERIES_DAILY",
                "symbol": symbol,
                "apikey": self.api_key,
                "outputsize": "full"
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            if "Time Series (Daily)" not in data:
                return None
            
            # Convert to list of dictionaries
            price_data = []
            start_dt = datetime.strptime(start_date, '%Y-%m-%d')
            end_dt = datetime.strptime(end_date, '%Y-%m-%d')
            
            for date_str, values in data["Time Series (Daily)"].items():
                date_dt = datetime.strptime(date_str, '%Y-%m-%d')
                if start_dt <= date_dt <= end_dt:
                    price_data.append({
                        'date': date_str,
                        'open': float(values['1. open']),
                        'high': float(values['2. high']),
                        'low': float(values['3. low']),
                        'close': float(values['4. close']),
                        'volume': int(values['5. volume'])
                    })
            
            return sorted(price_data, key=lambda x: x['date'])
            
        except Exception as e:
            logger.debug(f"Alpha Vantage failed for {symbol}: {e}")
            return None
    
    def _fetch_from_yahoo_finance(self, symbol: str, start_date: str, end_date: str) -> Optional[List[Dict]]:
        """Fetch data from Yahoo Finance API with rate limiting"""
        try:
            # Add .NS suffix for Indian stocks if not present
            if not symbol.endswith('.NS'):
                symbol = f"{symbol}.NS"
            
            # Add delay to avoid rate limiting
            time.sleep(1)
            
            url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}"
            params = {
                "period1": int(datetime.strptime(start_date, '%Y-%m-%d').timestamp()),
                "period2": int(datetime.strptime(end_date, '%Y-%m-%d').timestamp()),
                "interval": "1d"
            }
            
            # Add headers to mimic browser request
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            
            response = requests.get(url, params=params, headers=headers, timeout=15)
            
            if response.status_code == 429:
                logger.warning(f"Rate limited for {symbol}, waiting 5 seconds...")
                time.sleep(5)
                response = requests.get(url, params=params, headers=headers, timeout=15)
            
            response.raise_for_status()
            
            data = response.json()
            if "chart" not in data or "result" not in data["chart"]:
                return None
            
            result = data["chart"]["result"][0]
            timestamps = result["timestamp"]
            quotes = result["indicators"]["quote"][0]
            
            # Create price data list
            price_data = []
            for i, timestamp in enumerate(timestamps):
                if i < len(quotes.get('open', [])) and quotes['open'][i] is not None:
                    date_str = datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d')
                    price_data.append({
                        'date': date_str,
                        'open': quotes['open'][i],
                        'high': quotes['high'][i],
                        'low': quotes['low'][i],
                        'close': quotes['close'][i],
                        'volume': quotes['volume'][i] if quotes['volume'][i] else 0
                    })
            
            return price_data
            
        except Exception as e:
            logger.debug(f"Yahoo Finance failed for {symbol}: {e}")
            return None
    
    def fetch_current_price(self, symbol: str) -> Optional[float]:
        """
        Fetch current price for a stock symbol from Yahoo Finance
        
        Args:
            symbol: Stock symbol
            
        Returns:
            Current price or None if failed
        """
        try:
            # Try Yahoo Finance
            price = self._fetch_current_from_yahoo(symbol)
            if price:
                return price
            
            # Try Alpha Vantage as backup
            if self.api_key:
                price = self._fetch_current_from_alpha_vantage(symbol)
                if price:
                    return price
            
            logger.error(f"No current price data available for {symbol}")
            return None
            
        except Exception as e:
            logger.error(f"Failed to fetch current price for {symbol}: {e}")
            return None
    
    def _fetch_current_from_yahoo(self, symbol: str) -> Optional[float]:
        """Fetch current price from Yahoo Finance"""
        try:
            # Add .NS suffix for Indian stocks if not present
            if not symbol.endswith('.NS'):
                symbol = f"{symbol}.NS"
            
            # Add delay to avoid rate limiting
            time.sleep(2)
            
            # Get current date and 5 days ago for recent data
            end_date = datetime.now()
            start_date = end_date - timedelta(days=5)
            
            url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}"
            params = {
                "period1": int(start_date.timestamp()),
                "period2": int(end_date.timestamp()),
                "interval": "1d"
            }
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            
            response = requests.get(url, params=params, headers=headers, timeout=15)
            
            if response.status_code == 429:
                logger.warning(f"Rate limited for {symbol}, using simulated price")
                return None
            
            if response.status_code == 200:
                data = response.json()
                if "chart" in data and "result" in data["chart"]:
                    result = data["chart"]["result"][0]
                    if "indicators" in result and "quote" in result["indicators"]:
                        quotes = result["indicators"]["quote"][0]
                        if quotes.get('close') and len(quotes['close']) > 0:
                            # Get the most recent non-null price
                            for i in range(len(quotes['close']) - 1, -1, -1):
                                if quotes['close'][i] is not None:
                                    return quotes['close'][i]
            
            return None
            
        except Exception as e:
            logger.debug(f"Yahoo Finance current price failed for {symbol}: {e}")
            return None
    
    def _fetch_current_from_alpha_vantage(self, symbol: str) -> Optional[float]:
        """Fetch current price from Alpha Vantage"""
        if not self.api_key:
            return None
        
        try:
            time.sleep(1)  # Alpha Vantage has rate limits
            
            url = "https://www.alphavantage.co/query"
            params = {
                "function": "GLOBAL_QUOTE",
                "symbol": symbol,
                "apikey": self.api_key
            }
            
            response = requests.get(url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "Global Quote" in data:
                    quote = data["Global Quote"]
                    if "05. price" in quote:
                        return float(quote["05. price"])
            
            return None
            
        except Exception as e:
            logger.debug(f"Alpha Vantage current price failed for {symbol}: {e}")
            return None
    
    def analyze_signal_performance(self, signal: Dict, price_data: List[Dict]) -> Dict:
        """
        Analyze trading signal performance against price data with daily comparison
        Continues analysis to track all targets hit (only stops on stop loss)
        
        Args:
            signal: Trading signal dictionary
            price_data: Historical price data list
            
        Returns:
            Performance analysis dictionary
        """
        if not price_data:
            return self._create_empty_analysis()
        
        buy_price = signal['buy_price_1']
        stop_loss = signal['stop_loss']
        target_1 = signal['target_1']
        target_2 = signal.get('target_2')
        target_3 = signal.get('target_3')
        
        # Initialize tracking variables
        target_1_hit = False
        target_2_hit = False
        target_3_hit = False
        stop_loss_hit = False
        final_price = price_data[-1]['close']
        first_hit_date = None
        first_hit_price = None
        outcome = "NO_HIT"
        
        # Track high and low prices during the timeframe
        highest_price = max(day['close'] for day in price_data)
        lowest_price = min(day['close'] for day in price_data)
        
        # Daily price comparison - continue until stop loss or end of timeframe
        for day_data in price_data:
            close_price = day_data['close']
            date = day_data['date']
            
            # Check stop loss first (priority - stops analysis)
            if stop_loss and close_price <= stop_loss:
                stop_loss_hit = True
                final_price = close_price
                if not first_hit_date:
                    first_hit_date = date
                    first_hit_price = close_price
                outcome = "STOP_LOSS_HIT"
                break
            
            # Check targets (continue analysis to track all targets)
            if target_1 and close_price >= target_1 and not target_1_hit:
                target_1_hit = True
                if not first_hit_date:
                    first_hit_date = date
                    first_hit_price = close_price
            
            if target_2 and close_price >= target_2 and not target_2_hit:
                target_2_hit = True
                if not first_hit_date:
                    first_hit_date = date
                    first_hit_price = close_price
            
            if target_3 and close_price >= target_3 and not target_3_hit:
                target_3_hit = True
                if not first_hit_date:
                    first_hit_date = date
                    first_hit_price = close_price
        
        # Determine final outcome
        if stop_loss_hit:
            outcome = "STOP_LOSS_HIT"
        elif target_3_hit:
            outcome = "TARGET_3_HIT"
        elif target_2_hit:
            outcome = "TARGET_2_HIT"
        elif target_1_hit:
            outcome = "TARGET_1_HIT"
        elif final_price > buy_price:
            outcome = "PROFIT"
        elif final_price < buy_price:
            outcome = "LOSS"
        else:
            outcome = "BREAKEVEN"
        
        return {
            'current_price': final_price,
            'highest_price': highest_price,
            'lowest_price': lowest_price,
            'target_1_hit': target_1_hit,
            'target_2_hit': target_2_hit,
            'target_3_hit': target_3_hit,
            'stop_loss_hit': stop_loss_hit,
            'first_hit_date': first_hit_date,
            'first_hit_price': first_hit_price,
            'outcome': outcome,
            'data_points': len(price_data)
        }
    
    def _create_empty_analysis(self) -> Dict:
        """Create empty analysis when no price data is available"""
        return {
            'current_price': None,
            'highest_price': None,
            'lowest_price': None,
            'target_1_hit': False,
            'target_2_hit': False,
            'target_3_hit': False,
            'stop_loss_hit': False,
            'first_hit_date': None,
            'first_hit_price': None,
            'outcome': "NO_DATA",
            'data_points': 0
        }
    
    def analyze_multiple_signals(self, signals: List[Dict]) -> List[Dict]:
        """
        Analyze multiple trading signals
        
        Args:
            signals: List of trading signal dictionaries
            
        Returns:
            List of signals with price analysis results
        """
        if not signals:
            return []
        
        analyzed_signals = []
        
        for i, signal in enumerate(signals, 1):
            logger.info(f"Analyzing signal {i}/{len(signals)}: {signal['stock']}")
            
            # Fetch price data
            price_data = self.fetch_stock_price_data(
                signal['stock'], 
                signal['listing_date'], 
                signal['cutoff_date']
            )
            
            if price_data is None:
                logger.warning(f"No price data available for {signal['stock']}, skipping analysis")
                # Add signal with empty analysis
                result = signal.copy()
                result['price_analysis'] = self._create_empty_analysis()
                analyzed_signals.append(result)
                continue
            
            # Analyze performance
            analysis = self.analyze_signal_performance(signal, price_data)
            
            # Combine signal and analysis
            result = signal.copy()
            result['price_analysis'] = analysis
            analyzed_signals.append(result)
        
        return analyzed_signals
    
    def export_performance_report(self, analyzed_signals: List[Dict], output_path: str):
        """Export performance analysis to CSV"""
        try:
            if not analyzed_signals:
                logger.warning("No analyzed signals to export")
                return False
            
            # Define fieldnames for CSV
            fieldnames = [
                'stock', 'listing_date', 'cutoff_date', 'buy_price', 'stop_loss',
                'target_1', 'target_2', 'target_3', 'time_frame', 'current_price',
                'highest_price', 'lowest_price', 'target_1_hit', 'target_2_hit',
                'target_3_hit', 'stop_loss_hit', 'first_hit_date', 'first_hit_price',
                'outcome', 'data_points'
            ]
            
            with open(output_path, 'w', newline='', encoding='utf-8') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                
                for signal in analyzed_signals:
                    analysis = signal.get('price_analysis', {})
                    
                    row = {
                        'stock': signal['stock'],
                        'listing_date': signal['listing_date'],
                        'cutoff_date': signal['cutoff_date'],
                        'buy_price': signal['buy_price_1'],
                        'stop_loss': signal['stop_loss'],
                        'target_1': signal['target_1'],
                        'target_2': signal.get('target_2'),
                        'target_3': signal.get('target_3'),
                        'time_frame': signal['time_frame'],
                        'current_price': analysis.get('current_price'),
                        'highest_price': analysis.get('highest_price'),
                        'lowest_price': analysis.get('lowest_price'),
                        'target_1_hit': analysis.get('target_1_hit'),
                        'target_2_hit': analysis.get('target_2_hit'),
                        'target_3_hit': analysis.get('target_3_hit'),
                        'stop_loss_hit': analysis.get('stop_loss_hit'),
                        'first_hit_date': analysis.get('first_hit_date'),
                        'first_hit_price': analysis.get('first_hit_price'),
                        'outcome': analysis.get('outcome'),
                        'data_points': analysis.get('data_points')
                    }
                    writer.writerow(row)
            
            logger.info(f"Exported performance report to: {output_path}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to export performance report: {e}")
            return False
    
    def print_performance_summary(self, analyzed_signals: List[Dict]):
        """Print a summary of performance analysis results"""
        if not analyzed_signals:
            print("No signals to analyze")
            return
        
        total_signals = len(analyzed_signals)
        profitable_signals = sum(1 for s in analyzed_signals 
                               if s.get('price_analysis', {}).get('outcome', 'NO_DATA') in ["PROFIT", "TARGET_1_HIT", "TARGET_2_HIT", "TARGET_3_HIT"])
        target_1_hits = sum(1 for s in analyzed_signals 
                           if s.get('price_analysis', {}).get('target_1_hit', False))
        stop_loss_hits = sum(1 for s in analyzed_signals 
                            if s.get('price_analysis', {}).get('stop_loss_hit', False))
        
        print("=" * 80)
        print("TRADING SIGNAL PERFORMANCE SUMMARY")
        print("=" * 80)
        print(f"Total Signals Analyzed: {total_signals}")
        print(f"Profitable Signals: {profitable_signals} ({profitable_signals/total_signals*100:.1f}%)")
        print(f"Target 1 Hits: {target_1_hits} ({target_1_hits/total_signals*100:.1f}%)")
        print(f"Stop Loss Hits: {stop_loss_hits} ({stop_loss_hits/total_signals*100:.1f}%)")
        
        print(f"\nDetailed Results:")
        print("-" * 80)
        for signal in analyzed_signals:
            analysis = signal.get('price_analysis', {})
            print(f"{signal['stock']:10} | Buy: {signal['buy_price_1']:8.2f} | "
                  f"Current: {analysis.get('current_price', 0):8.2f} | "
                  f"High: {analysis.get('highest_price', 0):8.2f} | "
                  f"Low: {analysis.get('lowest_price', 0):8.2f} | "
                  f"Outcome: {analysis.get('outcome', 'N/A'):15}")
        
        print("=" * 80)


def main():
    """Main function for testing"""
    # Load analyzed signals
    from signal_analyzer import TradingSignalAnalyzer
    
    analyzer = TradingSignalAnalyzer()
    analyzer.load_signals_from_json('trading_signals.json')
    analyzed_signals = analyzer.analyze_signals()
    
    # Get expired signals for price analysis
    expired_signals = analyzer.get_expired_signals()
    
    if not expired_signals:
        print("No expired signals found for price analysis")
        return
    
    # Initialize price analyzer
    price_analyzer = SimplePriceAnalyzer()
    
    # Analyze performance
    performance_results = price_analyzer.analyze_multiple_signals(expired_signals)
    
    # Print summary
    price_analyzer.print_performance_summary(performance_results)
    
    # Export results
    price_analyzer.export_performance_report(performance_results, 'performance_report.csv')


if __name__ == "__main__":
    main() 
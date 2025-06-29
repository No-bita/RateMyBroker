#!/usr/bin/env python3
"""
Trading Signal Analyzer
Analyze trading signals and compare against price history
"""

import json
import csv
import re
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TradingSignalAnalyzer:
    """Analyze trading signals and their performance"""
    
    def __init__(self):
        """Initialize analyzer"""
        self.signals = []
        self.analyzed_signals = []
        
    def load_signals_from_json(self, file_path: str):
        """Load trading signals from JSON file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                self.signals = json.load(f)
            logger.info(f"Loaded {len(self.signals)} trading signals from {file_path}")
        except Exception as e:
            logger.error(f"Failed to load signals: {e}")
            raise
    
    def load_signals_from_csv(self, file_path: str):
        """Load trading signals from CSV file"""
        try:
            signals = []
            with open(file_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    # Convert string values to appropriate types
                    signal = {
                        'date': row['date'],
                        'sender': row['sender'],
                        'action': row['action'],
                        'stock': row['stock'],
                        'buy_price_1': float(row['buy_price_1']) if row['buy_price_1'] else None,
                        'buy_price_2': float(row['buy_price_2']) if row['buy_price_2'] else None,
                        'stop_loss': float(row['stop_loss']) if row['stop_loss'] else None,
                        'target_1': float(row['target_1']) if row['target_1'] else None,
                        'target_2': float(row['target_2']) if row['target_2'] else None,
                        'target_3': float(row['target_3']) if row['target_3'] else None,
                        'time_frame': row['time_frame'],
                        'raw_message': row['raw_message']
                    }
                    signals.append(signal)
            
            self.signals = signals
            logger.info(f"Loaded {len(self.signals)} trading signals from {file_path}")
        except Exception as e:
            logger.error(f"Failed to load signals: {e}")
            raise
    
    def _extract_days_from_timeframe(self, time_frame: str) -> Optional[int]:
        """
        Extract the upper end of time frame range
        
        Args:
            time_frame: Time frame string (e.g., "5-10 Days", "30 Days")
            
        Returns:
            Number of days (upper end of range)
        """
        if not time_frame:
            return None
        
        # Extract numbers from time frame
        numbers = re.findall(r'\d+', time_frame)
        if not numbers:
            return None
        
        # Convert to integers
        days_list = [int(num) for num in numbers]
        
        # Return the maximum (upper end of range)
        return max(days_list)
    
    def _calculate_cutoff_date(self, listing_date: str, time_frame: str) -> Optional[str]:
        """
        Calculate cutoff date by adding time frame to listing date
        
        Args:
            listing_date: Signal date (YYYY-MM-DD)
            time_frame: Time frame string
            
        Returns:
            Cutoff date in YYYY-MM-DD format
        """
        try:
            # Parse listing date
            listing_dt = datetime.strptime(listing_date, '%Y-%m-%d')
            
            # Extract days from time frame
            days = self._extract_days_from_timeframe(time_frame)
            if not days:
                return None
            
            # Calculate cutoff date
            cutoff_dt = listing_dt + timedelta(days=days)
            return cutoff_dt.strftime('%Y-%m-%d')
            
        except Exception as e:
            logger.warning(f"Failed to calculate cutoff date for {listing_date}: {e}")
            return None
    
    def analyze_signals(self) -> List[Dict]:
        """
        Analyze all trading signals
        
        Returns:
            List of analyzed signals with additional fields
        """
        today = datetime.now().date()
        analyzed_signals = []
        
        for signal in self.signals:
            # Create copy of signal
            analyzed_signal = signal.copy()
            
            # Rename date to listing_date
            analyzed_signal['listing_date'] = analyzed_signal.pop('date')
            
            # Calculate cutoff date
            cutoff_date = self._calculate_cutoff_date(
                analyzed_signal['listing_date'], 
                analyzed_signal['time_frame']
            )
            analyzed_signal['cutoff_date'] = cutoff_date
            
            # Check if signal has expired
            if cutoff_date:
                cutoff_dt = datetime.strptime(cutoff_date, '%Y-%m-%d').date()
                is_expired = today > cutoff_dt
                analyzed_signal['is_expired'] = is_expired
                
                if is_expired:
                    analyzed_signal['days_expired'] = (today - cutoff_dt).days
                else:
                    analyzed_signal['days_expired'] = 0
            else:
                analyzed_signal['is_expired'] = False
                analyzed_signal['days_expired'] = 0
            
            analyzed_signals.append(analyzed_signal)
        
        self.analyzed_signals = analyzed_signals
        logger.info(f"Analyzed {len(analyzed_signals)} signals")
        return analyzed_signals
    
    def get_expired_signals(self) -> List[Dict]:
        """Get all expired signals"""
        return [signal for signal in self.analyzed_signals if signal.get('is_expired', False)]
    
    def get_active_signals(self) -> List[Dict]:
        """Get all active (non-expired) signals"""
        return [signal for signal in self.analyzed_signals if not signal.get('is_expired', False)]
    
    def simulate_price_analysis(self, expired_signals: List[Dict]) -> List[Dict]:
        """
        Simulate price analysis for expired signals
        This is a placeholder - in real implementation, you would fetch actual price data
        
        Args:
            expired_signals: List of expired signals to analyze
            
        Returns:
            List of signals with price analysis results
        """
        analyzed_results = []
        
        for signal in expired_signals:
            result = signal.copy()
            
            # Simulate price analysis (replace with actual price data fetching)
            result['price_analysis'] = {
                'highest_price': self._simulate_highest_price(signal),
                'lowest_price': self._simulate_lowest_price(signal),
                'current_price': self._simulate_current_price(signal),
                'target_1_hit': self._simulate_target_hit(signal, 'target_1'),
                'target_2_hit': self._simulate_target_hit(signal, 'target_2'),
                'target_3_hit': self._simulate_target_hit(signal, 'target_3'),
                'stop_loss_hit': self._simulate_stop_loss_hit(signal),
                'profit_loss_percentage': self._simulate_profit_loss(signal)
            }
            
            analyzed_results.append(result)
        
        return analyzed_results
    
    def _simulate_highest_price(self, signal: Dict) -> float:
        """Simulate highest price reached (placeholder)"""
        buy_price = signal['buy_price_1']
        target_1 = signal['target_1']
        # Simulate: 70% chance of reaching target_1, 30% chance of reaching 95% of target_1
        import random
        if random.random() < 0.7:
            return target_1 * 1.02  # Slightly above target
        else:
            return target_1 * 0.95
    
    def _simulate_lowest_price(self, signal: Dict) -> float:
        """Simulate lowest price reached (placeholder)"""
        buy_price = signal['buy_price_1']
        stop_loss = signal['stop_loss']
        # Simulate: 20% chance of hitting stop loss, 80% chance of staying above
        import random
        if random.random() < 0.2:
            return stop_loss * 0.98  # Slightly below stop loss
        else:
            return stop_loss * 1.05
    
    def _simulate_current_price(self, signal: Dict) -> float:
        """Simulate current price (placeholder)"""
        buy_price = signal['buy_price_1']
        target_1 = signal['target_1']
        # Simulate current price between buy price and target_1
        import random
        return buy_price + (target_1 - buy_price) * random.random()
    
    def _simulate_target_hit(self, signal: Dict, target_key: str) -> bool:
        """Simulate if target was hit (placeholder)"""
        target_price = signal.get(target_key)
        if not target_price:
            return False
        
        # Simulate: 60% chance of hitting target
        import random
        return random.random() < 0.6
    
    def _simulate_stop_loss_hit(self, signal: Dict) -> bool:
        """Simulate if stop loss was hit (placeholder)"""
        # Simulate: 15% chance of hitting stop loss
        import random
        return random.random() < 0.15
    
    def _simulate_profit_loss(self, signal: Dict) -> float:
        """Simulate profit/loss percentage (placeholder)"""
        buy_price = signal['buy_price_1']
        current_price = self._simulate_current_price(signal)
        return ((current_price - buy_price) / buy_price) * 100
    
    def export_analysis_to_csv(self, output_path: str):
        """Export analyzed signals to CSV"""
        try:
            if not self.analyzed_signals:
                logger.warning("No analyzed signals to export")
                return False
            
            # Define fieldnames for CSV
            fieldnames = [
                'listing_date', 'sender', 'action', 'stock', 'buy_price_1', 'buy_price_2',
                'stop_loss', 'target_1', 'target_2', 'target_3', 'time_frame',
                'cutoff_date', 'is_expired', 'days_expired', 'raw_message'
            ]
            
            with open(output_path, 'w', newline='', encoding='utf-8') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                
                for signal in self.analyzed_signals:
                    # Create a copy without price_analysis for CSV
                    csv_signal = {k: v for k, v in signal.items() if k != 'price_analysis'}
                    writer.writerow(csv_signal)
            
            logger.info(f"Exported analysis to: {output_path}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to export analysis: {e}")
            return False
    
    def print_summary(self):
        """Print analysis summary"""
        if not self.analyzed_signals:
            print("No signals analyzed")
            return
        
        total_signals = len(self.analyzed_signals)
        expired_signals = len(self.get_expired_signals())
        active_signals = len(self.get_active_signals())
        
        print("\n" + "="*60)
        print("TRADING SIGNAL ANALYSIS SUMMARY")
        print("="*60)
        print(f"Total Signals: {total_signals}")
        print(f"Expired Signals: {expired_signals}")
        print(f"Active Signals: {active_signals}")
        
        if expired_signals > 0:
            print(f"\nExpired Signals Details:")
            print("-" * 40)
            for signal in self.get_expired_signals():
                print(f"{signal['stock']}: Listed {signal['listing_date']}, Expired {signal['cutoff_date']} ({signal['days_expired']} days ago)")
        
        if active_signals > 0:
            print(f"\nActive Signals Details:")
            print("-" * 40)
            for signal in self.get_active_signals():
                print(f"{signal['stock']}: Listed {signal['listing_date']}, Expires {signal['cutoff_date']}")
        
        print("="*60)


def main():
    """Main function for testing"""
    analyzer = TradingSignalAnalyzer()
    
    # Load signals from JSON
    analyzer.load_signals_from_json('trading_signals.json')
    
    # Analyze signals
    analyzed_signals = analyzer.analyze_signals()
    
    # Print summary
    analyzer.print_summary()
    
    # Export analysis
    analyzer.export_analysis_to_csv('analyzed_signals.csv')
    
    # Simulate price analysis for expired signals
    expired_signals = analyzer.get_expired_signals()
    if expired_signals:
        print(f"\nSimulating price analysis for {len(expired_signals)} expired signals...")
        price_analysis = analyzer.simulate_price_analysis(expired_signals)
        
        print("\nPrice Analysis Results:")
        print("-" * 80)
        for result in price_analysis:
            analysis = result['price_analysis']
            print(f"{result['stock']}: Buy @ {result['buy_price_1']} | Current: {analysis['current_price']:.2f} | P&L: {analysis['profit_loss_percentage']:.2f}% | T1 Hit: {analysis['target_1_hit']} | SL Hit: {analysis['stop_loss_hit']}")


if __name__ == "__main__":
    main() 
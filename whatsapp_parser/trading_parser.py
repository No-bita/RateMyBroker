#!/usr/bin/env python3
"""
Trading Signal Parser for WhatsApp Messages
Extracts structured trading data from WhatsApp chat exports
"""

import re
import csv
import json
from datetime import datetime
from typing import List, Dict, Optional, Tuple
import logging
import sys
import argparse

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TradingSignalParser:
    """Parser for trading signals from WhatsApp messages"""
    
    def __init__(self):
        """Initialize trading parser"""
        # Message pattern for trading signals
        self.message_pattern = re.compile(
            r'(\d{1,2}/\d{1,2}/\d{2,4}),?\s*\d{1,2}:\d{2}\s*-\s*(.+?):\s*(.+)',
            re.MULTILINE
        )
        
        # Trading signal patterns - Updated to handle comma-separated buy prices
        self.trading_patterns = [
            # Pattern for "BUY STOCK @ PRICE1,PRICE2 SL STOPLOSS TGT TARGET1,TARGET2,TARGET3"
            re.compile(
                r'(BUY|SELL|HOLD)\s+([A-Z]+)\s*@\s*([\d,]+\.?\d*)\s+SL\s+([\d,]+\.?\d*)\s+TGT\s+([\d,]+\.?\d*(?:,[\d,]+\.?\d*)*)',
                re.IGNORECASE
            ),
            # Alternative pattern for different formats
            re.compile(
                r'(BUY|SELL|HOLD)\s+([A-Z]+)\s*@\s*([\d,]+\.?\d*)\s+SL\s+([\d,]+\.?\d*)\s+TARGET\s+([\d,]+\.?\d*(?:,[\d,]+\.?\d*)*)',
                re.IGNORECASE
            )
        ]
        
        # Date formats to try
        self.date_formats = [
            '%m/%d/%y',  # MM/DD/YY (your format)
            '%m/%d/%Y',  # MM/DD/YYYY
            '%d/%m/%y',  # DD/MM/YY
            '%d/%m/%Y',  # DD/MM/YYYY
        ]
        
    def parse_file(self, file_path: str) -> List[Dict]:
        """
        Parse WhatsApp chat file and extract trading signals
        
        Args:
            file_path: Path to the TXT file
            
        Returns:
            List of trading signal dictionaries
        """
        logger.info(f"Parsing trading signals from file: {file_path}")
        
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()
        except UnicodeDecodeError:
            # Try with different encoding
            with open(file_path, 'r', encoding='latin-1') as file:
                content = file.read()
        
        # Split content into lines
        lines = content.split('\n')
        trading_signals = []
        
        # Parse messages
        for line in lines:
            if line.strip():
                signal_data = self._parse_trading_line(line)
                if signal_data:
                    trading_signals.append(signal_data)
        
        logger.info(f"Extracted {len(trading_signals)} trading signals from {len(lines)} lines")
        return trading_signals
    
    def _parse_trading_line(self, line: str) -> Optional[Dict]:
        """
        Parse a single line and extract trading signal data
        
        Args:
            line: Single line from chat file
            
        Returns:
            Dictionary with trading signal data or None if not a valid signal
        """
        # First, extract date and message content
        match = self.message_pattern.match(line)
        if not match:
            return None
        
        date_str, sender, message = match.groups()
        
        # Skip deleted messages
        if "deleted this message" in message.lower():
            return None
        
        # Parse date
        date_obj = self._parse_date(date_str)
        if not date_obj:
            return None
        
        # Extract trading signal from message
        trading_data = self._extract_trading_signal(message)
        if not trading_data:
            return None
        
        action, stock, buy_price_raw, stop_loss, targets = trading_data
        
        # Parse buy prices (handle one or two prices)
        buy_prices = [self._clean_price(bp) for bp in buy_price_raw.split(',')]
        buy_price_1 = buy_prices[0] if len(buy_prices) > 0 else None
        buy_price_2 = buy_prices[1] if len(buy_prices) > 1 else None
        
        # Parse targets into separate columns
        target_list = self._parse_targets(targets)
        
        # Parse time frame
        time_frame = self._extract_time_frame(message)
        
        return {
            'date': date_obj.strftime('%Y-%m-%d'),
            'sender': sender.strip(),
            'action': action.upper(),
            'stock': stock.upper(),
            'buy_price_1': buy_price_1,
            'buy_price_2': buy_price_2,
            'stop_loss': self._clean_price(stop_loss),
            'target_1': target_list[0] if len(target_list) > 0 else None,
            'target_2': target_list[1] if len(target_list) > 1 else None,
            'target_3': target_list[2] if len(target_list) > 2 else None,
            'time_frame': time_frame,
            'raw_message': message.strip()
        }
    
    def _parse_date(self, date_str: str) -> Optional[datetime]:
        """
        Parse date string into datetime object
        
        Args:
            date_str: Date string
            
        Returns:
            datetime object or None if parsing fails
        """
        date_str = date_str.strip()
        
        for date_format in self.date_formats:
            try:
                return datetime.strptime(date_str, date_format)
            except ValueError:
                continue
        
        logger.warning(f"Could not parse date: {date_str}")
        return None
    
    def _extract_trading_signal(self, message: str) -> Optional[Tuple]:
        """
        Extract trading signal components from message
        
        Args:
            message: Message content
            
        Returns:
            Tuple of (action, stock, buy_price, stop_loss, targets) or None
        """
        for pattern in self.trading_patterns:
            match = pattern.search(message)
            if match:
                action, stock, buy_price, stop_loss, targets = match.groups()
                return (action, stock, buy_price, stop_loss, targets)
        
        return None
    
    def _parse_targets(self, targets_str: str) -> List[float]:
        """
        Parse targets string into list of numbers
        
        Args:
            targets_str: Targets string (e.g., "5235,5465" or "432,440")
            
        Returns:
            List of target prices
        """
        targets = []
        # Split by comma and clean each target
        for target in targets_str.split(','):
            clean_target = self._clean_price(target.strip())
            if clean_target:
                targets.append(clean_target)
        
        return targets
    
    def _clean_price(self, price_str: str) -> Optional[float]:
        """
        Clean and convert price string to float
        
        Args:
            price_str: Price string (may contain commas for multiple prices)
            
        Returns:
            Float price (first price if multiple) or None if invalid
        """
        try:
            # If there are commas, take the first price
            if ',' in price_str:
                price_str = price_str.split(',')[0]
            
            # Remove any remaining commas and convert to float
            clean_price = price_str.replace(',', '').strip()
            return float(clean_price)
        except (ValueError, AttributeError):
            return None
    
    def _extract_time_frame(self, message: str) -> Optional[str]:
        """
        Extract the time frame from the message (e.g., '5-10 Days', '30 Days')
        Stop at 'Days' or 'days' and don't include any text after that
        """
        # Look for 'Time Frame:' or 'Time Frame :' and extract the value
        match = re.search(r'Time Frame\s*:?\s*([^;\n]+)', message, re.IGNORECASE)
        if match:
            time_frame_text = match.group(1).strip()
            
            # Find the position of 'Days' or 'days' and cut off everything after it
            days_match = re.search(r'(\d+(?:-\d+)?\s*Days?)', time_frame_text, re.IGNORECASE)
            if days_match:
                return days_match.group(1).strip()
            
            return time_frame_text
        return None
    
    def get_statistics(self, signals: List[Dict]) -> Dict:
        """
        Get statistics about the trading signals
        
        Args:
            signals: List of trading signal dictionaries
            
        Returns:
            Dictionary with statistics
        """
        if not signals:
            return {
                'total_signals': 0,
                'unique_stocks': 0,
                'date_range': {'start': 'N/A', 'end': 'N/A'},
                'actions': {},
                'top_stocks': {},
                'avg_buy_price': 0,
                'avg_stop_loss': 0
            }
        
        # Count actions
        actions = {}
        stocks = {}
        buy_prices = []
        stop_losses = []
        dates = []
        
        for signal in signals:
            # Count actions
            action = signal['action']
            actions[action] = actions.get(action, 0) + 1
            
            # Count stocks
            stock = signal['stock']
            stocks[stock] = stocks.get(stock, 0) + 1
            
            # Collect prices
            if signal['buy_price_1']:
                buy_prices.append(signal['buy_price_1'])
            if signal['buy_price_2']:
                buy_prices.append(signal['buy_price_2'])
            if signal['stop_loss']:
                stop_losses.append(signal['stop_loss'])
            
            # Collect dates
            dates.append(signal['date'])
        
        # Get date range
        dates.sort()
        date_range = {'start': dates[0], 'end': dates[-1]} if dates else {'start': 'N/A', 'end': 'N/A'}
        
        # Get top stocks
        top_stocks = dict(sorted(stocks.items(), key=lambda x: x[1], reverse=True)[:10])
        
        return {
            'total_signals': len(signals),
            'unique_stocks': len(stocks),
            'date_range': date_range,
            'actions': actions,
            'top_stocks': top_stocks,
            'avg_buy_price': sum(buy_prices) / len(buy_prices) if buy_prices else 0,
            'avg_stop_loss': sum(stop_losses) / len(stop_losses) if stop_losses else 0
        }
    
    def export_csv(self, signals: List[Dict], output_path: str) -> bool:
        """
        Export trading signals to CSV file
        
        Args:
            signals: List of trading signal dictionaries
            output_path: Output file path
            
        Returns:
            True if successful, False otherwise
        """
        try:
            with open(output_path, 'w', newline='', encoding='utf-8') as csvfile:
                if not signals:
                    return True
                
                fieldnames = [
                    'date', 'sender', 'action', 'stock', 'buy_price_1', 'buy_price_2',
                    'stop_loss', 'target_1', 'target_2', 'target_3', 'time_frame', 'raw_message'
                ]
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                
                writer.writeheader()
                for signal in signals:
                    writer.writerow(signal)
            
            logger.info(f"Successfully exported {len(signals)} trading signals to CSV: {output_path}")
            return True
            
        except Exception as e:
            logger.error(f"CSV export failed: {e}")
            return False
    
    def export_json(self, signals: List[Dict], output_path: str) -> bool:
        """
        Export trading signals to JSON file
        
        Args:
            signals: List of trading signal dictionaries
            output_path: Output file path
            
        Returns:
            True if successful, False otherwise
        """
        try:
            with open(output_path, 'w', encoding='utf-8') as jsonfile:
                json.dump(signals, jsonfile, indent=2, ensure_ascii=False)
            
            logger.info(f"Successfully exported {len(signals)} trading signals to JSON: {output_path}")
            return True
            
        except Exception as e:
            logger.error(f"JSON export failed: {e}")
            return False


def main():
    """Main function for testing"""
    # Parse command line arguments
    parser_arg = argparse.ArgumentParser(description='Parse trading signals from WhatsApp chat file')
    parser_arg.add_argument('input_file', nargs='?', default='trading_chat.txt', 
                           help='Input WhatsApp chat file (default: trading_chat.txt)')
    parser_arg.add_argument('--output-csv', default='trading_signals.csv',
                           help='Output CSV file (default: trading_signals.csv)')
    parser_arg.add_argument('--output-json', default='trading_signals.json',
                           help='Output JSON file (default: trading_signals.json)')
    
    args = parser_arg.parse_args()
    
    parser = TradingSignalParser()
    
    # Parse the trading chat file
    signals = parser.parse_file(args.input_file)
    
    if not signals:
        print("No trading signals found!")
        return
    
    # Print statistics
    stats = parser.get_statistics(signals)
    print("\n" + "="*60)
    print("TRADING SIGNALS EXTRACTION STATISTICS")
    print("="*60)
    print(f"Total Signals: {stats['total_signals']}")
    print(f"Unique Stocks: {stats['unique_stocks']}")
    print(f"Date Range: {stats['date_range']['start']} to {stats['date_range']['end']}")
    print(f"Average Buy Price: {stats['avg_buy_price']:.2f}")
    print(f"Average Stop Loss: {stats['avg_stop_loss']:.2f}")
    
    print("\nActions:")
    for action, count in stats['actions'].items():
        print(f"  {action}: {count}")
    
    print("\nTop Stocks:")
    for stock, count in stats['top_stocks'].items():
        print(f"  {stock}: {count} signals")
    
    # Show first few signals
    print("\nFirst 5 trading signals:")
    print("-" * 100)
    for i, signal in enumerate(signals[:5]):
        print(f"{signal['date']} | {signal['action']} {signal['stock']} @ {signal['buy_price_1']} | {signal['buy_price_2']} | SL: {signal['stop_loss']} | T1: {signal['target_1']} | T2: {signal['target_2']} | T3: {signal['target_3']}")
    
    # Export to CSV and JSON
    parser.export_csv(signals, args.output_csv)
    parser.export_json(signals, args.output_json)
    
    print("\n" + "="*60)
    print("Trading parser test completed!")
    print("="*60)


if __name__ == "__main__":
    main() 
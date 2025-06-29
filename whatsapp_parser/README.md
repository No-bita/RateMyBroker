# WhatsApp Message Extraction Bot

A Python bot that extracts messages from WhatsApp chat files and structures them in tabular form.

## Features

- **TXT File Parser**: Extract messages from exported WhatsApp chat files (TXT format)
- **WhatsApp Web Automation**: Automate extraction via WhatsApp Web (optional)
- **Tabular Output**: Structure data in CSV/Excel format
- **Message Filtering**: Filter out unimportant information
- **Multiple Export Formats**: Support for CSV, Excel, and JSON outputs

## Installation

1. Clone or download the project
2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### 1. Parse TXT Files
```bash
python main.py --file path/to/chat.txt --output chat_data.csv
```

### 2. Extract from WhatsApp Web
```bash
python main.py --web --output web_data.csv
```

### 3. Advanced Options
```bash
python main.py --file chat.txt --output data.xlsx --format excel --filter-media
```

## Supported Formats

- **Input**: TXT files (WhatsApp exported chats)
- **Output**: CSV, Excel (.xlsx), JSON

## Message Structure

The extracted data includes:
- **Timestamp**: Date and time of message
- **Sender**: Name or phone number of sender
- **Message**: Text content
- **Message Type**: Text, media, system message
- **Status**: Read receipts (if available)

## Configuration

Edit `config.py` to customize:
- Date/time formats
- Message patterns
- Filtering rules
- Output preferences 
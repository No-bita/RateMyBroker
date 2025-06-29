"""
Configuration settings for WhatsApp Message Extraction Bot
"""

import re
from datetime import datetime

# Date and time patterns for different WhatsApp export formats
DATE_PATTERNS = [
    r'(\d{1,2}/\d{1,2}/\d{2,4})',  # DD/MM/YY or DD/MM/YYYY
    r'(\d{1,2}-\d{1,2}-\d{2,4})',  # DD-MM-YY or DD-MM-YYYY
    r'(\d{4}-\d{2}-\d{2})',        # YYYY-MM-DD
]

TIME_PATTERNS = [
    r'(\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)',  # HH:MM or HH:MM:SS with optional AM/PM
    r'(\d{1,2}:\d{2}(?::\d{2})?)',  # HH:MM or HH:MM:SS (24-hour)
]

# Message pattern for WhatsApp exported chats
# Format: [Date, Time] Sender: Message
MESSAGE_PATTERN = re.compile(
    r'\[?(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\s*,?\s*(\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)\]?\s*(.+?):\s*(.+)',
    re.MULTILINE
)

# Alternative pattern for different export formats
ALT_MESSAGE_PATTERN = re.compile(
    r'(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\s+(\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)\s+([^:]+):\s*(.+)',
    re.MULTILINE
)

# Patterns to identify system messages (to be filtered out)
SYSTEM_MESSAGES = [
    r'Messages and calls are end-to-end encrypted',
    r'You deleted this message',
    r'This message was deleted',
    r'<Media omitted>',
    r'image omitted',
    r'video omitted',
    r'audio omitted',
    r'document omitted',
    r'contact omitted',
    r'location omitted',
    r'sticker omitted',
    r'GIF omitted',
    r'You changed the group description',
    r'You changed this group\'s icon',
    r'You added',
    r'You removed',
    r'You left',
    r'You joined using this group\'s invite link',
    r'created group',
    r'changed the subject to',
    r'changed this group\'s icon',
    r'added',
    r'removed',
    r'left',
    r'joined using this group\'s invite link',
]

# Compile system message patterns
SYSTEM_PATTERNS = [re.compile(pattern, re.IGNORECASE) for pattern in SYSTEM_MESSAGES]

# Output configuration
OUTPUT_COLUMNS = [
    'timestamp',
    'date',
    'time',
    'sender',
    'message',
    'message_type',
    'is_system_message'
]

# Date format for parsing - Updated to handle MM/DD/YYYY format
DATE_FORMATS = [
    '%m/%d/%Y',  # MM/DD/YYYY (most common in US)
    '%m/%d/%y',  # MM/DD/YY
    '%d/%m/%Y',  # DD/MM/YYYY (European format)
    '%d/%m/%y',  # DD/MM/YY
    '%d-%m-%Y',  # DD-MM-YYYY
    '%d-%m-%y',  # DD-MM-YY
    '%Y-%m-%d',  # YYYY-MM-DD
]

# Time format for parsing
TIME_FORMATS = [
    '%I:%M %p',  # 12-hour with AM/PM
    '%I:%M:%S %p',  # 12-hour with seconds and AM/PM
    '%H:%M',  # 24-hour
    '%H:%M:%S',  # 24-hour with seconds
]

# WhatsApp Web configuration
WHATSAPP_WEB_URL = "https://web.whatsapp.com"
WAIT_TIMEOUT = 30  # seconds
SCROLL_PAUSE_TIME = 2  # seconds

# Filtering options
DEFAULT_FILTERS = {
    'filter_system_messages': True,
    'filter_media_messages': False,
    'filter_empty_messages': True,
    'min_message_length': 1,
    'include_deleted_messages': False,
}

# Export options
EXPORT_OPTIONS = {
    'csv': {
        'encoding': 'utf-8',
        'index': False,
        'date_format': '%Y-%m-%d %H:%M:%S'
    },
    'excel': {
        'index': False,
        'date_format': '%Y-%m-%d %H:%M:%S'
    },
    'json': {
        'orient': 'records',
        'date_format': 'iso'
    }
} 
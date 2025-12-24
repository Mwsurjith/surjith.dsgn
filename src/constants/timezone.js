/**
 * Timezone microapp constants
 */

export const STORAGE_KEY = 'timezone_selected';
export const STORAGE_LOCAL_KEY = 'timezone_local';

export const FALLBACK_TIMEZONES = [
    { timezone: 'Asia/Kolkata', offset: '+0530', country: 'India' },
    { timezone: 'America/Denver', offset: '-0700', country: 'United States' },
    { timezone: 'America/Los_Angeles', offset: '-0800', country: 'United States' },
    { timezone: 'America/New_York', offset: '-0500', country: 'United States' },
    { timezone: 'America/Chicago', offset: '-0600', country: 'United States' },
    { timezone: 'Europe/London', offset: '+0000', country: 'United Kingdom' },
    { timezone: 'Europe/Paris', offset: '+0100', country: 'France' },
    { timezone: 'Europe/Berlin', offset: '+0100', country: 'Germany' },
    { timezone: 'Asia/Tokyo', offset: '+0900', country: 'Japan' },
    { timezone: 'Asia/Shanghai', offset: '+0800', country: 'China' },
    { timezone: 'Asia/Singapore', offset: '+0800', country: 'Singapore' },
    { timezone: 'Asia/Dubai', offset: '+0400', country: 'United Arab Emirates' },
    { timezone: 'Australia/Sydney', offset: '+1100', country: 'Australia' },
    { timezone: 'Pacific/Auckland', offset: '+1300', country: 'New Zealand' },
    { timezone: 'Africa/Cairo', offset: '+0200', country: 'Egypt' },
    { timezone: 'America/Sao_Paulo', offset: '-0300', country: 'Brazil' },
];

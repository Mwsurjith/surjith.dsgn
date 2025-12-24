// Timezone utility functions

// Parse offset string like "+0530" or "-0700" to minutes
export function parseOffset(offsetStr) {
    if (!offsetStr) return 0;
    const sign = offsetStr[0] === '-' ? -1 : 1;
    const hours = parseInt(offsetStr.slice(1, 3), 10) || 0;
    const minutes = parseInt(offsetStr.slice(3, 5), 10) || 0;
    return sign * (hours * 60 + minutes);
}

// Get user's local timezone offset in "+HHMM" format
export function getLocalOffset() {
    const offset = -new Date().getTimezoneOffset();
    const sign = offset >= 0 ? '+' : '-';
    const absOffset = Math.abs(offset);
    const hours = Math.floor(absOffset / 60).toString().padStart(2, '0');
    const minutes = (absOffset % 60).toString().padStart(2, '0');
    return `${sign}${hours}${minutes}`;
}

// Get time in a specific timezone given offset
export function getTimeInTimezone(date, offsetStr) {
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const offsetMinutes = parseOffset(offsetStr);
    return new Date(utc + offsetMinutes * 60000);
}

// Get time in target timezone from base timezone time
export function getTimeInTimezoneFromBase(baseDate, baseOffset, targetOffset) {
    const baseMinutes = parseOffset(baseOffset);
    const targetMinutes = parseOffset(targetOffset);
    const diffMinutes = targetMinutes - baseMinutes;
    return new Date(baseDate.getTime() + diffMinutes * 60000);
}

// Check if hour is night time (before 6am or after 9pm)
export function isNightHour(hour) {
    return hour < 6 || hour >= 21;
}

// Format time as "09:03 pm" style
export function formatTimeDisplay(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    const displayHours = (hours % 12 || 12).toString().padStart(2, '0');
    return `${displayHours}:${minutes} ${ampm}`;
}

// Format time with seconds for large clock
export function formatTimeLarge(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    const displayHours = (hours % 12 || 12).toString().padStart(2, '0');
    return { time: `${displayHours}:${minutes}:${seconds}`, ampm };
}

// Format date as "Thu, Dec 18"
export function formatDateShort(date) {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// Format full date as "Thursday, 18 December, 2025, week 51"
export function formatFullDate(date) {
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    return `${weekday}, ${day} ${month}, ${year}, week ${weekNumber}`;
}

// Format offset for display like "GMT +5.5"
export function formatOffset(offsetStr) {
    const totalMinutes = parseOffset(offsetStr);
    const hours = Math.floor(Math.abs(totalMinutes) / 60);
    const mins = Math.abs(totalMinutes) % 60;
    const sign = totalMinutes >= 0 ? '+' : '-';
    if (mins > 0) {
        return `GMT ${sign}${hours}.${Math.round(mins / 6)}`;
    }
    return `GMT ${sign}${hours}`;
}

// Generate time slots based on local time
export function generateSlots(baseDate, baseOffset, targetOffset, numSlots = 24) {
    const slots = [];
    const baseTime = getTimeInTimezone(baseDate, baseOffset);
    const currentHour = baseTime.getHours();

    for (let i = -1; i < numSlots - 1; i++) {
        const slotBaseTime = new Date(baseTime);
        slotBaseTime.setHours(currentHour + i, i === 0 ? baseTime.getMinutes() : 0, 0, 0);

        const targetTime = getTimeInTimezoneFromBase(slotBaseTime, baseOffset, targetOffset);

        slots.push({
            baseTime: slotBaseTime,
            targetTime: targetTime,
            isCurrent: i === 0,
        });
    }

    return slots;
}

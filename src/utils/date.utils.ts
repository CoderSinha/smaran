/**
 * Date utility functions for converting between ISO strings and DD/MM/YYYY format
 */

/**
 * Converts ISO string to DD/MM/YYYY format
 * @param isoString - ISO date string (e.g., "2025-01-29T10:30:00.000Z")
 * @returns DD/MM/YYYY formatted string (e.g., "29/01/2025")
 */
export function convertISOToddMMyyyy(isoString: string): string {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  } catch {
    return '';
  }
}

/**
 * Converts DD/MM/YYYY string to ISO string
 * @param dateString - DD/MM/YYYY formatted string (e.g., "29/01/2025")
 * @returns ISO date string (e.g., "2025-01-29T00:00:00.000Z")
 */
export function convertddMMyyyyToISO(dateString: string): string {
  if (!dateString || dateString.length !== 10) return '';
  try {
    const [day, month, year] = dateString.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (isNaN(date.getTime())) return '';
    return date.toISOString();
  } catch {
    return '';
  }
}

/**
 * Checks if a date string is in valid DD/MM/YYYY format
 * @param dateString - Date string to validate
 * @returns true if format is valid
 */
export function isValidDateFormat(dateString: string): boolean {
  return /^\d{2}\/\d{2}\/\d{4}$/.test(dateString);
}

/**
 * Checks if a date is today or in the future
 * @param dateString - DD/MM/YYYY formatted string or ISO string
 * @returns true if date is today or future
 */
export function isFutureOrToday(dateString: string): boolean {
  try {
    let date: Date;

    if (isValidDateFormat(dateString)) {
      const isoString = convertddMMyyyyToISO(dateString);
      if (!isoString) return false;
      date = new Date(isoString);
    } else {
      date = new Date(dateString);
    }

    if (isNaN(date.getTime())) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    return date >= today;
  } catch {
    return false;
  }
}

/**
 * Auto-formats date input with separators (12345678 → 12/34/5678)
 * @param value - Raw input value
 * @returns Formatted string with separators
 */
export function formatDateInput(value: string): string {
  let cleanValue = value.replace(/\D/g, ''); // Remove non-digits

  // Auto-add separators
  if (cleanValue.length >= 2) {
    cleanValue = cleanValue.substring(0, 2) + '/' + cleanValue.substring(2);
  }
  if (cleanValue.length >= 5) {
    cleanValue = cleanValue.substring(0, 5) + '/' + cleanValue.substring(5, 9);
  }

  return cleanValue;
}

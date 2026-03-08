import dayjs from "dayjs";

/**
 * Format a date string or Date to 'DD/MM/YYYY HH:mm:ss'
 * @param date - string or Date
 * @returns formatted string
 */
export function formatDateTime(date: string | Date | undefined | null): string {
  if (!date) return "";
  return dayjs(date).format("DD/MM/YYYY HH:mm:ss");
}

/**
 * Format date only to 'DD/MM/YYYY'
 */
export function formatDate(date: string | Date | undefined | null): string {
  if (!date) return "";
  return dayjs(date).format("DD/MM/YYYY");
}

/**
 * Format time only to 'HH:mm:ss'
 */
export function formatTime(date: string | Date | undefined | null): string {
  if (!date) return "";
  return dayjs(date).format("HH:mm:ss");
}
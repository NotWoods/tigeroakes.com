import { Temporal } from '@js-temporal/polyfill';

/**
 * Convert date string into a PlainDate.
 * Handles dates in Astro's format, which adds time and timezone identifiers.
 */
export function dateFromString(date: string) {
  const timeSeparator = date.indexOf('T');
  if (timeSeparator >= 0) {
    date = date.substring(0, timeSeparator);
  }
  return Temporal.PlainDate.from(date);
}

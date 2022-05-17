import { Intl, Temporal } from '@js-temporal/polyfill';

export function formatToPartsMap(
  formatter: Intl.DateTimeFormat,
  date: Intl.Formattable
): ReadonlyMap<globalThis.Intl.DateTimeFormatPartTypes, string> {
  return new Map(
    formatter.formatToParts(date).map(({ type, value }) => [type, value])
  );
}

/**
 * Convert date string into a PlainDate.
 * Handles dates in Astro's format, which adds time and timezone identifiers.
 */
export function dateFromString(date: string): Temporal.PlainDate;
export function dateFromString(
  date: string | undefined
): Temporal.PlainDate | undefined;
export function dateFromString(date: string | undefined) {
  if (!date) return undefined;

  if (typeof date === 'string') {
    const timeSeparator = date.indexOf('T');
    if (timeSeparator >= 0) {
      date = date.substring(0, timeSeparator);
    }
  }
  return Temporal.PlainDate.from(date);
}

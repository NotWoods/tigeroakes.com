import { Intl, Temporal } from '@js-temporal/polyfill';

export function formatToPartsMap(
  formatter: Intl.DateTimeFormat,
  date: Temporal.PlainDate | Date
): ReadonlyMap<globalThis.Intl.DateTimeFormatPartTypes, string> {
  const formattable =
    date instanceof Date
      ? date.valueOf()
      : date.toZonedDateTime('America/Vancouver').epochMilliseconds;
  return new Map(
    formatter.formatToParts(formattable).map(({ type, value }) => [type, value])
  );
}

export function toPlainDate(date: Date | string): Temporal.PlainDate {
  if (typeof date === 'string') {
    return Temporal.PlainDate.from(date);
  } else {
    return new Temporal.PlainDate(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );
  }
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

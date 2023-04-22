import { Intl } from '@js-temporal/polyfill';
import { Fragment } from 'preact';
import { dateFromString } from '../../scripts/date';

export const resumeDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
});
const resumeYearFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
});

function formatResumeDate(date: string, onlyYear?: boolean) {
  return (onlyYear ? resumeYearFormatter : resumeDateFormatter).format(
    dateFromString(date)
  );
}

function formatIsoDate(date: string | undefined) {
  if (!date) {
    return 'P1Y';
  }
  return dateFromString(date).toString();
}

export interface DateRange {
  startDate?: string;
  endDate?: string;
}

export function formatResumeDateRange({
  startDate,
  endDate,
  onlyYear,
}: DateRange & { onlyYear?: boolean }) {
  return [
    formatResumeDate(startDate, onlyYear),
    endDate ? formatResumeDate(endDate, onlyYear) : 'Present',
  ].join(' — ');
}

export const ExperienceDate = ({
  startDate,
  endDate,
  onlyYear,
}: DateRange & { onlyYear?: boolean }) => {
  return (
    <time
      class="text-orange-500 float-right text-[0.825em] ml-4"
      dateTime={`${formatIsoDate(startDate)}/${formatIsoDate(endDate)}`}
    >
      {formatResumeDateRange({ startDate, endDate, onlyYear })}
    </time>
  );
};

export const ExperienceTitle = ({
  company,
  position,
  website,
}: {
  company: string;
  position?: string;
  website?: string;
}) => {
  return (
    <h3 class="font-sans font-normal text-[11pt]">
      <a href={website} class="font-semibold">
        {company}
      </a>
      {position && (
        <>
          , <span>{position}</span>
        </>
      )}
    </h3>
  );
};

export const ExperienceHighlights = ({
  highlights,
}: {
  highlights: readonly string[] | undefined;
}) => {
  if (!highlights) return null;
  return (
    <ul class="list-square clear-right mt-[2pt] mb-[8pt] pl-[1em]">
      {highlights.map((highlight, i) => (
        <ExperienceHighlight key={i}>{highlight}</ExperienceHighlight>
      ))}
    </ul>
  );
};

const BOLD = /\*\*([^*]+)\*\*/g;
export function parseHighlight(highlight: string) {
  const parts: { text: string; bold: boolean }[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = BOLD.exec(highlight)) !== null) {
    const startIndex = lastIndex;
    const endIndex = BOLD.lastIndex;

    // Push plain text
    parts.push({ text: highlight.slice(startIndex, match.index), bold: false });

    // Push bold text
    parts.push({
      text: highlight.slice(match.index + 2, endIndex - 2),
      bold: true,
    });

    lastIndex = endIndex;
  }
  parts.push({ text: highlight.slice(lastIndex), bold: false });

  return parts;
}

const ExperienceHighlight = ({ children }: { children: string }) => {
  let plainCount = 0;
  let boldCount = 0;

  const parts = parseHighlight(children).map(({ text, bold }) => {
    if (bold) {
      return <strong key={`bold-${boldCount++}`}>{text}</strong>;
    } else {
      return <Fragment key={plainCount++}>{text}</Fragment>;
    }
  });

  return <li>{parts}</li>;
};

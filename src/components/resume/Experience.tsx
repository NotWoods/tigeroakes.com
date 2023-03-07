import { Intl } from '@js-temporal/polyfill';
import { ComponentChild, Fragment } from 'preact';
import { dateFromString, formatToPartsMap } from '../../scripts/date';

const resumeFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
});

function formatResumeDate(date: string) {
  const parts = formatToPartsMap(resumeFormatter, dateFromString(date));
  return `${parts.get('year')}-${parts.get('month')}`;
}

function formatIsoDate(date: string | undefined) {
  if (!date) {
    return 'P1Y';
  }
  return dateFromString(date).toString();
}

export const ExperienceDate = ({ startDate, endDate }) => {
  return (
    <time
      class="text-orange-500 float-right text-[0.825em] ml-4"
      dateTime={`${formatIsoDate(startDate)}/${formatIsoDate(endDate)}`}
    >
      {formatResumeDate(startDate)}
      {' — '}
      {endDate ? formatResumeDate(endDate) : 'Present'}
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
    <h3 class="font-sans font-normal">
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
  highlights: readonly string[];
}) => {
  return (
    <ul class="list-square clear-right mt-[2pt] mb-[8pt] pl-[1em]">
      {highlights.map((highlight, i) => (
        <ExperienceHighlight key={i}>{highlight}</ExperienceHighlight>
      ))}
    </ul>
  );
};

const BOLD = /\*\*([^*]+)\*\*/g;
const ExperienceHighlight = ({ children }: { children: string }) => {
  const parts: ComponentChild[] = [];

  let i = 0;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = BOLD.exec(children)) !== null) {
    const startIndex = lastIndex;
    const endIndex = BOLD.lastIndex;

    // Push plain text
    parts.push(
      <Fragment key={i}>{children.slice(startIndex, match.index)}</Fragment>
    );

    // Push bold text
    parts.push(
      <strong key={`bold-${i}`}>
        {children.slice(match.index + 2, endIndex - 2)}
      </strong>
    );

    lastIndex = endIndex;
    i++;
  }
  parts.push(children.slice(lastIndex));

  return <li>{parts}</li>;
};

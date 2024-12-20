import { Intl, Temporal } from '@js-temporal/polyfill';
import { DefaultMap } from '@notwoods/default-map';
import type { ComponentChild, FunctionComponent } from 'preact';
import { dateFromString } from '../../scripts/date';
import styles from './resume.module.css';
import type { ResumeSchema } from '@kurone-kito/jsonresume-types';
import { parseHighlight, type TextSpan } from './markdownish';

export const resumeDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
});
const resumeYearFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
});

function formatResumeDate(date: string, onlyYear?: boolean) {
  const plainDate = dateFromString(date);

  return (onlyYear ? resumeYearFormatter : resumeDateFormatter).format(
    plainDate
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

interface FormatDateRangeOptions extends DateRange {
  onlyYear?: boolean | 'auto';
}

export function formatResumeDateRange({
  startDate,
  endDate,
  onlyYear,
}: FormatDateRangeOptions) {
  if (!startDate) {
    return '';
  }

  if (onlyYear === 'auto') {
    if (endDate) {
      const twoYearsAgo = Temporal.Now.plainDateISO().subtract({ years: 2 });

      onlyYear =
        Temporal.PlainDate.compare(twoYearsAgo, startDate) > 0 &&
        Temporal.PlainDate.compare(twoYearsAgo, endDate) > 0;
    } else {
      onlyYear = false;
    }
  }

  return [
    formatResumeDate(startDate, onlyYear),
    endDate ? formatResumeDate(endDate, onlyYear) : 'Present',
  ].join(' — ');
}

export const ExperienceDate = ({
  startDate,
  endDate,
  onlyYear,
}: FormatDateRangeOptions) => {
  return (
    <time
      class="float-right ml-4 font-bold"
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
    <h3 class={styles.experienceTitle}>
      <a href={website} class="font-bold">
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
    <ul class={`${styles.experienceHighlights} clear-right list-square`}>
      {highlights.map((highlight, i) => (
        <ExperienceHighlight key={i}>{highlight}</ExperienceHighlight>
      ))}
    </ul>
  );
};

const ExperienceHighlight = ({ children }: { children: string }) => {
  const parts = parseHighlight(children).map((textSpan, index) => (
    <FormattedSpan key={index} {...textSpan} />
  ));

  return <li>{parts}</li>;
};

export const FormattedSpan: FunctionComponent<TextSpan> = ({
  text,
  bold,
  href,
}) => {
  let span: ComponentChild = text;
  if (bold) {
    span = <strong>{text}</strong>;
  }
  if (href) {
    span = <a href={href}>{span}</a>;
  }
  return <>{span}</>;
};

export function bucketSkills(
  skills: ResumeSchema['skills'] = [],
  fallback = 'other'
) {
  const buckets = new DefaultMap<string, string[]>(() => []);
  for (const skill of skills) {
    if (skill.name) {
      for (const keyword of skill.keywords ?? [fallback]) {
        buckets.get(keyword).push(skill.name);
      }
    }
  }
  return buckets;
}

export function formatSkills(skills: ResumeSchema['skills']) {
  const buckets = bucketSkills(skills);
  return ['language', 'tech', 'other']
    .map((keyword) => buckets.get(keyword))
    .filter((x) => x.length > 0)
    .map((skills) => skills.join(', '));
}

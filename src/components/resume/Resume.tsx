import type { ResumeSchema } from '@kurone-kito/jsonresume-types';
import { type ComponentChildren, Fragment } from 'preact';
import {
  ExperienceDate,
  ExperienceHighlights,
  ExperienceTitle,
  formatSkills,
} from './Experience';
import { ResumeHeader } from './Header';
import styles from './resume.module.css';

export const Resume = ({ jsonResume }: { jsonResume: ResumeSchema }) => {
  return (
    <main class={`${styles.resume} resume mx-auto bg-white`}>
      <ResumeHeader basics={jsonResume.basics} />

      <ResumeSectionHeader>Technologies and Languages</ResumeSectionHeader>
      <ExperienceHighlights highlights={formatSkills(jsonResume.skills)} />

      <ResumeSectionHeader>Experience</ResumeSectionHeader>
      {jsonResume.work!.map((work) => (
        <Fragment key={work.startDate}>
          <ExperienceDate
            startDate={work.startDate}
            endDate={work.endDate}
            onlyYear="auto"
          />
          <ExperienceTitle
            company={work.name!}
            position={work.position}
            website={work.url}
          />
          <ExperienceHighlights highlights={work.highlights} />
        </Fragment>
      ))}

      <ResumeSectionHeader>Community Projects</ResumeSectionHeader>
      {jsonResume.projects!.map((project) => (
        <Fragment key={project.name}>
          {project.startDate && (
            <ExperienceDate
              startDate={project.startDate}
              endDate={project.endDate}
              onlyYear
            />
          )}
          <ExperienceTitle company={project.name!} website={project.url} />
          <ExperienceHighlights highlights={project.highlights} />
        </Fragment>
      ))}

      <ResumeSectionHeader>Education</ResumeSectionHeader>
      {jsonResume.education!.map((education) => (
        <Fragment key={education.startDate}>
          <ExperienceDate
            startDate={education.startDate}
            endDate={education.endDate}
            onlyYear
          />
          <ExperienceTitle
            company={education.institution!}
            position={`${education.studyType} in ${education.area}`}
            website={education.url}
          />
        </Fragment>
      ))}
    </main>
  );
};

const ResumeSectionHeader = (props: {
  children: ComponentChildren;
  class?: string;
}) => (
  <h2
    class={[
      styles.sectionHeader,
      'border-b border-orange-500 font-bold',
      props.class,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    {props.children}
  </h2>
);

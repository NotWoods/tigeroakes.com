import { ComponentChildren, Fragment } from 'preact';
import {
  ExperienceDate,
  ExperienceHighlights,
  ExperienceTitle,
} from './Experience';
import { ResumeHeader, TagList } from './Header';

export const Resume = ({ jsonResume }) => {
  return (
    <main class="resume mx-auto bg-white text-[#212121] text-[11pt] m-[2em] print:m-0 max-w-[8.5in] p-[0.5in]">
      <ResumeHeader basics={jsonResume.basics} />
      <ResumeSectionHeader>Experience</ResumeSectionHeader>
      {jsonResume.work.map((work) => (
        <Fragment key={work.startDate}>
          <ExperienceDate startDate={work.startDate} endDate={work.endDate} />
          <ExperienceTitle
            company={work.company}
            position={work.position}
            website={work.website}
          />
          <ExperienceHighlights highlights={work.highlights} />
        </Fragment>
      ))}

      <ResumeSectionHeader>Community</ResumeSectionHeader>
      {jsonResume.projects.map((project) => (
        <Fragment key={project.name}>
          <ExperienceTitle company={project.name} website={project.url} />
          <ExperienceHighlights highlights={project.highlights} />
        </Fragment>
      ))}

      <ResumeSectionHeader>Skills</ResumeSectionHeader>
      <p class="mb-[8pt]">
        <TagList tags={jsonResume.skills.map((skill) => skill.name)} />
      </p>

      <ResumeSectionHeader>Education</ResumeSectionHeader>
      {jsonResume.education.map((education) => (
        <Fragment key={education.startDate}>
          <ExperienceDate
            startDate={education.startDate}
            endDate={education.endDate}
          />
          <ExperienceTitle
            company={education.institution}
            position={`${education.studyType} in ${education.area}`}
            website={education.url}
          />
        </Fragment>
      ))}

      <ResumeSectionHeader class="mt-[12pt]">Awards</ResumeSectionHeader>
      <ExperienceHighlights
        highlights={jsonResume.awards.map((award) => award.title)}
      />
    </main>
  );
};

const ResumeSectionHeader = (props: {
  children: ComponentChildren;
  class?: string;
}) => (
  <h2
    class={[
      'font-sans text-[12pt] mb-[3pt] relative font-bold accent-block--left accent-block--still',
      props.class,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    {props.children}
  </h2>
);

import { APIRoute, GetStaticPaths } from 'astro';
import {
  Document,
  ExternalHyperlink,
  HeadingLevel,
  Packer,
  Paragraph,
  ParagraphChild,
  TextRun,
} from 'docx';
import {
  DateRange,
  formatResumeDateRange,
  resumeDateFormatter,
} from '../../../components/resume/Experience';
import { contactList } from '../../../components/resume/Header';

function joinTags(
  tags: readonly ParagraphChild[],
  separator = ' | '
): ParagraphChild[] {
  return tags.flatMap((tag, index) => {
    if (index < tags.length - 1) {
      return [tag, new TextRun(separator)];
    } else {
      return [tag];
    }
  });
}

function resumeHeader({ basics }) {
  return [
    // Name
    new Paragraph({
      text: basics.name,
      heading: HeadingLevel.TITLE,
      style: 'title',
    }),
    // Contact
    new Paragraph({
      children: joinTags(
        contactList(basics).map(
          ({ href, text }) =>
            new ExternalHyperlink({
              children: [new TextRun(text)],
              link: href,
            })
        )
      ),
      style: 'skills',
    }),
    // Summary
    new Paragraph({
      text: basics.summary,
      style: 'summary',
    }),
  ];
}

function experience({
  company,
  position,
  url,
  dateRange,
  highlights,
}: {
  company: string;
  position?: string;
  url?: string;
  dateRange: DateRange;
  highlights?: readonly string[];
}): Paragraph[] {
  const companyText = new TextRun({
    text: company,
    style: 'company',
  });

  const heading = new Paragraph({
    children: [
      url
        ? new ExternalHyperlink({ children: [companyText], link: url })
        : companyText,
      new TextRun(position ? `, ${position}` : ''),
      new TextRun({
        text: formatResumeDateRange(dateRange),
        style: 'date',
      }),
    ],
    heading: HeadingLevel.HEADING_2,
    style: 'heading-2',
  });

  const bullets =
    highlights?.map(
      (highlight) =>
        new Paragraph({
          text: highlight,
          bullet: { level: 0 },
          style: 'list-bullet',
        })
    ) ?? [];

  return [heading, ...bullets];
}

function sectionHeader(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    style: 'heading-1',
  });
}

export const get: APIRoute = async ({ params }) => {
  const { type } = params;
  const jsonResume = await import(`../json-resume/${type}.json`).then(
    (mod) => mod.default
  );
  console.log(jsonResume);

  const doc = new Document({
    creator: 'Tiger Oakes',
    title: `${jsonResume.basics.name} Resume - ${resumeDateFormatter.format(
      new Date()
    )}}`,
    sections: [
      {
        properties: {},
        children: [
          ...resumeHeader(jsonResume),

          sectionHeader('Experience'),
          ...jsonResume.work.flatMap((work) =>
            experience({
              ...work,
              dateRange: work,
            })
          ),

          sectionHeader('Community'),
          ...jsonResume.projects.flatMap((project) =>
            experience({
              company: project.name,
              url: project.url,
              dateRange: project,
              highlights: project.highlights,
            })
          ),

          sectionHeader('Skills'),
          new Paragraph({
            children: joinTags(
              jsonResume.skills.map((skill) => new TextRun(skill.name))
            ),
            style: 'skills',
          }),

          sectionHeader('Education'),
          ...jsonResume.education.flatMap((education) =>
            experience({
              company: education.institution,
              position: `${education.studyType} in ${education.area}`,
              url: education.url,
              dateRange: education,
            })
          ),

          sectionHeader('Awards'),
          new Paragraph({
            children: joinTags(
              jsonResume.awards.map((award) => new TextRun(award.title)),
              ', '
            ),
            style: 'skills',
          }),
        ],
      },
    ],
  });

  // Used to export the file into a .docx file
  return new Response(await Packer.toBuffer(doc), {
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
  });
};

const RESUME_ID = /resume\/(\w+).json/;
export const getStaticPaths: GetStaticPaths = async () => {
  const resumeData = import.meta.glob('../json-resume/*.json');
  return Object.keys(resumeData).map((path) => {
    const [, type] = path.match(RESUME_ID);
    return {
      params: { type },
    };
  });
};

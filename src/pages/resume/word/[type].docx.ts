import type { ResumeSchema } from '@kurone-kito/jsonresume-types';
import { APIRoute, GetStaticPaths } from 'astro';
import {
  BorderStyle,
  convertInchesToTwip,
  Document,
  ExternalHyperlink,
  HeadingLevel,
  LevelFormat,
  Packer,
  Paragraph,
  ParagraphChild,
  Tab,
  TabStopType,
  TextRun,
} from 'docx';
import {
  DateRange,
  formatResumeDateRange,
  parseHighlight,
  resumeDateFormatter,
} from '../../../components/resume/Experience';
import { contactList } from '../../../components/resume/Header';
import { ColorOrange, StyleDateRange, styles, StyleSummary } from './_styles';
import { loadJsonResume } from '../json-resume/_load';

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

function resumeHeader({ basics }: Pick<ResumeSchema, 'basics'>) {
  return [
    // Name
    new Paragraph({
      text: basics.name,
      heading: HeadingLevel.TITLE,
      style: 'Title',
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
      style: 'Skills',
    }),
    // Summary
    new Paragraph({
      text: basics.summary,
      style: StyleSummary,
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          space: 4,
          color: ColorOrange,
        },
      },
    }),
  ];
}

function experience({
  name,
  position,
  url,
  dateRange,
  highlights,
  first,
}: {
  name?: string;
  position?: string;
  url?: string;
  dateRange?: DateRange;
  highlights?: readonly string[];
  first: boolean;
}): Paragraph[] {
  const companyText = new TextRun({
    text: name,
    font: 'Lato Semibold',
  });

  const heading = [
    new Paragraph({
      children: [
        url
          ? new ExternalHyperlink({ children: [companyText], link: url })
          : companyText,
        new TextRun({
          text: position ? `, ${position}` : '',
          font: 'Lato',
        }),
        dateRange &&
          new TextRun({
            children: [new Tab(), formatResumeDateRange(dateRange)],
            style: StyleDateRange,
          }),
      ].filter(Boolean),
      heading: HeadingLevel.HEADING_2,
      style: 'Heading2',
      tabStops: [
        {
          type: TabStopType.RIGHT,
          position: convertInchesToTwip(7.5),
        },
      ],
      spacing: first ? { before: 0 } : undefined,
    }),
  ];

  const bullets =
    highlights?.map(
      (highlight) =>
        new Paragraph({
          children: parseHighlight(highlight).map(
            ({ text, bold }) =>
              new TextRun({ text, bold, font: bold ? 'Lato Heavy' : undefined })
          ),
          bullet: { level: 0 },
          numbering: { level: 0, reference: 'SquareBullet' },
          style: 'ListBullet',
        })
    ) ?? [];

  return [...heading, ...bullets];
}

function sectionHeader(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    style: 'Heading1',
  });
}

export const get: APIRoute = async ({ params }) => {
  const { type } = params;
  const jsonResume = await loadJsonResume(type);
  const margin = convertInchesToTwip(0.5);

  const doc = new Document({
    creator: 'Tiger Oakes',
    title: `${jsonResume.basics.name} Resume - ${resumeDateFormatter.format(
      new Date()
    )}}`,
    numbering: {
      config: [
        {
          reference: 'SquareBullet',
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: '▪',
              style: {
                paragraph: {
                  indent: {
                    left: convertInchesToTwip(0.15),
                    hanging: convertInchesToTwip(0.15),
                  },
                },
              },
            },
          ],
        },
      ],
    },
    styles,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: margin,
              left: margin,
              right: margin,
              bottom: margin,
            },
          },
        },
        children: [
          ...resumeHeader(jsonResume),

          sectionHeader('Experience'),
          ...jsonResume.work.flatMap((work, i) =>
            experience({
              ...work,
              first: i === 0,
              dateRange: work,
            })
          ),

          sectionHeader('Community'),
          ...jsonResume.projects.flatMap((project, i) =>
            experience({
              ...project,
              first: i === 0,
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
          ...jsonResume.education.flatMap((education, i) =>
            experience({
              first: i === 0,
              name: education.institution,
              position: `${education.studyType} in ${education.area}`,
              url: education.url,
              dateRange: education,
            })
          ),

          sectionHeader('Awards'),
          ...jsonResume.awards.map(
            (award) =>
              new Paragraph({
                text: award.title,
                bullet: { level: 0 },
                numbering: { level: 0, reference: 'SquareBullet' },
                style: 'ListBullet',
              })
          ),
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

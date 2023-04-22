import type { ResumeSchema } from '@kurone-kito/jsonresume-types';
import { APIRoute, GetStaticPaths } from 'astro';
import docx from 'docx';
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
  tags: readonly (string | docx.ParagraphChild)[],
  separator = ' | '
): docx.ParagraphChild[] {
  return tags.flatMap((tag, index) => {
    const children: docx.ParagraphChild[] = [];
    if (typeof tag === 'string') {
      children.push(
        new docx.TextRun({
          text: tag,
          break: tag.length > 50 ? 1 : undefined,
        })
      );
    } else {
      children.push(tag);
    }

    if (index < tags.length - 1) {
      children.push(new docx.TextRun(separator));
    }
    return children;
  });
}

function resumeHeader({ basics }: Pick<ResumeSchema, 'basics'>) {
  return [
    // Name
    new docx.Paragraph({
      text: basics.name,
      heading: docx.HeadingLevel.TITLE,
      style: 'Title',
    }),
    // Contact
    new docx.Paragraph({
      children: joinTags(
        contactList(basics).map(
          ({ href, text }) =>
            new docx.ExternalHyperlink({
              children: [new docx.TextRun(text)],
              link: href,
            })
        )
      ),
      style: 'Skills',
    }),
    // Summary
    new docx.Paragraph({
      text: basics.summary,
      style: StyleSummary,
      border: {
        bottom: {
          style: docx.BorderStyle.SINGLE,
          space: 4,
          color: ColorOrange,
        },
      },
    }),
  ];
}

let lastExperienceWasEmpty = false;
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
  dateRange?: DateRange & { onlyYear?: boolean };
  highlights?: readonly string[];
  first: boolean;
}): docx.Paragraph[] {
  const companyText = new docx.TextRun({
    text: name,
    font: 'Lato Semibold',
  });

  const heading = [
    new docx.Paragraph({
      children: [
        url
          ? new docx.ExternalHyperlink({ children: [companyText], link: url })
          : companyText,
        new docx.TextRun({
          text: position ? `, ${position}` : '',
          font: 'Lato',
        }),
        dateRange &&
          new docx.TextRun({
            children: [new docx.Tab(), formatResumeDateRange(dateRange)],
            style: StyleDateRange,
          }),
      ].filter(Boolean),
      heading: docx.HeadingLevel.HEADING_2,
      style: 'Heading2',
      tabStops: [
        {
          type: docx.TabStopType.RIGHT,
          position: docx.convertInchesToTwip(7.5),
        },
      ],
      spacing: first || lastExperienceWasEmpty ? { before: 0 } : undefined,
    }),
  ];

  const bullets =
    highlights?.map(
      (highlight) =>
        new docx.Paragraph({
          children: parseHighlight(highlight).map(
            ({ text, bold }) =>
              new docx.TextRun({
                text,
                bold,
                font: bold ? 'Lato Heavy' : undefined,
              })
          ),
          bullet: { level: 0 },
          numbering: { level: 0, reference: 'SquareBullet' },
          style: 'ListBullet',
        })
    ) ?? [];

  lastExperienceWasEmpty = bullets.length === 0;
  return [...heading, ...bullets];
}

function sectionHeader(text: string): docx.Paragraph {
  return new docx.Paragraph({
    text,
    heading: docx.HeadingLevel.HEADING_1,
    style: 'Heading1',
  });
}

export const get: APIRoute = async ({ params }) => {
  const { type } = params;
  const jsonResume = await loadJsonResume(type);
  const margin = docx.convertInchesToTwip(0.4);

  const doc = new docx.Document({
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
              format: docx.LevelFormat.BULLET,
              text: '▪',
              style: {
                paragraph: {
                  indent: {
                    left: docx.convertInchesToTwip(0.15),
                    hanging: docx.convertInchesToTwip(0.15),
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
              dateRange: project.startDate
                ? {
                    startDate: project.startDate,
                    endDate: project.endDate,
                    onlyYear: true,
                  }
                : undefined,
            })
          ),

          sectionHeader('Technical Proficiencies'),
          new docx.Paragraph({
            children: joinTags(jsonResume.skills.map((skill) => skill.name)),
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
          new docx.Paragraph({
            children: joinTags(
              jsonResume.awards.map((award) => award.title),
              ', '
            ),
            style: 'skills',
          }),
        ],
      },
    ],
  });

  // Used to export the file into a .docx file
  return new Response(await docx.Packer.toBuffer(doc), {
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

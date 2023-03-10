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
      style: 'Summary',
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          space: 4,
          color: 'E67237',
        },
      },
    }),
  ];
}

function experience({
  company,
  position,
  url,
  dateRange,
  highlights,
  first,
}: {
  company: string;
  position?: string;
  url?: string;
  dateRange?: DateRange;
  highlights?: readonly string[];
  first: boolean;
}): Paragraph[] {
  const companyText = new TextRun({
    text: company,
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
            style: 'DateRange',
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
  const jsonResume = await import(`../json-resume/${type}.json`).then(
    (mod) => mod.default
  );
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
    styles: {
      default: {
        document: {
          run: {
            font: 'Lato',
            size: 10 * 2,
          },
        },
        title: {
          run: {
            font: 'Lato Semibold',
            size: 20 * 2,
            allCaps: true,
          },
        },
        heading1: {
          run: {
            font: 'Lato',
            bold: true,
            size: 12 * 2,
          },
          paragraph: {
            spacing: {
              before: 8 * 20,
              after: 3 * 20,
            },
          },
        },
        heading2: {
          run: {
            font: 'Lato',
            size: 11 * 2,
          },
          paragraph: {
            spacing: {
              before: 6 * 20,
              after: 2 * 20,
            },
          },
        },
        listParagraph: {
          basedOn: 'Normal',
          paragraph: {
            indent: {
              left: 0,
              hanging: convertInchesToTwip(0.15),
            },
            spacing: {
              after: 2 * 20,
            },
          },
        },
      },
      paragraphStyles: [
        {
          id: 'Summary',
          name: 'Summary',
          run: {
            size: 11 * 2,
            italics: true,
            color: '191919',
          },
          paragraph: {
            spacing: {
              before: 4 * 20,
              after: 6 * 20,
            },
          },
        },
      ],
      characterStyles: [
        {
          id: 'DateRange',
          name: 'Date Range',
          run: {
            size: 9 * 2,
            color: 'E67237',
          },
        },
      ],
    },
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
              first: i === 0,
              company: project.name,
              url: project.url,
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
          ...jsonResume.education.flatMap((education, i) =>
            experience({
              first: i === 0,
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

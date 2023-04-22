import docx from 'docx';

export const StyleSummary = 'Summary';
export const StyleDateRange = 'DateRange';
export const ColorOrange = 'E67237';

export const styles: docx.IStylesOptions = {
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
        size: 22 * 2,
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
          hanging: docx.convertInchesToTwip(0.15),
        },
        spacing: {
          after: 2 * 20,
        },
      },
    },
  },
  paragraphStyles: [
    {
      id: StyleSummary,
      name: 'Summary',
      run: {
        size: 10 * 2,
        italics: true,
        color: '191919',
      },
      paragraph: {
        spacing: {
          before: 6 * 20,
          after: 6 * 20,
        },
      },
    },
  ],
  characterStyles: [
    {
      id: StyleDateRange,
      name: 'Date Range',
      run: {
        size: 9 * 2,
        color: ColorOrange,
      },
    },
  ],
};

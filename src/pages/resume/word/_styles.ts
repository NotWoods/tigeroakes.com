import * as docx from 'docx';

export const StyleSummary = 'Summary';
export const StyleDateRange = 'DateRange';
export const ColorOrange = 'E67237';

export const styles: docx.IStylesOptions = {
  default: {
    document: {
      run: {
        font: 'Calibri',
        size: 11 * 2,
      },
    },
    title: {
      run: {
        font: 'Aptos Serif',
        bold: true,
        size: 14 * 2,
      },
    },
    heading1: {
      run: {
        font: 'Aptos Serif',
        bold: true,
        size: 12 * 2,
      },
      paragraph: {
        spacing: {
          before: 6 * 20,
          after: 4 * 20,
        },
      },
    },
    heading2: {
      run: {
        font: 'Calibri',
        size: 12 * 2,
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
      },
    },
  },
  paragraphStyles: [
    {
      id: StyleSummary,
      name: 'Summary',
      run: {
        size: 11 * 2,
        italics: true,
        color: '191919',
      },
      paragraph: {
        spacing: {
          before: 4 * 20,
        },
      },
    },
  ],
  characterStyles: [
    {
      id: StyleDateRange,
      name: 'Date Range',
      run: {
        size: 11 * 2,
        bold: true,
      },
    },
  ],
};

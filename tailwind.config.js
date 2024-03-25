// @ts-check

import colors from 'tailwindcss/colors';
import themeColors from './src/data/colors.js';

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{astro,html,js,jsx,svelte,ts,tsx,mdx}'],
  theme: {
    colors: {
      ...themeColors,
      transparent: 'transparent',
      current: 'currentColor',
      accent: 'var(--accent)',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      zinc: colors.zinc,
    },
    fontFamily: {
      sans: ['Lato', 'Trebuchet MS', 'sans-serif'],
      mono: [
        `'Cascadia Mono'`,
        `ui-monospace`,
        `'Cascadia Code'`,
        `'Source Code Pro'`,
        `Menlo`,
        `Consolas`,
        `'DejaVu Sans Mono'`,
        `monospace`,
      ],
    },
    extend: {
      maxWidth: {
        site: '52rem',
      },
      minWidth: {
        44: '11rem',
      },
      listStyleType: {
        square: 'square',
      },
      // @ts-ignore
      typography({ theme }) {
        return {
          DEFAULT: {
            css: {
              maxWidth: 'none',
              a: {
                textDecoration: `underline ${theme('colors.orange[500]')}`,
                textDecorationThickness: '2px',
                fontWeight: 'inherit',
              },
              code: {
                fontSize: '0.9em',
                overflowWrap: 'anywhere',
                padding: '0.1em 0.3em',
                backgroundColor: 'var(--tw-prose-code-bg)',
                borderRadius: '0',
              },
              blockquote: {
                fontWeight: 'inherit',
              },
              h1: { fontWeight: '600' },
              h2: { fontWeight: '600' },
              h3: { fontWeight: '600' },
              h4: { fontWeight: '600' },
              h5: { fontWeight: '600' },
              h6: { fontWeight: '600' },
              'code::before': {
                content: 'none',
              },
              'code::after': {
                content: 'none',
              },
              img: {
                marginLeft: 'auto',
                marginRight: 'auto',
              },
              video: {
                marginLeft: 'auto',
                marginRight: 'auto',
              },
            },
          },
          lg: {
            css: {
              a: {
                textDecoration: `underline ${theme('colors.orange[500]')}`,
                textDecorationThickness: '2px',
                fontWeight: 'inherit',
              },
              code: {
                fontSize: '0.9em',
              },
              pre: {
                marginLeft: theme('-spacing.4'),
                marginRight: theme('-spacing.4'),
                borderRadius: '0',
              },
            },
          },
          gray: {
            css: {
              '--tw-prose-body': theme('colors.slate[800]'),
              '--tw-prose-headings': theme('colors.slate[800]'),
              '--tw-prose-lead': theme('colors.gray[600]'),
              '--tw-prose-links': theme('colors.current'),
              '--tw-prose-bold': theme('colors.current'),
              '--tw-prose-counters': theme('colors.current'),
              '--tw-prose-bullets': theme('colors.current'),
              '--tw-prose-hr': theme('colors.gray[400]'),
              '--tw-prose-quotes': theme('colors.gray[600]'),
              '--tw-prose-quote-borders': theme('colors.gray[300]'),
              '--tw-prose-captions': theme('colors.gray[500]'),
              '--tw-prose-code': theme('colors.current'),
              '--tw-prose-code-bg': theme('colors.gray[300]'),
              '--tw-prose-pre-code': theme('colors.gray[200]'),
              '--tw-prose-pre-bg': theme('colors.slate[800]'),
              '--tw-prose-th-borders': theme('colors.gray[300]'),
              '--tw-prose-td-borders': theme('colors.gray[200]'),
              '--tw-prose-invert-body': theme('colors.slate[200]'),
              '--tw-prose-invert-headings': theme('colors.white'),
              '--tw-prose-invert-lead': theme('colors.gray[400]'),
              '--tw-prose-invert-links': theme('colors.current'),
              '--tw-prose-invert-bold': theme('colors.current'),
              '--tw-prose-invert-counters': theme('colors.current'),
              '--tw-prose-invert-bullets': theme('colors.current'),
              '--tw-prose-invert-hr': theme('colors.gray[600]'),
              '--tw-prose-invert-quotes': theme('colors.gray[300]'),
              '--tw-prose-invert-quote-borders': theme('colors.gray[700]'),
              '--tw-prose-invert-captions': theme('colors.gray[400]'),
              '--tw-prose-invert-code': theme('colors.current'),
              '--tw-prose-invert-code-bg': theme('colors.zinc[700]'),
              '--tw-prose-invert-pre-code': theme('colors.gray[300]'),
              '--tw-prose-invert-pre-bg': theme('colors.slate[800]'),
              '--tw-prose-invert-th-borders': theme('colors.gray[600]'),
              '--tw-prose-invert-td-borders': theme('colors.gray[700]'),
            },
          },
          invert: {
            css: {
              '--tw-prose-code-bg': 'var(--tw-prose-invert-code-bg)',
            },
          },
        };
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
  ],
};

module.exports = config;

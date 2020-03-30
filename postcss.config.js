// @ts-check
const postcssPresetEnv = require('postcss-preset-env');
const cssNano = require('cssnano');

/** @type {import('postcss').AcceptedPlugin[]} */
const plugins = [
  postcssPresetEnv({
    stage: false,
    features: {
      'custom-media-queries': true,
      'hexadecimal-alpha-notation': true,
      'gap-properties': true,
      'matches-pseudo-class': true,
      'nesting-rules': true,
      'place-properties': true,
    },
    autoprefixer: {
      add: false,
    },
  }),
  cssNano({
    preset: [
      'default',
      {
        discardUnused: true,
        mergeIdents: true,
        reduceIdents: true,
        svgo: false,
        zindex: false,
      },
    ],
  }),
];

module.exports = {
  plugins,
};

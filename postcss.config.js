// @ts-check
const postcssColorHexAlpha = require('postcss-color-hex-alpha');
const postcssCustomMedia = require('postcss-custom-media');
const postcssGapProperties = require('postcss-gap-properties');
const postcssPlace = require('postcss-place');
const postcssSelectorMatches = require('postcss-selector-matches');
const cssNano = require('cssnano');

/** @type {import('postcss').AcceptedPlugin[]} */
const plugins = [
  postcssColorHexAlpha({ preserve: false }),
  postcssCustomMedia({ preserve: false }),
  postcssGapProperties({ preserve: true }),
  postcssPlace({ preserve: false }),
  postcssSelectorMatches(),
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

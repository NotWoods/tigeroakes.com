// @ts-check
const postcssColorFunctionalNotation = require('postcss-color-functional-notation');
const postcssColorHexAlpha = require('postcss-color-hex-alpha');
const postcssCustomMedia = require('postcss-custom-media');
const postcssGapProperties = require('postcss-gap-properties');
const postcssInset = require('postcss-inset');
const postcssPlace = require('postcss-place');
const postcssSelectorMatches = require('postcss-selector-matches');
const cssNano = require('cssnano');

/** @type {import('postcss').AcceptedPlugin[]} */
const plugins = [
  postcssColorFunctionalNotation({ preserve: false }),
  postcssColorHexAlpha({ preserve: false }),
  postcssCustomMedia({ preserve: false }),
  postcssGapProperties({ preserve: true }),
  postcssInset({ preserve: false }),
  postcssPlace({ preserve: false }),
  postcssSelectorMatches(),
  process.env.HUGO_ENVIRONMENT === 'production'
    ? cssNano({
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
      })
    : undefined,
];

module.exports = {
  plugins: plugins.filter(plugin => plugin != undefined),
};

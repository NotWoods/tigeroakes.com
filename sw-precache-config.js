// @ts-check
/** @type {import('sw-precache').Options} */
const config = {
  staticFileGlobs: [
    "profile_*_160x*.jpg",
    "hero.jpg",
    "**/*.css",
    "**/*.html",
    "**/*.svg",
    "contact/background*.jpg",
    "projects/*/logo_*_128x*.png"
  ]
};

module.exports = config;

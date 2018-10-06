// @ts-check
/** @type {import('sw-precache').Options} */
const config = {
  staticFileGlobs: [
    "public/profile_*_160x*.jpg",
    "public/hero.jpg",
    "public/**/*.css",
    "public/**/*.html",
    "public/**/*.svg",
    "public/contact/background*.jpg",
    "public/projects/*/logo_*_128x*.png",
    "public/projects/*/background*.jpg"
  ]
};

module.exports = config;

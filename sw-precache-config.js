// @ts-check
/** @type {import('sw-precache').Options} */
const config = {
  staticFileGlobs: [
    "public/profile_*_160x*.jpg",
    "public/hero.jpg",
    "public/**/*.css",
    "public/**/*.html",
    "public/**/*.svg",
    "public/projects/*/*.jpg",
    "public/projects/*/*.png",
  ]
};

module.exports = config;

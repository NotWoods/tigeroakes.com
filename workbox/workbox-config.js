// @ts-check

// workbox generateSW workbox/workbox-config.js

/** @type {import('workbox-build').GetManifestConfig} */
const config = {
  globDirectory: 'public/',
  globPatterns: [
    '**/*.css',
    // Home page
    'index.html',
    'hero.jpg',
    'profile_*_{80,160}x0_*.jpg',
    'contact/**/*.{jpg,svg}',
    // Featured projects
    'projects/{mozilla-firefox,google,yelp}/**/*.{html,jpg,svg,png}',
    // Projects page
    'projects/index.html',
    'projects/*/logo.svg',
    'projects/*/logo_*_128x0_*.png',
    // Blog & Talks
    '{posts,talks}/index.html',
    '{posts,talks}/tags/**/*.html',
    // Resume
    'resume/index.html'
  ],
  // Hugo already includes a hash on processed images
  dontCacheBustURLsMatching: /[a-z]+_[a-z0-9]+_\d+_\d+x\d_[a-z]+_[a-z0-9]+_[a-z0-9]+\.(?:png|jpg)$/,
};

export default config;

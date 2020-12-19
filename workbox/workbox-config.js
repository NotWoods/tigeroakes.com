// @ts-check

// workbox generateSW workbox/workbox-config.js

/** @type {import('workbox-build').GetManifestConfig} */
const config = {
  globDirectory: 'public/',
  globPatterns: [
    'css/**/*.css',
    'js/**/*.js',
    'offline.html',
    // Home page
    'index.html',
    'profile_*_{80,160}x0_*.jpg',
    'contact/**/*.{jpg,svg}',
    // Featured projects
    'projects/{mozilla-firefox,google,yelp,big-island-buses}/**/*.{html,jpg,svg,png}',
    'posts/{react-to-compose-dictionary, maskable-icons}/**/*.{html,jpg,svg,png,gif}',
    // Projects page
    'projects/index.html',
    'projects/*/logo.svg',
    'projects/*/logo_*_128x0_*.png',
    // Blog & Talks
    '{posts,talks,featured-in}/index.html',
    'tags/**/*.html',
    'posts/*/banner.{png,jpg,svg}',
    'talks/*/slide.{png,jpg,svg}',
    // Resume
    'resume/index.html',
    // Fonts
    'font/**/*.woff2'
  ],
  // Hugo already includes a hash on processed images: img_hash_hash_WxH_resize_quality_box.jpg
  // Hugo also has a hash on CSS and JS: file.hash.css
  dontCacheBustURLsMatching: /[a-z]+(?:_[a-z0-9]+_\d+_\d+x\d_[a-z]+_[a-z0-9]+_[a-z0-9]+\.(?:png|jpg)|\.[a-f0-9]+\.(?:css|js))$/,
};

export default config;

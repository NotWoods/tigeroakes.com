// @ts-check

/** @type {import('sw-precache').Handler} */
const handler = 'fastest'

/** @type {import('sw-precache').Options} */
const config = {
    cacheId: 'tigeroakes',
    staticFileGlobs: [
        'public/profile_*_160x*.jpg',
        'public/index.html',
        'public/@(contact|resume)/index.html',
        'public/@(featured-in|posts|projects)/index.html',
        'public/@(featured-in|posts|projects)/*/*.html',
        'public/**/*.css',
        'public/contact/*.svg',
        'public/projects/*/logo.svg',
        'public/projects/*/logo_*_128x*.png',
        'public/js/service-worker-registration.min.js'
    ],
    runtimeCaching: [
        /\/(projects|posts)\/\*\/\*.(jpg|png)/,
        '/hero.jpg',
        '/contact/background.jpg',
        '/featured-in/index.html'
    ].map(urlPattern => ({ urlPattern, handler }))
};

module.exports = config;

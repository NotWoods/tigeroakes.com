import rss from '@astrojs/rss';

export const get = () =>
  rss({
    title: 'Tiger Oakes',
    description: `Tiger Oakes' blog where I learn out loud. I write about web and Android development, with plenty of PWA and icon talk.`,
    site: import.meta.env.SITE,
    items: import.meta.glob('./*/*.md'),
  });

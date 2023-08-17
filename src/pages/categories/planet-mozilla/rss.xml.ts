import rss from '@astrojs/rss';
import { APIRoute } from 'astro';
import { formatPost, rssConfig } from '../../../scripts/rss';
import { getCollection } from 'astro:content';

const postsData = getCollection('posts');

export const get: APIRoute = async () => {
  const posts = await postsData;
  return rss({
    ...rssConfig,
    title: 'Planet Mozilla | Tiger Oakes',
    // list of `<item>`s in output xml
    // simple example: generate items for every md file in /src/pages
    // see "Generating items" section for required frontmatter and advanced use cases
    items: posts
      .filter((post) => post.data.categories?.includes('Planet Mozilla'))
      .map(formatPost),
  });
};

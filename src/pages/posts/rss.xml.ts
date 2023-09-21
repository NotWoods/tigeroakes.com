import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { formatPost, rssConfig } from '../../scripts/rss';
import { getCollection } from 'astro:content';
import { comparePosts } from '../../scripts/posts';

export const get: APIRoute = async () => {
  const posts = await getCollection('posts');
  posts.sort(comparePosts);
  return rss({
    ...rssConfig,
    // list of `<item>`s in output xml
    // simple example: generate items for every md file in /src/pages
    // see "Generating items" section for required frontmatter and advanced use cases
    items: posts.map(formatPost),
  });
};

import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { formatPost, rssConfig } from '../../scripts/rss';
import { getAllPosts } from '../../scripts/posts';

export const GET: APIRoute = async () => {
  const posts = await getAllPosts();
  return rss({
    ...rssConfig,
    // list of `<item>`s in output xml
    // simple example: generate items for every md file in /src/pages
    // see "Generating items" section for required frontmatter and advanced use cases
    items: posts.map(formatPost),
  });
};

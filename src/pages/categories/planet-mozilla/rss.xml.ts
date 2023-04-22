import rss from '@astrojs/rss';
import { APIRoute } from 'astro';
import { loadPosts } from '../../../scripts/posts';
import { formatPost, rssConfig } from '../../../scripts/rss';

const postsData = import.meta.glob('../../posts/*/*.{md,mdx}', { eager: true });

export const get: APIRoute = async () => {
  const posts = await loadPosts(Object.values(postsData) as any);
  return rss({
    ...rssConfig,
    title: 'Planet Mozilla | Tiger Oakes',
    // list of `<item>`s in output xml
    // simple example: generate items for every md file in /src/pages
    // see "Generating items" section for required frontmatter and advanced use cases
    items: posts
      .filter((post) => post.frontmatter.categories?.includes('Planet Mozilla'))
      .map(formatPost),
  });
};

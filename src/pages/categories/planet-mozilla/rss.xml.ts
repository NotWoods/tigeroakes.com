import rss from '@astrojs/rss';
import { APIRoute } from 'astro';
import { loadPosts } from '../../../scripts/posts';

const postsData = import.meta.glob('../../posts/*/*.{md,mdx}', { eager: true });

export const get: APIRoute = async () => {
  const posts = await loadPosts(Object.values(postsData) as any);
  return rss({
    title: 'Planet Mozilla | Tiger Oakes',
    description: `Tiger Oakes' blog where I learn out loud. I write about web and Android development, with plenty of PWA and icon talk.`,
    site: 'https://tigeroakes.com',
    stylesheet: '/posts/pretty-feed-v3.xsl',
    customData:
      `<author><name>Tiger Oakes</name><email>contact@tigeroakes.com</email></author>` +
      `<webfeeds:cover image="https://tigeroakes.com/banner.png"/>` +
      `<webfeeds:icon>https://tigeroakes.com/favicon.svg</webfeeds:icon>` +
      `<webfeeds:logo>https://tigeroakes.com/logo_text.svg</webfeeds:logo>` +
      `<webfeeds:accentColor>e67237</webfeeds:accentColor>` +
      `<language>en-ca</language>`,
    // list of `<item>`s in output xml
    // simple example: generate items for every md file in /src/pages
    // see "Generating items" section for required frontmatter and advanced use cases
    items: posts
      .filter((post) => post.frontmatter.categories?.includes('Planet Mozilla'))
      .map((post) => {
        const date = post.date.toZonedDateTime({
          timeZone: 'America/Vancouver',
        });
        return {
          link: post.url,
          title: post.frontmatter.title,
          description: post.frontmatter.description,
          pubDate: new Date(date.epochMilliseconds),
          customData: post.frontmatter.tags
            .map((tag) => `<category>${tag}</category>`)
            .join(''),
        };
      }),
  });
};

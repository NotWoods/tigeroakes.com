import { RSSOptions } from '@astrojs/rss';
import type { Post } from './posts';

export const rssConfig = {
  title: 'Tiger Oakes',
  description: `Tiger Oakes' blog where I learn out loud. I write about web and Android development, with plenty of PWA and icon talk.`,
  site: 'https://tigeroakes.com',
  stylesheet: '/posts/pretty-feed-v3.xsl',
  xmlns: {
    webfeeds: 'http://webfeeds.org/rss/1.0',
    media: 'http://search.yahoo.com/mrss/',
  },
  customData:
    `<author><name>Tiger Oakes</name><email>contact@tigeroakes.com</email></author>` +
    `<webfeeds:cover image="https://tigeroakes.com/banner.png"/>` +
    `<webfeeds:icon>https://tigeroakes.com/favicon.svg</webfeeds:icon>` +
    `<webfeeds:logo>https://tigeroakes.com/logo_text.svg</webfeeds:logo>` +
    `<webfeeds:accentColor>e67237</webfeeds:accentColor>` +
    `<language>en-ca</language>`,
};

type Item<Array> = Array extends ReadonlyArray<infer T> ? T : never;

export function formatPost(post: Post): Item<RSSOptions['items']> {
  const date = post.date.toZonedDateTime({ timeZone: 'America/Vancouver' });
  const tags = post.frontmatter.tags
    .map((tag) => `<category>${tag}</category>`)
    .join('');

  return {
    link: post.url,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    pubDate: new Date(date.epochMilliseconds),
    customData: tags + (post.banner ? mediaContentTag(post.banner) : ''),
  };
}

function formatToMimeType(format: InputFormat) {
  switch (format) {
    case 'png':
      return 'image/png';
    case 'svg':
      return 'image/svg+xml';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    default:
      throw new Error(`Unknown format: ${format}`);
  }
}

function mediaContentTag(banner: ImageMetadata) {
  return `<media:content
    url="https://tigeroakes.com${banner.src}"
    medium="image"
    type="${formatToMimeType(banner.format)}"
    width="${banner.width}"
    height="${banner.height}" />`;
}

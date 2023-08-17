import { RSSOptions } from '@astrojs/rss';
import { CollectionEntry } from 'astro:content';
import { formatToMimeType } from '../components/Picture.astro';

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

export function formatPost(
  post: CollectionEntry<'posts'>
): Item<RSSOptions['items']> {
  let customData = post.data.tags
    .map((tag) => `<category>${tag}</category>`)
    .join('');

  if (post.data.banner) {
    customData += mediaContentTag(post.data.banner);
  }

  return {
    link: `/posts/${post.slug}/`,
    title: post.data.title,
    description: post.data.description,
    pubDate: post.data.date,
    customData,
  };
}

function mediaContentTag(banner: ImageMetadata) {
  return `<media:content
    url="https://tigeroakes.com${banner.src}"
    medium="image"
    type="${formatToMimeType(banner.format)}"
    width="${banner.width}"
    height="${banner.height}" />`;
}

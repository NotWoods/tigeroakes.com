import type { RSSFeedItem } from '@astrojs/rss';
import { experimental_AstroContainer } from 'astro/container';
import type { CollectionEntry } from 'astro:content';
import { formatToMimeType } from './picture';
import { getContainerRenderer as preactContainerRenderer } from '@astrojs/preact';
import { loadRenderers } from 'astro:container';

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

const container = await experimental_AstroContainer.create({
  renderers: await loadRenderers([preactContainerRenderer()]),
});

export async function formatPost(
  post: CollectionEntry<'posts'>
): Promise<RSSFeedItem> {
  let customData = post.data.tags
    .map((tag) => `<category>${tag}</category>`)
    .join('');

  if (post.data.banner) {
    customData += mediaContentTag(post.data.banner);
  }

  const { Content } = await post.render();
  const content = await container.renderToString(Content);

  return {
    link: `/posts/${post.slug}/`,
    title: post.data.title,
    description: post.data.description,
    pubDate: post.data.date,
    customData,
    content,
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

import { Temporal } from '@js-temporal/polyfill';
import type { MarkdownInstance } from 'astro';
import { dirname, join } from 'path';
import tagColors from '../data/tags.json';
import { dateFromString } from './date';
import { trailingSlash } from './path';

export interface PostFrontmatter {
  title: string;
  description: string;
  draft?: boolean;
  tags: readonly string[];
  categories: readonly string[];
  date: string;
  elsewhere?: {
    name: string;
    source: string;
    link: string;
  };
  banner?: string;
  banner_alt?: string;
}

export interface Post extends Omit<MarkdownInstance<PostFrontmatter>, 'rawContent' | 'compiledContent'> {
  date: Temporal.PlainDate;
}

export async function loadPosts(
  input: Promise<readonly Omit<MarkdownInstance<PostFrontmatter>, 'rawContent' | 'compiledContent'>[]>
) {
  const allPosts = await input;
  const formattedPosts = allPosts
    .filter((post) => !post.frontmatter.draft)
    .map((post) => {
      const formattedPost: Post = {
        ...post,
        url: trailingSlash(post.url),
        date: post.frontmatter.date
          ? dateFromString(post.frontmatter.date)
          : undefined,
      };
      return formattedPost;
    });
  formattedPosts.sort((a, b) => {
    if (a.date && b.date) {
      return Temporal.PlainDate.compare(a.date, b.date) * -1;
    } else if (a.date) {
      return -1;
    } else if (b.date) {
      return 1;
    } else {
      return 0;
    }
  });
  return formattedPosts;
}

export function postAccentColor(tags: readonly string[] = []) {
  for (const tag of tags) {
    const color = tagColors[tag];
    if (color) {
      return color;
    }
  }
  return undefined;
}

export function accentStyles(accent: string | undefined) {
  if (accent) {
    return `--accent: ${accent};`;
  } else {
    return undefined;
  }
}

export function postBanner(post: {
  file: string;
  frontmatter: { banner?: string };
}) {
  return post.frontmatter.banner
    ? join(dirname(post.file), post.frontmatter.banner)
    : undefined;
}

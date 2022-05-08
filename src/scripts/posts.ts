import { Temporal } from '@js-temporal/polyfill';
import tagColors from '../data/tags.json';
import type { MarkdownInstance } from 'astro';
import { dateFromString } from './date';

export interface PostFrontmatter {
  title: string;
  description: string;
  tags: readonly string[];
  categories: readonly string[];
  date: string;
  elsewhere?: {
    name: string;
    source: string;
    link: string;
  };
  banner?: string;
}

export interface Post extends MarkdownInstance<PostFrontmatter> {
  date: Temporal.PlainDate;
}

export async function loadPosts(
  input: Promise<MarkdownInstance<PostFrontmatter>[]>
) {
  const allPosts = await input;
  const formattedPosts = allPosts.map((post) => {
    const formattedPost: Post = {
      ...post,
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

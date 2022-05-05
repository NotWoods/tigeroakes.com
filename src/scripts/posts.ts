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
    if (!post.frontmatter.date) {
      console.warn('No date found for post', post.url);
    }
    const formattedPost: Post = {
      ...post,
      date: dateFromString(post.frontmatter.date),
    };
    return formattedPost;
  });
  formattedPosts.sort(
    (a, b) => Temporal.PlainDate.compare(a.date, b.date) * -1
  );
  return formattedPosts;
}

export function postAccentColor(tags: readonly string[] = []) {
  for (const tag of tags) {
    const color = tagColors[tag];
    if (color) {
      return `--accent: ${color};`;
    }
  }
  return undefined;
}

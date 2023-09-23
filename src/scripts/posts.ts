import { getCollection } from 'astro:content';
import tagColors from '../data/tags.json';

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

export function comparePosts(
  a: { data: { date: Date } },
  b: { data: { date: Date } }
) {
  return b.data.date.valueOf() - a.data.date.valueOf();
}

export async function getAllPosts() {
  const allPosts = await getCollection('posts');
  return allPosts.filter((post) => !post.data.draft).sort(comparePosts);
}

import type { MarkdownInstance } from 'astro';
import { loadPosts, postAccentColor, postBanner, PostFrontmatter } from './posts';
import { loadProjects, ProjectFrontmatter } from './projects';

function asArray<T>(x: T | readonly T[]): readonly T[] {
  return Array.isArray(x) ? x : [x];
}

/**
 * Group a list of items by a given key.
 * @param items Items to group
 * @param getKey Function that returns the key or keys associated with a given item.
 */
export function groupBy<Item, Key>(
  items: readonly Item[],
  getKey: (item: Item) => Key | readonly Key[]
): ReadonlyMap<Key, readonly Item[]> {
  const groupedItems = new Map<Key, Item[]>();
  for (const item of items) {
    const keys = asArray(getKey(item));
    for (const key of keys) {
      const posts = groupedItems.get(key) ?? [];
      posts.push(item);
      groupedItems.set(key, posts);
    }
  }
  return groupedItems;
}

export async function getCollectionPages(
  postInput: Promise<MarkdownInstance<PostFrontmatter>[]>,
  projectInput: Promise<MarkdownInstance<ProjectFrontmatter>[]>
) {
  const [allPages, allProjects] = await Promise.all([
    loadPosts(postInput),
    loadProjects(projectInput),
  ]);

  const formattedPages = allPages.map((post) => ({
    title: post.frontmatter.title,
    date: post.date,
    accent: postAccentColor(post.frontmatter.tags),
    href: post.url,
    pictureSrc: postBanner(post),
    pictureFit: 'cover',
    tags: post.frontmatter.tags,
  }));
  const formattedProjects = allProjects.map((project) => ({
    title: project.frontmatter.title,
    accent: project.frontmatter.color,
    href: project.url,
    pictureSrc: undefined,
    pictureFit: 'contain',
    tags: project.frontmatter.tech,
  }));

  const tagToPages = groupBy(
    [...formattedPages, ...formattedProjects],
    (page) => page.tags ?? []
  );
  return tagToPages;
}

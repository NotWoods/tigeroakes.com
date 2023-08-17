import { getCollection } from 'astro:content';
import GithubSlugger from 'github-slugger';
import { Item } from '../components/lists/ListFlat.astro';
import { postAccentColor } from './posts';

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

export async function getCollectedPages(key: 'tags' | 'categories') {
  const [posts, talks, projects] = await Promise.all([
    getCollection('posts'),
    getCollection('talks'),
    getCollection('projects'),
  ]);

  const formattedPages = [...posts, ...talks].map(
    (
      page
    ): Item & { tags: readonly string[]; categories: readonly string[] } => ({
      title: page.data.title,
      date: page.data.date,
      accent: postAccentColor(page.data.tags),
      href: `/${page.collection}/${page.slug}/`,
      pictureSrc: page.data.banner,
      pictureAlt: page.data.banner_alt,
      pictureFit: 'cover' as const,
      tags: page.data.tags,
      categories: page.data.categories,
      collection: page.collection,
    })
  );
  const formattedProjects = projects.map(
    (
      project
    ): Item & { tags: readonly string[]; categories: readonly string[] } => ({
      title: project.data.title,
      accent: project.data.color,
      href: `/projects/${project.slug}/`,
      pictureSrc: undefined,
      pictureFit: 'contain' as const,
      tags: project.data.tech,
      categories: project.data.categories,
      collection: 'projects',
    })
  );

  const tagToPages = groupBy(
    [...formattedPages, ...formattedProjects],
    (page) => page[key] ?? []
  );

  const slugger = new GithubSlugger();
  const tagPaths = new Map(
    Array.from(tagToPages.keys()).map((tag) => [tag, slugger.slug(tag)])
  );

  return { tagToPages, tagPaths };
}

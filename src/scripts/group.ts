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

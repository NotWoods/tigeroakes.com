import type { CollectionEntry, DataEntryMap } from 'astro:content';

export interface TalkBacklink {
  conference: keyof DataEntryMap['conferences'];
  name: string;
}

export function getConferenceName(
  conf: CollectionEntry<'conferences'>
): string {
  let name = conf.data.name;
  switch (conf.data.type) {
    case 'conference':
    case 'workshop':
      name += ` ${conf.data.date.toLocaleString('en-US', { year: 'numeric' })}`;
      break;
    case 'meetup':
      name += ` ${conf.data.date.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`;
      break;
  }
  return name;
}

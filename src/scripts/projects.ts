import { z } from 'astro:content';
import type { ButtonProps } from '../components/Buttons.astro';

export const linkButtonSchema = z.object({
  title: z.string(),
  link: z.string().url().or(z.string().startsWith('/')).optional(),
  github: z.string().includes('/').optional(),
});

export type Link = z.infer<typeof linkButtonSchema>;

export function projectButtons(
  links: readonly Link[],
  pageUrl: string | URL
): ButtonProps[];
export function projectButtons(
  links: readonly Link[] | undefined,
  pageUrl: string | URL
): ButtonProps[] | undefined;
export function projectButtons(
  links: readonly Link[] | undefined,
  pageUrl: string | URL
): ButtonProps[] | undefined {
  return links?.map((link) => ({
    title: link.title,
    href: buttonLink(link, pageUrl),
  }));
}

function buttonLink(link: Link, pageUrl: string | URL) {
  switch (link.title) {
    case 'Details':
    case 'Case study':
      return pageUrl;
    default:
      if (link.github) {
        return `https://github.com/${link.github}`;
      }
  }
  return link.link!;
}

export function compareProjects(
  a: { data: { weight: number } },
  b: { data: { weight: number } }
) {
  return a.data.weight - b.data.weight;
}

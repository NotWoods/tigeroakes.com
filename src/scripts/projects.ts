import Image from '@11ty/eleventy-img';
import type { MarkdownInstance } from 'astro';
import { imageOptions } from '../components/eleventy-img/options';
import { trailingSlash } from './path';

export interface Link {
  title: string;
  github?: string;
  link?: string;
}

export interface ProjectFrontmatter {
  title: string;
  subtitle: string;
  weight?: number;
  description?: string;
  color: string;
  fallbackcolor: string;
  logo?: string;
  links: readonly Link[];
  tech: readonly string[];
  categories: readonly string[];
}

export type Project = MarkdownInstance<ProjectFrontmatter>;

export const PROJECT_PATH = /^\/projects\/([-\w]+)/;

export async function loadProjects(
  input: Promise<MarkdownInstance<ProjectFrontmatter>[]>
) {
  const allProjects = await input;
  const formattedProjects = allProjects.map((project) => ({
    ...project,
    url: trailingSlash(project.url),
  }));
  formattedProjects.sort((a, b) => {
    const aWeight = a.frontmatter.weight || Infinity;
    const bWeight = b.frontmatter.weight || Infinity;
    return aWeight - bWeight;
  });
  return formattedProjects;
}

export function projectButtons(
  links: readonly Link[] | undefined,
  pageUrl: string | URL
) {
  return links?.map((link) => ({
    title: link.title,
    href: buttonLink(link, pageUrl),
  }));
}

function buttonLink(link: Link, pageUrl: string | URL) {
  switch (link.title) {
    case 'Details':
    case 'Case study':
      return trailingSlash(pageUrl);
    default:
      if (link.github) {
        return `https://github.com/${link.github}`;
      }
  }
  return link.link;
}

export async function projectImages(
  projectId: string,
  logoSrc: string | false = 'logo.svg'
) {
  const [backgroundImage, logo] = await Promise.all([
    Image(`src/pages/projects/${projectId}/background.jpg`, {
      ...imageOptions,
      formats: ['avif', 'webp', 'jpeg'],
    }),
    logoSrc
      ? Image(`src/pages/projects/${projectId}/${logoSrc}`, {
          ...imageOptions,
          widths: [128, 256, 512],
          formats: ['avif', 'webp', null],
          svgShortCircuit: true,
          sharpWebpOptions: { lossless: true },
          sharpAvifOptions: { lossless: true },
        })
      : undefined,
  ]);

  return { backgroundImage, logo };
}

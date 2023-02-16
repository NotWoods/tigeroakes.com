import type { MarkdownInstance, MDXInstance } from 'astro';
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

export type Project =
  | MarkdownInstance<ProjectFrontmatter>
  | MDXInstance<ProjectFrontmatter>;

export const PROJECT_PATH = /^\/projects\/([-\w]+)/;

export async function loadProjects(input: Promise<readonly Project[]>) {
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
  logoSrc: string | undefined
): Promise<{ backgroundImage: ImageMetadata; logo: ImageMetadata }> {
  const [{ default: backgroundImage }, { default: logo }] = await Promise.all([
    import(`../pages/projects/${projectId}/background.jpg`),
    logoSrc
      ? import(`../pages/projects/${projectId}/logo.png`)
      : import(`../pages/projects/${projectId}/logo.svg`),
  ]);

  return { backgroundImage, logo };
}

interface Link {
  title: string;
  github?: string;
  link?: string;
}

export const PROJECT_PATH = /^\/projects\/([-\w]+)/;

export function projectButtons(links: readonly Link[], pageUrl: string | URL) {
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
  return link.link;
}

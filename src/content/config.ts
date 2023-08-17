import { z, reference, defineCollection } from 'astro:content';
import { jsonResumeSchema } from '../components/resume/schema';

const linkButtonSchema = z.object({
  title: z.string(),
  link: z.string().url().optional(),
});

const jsonResume = defineCollection({
  type: 'data',
  schema: jsonResumeSchema,
});

const projects = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      weight: z.number().default(Infinity),
      title: z.string(),
      subtitle: z.string(),
      description: z.string().optional(),
      color: z.string(),
      fallbackcolor: z.string().optional(),
      tech: z.array(z.string()),
      categories: z.array(z.string()).default([]),
      links: z.array(linkButtonSchema).default([]),
      logo: image(),
      background: image(),
    }),
});

const posts = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      elsewhere: z
        .object({
          name: z.string(),
          source: z.string().url(),
          link: z.string().url(),
        })
        .optional(),
      title: z.string(),
      description: z.string(),
      date: z.date(),
      tags: z.array(z.string()),
      categories: z.array(z.string()).default([]),
      projects: z.array(reference('projects')).default([]),
      links: z.array(linkButtonSchema).default([]),
      banner: image().optional(),
      banner_alt: z.string().optional(),
      toc: z.boolean().default(false),
    }),
});

const talks = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(),
      tags: z.array(z.string()),
      projects: z.array(reference('projects')).default([]),
      links: z.array(linkButtonSchema).default([]),
      color: z.string().optional(),
      banner: image(),
      banner_alt: z.string().optional(),
    }),
});

const featuredIn = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    links: z.array(linkButtonSchema).default([]),
  }),
});

export const collections = {
  projects,
  posts,
  talks,
  'json-resume': jsonResume,
  'featured-in': featuredIn,
};

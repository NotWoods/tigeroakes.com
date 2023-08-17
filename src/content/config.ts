import { z, reference, defineCollection } from 'astro:content';
import { jsonResumeSchema } from '../components/resume/schema';

const jsonResume = defineCollection({
  type: 'data',
  schema: jsonResumeSchema,
});

const projectCollection = defineCollection({
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
      links: z
        .array(
          z.object({
            title: z.string(),
            link: z.string().url().optional(),
          })
        )
        .default([]),
      logo: image(),
      background: image(),
    }),
});

const talkCollection = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(),
      tags: z.array(z.string()),
      projects: z.array(reference('projects')).default([]),
      links: z
        .array(
          z.object({
            title: z.string(),
            link: z.string().url(),
          })
        )
        .default([]),
      color: z.string().optional(),
      banner: image(),
      banner_alt: z.string().optional(),
    }),
});

export const collections = {
  projects: projectCollection,
  talks: talkCollection,
  'json-resume': jsonResume,
};

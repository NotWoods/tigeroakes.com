import { z, defineCollection } from 'astro:content';
import { jsonResumeSchema } from '../components/resume/schema';

const jsonResume = defineCollection({
  type: 'data',
  schema: jsonResumeSchema,
});

const talkCollection = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(),
      tags: z.array(z.string()),
      // TODO: use reference to projects
      projects: z.array(z.string()).default([]),
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
  talks: talkCollection,
  'json-resume': jsonResume,
};

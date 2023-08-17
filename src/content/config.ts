import { defineCollection } from 'astro:content';
import { jsonResumeSchema } from '../components/resume/schema';

const jsonResume = defineCollection({
  type: 'data',
  schema: jsonResumeSchema,
});

export const collections = {
  'json-resume': jsonResume,
};

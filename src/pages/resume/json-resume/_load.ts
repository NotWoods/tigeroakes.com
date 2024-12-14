import type { ResumeSchema } from '@kurone-kito/jsonresume-types';
import { getEntry } from 'astro:content';

function mergeResume(base: ResumeSchema, partial: ResumeSchema): ResumeSchema {
  return {
    ...base,
    ...partial,
    basics: {
      ...base.basics,
      ...partial.basics,
    },
    work: mergeArray(base.work, partial.work),
    projects: mergeArray(base.projects, partial.projects),
  };
}

function mergeArray<T extends { name?: string; startDate?: string }>(
  base: readonly T[] | undefined,
  partial: readonly T[] | undefined
): T[] | undefined {
  if (!partial) return base?.slice();

  return partial.map((experience) => {
    const baseExperience = base?.find(
      (baseExperience) =>
        baseExperience.name === experience.name &&
        baseExperience.startDate === experience.startDate
    );

    return {
      ...baseExperience,
      ...experience,
    };
  });
}

const defaultJsonResume = getEntry('json-resume', 'default');
export async function loadJsonResume(type: string) {
  const jsonResume = await getEntry('json-resume', type);
  const defaultResume = await defaultJsonResume;
  if (!jsonResume) {
    throw new Error(`Invalid json-resume name: ${type}`);
  }

  return mergeResume(defaultResume!.data, jsonResume.data);
}

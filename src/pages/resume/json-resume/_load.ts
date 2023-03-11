import type { ResumeSchema } from '@kurone-kito/jsonresume-types';
import defaultJsonResume from './default.json';

function mergeResume(base: ResumeSchema, partial: ResumeSchema): ResumeSchema {
  return {
    ...base,
    ...partial,
    basics: {
      ...base.basics,
      ...partial.basics,
    },
    work: mergeArrray(base.work, partial.work),
    projects: mergeArrray(base.projects, partial.projects),
  };
}

function mergeArrray<T extends { name?: string; position?: string }>(
  base: readonly T[],
  partial: readonly T[]
): T[] {
  if (!partial) return base.slice();

  return partial.map((experience) => {
    const baseExperience = base.find(
      (baseExperience) => baseExperience.name === experience.name
      // && baseExperience.position === experience.position
    );

    return {
      ...baseExperience,
      ...experience,
    };
  });
}

export async function loadJsonResume(type: string) {
  const { default: jsonResume } = await import(`../json-resume/${type}.json`);
  return mergeResume(defaultJsonResume, jsonResume);
}

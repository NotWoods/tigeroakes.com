export function merge(base, partial) {
  return {
    basics: mergeBasics(base.basics, partial.basics),
    work: mergeWork(base.work, partial.work),
    projects: mergeProjects(base.projects, partial.projects),
    volunteer: mergeProjects(base.volunteer, partial.volunteer),
    education: partial.education || base.education,
    awards: partial.awards || base.awards,
    publications: partial.publications || base.publications,
    skills: partial.skills || base.skills,
    languages: partial.languages || base.languages,
    interests: partial.interests || base.interests,
    references: partial.references || base.references,
  };
}

export function mergeAll(base, ...resumes) {
  return resumes.reduce(merge, base);
}

/**
 * Combine two arrays into a single array.
 * If two items have the same key, they will be merged.
 * Otherwise new items are appended to the array.
 * @template T
 * @template K
 * @param {T[]} base
 * @param {T[]} partial
 * @param {object} opts
 * @param {(T) => K} opts.toKey
 * @param {(T, T) => T} opts.merge
 */
function mergeArrays(base = [], partial, opts) {
  const { toKey, merge = (a, b) => ({ ...a, ...b }) } = opts;
  if (!partial) return base;

  const merged = base.slice(0);
  const indexes = new Map();
  merged.forEach((item, index) => indexes.set(toKey(item), index));

  (partial || []).forEach(partialItem => {
    const existingIndex = indexes.findIndex(toKey(partialItem));
    if (existingIndex != undefined) {
      merged[existingIndex] = merge(merged[existingIndex], partialItem);
    } else {
      merged.push(partialItem);
    }
  });

  return merged;
}

function mergeBasics(base, partial) {
  if (!partial) return base;

  return {
    ...base,
    ...partial,
    location: {
      ...base.location,
      ...partial.location,
    },
    profiles: mergeArrays(base.profiles, partial.profiles, {
      toKey: profile => profile.network,
    }),
  };
}

function mergeWork(base, partial) {
  return mergeArrays(base, partial, {
    toKey: work => work.company + work.startDate + work.endDate,
    merge(baseWork, partialWork) {
      if (!partialWork) return baseWork;
      return {
        ...baseWork,
        ...partialWork,
        highlights: partialWork.highlights || baseWork.highlights,
      };
    },
  });
}

function mergeProjects(base, partial) {
  return mergeArrays(base, partial, {
    toKey: proj => proj.name,
    merge(baseProj, partialProj) {
      if (!partialProj) return baseProj;
      return {
        ...baseProj,
        ...partialProj,
        highlights: partialProj.highlights || baseProj.highlights,
      };
    },
  });
}

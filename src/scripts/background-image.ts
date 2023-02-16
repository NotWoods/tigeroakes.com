import { getPicture } from '@astrojs/image';

const FIRST_SRC_SET = /^(\S*) \d+w/;

function sourcesToImageSet(sources: { type: string; srcset: string }[]) {
  return sources
    .map((source) => {
      const match = source.srcset.match(FIRST_SRC_SET);
      if (!match) {
        throw new Error(`Invalid srcset: ${source}`);
      }
      return `url("${match[1]}") type("${source.type}")`;
    })
    .join(', ');
}

export type GetPictureResult = Awaited<ReturnType<typeof getPicture>>;

/**
 * Converts the metadata returned by getPicture to a background-image CSS property.
 * @example
 * metadataToBackgroundImage({
 *   image: { src: 'fallback.jpg' },
 *   sources: [{ type: 'image/webp', srcset: 'image.webp 20w' }]
 * });
 * // ->
 * // `background-image: url("fallback.jpg");
 * // background-image: -webkit-image-set(url("image.webp") type("image/webp"));
 * // background-image: image-set(url("image.webp") type("image/webp"))`
 */
export function metadataToBackgroundImage(metadata: GetPictureResult) {
  const src = metadata.image.src;
  const imageSet = sourcesToImageSet(metadata.sources);

  return [
    `url("${src}")`,
    `-webkit-image-set(${imageSet})`,
    `image-set(${imageSet})`,
  ]
    .map((value) => `background-image: ${value}`)
    .join('; ');
}

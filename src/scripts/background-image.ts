import { getImage } from 'astro:assets';

function sourcesToImageSet(sources: readonly GetImageResult[]) {
  return sources
    .map((source) => {
      return `url("${source.src}") type("${source.options.format}")`;
    })
    .join(', ');
}

export type GetImageResult = Awaited<ReturnType<typeof getImage>>;

/**
 * Convert an image to a background-image CSS property.
 * @example
 * getInlineBackgroundImage({
 *   src: 'fallback.jpg',
 *   formats: ['webp', 'jpeg']
 * });
 * // ->
 * // `background-image: url("fallback.jpg");
 * // background-image: -webkit-image-set(url("image.webp") type("image/webp"));
 * // background-image: image-set(url("image.webp") type("image/webp"))`
 */
export async function getInlineBackgroundImage({
  formats,
  ...options
}: {
  src: ImageMetadata | string;
  width?: number;
  formats: ReadonlyArray<'avif' | 'webp' | 'png' | 'jpeg'>;
}) {
  const image = await getImage({ ...options, format: formats.at(-1) });
  return `background-image: url("${image.src}");`;

  const metadata = await Promise.all(
    formats.map((format) => getImage({ ...options, format }))
  );

  const src = metadata.at(-1)!.src;
  const imageSet = sourcesToImageSet(metadata);

  return `background-image: url("${src}"); --image-set: ${imageSet}; background-image: -webkit-image-set(var(--image-set)); background-image: image-set(var(--image-set))`;
}

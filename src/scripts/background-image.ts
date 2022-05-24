import type { Metadata } from '@11ty/eleventy-img';

type BackgroundFormat = 'jpeg' | 'webp' | 'avif';
const backgroundFormats: readonly BackgroundFormat[] = ['avif', 'webp', 'jpeg'];

export function backgroundImage(
  paths: Record<'jpeg' | 'webp' | 'avif', string>
) {
  const imageSet = backgroundFormats
    .map((format) => `url("${paths[format]}") type("image/${format}")`)
    .join(', ');

  return (
    `background-image: url("${paths['jpeg']}"); ` +
    `background-image: -webkit-image-set(${imageSet}); background-image: image-set(${imageSet})`
  );
}

export function metadataToBackgroundImage(metadata: Metadata) {
  function urlForFormat(format: BackgroundFormat) {
    const data = metadata[format];
    if (data) {
      return data[0].url;
    } else {
      throw new Error(`Missing format .${format}`);
    }
  }

  return backgroundImage({
    avif: urlForFormat('avif'),
    webp: urlForFormat('webp'),
    jpeg: urlForFormat('jpeg'),
  });
}

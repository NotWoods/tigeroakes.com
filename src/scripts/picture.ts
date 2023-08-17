export type ImageFormat = ImageMetadata['format'] | 'avif';

export function formatToMimeType(format: ImageFormat) {
  switch (format) {
    case 'png':
      return 'image/png';
    case 'svg':
      return 'image/svg+xml';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    default:
      return `image/${format}`;
  }
}

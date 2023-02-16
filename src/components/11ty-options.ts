import type { ImageOptions } from '@11ty/eleventy-img';
import { basename, dirname, extname } from 'path';

export function parentFolder(src: string) {
  return basename(dirname(src));
}

export const imageOptions: Partial<ImageOptions> = {
  outputDir: `${import.meta.env.PROD ? 'dist' : 'static'}/assets/images`,
  urlPath: '/assets/images',
  sharpWebpOptions: { quality: 90 },
  sharpAvifOptions: { quality: 90 },
  filenameFormat(id, src, width, format) {
    const fileName = basename(src, extname(src));
    return `${parentFolder(src)}-${fileName}-${width}.${id}.${format}`;
  },
};

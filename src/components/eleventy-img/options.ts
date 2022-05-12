import { basename, dirname, extname } from 'path';

export function parentFolder(src: string) {
  return basename(dirname(src));
}

export const imageOptions = {
  outputDir: `${import.meta.env.PROD ? 'dist' : 'static'}/assets/images`,
  urlPath: '/assets/images',
  sharpWebpOptions: { quality: 90 },
  sharpAvifOptions: { quality: 90 },
  filenameFormat(id: string, src: string, width: string, format: string) {
    const fileName = basename(src, extname(src));
    return `${parentFolder(src)}-${fileName}-${width}.${id}.${format}`;
  }
};

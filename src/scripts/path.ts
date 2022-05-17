export function trailingSlash(path: string | URL): string {
  if (typeof path !== 'string') {
    path = path.pathname;
  }

  if (path.endsWith('/')) {
    return path;
  } else {
    return path + '/';
  }
}

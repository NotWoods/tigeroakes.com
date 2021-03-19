// @ts-check

import {
  imageCache,
  offlineFallback,
  pageCache,
  staticResourceCache,
} from 'workbox-recipes';

pageCache();
staticResourceCache();
imageCache({
  matchCallback({ request }) {
    switch (request.destination) {
      case 'image':
      case 'video':
      case 'audio':
        return true;
      default:
        return false;
    }
  },
});
offlineFallback({ pageFallback: 'offline.html' });

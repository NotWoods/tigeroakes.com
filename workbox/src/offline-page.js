// @ts-check

import { ignoreSearch } from './consts';

/** @type {import('workbox-routing').RouteHandlerObject} */
export const catchHandler = {
  async handle({ event }) {
    console.log(event);
    switch (event.request.destination) {
      case 'document':
        return caches.match('/offline.html', ignoreSearch);

      default:
        return Response.error();
    }
  },
};

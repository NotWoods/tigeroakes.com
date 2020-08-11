import { matchPrecache } from 'workbox-precaching';
import { ignoreSearch } from './consts';

/** @type {import('workbox-routing').RouteHandlerObject} */
export const catchHandler = {
  async handle({ event }) {
    console.log('catch', event);
    switch (event.request.destination) {
      case 'document':
        return matchPrecache('/offline.html', ignoreSearch);

      default:
        return Response.error();
    }
  },
};

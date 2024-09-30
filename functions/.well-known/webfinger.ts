const mastodon_server = 'https://hachyderm.io/';
const mastodon_user = 'notwoods';

const resources = new Set([
  'acct:notwoods@tigeroakes.com',
  'acct:contact@tigeroakes.com',
  'acct:tiger@tigeroakes.com',
  'acct:tigeroakes@tigeroakes.com',
]);

export const onRequest: PagesFunction = ({ request }) => {
  const resource = new URL(request.url).searchParams.get('resource');

  if (!resources.has(resource)) {
    return new Response('no such resource', {
      status: 404,
    });
  }

  return Response.json({
    subject: resource,
    aliases: [
      `https://${mastodon_server}/@${mastodon_user}`,
      `https://${mastodon_server}/users/${mastodon_user}`,
    ],
    links: [
      {
        rel: 'http://webfinger.net/rel/profile-page',
        type: 'text/html',
        href: `https://${mastodon_server}/@${mastodon_user}`,
      },
      {
        rel: 'self',
        type: 'application/activity+json',
        href: `https://${mastodon_server}/users/${mastodon_user}`,
      },
      {
        rel: 'http://ostatus.org/schema/1.0/subscribe',
        template: `https://${mastodon_server}/authorize_interaction?uri={uri}`,
      },
    ],
  });
};

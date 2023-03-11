import type { ResumeSchema } from '@kurone-kito/jsonresume-types';
import { ComponentChildren, Fragment } from 'preact';

export const TagList = ({ tags }: { tags: readonly ComponentChildren[] }) => {
  return (
    <>
      {tags.filter(Boolean).map((tag, i) => (
        <Fragment key={i}>
          {tag}
          {i < tags.length - 1 ? ' | ' : null}
        </Fragment>
      ))}
    </>
  );
};

function formatPhoneNumber(phoneNumber: string) {
  const phoneSlice = phoneNumber.split('-').slice(1);
  return phoneSlice.join('-');
}

const HTTPS = /^https?:\/\//;

export function contactList(
  basics: ResumeSchema['basics']
): { text: string; href: string }[] {
  const github = basics.profiles?.find(
    (profile) => profile.network === 'GitHub'
  );

  return [
    {
      text: basics.email,
      href: `mailto:${basics.email}`,
    },
    {
      text: formatPhoneNumber(basics.phone),
      href: `tel:${basics.phone}`,
    },
    {
      text: basics.url.replace(HTTPS, ''),
      href: basics.url,
    },
    github?.url && {
      text: github.url.replace(HTTPS, ''),
      href: github.url,
    },
  ].filter(Boolean);
}

export const ResumeHeader = ({ basics }: Pick<ResumeSchema, 'basics'>) => {
  return (
    <header class="border-b border-orange-500 mb-[8pt]">
      <h1 class="font-sans text-bold uppercase text-[20pt]">{basics.name}</h1>
      <p class="mb-[4pt]">
        <TagList
          tags={contactList(basics).map(({ text, href }) => (
            <a class="" href={href}>
              {text}
            </a>
          ))}
        />
      </p>
      <p class="italic text-neutral-700 mb-[4pt] text-[11pt]">
        {basics.summary}
      </p>
    </header>
  );
};

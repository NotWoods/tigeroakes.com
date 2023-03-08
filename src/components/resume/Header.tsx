import { ComponentChildren, Fragment } from 'preact';

interface Profile {
  network: string;
  username: string;
  url: string;
}

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

export const ResumeHeader = ({ basics }) => {
  const phoneSlice = basics.phone.split('-').slice(1);
  const github: Profile = basics.profiles.find(
    (profile: Profile) => profile.network === 'GitHub'
  );

  return (
    <header class="border-b border-orange-500 mb-[8pt]">
      <h1 class="font-sans text-bold uppercase text-[20pt]">{basics.name}</h1>
      <p class="mb-[4pt]">
        <TagList
          tags={[
            <a class="" href={`mailto:${basics.email}`}>
              {basics.email}
            </a>,
            <a class="" href={`tel:${basics.phone}`}>
              {phoneSlice.join('-')}
            </a>,
            <a class="" href={basics.url}>
              tigeroakes.com
            </a>,
            github && (
              <a class="" href={github.url}>
                github.com/{github.username}
              </a>
            ),
          ]}
        />
      </p>
      <p class="italic text-neutral-700 mb-[4pt]">{basics.summary}</p>
    </header>
  );
};

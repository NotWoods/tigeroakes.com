import type { ResumeSchema } from '@kurone-kito/jsonresume-types';
import styles from './resume.module.css';

function formatPhoneNumber(phoneNumber: string) {
  const phoneSlice = phoneNumber.split('-').slice(1);
  return phoneSlice.join('-');
}

const HTTPS = /^https?:\/\//;

export function contactList(
  basics: NonNullable<ResumeSchema['basics']>
): { text: string; href?: string }[] {
  const github = basics.profiles?.find(
    (profile) => profile.network === 'GitHub'
  );

  const list: { text: string; href?: string }[] = [];
  if (basics.location) {
    list.push({
      text: `${basics.location.city}, ${basics.location.region} (${basics.location.countryCode} Citizen)`,
    });
  }

  if (github && github.username) {
    list.push({
      text: `github.com/${github.username}`,
      href: github.url,
    });
  }

  if (basics.email) {
    list.push({
      text: basics.email,
      href: `mailto:${basics.email}`,
    });
  }

  if (basics.phone) {
    list.push({
      text: formatPhoneNumber(basics.phone),
      href: `tel:${basics.phone}`,
    });
  }

  return list;
}

export const ResumeHeader = (props: Pick<ResumeSchema, 'basics'>) => {
  const basics = props.basics!;
  return (
    <header>
      <h1 class={styles.title}>{basics.name}</h1>
      <ul>
        {contactList(basics).map(({ text, href }) => (
          <li class={`${styles.contactItem} inline`}>
            <a href={href}>{text}</a>
          </li>
        ))}
      </ul>
    </header>
  );
};

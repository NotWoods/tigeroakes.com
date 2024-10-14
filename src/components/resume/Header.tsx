import type { ResumeSchema } from '@kurone-kito/jsonresume-types';
import styles from './resume.module.css';
import type { TextSpan } from './markdownish';
import { FormattedSpan } from './Experience';

function formatPhoneNumber(phoneNumber: string) {
  const phoneSlice = phoneNumber.split('-').slice(1);
  return phoneSlice.join('-');
}

export function contactList(
  basics: NonNullable<ResumeSchema['basics']>
): TextSpan[] {
  const github = basics.profiles?.find(
    (profile) => profile.network === 'GitHub'
  );

  const list: TextSpan[] = [];
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
        {contactList(basics).map((textSpan) => (
          <li key={textSpan.href} class={`${styles.contactItem} inline`}>
            <FormattedSpan {...textSpan} />
          </li>
        ))}
      </ul>
      <p class={`${styles.summary} italic`}>{basics.summary}</p>
    </header>
  );
};

import React from 'react';
import { useTranslation } from 'react-i18next';

function DocumentLinks() {
  const { t } = useTranslation('sign-in');
  return (
    <ul className="inline space-x-2 pt-huge text-center text-Primary-500">
      {DOCUMENT_LINKS.map((doc) => (
        <li
          key={doc.link}
          className={
            "inline-block after:ml-2 after:content-['•'] last:after:content-['']"
          }
        >
          <a
            href={t(doc.link as never)}
            target={'_blank'}
            className="action-regular !text-xs"
            rel="noreferrer"
          >
            {t(doc.text as never)}
          </a>
        </li>
      ))}
    </ul>
  );
}

const DOCUMENT_LINKS = [
  {
    link: 'privacy_policy_link',
    text: 'privacy_policy_link_text',
  },
  {
    link: 'terms_and_conditions_link',
    text: 'terms_and_conditions_link_text',
  },
  {
    link: 'cookies_policy_link',
    text: 'cookies_policy_link_text',
  },
];

export default DocumentLinks;

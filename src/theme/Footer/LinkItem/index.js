import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import isInternalUrl from '@docusaurus/isInternalUrl';
import IconExternalLink from '@theme/Icon/ExternalLink';

const COOKIE_SETTINGS_EVENT = 'cursed-seas-cookie-settings';

export default function FooterLinkItem({item}) {
  const {
    to,
    href,
    label,
    prependBaseUrlToHref,
    className,
    ...props
  } = item;

  const toUrl = useBaseUrl(to);

  const normalizedHref = useBaseUrl(href, {
    forcePrependBaseUrl: true,
  });

  if (label === 'Cookie settings') {
    const openCookieSettings = (event) => {
      event.preventDefault();

      window.dispatchEvent(
        new CustomEvent(COOKIE_SETTINGS_EVENT)
      );
    };

    return (
      <button
        type="button"
        className={clsx(
          'footer__link-item',
          'cookie-settings-link',
          className
        )}
        onClick={openCookieSettings}>
        {label}
      </button>
    );
  }

  return (
    <Link
      className={clsx('footer__link-item', className)}
      {...(href
        ? {
            href: prependBaseUrlToHref
              ? normalizedHref
              : href,
          }
        : {
            to: toUrl,
          })}
      {...props}>
      {label}

      {href && !isInternalUrl(href) && (
        <IconExternalLink />
      )}
    </Link>
  );
}
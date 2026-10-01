import React from 'react';
import CookieConsent from '@site/src/components/CookieConsent';

export default function Root({children}) {
  return (
    <>
      {children}
      <CookieConsent />
    </>
  );
}
import React from 'react';
import CookieConsent from '@site/src/components/CookieConsent';
import ClickableNpcImages from '@site/src/components/ClickableNpcImages';

export default function Root({children}) {
  return (
    <>
      {children}
      <CookieConsent />
      <ClickableNpcImages />
    </>
  );
}
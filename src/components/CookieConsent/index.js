import React, {useEffect, useState} from 'react';
import Link from '@docusaurus/Link';

const GA_MEASUREMENT_ID = 'G-KBX083D6W7';
const COOKIE_SETTINGS_EVENT = 'cursed-seas-cookie-settings';

function loadGoogleAnalytics() {
  if (window.gtag) {
    return;
  }

  window.dataLayer = window.dataLayer || [];

  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  window.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });

  window.gtag('js', new Date());

  const script = document.createElement('script');
  script.async = true;
  script.src =
    `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

  document.head.appendChild(script);

  window.gtag('config', GA_MEASUREMENT_ID);
}

function enableGoogleAnalytics() {
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = false;

  loadGoogleAnalytics();

  window.gtag?.('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}

function deleteGoogleAnalyticsCookies() {
  const cookies = document.cookie.split(';');

  cookies.forEach((cookie) => {
    const cookieName = cookie.split('=')[0].trim();

    if (
      cookieName === '_ga' ||
      cookieName.startsWith('_ga_')
    ) {
      // Delete cookie for the current path.
      document.cookie =
        `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;

      // Also try deleting it using the site's base path.
      document.cookie =
        `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/cursed-seas/`;
    }
  });
}

function disableGoogleAnalytics() {
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;

  if (window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  }

  deleteGoogleAnalyticsCookies();
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('analytics-consent');

    if (consent === 'granted') {
      enableGoogleAnalytics();
    } else {
      disableGoogleAnalytics();

      if (!consent) {
        setVisible(true);
      }
    }

    const openCookieSettings = () => {
      setVisible(true);
    };

    window.addEventListener(
      COOKIE_SETTINGS_EVENT,
      openCookieSettings
    );

    return () => {
      window.removeEventListener(
        COOKIE_SETTINGS_EVENT,
        openCookieSettings
      );
    };
  }, []);

  const accept = () => {
    localStorage.setItem('analytics-consent', 'granted');

    enableGoogleAnalytics();

    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem('analytics-consent', 'denied');

    disableGoogleAnalytics();

    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div
      className="cookie-consent"
      role="dialog"
      aria-label="Analytics consent">

      <div className="cookie-consent__text">
        <strong>Cookies & Analytics</strong>

        <span>
          With your consent, this wiki uses Google Analytics to understand
          which pages are visited and how the site is used. Analytics is
          disabled unless you accept. You can change your choice at any time.
          {' '}
          <Link to="/privacy">
            Privacy Policy
          </Link>
        </span>
      </div>

      <div className="cookie-consent__buttons">
        <button
          className="button button--secondary"
          onClick={reject}>
          Reject
        </button>

        <button
          className="button button--primary"
          onClick={accept}>
          Accept analytics
        </button>
      </div>

    </div>
  );
}
'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    // Only register service worker in supported browser environments
    if (
      typeof window === 'undefined' ||
      !('serviceWorker' in navigator) ||
      process.env.NODE_ENV !== 'production'
    ) {
      return;
    }

    const registerSW = () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          // Check for service worker updates
          registration.addEventListener('updatefound', () => {
            const installing = registration.installing;
            if (installing) {
              installing.addEventListener('statechange', () => {
                if (
                  installing.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  // A new version of the app shell is cached
                  console.info('[PWA] New offline version available.');
                }
              });
            }
          });
        })
        .catch((err) => {
          // Gracefully fail without disrupting the athlete's workout
          console.warn('[PWA] Service worker registration omitted:', err);
        });
    };

    // Register after page has completely loaded to prevent any FCP / LCP contention
    if (document.readyState === 'complete') {
      registerSW();
    } else {
      window.addEventListener('load', registerSW, { once: true });
    }
  }, []);

  return null;
}

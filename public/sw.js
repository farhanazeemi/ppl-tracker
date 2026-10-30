/* ===================================================================
   PPL Hypertrophy Tracker — Progressive Web App Service Worker (sw.js)
   Optimized for offline resistance training sessions in low/no reception gyms.
   =================================================================== */

const CACHE_VERSION = 'ppl-tracker-v1';
const PRECACHE_ASSETS = [
  '/tools/ppl-tracker',
  '/tools/bmi-calculator',
  '/tools',
  '/manifest.json',
  '/icon.svg',
];

// 1. INSTALL: Pre-cache critical app shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
      .catch((err) => {
        // Silently proceed if individual non-critical resource fails
        console.warn('[PWA SW] Pre-cache partial warning:', err);
      })
  );
});

// 2. ACTIVATE: Clean up stale caches from previous versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_VERSION) {
              return caches.delete(name);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// 3. FETCH: Smart caching strategy optimized for speed and offline reliability
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only intercept GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Bypass non-http protocols (e.g. chrome-extension:)
  if (!url.protocol.startsWith('http')) return;

  // Bypass third-party analytics & external tracking
  if (
    url.hostname.includes('googletagmanager.com') ||
    url.hostname.includes('google-analytics.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('gstatic.com')
  ) {
    return;
  }

  // Bypass Supabase cloud sync (Supabase client handles offline queuing/localStorage)
  if (url.hostname.includes('supabase.co')) {
    return;
  }

  // Bypass internal Sanity Studio and API routes
  if (url.pathname.startsWith('/studio') || url.pathname.startsWith('/api')) {
    return;
  }

  // Strategy A: Page Navigations (HTML) -> Network-First with Cache Fallback for gym offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_VERSION).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          // Network failed (offline in gym basement) -> Return cached page or tracker shell
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;

          // Fallback to primary offline workout tracker
          const fallbackShell = await caches.match('/tools/ppl-tracker');
          if (fallbackShell) return fallbackShell;

          return new Response(
            `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>PPL Tracker — Offline Mode</title>
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #090a0f; color: #f8fafc; text-align: center; padding: 48px 16px; margin: 0; }
                  h1 { font-size: 24px; text-transform: uppercase; color: #f59e0b; }
                  p { color: #94a3b8; font-size: 14px; max-width: 400px; margin: 16px auto; line-height: 1.5; }
                  a { display: inline-block; margin-top: 20px; padding: 12px 24px; background: #f59e0b; color: #000; text-decoration: none; font-weight: bold; border-radius: 12px; }
                </style>
              </head>
              <body>
                <h1>Offline Mode (Gym Safe)</h1>
                <p>No cellular reception detected in this area. Your workout tracker and history remain safely cached on your device.</p>
                <a href="/tools/ppl-tracker">Open Workout Tracker</a>
              </body>
            </html>`,
            {
              headers: { 'Content-Type': 'text/html; charset=utf-8' },
            }
          );
        })
    );
    return;
  }

  // Strategy B: Next.js Static Chunks, CSS, and Preloaded Fonts -> Cache-First
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_VERSION).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Strategy C: Static Media, Icons & SVG -> Stale-While-Revalidate
  if (
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.ico') ||
    url.pathname === '/manifest.json'
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_VERSION).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Default: Network fetch with catch
  event.respondWith(fetch(request));
});

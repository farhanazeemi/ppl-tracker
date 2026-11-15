'use client';

import React from 'react';
import Script from 'next/script';

const CLARITY_PROJECT_ID = 'ze3g5jcdbm';

export function MicrosoftClarity() {
  // Do not load Clarity scripts in non-production environments to prevent local analytics pollution
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && !window.location.pathname.startsWith('/studio')) {
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
          }
        `,
      }}
    />
  );
}

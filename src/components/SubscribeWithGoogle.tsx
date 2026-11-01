import React from 'react';

/**
 * Subscribe with Google (SwG Basic) integration for published fitness articles.
 * Matches Google News / Publisher Center specification:
 * - Publication / Product ID: CAowpcXODA:openaccess
 * - Content Type: NewsArticle
 * - Access Model: Open Access (isAccessibleForFree: true)
 */
export function SubscribeWithGoogle() {
  return (
    <>
      <script
        async
        type="application/javascript"
        src="https://news.google.com/swg/js/v1/swg-basic.js"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `(self.SWG_BASIC = self.SWG_BASIC || []).push( basicSubscriptions => {
    basicSubscriptions.init({
      type: "NewsArticle",
      isPartOfType: ["Product"],
      isPartOfProductId: "CAowpcXODA:openaccess",
      clientOptions: { theme: "light", lang: "en" },
    });
  });`,
        }}
      />
    </>
  );
}

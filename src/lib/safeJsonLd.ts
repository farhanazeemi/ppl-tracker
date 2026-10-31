/**
 * Serializes an object to JSON and safely escapes HTML-sensitive characters
 * ('<', '>', '&') to unicode escape sequences to prevent Stored XSS via script tag
 * breakout inside '<script type="application/ld+json">'.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

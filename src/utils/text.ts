/**
 * Converts heading text into a clean, URL-safe, stable ID for on-page anchor navigation.
 */
export function slugifyHeading(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

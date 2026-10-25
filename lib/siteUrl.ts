/**
 * Public origin of the deployed site, read from SITE_URL at build time (for example
 * https://example.com). Unset means no canonical URL, sitemap entries or absolute
 * metadata links are emitted; no domain is assumed.
 */
export function getSiteUrl(): URL | undefined {
  const raw = process.env.SITE_URL?.trim();
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
    return new URL(url.origin);
  } catch {
    return undefined;
  }
}

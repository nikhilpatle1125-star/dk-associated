const BASE = (process.env.SITE_URL || 'https://www.dkpropertyguide.in').replace(/\/$/, '');

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }],
    sitemap: `${BASE}/sitemap.xml`
  };
}

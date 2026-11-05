import { prisma } from '../lib/prisma';

export const revalidate = 3600;

const BASE = (process.env.SITE_URL || 'https://www.dkpropertyguide.in').replace(/\/$/, '');

export default async function sitemap() {
  const properties = await prisma.property
    .findMany({ select: { slug: true, updatedAt: true } })
    .catch(() => []);

  const pages = ['', '/properties', '/about', '/contact'].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date()
  }));

  const items = properties.map((p) => ({
    url: `${BASE}/properties/${p.slug}`,
    lastModified: p.updatedAt
  }));

  return [...pages, ...items];
}

import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { requireAdmin } from '../../../lib/apiAuth';

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  return NextResponse.json(settings);
}

export async function PUT(request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });

  const data = {
    companyName: String(body.companyName || 'DK Associated').slice(0, 150),
    tagline: String(body.tagline || '').slice(0, 200),
    email: String(body.email || '').slice(0, 200),
    whatsapp: String(body.whatsapp || '').slice(0, 30),
    phone: String(body.phone || '').slice(0, 30),
    address: String(body.address || '').slice(0, 300),
    mapLink: String(body.mapLink || '').slice(0, 500),
    aboutText: String(body.aboutText || '').slice(0, 5000),
    logoUrl: body.logoUrl || null,
    heroImageUrl: body.heroImageUrl || null,
    facebookUrl: body.facebookUrl || null,
    instagramUrl: body.instagramUrl || null
  };

  const updated = await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: data,
    create: { id: 'singleton', ...data }
  });

  return NextResponse.json(updated);
}

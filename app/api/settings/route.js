import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { requireAdmin } from '../../../lib/apiAuth';

function cleanUrl(v) {
  if (!v) return null;
  const t = String(v).trim().slice(0, 500);
  return /^https?:\/\//i.test(t) ? t : null;
}

function cleanText(v, fallback, max) {
  const t = v === undefined || v === null ? '' : String(v).trim();
  return (t || fallback).slice(0, max);
}

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
    facebookUrl: cleanUrl(body.facebookUrl),
    instagramUrl: cleanUrl(body.instagramUrl),
    youtubeUrl: cleanUrl(body.youtubeUrl),
    yearsExperience: cleanText(body.yearsExperience, '15+', 40),
    happyClients: cleanText(body.happyClients, '1,200+', 40),
    verifiedProperties: cleanText(body.verifiedProperties, '100%', 40),
    expertSupport: cleanText(body.expertSupport, '24/7 Guidance', 60)
  };

  const updated = await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: data,
    create: { id: 'singleton', ...data }
  });

  return NextResponse.json(updated);
}

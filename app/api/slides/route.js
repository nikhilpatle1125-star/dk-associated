import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { requireAdmin } from '../../../lib/apiAuth';

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;
  const slides = await prisma.slide.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] });
  return NextResponse.json(slides);
}

export async function POST(request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json().catch(() => null);
  if (!body?.imageUrl || !/^https?:\/\//i.test(body.imageUrl)) {
    return NextResponse.json({ error: 'A slide image is required.' }, { status: 400 });
  }

  const last = await prisma.slide.findFirst({ orderBy: { sortOrder: 'desc' } });
  const slide = await prisma.slide.create({
    data: {
      imageUrl: String(body.imageUrl),
      title: String(body.title || '').slice(0, 120),
      subtitle: String(body.subtitle || '').slice(0, 250),
      linkUrl: body.linkUrl && /^(https?:\/\/|\/)/i.test(body.linkUrl) ? String(body.linkUrl).slice(0, 500) : null,
      sortOrder: (last?.sortOrder ?? -1) + 1
    }
  });
  return NextResponse.json(slide, { status: 201 });
}

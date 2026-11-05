import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/apiAuth';

export async function PUT(request, { params }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });

  const data = {};
  if (body.title !== undefined) data.title = String(body.title).slice(0, 120);
  if (body.subtitle !== undefined) data.subtitle = String(body.subtitle).slice(0, 250);
  if (body.linkUrl !== undefined) {
    data.linkUrl = body.linkUrl && /^(https?:\/\/|\/)/i.test(body.linkUrl) ? String(body.linkUrl).slice(0, 500) : null;
  }
  if (body.active !== undefined) data.active = Boolean(body.active);
  if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder) || 0;

  try {
    const updated = await prisma.slide.update({ where: { id: params.id }, data });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  }
}

export async function DELETE(request, { params }) {
  const { response } = await requireAdmin();
  if (response) return response;
  try {
    await prisma.slide.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/apiAuth';
import { buildPropertyData } from '../../../../lib/propertyValidation';

export async function GET(request, { params }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const property = await prisma.property.findUnique({ where: { id: params.id } });
  if (!property) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  return NextResponse.json(property);
}

export async function PUT(request, { params }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const existing = await prisma.property.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });

  try {
    const data = buildPropertyData(body, existing.slug);
    const updated = await prisma.property.update({ where: { id: params.id }, data });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Could not update property.' }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const existing = await prisma.property.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

  await prisma.property.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}

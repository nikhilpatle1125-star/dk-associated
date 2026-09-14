import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { requireAdmin } from '../../../lib/apiAuth';
import { buildPropertyData } from '../../../lib/propertyValidation';

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const properties = await prisma.property.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(properties);
}

export async function POST(request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });

  try {
    const data = buildPropertyData(body, null);
    const created = await prisma.property.create({ data });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Could not create property.' }, { status: 400 });
  }
}

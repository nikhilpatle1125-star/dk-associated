import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(request) {
  const body = await request.json().catch(() => null);

  if (!body?.name || !body?.phone || !body?.message) {
    return NextResponse.json({ error: 'Name, phone and message are required.' }, { status: 400 });
  }

  const saved = await prisma.contactMessage.create({
    data: {
      name: String(body.name).slice(0, 200),
      phone: String(body.phone).slice(0, 30),
      email: body.email ? String(body.email).slice(0, 200) : null,
      message: String(body.message).slice(0, 2000),
      propertyId: body.propertyId ? String(body.propertyId).slice(0, 200) : null
    }
  });

  return NextResponse.json({ ok: true, id: saved.id });
}

export async function GET(request) {
  const { getServerSession } = await import('next-auth');
  const { authOptions } = await import('../../../lib/auth');
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(messages);
}

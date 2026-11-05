import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

const recent = new Map(); // best-effort throttle (per serverless instance)

export async function POST(request) {
  const body = await request.json().catch(() => null);

  // Honeypot: real users never fill this hidden field; bots do. Pretend success.
  if (body?.website) return NextResponse.json({ ok: true });

  const ip = (request.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
  const now = Date.now();
  const hits = (recent.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  if (hits.length >= 5) {
    return NextResponse.json({ error: 'Too many messages. Please try again later.' }, { status: 429 });
  }
  hits.push(now);
  recent.set(ip, hits);

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

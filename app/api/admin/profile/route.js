import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = await prisma.admin.findUnique({ where: { id: session.user.id } });
  if (!admin) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

  return NextResponse.json({ email: admin.email });
}

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body?.currentPassword) {
    return NextResponse.json({ error: 'Enter your current password to make changes.' }, { status: 400 });
  }

  const admin = await prisma.admin.findUnique({ where: { id: session.user.id } });
  if (!admin) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

  const valid = await bcrypt.compare(body.currentPassword, admin.password);
  if (!valid) {
    return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
  }

  const data = {};

  if (body.newEmail && body.newEmail !== admin.email) {
    const existing = await prisma.admin.findUnique({ where: { email: body.newEmail } });
    if (existing && existing.id !== admin.id) {
      return NextResponse.json({ error: 'That email is already in use.' }, { status: 400 });
    }
    data.email = String(body.newEmail).slice(0, 200);
  }

  if (body.newPassword) {
    if (String(body.newPassword).length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 });
    }
    data.password = await bcrypt.hash(body.newPassword, 10);
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 });
  }

  const updated = await prisma.admin.update({ where: { id: admin.id }, data });

  return NextResponse.json({ email: updated.email, passwordChanged: Boolean(data.password) });
}

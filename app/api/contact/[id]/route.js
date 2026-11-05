import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/apiAuth';

export async function DELETE(request, { params }) {
  const { response } = await requireAdmin();
  if (response) return response;
  try {
    await prisma.contactMessage.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  }
}

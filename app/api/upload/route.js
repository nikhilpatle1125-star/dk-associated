import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get('file');

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
  }

  const maxBytes = 15 * 1024 * 1024; // 15MB
  if (file.size > maxBytes) {
    return NextResponse.json({ error: 'File is larger than 15MB.' }, { status: 400 });
  }

  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: 'Only JPG, PNG, WEBP images or PDF files are allowed.' }, { status: 400 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'File storage is not configured yet. Add BLOB_READ_WRITE_TOKEN in your environment variables.' },
      { status: 500 }
    );
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '-');
  const key = `dk-associated/${Date.now()}-${safeName}`;

  const blob = await put(key, file, {
    access: 'public',
    addRandomSuffix: true
  });

  return NextResponse.json({ url: blob.url });
}

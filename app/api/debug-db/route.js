import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function GET() {
  try {
    const blob = await put('debug-test.txt', 'hello world', { access: 'public', addRandomSuffix: true });
    return NextResponse.json({ ok: true, url: blob.url });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err.message || err) }, { status: 500 });
  }
}
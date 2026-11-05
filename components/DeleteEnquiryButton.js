'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteEnquiryButton({ id }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handle() {
    if (!window.confirm('Delete this enquiry?')) return;
    setBusy(true);
    const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
    setBusy(false);
    if (res.ok) router.refresh();
    else window.alert('Could not delete. Please try again.');
  }

  return (
    <button onClick={handle} disabled={busy} className="text-sm text-red-700 hover:underline focus-ring disabled:opacity-60">
      {busy ? 'Deleting…' : 'Delete'}
    </button>
  );
}

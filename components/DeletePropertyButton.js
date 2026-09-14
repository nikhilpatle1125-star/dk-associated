'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeletePropertyButton({ id, title }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setBusy(true);
    const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
    setBusy(false);
    if (res.ok) {
      router.refresh();
    } else {
      alert('Could not delete this property. Please try again.');
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={busy}
      className="text-sm text-red-700 hover:underline focus-ring disabled:opacity-50"
    >
      {busy ? 'Deleting…' : 'Delete'}
    </button>
  );
}

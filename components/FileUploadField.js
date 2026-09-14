'use client';

import { useState } from 'react';

export default function FileUploadField({ label, accept, multiple, value, onChange, hint }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const urls = multiple ? (Array.isArray(value) ? value : []) : value ? [value] : [];

  async function uploadFile(file) {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Upload failed.');
    return data.url;
  }

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    setError('');
    try {
      const uploaded = [];
      for (const file of files) {
        const url = await uploadFile(file);
        uploaded.push(url);
      }
      if (multiple) {
        onChange([...(Array.isArray(value) ? value : []), ...uploaded]);
      } else {
        onChange(uploaded[0]);
      }
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  function removeAt(index) {
    if (multiple) {
      const next = [...urls];
      next.splice(index, 1);
      onChange(next);
    } else {
      onChange(null);
    }
  }

  const isPdf = (u) => u.toLowerCase().endsWith('.pdf');

  return (
    <div>
      <span className="block mb-1 text-sm font-medium text-[var(--ink)]/80">{label}</span>
      {hint && <p className="text-xs text-[var(--ink)]/50 mb-2">{hint}</p>}

      {urls.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {urls.map((u, i) => (
            <div key={u + i} className="relative border border-[var(--line)] w-24 h-24 bg-[var(--paper)] flex items-center justify-center overflow-hidden">
              {isPdf(u) ? (
                <span className="text-xs text-center px-1 text-[var(--ink)]/60">PDF file</span>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={u} alt="" className="w-full h-full object-cover" />
              )}
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute top-0 right-0 bg-black/60 text-white text-xs w-5 h-5 flex items-center justify-center focus-ring"
                aria-label="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="inline-flex items-center gap-2 text-sm border border-[var(--line)] px-3 py-2 cursor-pointer hover:border-[var(--forest)] focus-ring">
        <input type="file" accept={accept} multiple={multiple} onChange={handleFiles} className="hidden" />
        {uploading ? 'Uploading…' : multiple ? 'Add photos' : 'Choose file'}
      </label>
      {error && <p className="text-sm text-red-700 mt-2">{error}</p>}
    </div>
  );
}

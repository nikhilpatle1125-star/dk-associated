'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUploadField from './FileUploadField';

export default function SlidesManager({ initialSlides }) {
  const router = useRouter();
  const [slides, setSlides] = useState(initialSlides || []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function api(url, method, body) {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Something went wrong.');
    return data;
  }

  async function addSlides(urls) {
    if (!urls.length) return;
    setBusy(true);
    setError('');
    try {
      const created = [];
      for (const imageUrl of urls) created.push(await api('/api/slides', 'POST', { imageUrl }));
      setSlides((s) => [...s, ...created]);
      setMessage(`${created.length} slide${created.length > 1 ? 's' : ''} added.`);
      router.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  function edit(id, field, value) {
    setSlides((list) => list.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }

  async function save(slide) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await api(`/api/slides/${slide.id}`, 'PUT', {
        title: slide.title,
        subtitle: slide.subtitle,
        linkUrl: slide.linkUrl || '',
        active: slide.active
      });
      setMessage('Slide saved.');
      router.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(slide) {
    const next = { ...slide, active: !slide.active };
    edit(slide.id, 'active', next.active);
    await save(next);
  }

  async function remove(slide) {
    if (!window.confirm('Delete this slide?')) return;
    setBusy(true);
    setError('');
    try {
      await api(`/api/slides/${slide.id}`, 'DELETE');
      setSlides((list) => list.filter((s) => s.id !== slide.id));
      router.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function move(index, dir) {
    const j = index + dir;
    if (j < 0 || j >= slides.length) return;
    const next = [...slides];
    [next[index], next[j]] = [next[j], next[index]];
    setSlides(next);
    setBusy(true);
    setError('');
    try {
      await Promise.all(next.map((s, i) => api(`/api/slides/${s.id}`, 'PUT', { sortOrder: i })));
      router.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8 max-w-3xl">
      {message && <p className="text-sm text-[var(--forest)] bg-[#e4efe6] border border-[#c3ddc9] p-3">{message}</p>}
      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 p-3">{error}</p>}

      <div className="bg-white border border-[var(--line)] p-5">
        <div className="font-medium mb-1">Add slide photos</div>
        <p className="text-xs text-[var(--ink)]/60 mb-3">
          Wide landscape photos work best (around 1920×900). You can select several at once.
        </p>
        <FileUploadField
          label=""
          accept="image/png,image/jpeg,image/webp"
          multiple
          value={[]}
          onChange={(urls) => addSlides(Array.isArray(urls) ? urls : [urls])}
        />
      </div>

      {slides.length === 0 ? (
        <div className="bg-white border border-dashed border-[var(--line)] p-10 text-center text-[var(--ink)]/60">
          No slides yet. Until you add some, the homepage shows the normal hero banner.
        </div>
      ) : (
        <ul className="grid gap-4">
          {slides.map((s, i) => (
            <li key={s.id} className={`bg-white border border-[var(--line)] p-4 grid sm:grid-cols-[180px_1fr] gap-4 ${s.active ? '' : 'opacity-60'}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.imageUrl} alt="" className="w-full aspect-[16/9] object-cover bg-[var(--line)]" />
              <div className="grid gap-2 text-sm">
                <input
                  value={s.title}
                  onChange={(e) => edit(s.id, 'title', e.target.value)}
                  placeholder="Caption title (optional)"
                  className="w-full border border-[var(--line)] px-3 py-2"
                />
                <input
                  value={s.subtitle}
                  onChange={(e) => edit(s.id, 'subtitle', e.target.value)}
                  placeholder="Short caption text (optional)"
                  className="w-full border border-[var(--line)] px-3 py-2"
                />
                <input
                  value={s.linkUrl || ''}
                  onChange={(e) => edit(s.id, 'linkUrl', e.target.value)}
                  placeholder="Link, e.g. /properties or https://… (optional)"
                  className="w-full border border-[var(--line)] px-3 py-2"
                />
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <button type="button" disabled={busy} onClick={() => save(s)} className="btn-primary !py-1.5 !px-4 text-sm focus-ring disabled:opacity-60">Save</button>
                  <button type="button" disabled={busy || i === 0} onClick={() => move(i, -1)} className="text-[var(--forest)] disabled:opacity-30 focus-ring" aria-label="Move earlier">↑ Earlier</button>
                  <button type="button" disabled={busy || i === slides.length - 1} onClick={() => move(i, 1)} className="text-[var(--forest)] disabled:opacity-30 focus-ring" aria-label="Move later">↓ Later</button>
                  <button type="button" disabled={busy} onClick={() => toggleActive(s)} className="text-[var(--ink)]/70 underline underline-offset-4 focus-ring">
                    {s.active ? 'Hide' : 'Show'}
                  </button>
                  <button type="button" disabled={busy} onClick={() => remove(s)} className="text-red-700 underline underline-offset-4 ml-auto focus-ring">Delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

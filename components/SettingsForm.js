'use client';

import { useState } from 'react';
import FileUploadField from './FileUploadField';

export default function SettingsForm({ initial }) {
  const [form, setForm] = useState(initial || {});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    setSaving(false);

    if (!res.ok) {
      setError('Could not save settings. Please try again.');
      return;
    }
    setMessage('Settings saved.');
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 max-w-2xl">
      {message && <p className="text-sm text-[var(--forest)] bg-[#e4efe6] border border-[#c3ddc9] p-3">{message}</p>}
      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 p-3">{error}</p>}

      <Section title="Business identity">
        <Field label="Company name">
          <input value={form.companyName || ''} onChange={(e) => set('companyName', e.target.value)} className="input" />
        </Field>
        <Field label="Tagline" hint="Shown on the homepage hero">
          <input value={form.tagline || ''} onChange={(e) => set('tagline', e.target.value)} className="input" />
        </Field>
        <Field label="About / profile description" hint="Used on the About page and homepage teaser">
          <textarea rows={5} value={form.aboutText || ''} onChange={(e) => set('aboutText', e.target.value)} className="input" />
        </Field>
      </Section>

      <Section title="Contact details">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Phone number">
            <input value={form.phone || ''} onChange={(e) => set('phone', e.target.value)} className="input" placeholder="+91 98xxxxxxx" />
          </Field>
          <Field label="WhatsApp number" hint="Used for the WhatsApp chat button">
            <input value={form.whatsapp || ''} onChange={(e) => set('whatsapp', e.target.value)} className="input" placeholder="+91 98xxxxxxx" />
          </Field>
        </div>
        <Field label="Email">
          <input type="email" value={form.email || ''} onChange={(e) => set('email', e.target.value)} className="input" />
        </Field>
        <Field label="Office address">
          <input value={form.address || ''} onChange={(e) => set('address', e.target.value)} className="input" />
        </Field>
        <Field label="Google Maps link">
          <input value={form.mapLink || ''} onChange={(e) => set('mapLink', e.target.value)} className="input" placeholder="https://maps.google.com/..." />
        </Field>
      </Section>

      <Section title="Branding">
        <FileUploadField
          label="Logo"
          accept="image/png,image/jpeg,image/webp"
          value={form.logoUrl}
          onChange={(v) => set('logoUrl', v)}
        />
        <FileUploadField
          label="Homepage hero image"
          accept="image/png,image/jpeg,image/webp"
          value={form.heroImageUrl}
          onChange={(v) => set('heroImageUrl', v)}
        />
      </Section>

      <Section title="Social links (optional)">
        <Field label="Facebook URL">
          <input value={form.facebookUrl || ''} onChange={(e) => set('facebookUrl', e.target.value)} className="input" />
        </Field>
        <Field label="Instagram URL">
          <input value={form.instagramUrl || ''} onChange={(e) => set('instagramUrl', e.target.value)} className="input" />
        </Field>
      </Section>

      <div>
        <button type="submit" disabled={saving} className="btn-primary focus-ring disabled:opacity-60">
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid var(--line);
          padding: 0.5rem 0.75rem;
          background: #fff;
        }
        .input:focus-visible {
          outline: 2px solid var(--clay);
          outline-offset: 2px;
        }
      `}</style>
    </form>
  );
}

function Section({ title, children }) {
  return (
    <fieldset className="grid gap-4">
      <legend className="font-display text-lg text-[var(--forest)] mb-1">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="block text-sm">
      <span className="block mb-1 font-medium text-[var(--ink)]/80">{label}</span>
      {hint && <span className="block text-xs text-[var(--ink)]/50 mb-1">{hint}</span>}
      {children}
    </label>
  );
}
